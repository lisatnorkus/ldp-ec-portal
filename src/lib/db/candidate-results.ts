import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";

export type OfficeType =
  | "MAYOR"
  | "US_SENATE"
  | "US_HOUSE"
  | "STATE_SENATE"
  | "STATE_HOUSE"
  | "METRO_COUNCIL"
  | "COUNTY_OFFICE";

export type CandidateRow = {
  id: string;
  office_type: OfficeType;
  district_number: number;
  full_name: string;
  party: string;
  is_incumbent: boolean;
  is_endorsed: boolean;
  notes: string | null;
  website_url: string | null;
  email: string | null;
};

export type ResultRowAll = {
  party: string;
  office: string;
  district: string;
  candidate: string;
  ld_number: number;
  ld_votes: number;
  ld_race_total: number;
  precincts_reporting: number;
};

// Candidate enriched with countywide result + status. status_label is
// the post-primary outcome ("Won — advances to November", "Eliminated",
// "Advances unopposed", "No primary opponent").
export type EnrichedCandidate = CandidateRow & {
  votes: number | null;
  pct: number | null;
  advances: boolean;
  status_label: string;
  was_on_ballot: boolean;
};

// Map candidates.office_type → election_results_2026_primary.office. For
// COUNTY_OFFICE we have to look at full_name match across multiple result
// office strings (COUNTY ATTORNEY, COUNTY CLERK, SHERIFF), so the
// per-candidate join falls back to a free office search.
const OFFICE_RES_LABEL: Partial<Record<OfficeType, string>> = {
  MAYOR: "LOUISVILLE MAYOR",
  METRO_COUNCIL: "LOUISVILLE METRO COUNCIL",
  STATE_HOUSE: "STATE REPRESENTATIVE",
  STATE_SENATE: "STATE SENATE",
  US_HOUSE: "U.S. REPRESENTATIVE",
  US_SENATE: "U.S. SENATOR",
};

const COUNTY_RES_LABELS = ["COUNTY ATTORNEY", "COUNTY CLERK", "SHERIFF"];

// Top-N rules for KY ballot access:
//   * MAYOR / METRO_COUNCIL — nonpartisan top-two advance
//   * everything else — partisan, top of each party advances
export function advancesCount(office: OfficeType): number {
  if (office === "MAYOR" || office === "METRO_COUNCIL") return 2;
  return 1;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Fuzzy match by normalized full name. Tolerates "Roz" vs "Rosalind"
// type differences by also accepting a last-name + first-letter match
// as a fallback.
function matchName(candName: string, resName: string): boolean {
  const a = normalize(candName);
  const b = normalize(resName);
  if (a === b) return true;
  const aParts = a.split(" ");
  const bParts = b.split(" ");
  const aLast = aParts[aParts.length - 1];
  const bLast = bParts[bParts.length - 1];
  if (aLast && bLast && aLast === bLast) {
    // last names match, also require first initial match if both have
    // one — keeps two same-surname candidates separable.
    return aParts[0]?.[0] === bParts[0]?.[0];
  }
  return false;
}

function resOfficeFor(c: CandidateRow): string[] {
  if (c.office_type === "COUNTY_OFFICE") return COUNTY_RES_LABELS;
  const label = OFFICE_RES_LABEL[c.office_type];
  return label ? [label] : [];
}

// Sum a candidate's countywide vote total across all LD rows for that
// (party, office, district, candidate). The 2026 results table is stored
// per-LD; we roll up to a single county number per candidate.
function countywideTotalsFor(
  c: CandidateRow,
  all: ResultRowAll[]
): { votes: number; pct: number; race_total: number } | null {
  const offices = resOfficeFor(c);
  const districtStr =
    c.district_number > 0 && c.office_type !== "MAYOR"
      ? String(c.district_number)
      : "";

  const matches = all.filter((r) => {
    if (!offices.includes(r.office)) return false;
    // Party check: for nonpartisan offices results use party='', for
    // partisan results use 'DEM' / 'REP'. Candidate.party is 'D'/'R'/'NP'.
    if (c.office_type === "MAYOR" || c.office_type === "METRO_COUNCIL") {
      if (r.party !== "") return false;
    } else {
      const want = c.party === "D" ? "DEM" : c.party === "R" ? "REP" : "";
      if (r.party !== want) return false;
    }
    // District check: results store district as text; "" means countywide.
    if ((r.district ?? "") !== districtStr) return false;
    return matchName(c.full_name, r.candidate);
  });

  if (matches.length === 0) return null;
  const votes = matches.reduce((s, r) => s + (r.ld_votes ?? 0), 0);
  const race_total = matches.reduce((s, r) => s + (r.ld_race_total ?? 0), 0);
  return {
    votes,
    race_total,
    pct: race_total ? (votes / race_total) * 100 : 0,
  };
}

// Within a single race bucket (office, district, party — or office, district
// only for nonpartisan), figure out who advances. Returns the set of
// matched candidate ids that advanced.
function computeAdvances(
  bucket: EnrichedCandidate[],
  office: OfficeType
): Set<string> {
  const n = advancesCount(office);
  const advanced = new Set<string>();
  // Group by party for partisan offices; nonpartisan = single group.
  const groups = new Map<string, EnrichedCandidate[]>();
  for (const c of bucket) {
    const key = office === "MAYOR" || office === "METRO_COUNCIL" ? "_" : c.party;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }
  for (const group of groups.values()) {
    // Single-candidate party group with non-empty votes/no votes — they
    // advance unopposed.
    if (group.length === 1) {
      advanced.add(group[0].id);
      continue;
    }
    // Sort by votes desc, take top n.
    const sorted = [...group].sort((a, b) => (b.votes ?? -1) - (a.votes ?? -1));
    // If nobody has votes recorded, we can't determine winners. Don't
    // advance anyone (status_label becomes "Pending" downstream).
    const hasAnyVotes = sorted.some((c) => (c.votes ?? 0) > 0);
    if (!hasAnyVotes) continue;
    for (let i = 0; i < Math.min(n, sorted.length); i++) {
      if ((sorted[i].votes ?? 0) > 0) advanced.add(sorted[i].id);
    }
  }
  return advanced;
}

export async function fetchEnrichedCandidates(): Promise<EnrichedCandidate[]> {
  const supabase = await getSupabaseServer();
  const [candidatesRes, allResultsRes] = await Promise.all([
    supabase
      .from("candidates")
      .select(
        "id, office_type, district_number, full_name, party, is_incumbent, is_endorsed, notes, website_url, email"
      )
      .eq("cycle_year", 2026),
    supabase
      .from("election_results_2026_primary")
      .select("party, office, district, candidate, ld_number, ld_votes, ld_race_total, precincts_reporting"),
  ]);

  const candidates = (candidatesRes.data ?? []) as CandidateRow[];
  const all = (allResultsRes.data ?? []) as ResultRowAll[];

  // First pass: attach countywide vote totals.
  const enriched: EnrichedCandidate[] = candidates.map((c) => {
    const totals = countywideTotalsFor(c, all);
    return {
      ...c,
      votes: totals?.votes ?? null,
      pct: totals?.pct ?? null,
      advances: false,
      status_label: "",
      was_on_ballot: totals !== null,
    };
  });

  // Second pass: group by (office_type, district_number) and compute advances.
  const buckets = new Map<string, EnrichedCandidate[]>();
  for (const c of enriched) {
    const key = `${c.office_type}|${c.district_number}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(c);
  }
  for (const [key, bucket] of buckets) {
    const office = key.split("|")[0] as OfficeType;
    const advanced = computeAdvances(bucket, office);
    const total_in_bucket = bucket.length;
    for (const c of bucket) {
      if (advanced.has(c.id)) {
        c.advances = true;
        // Distinguish "advances unopposed" from "won contested primary".
        const sameParty = bucket.filter(
          (o) =>
            office === "MAYOR" || office === "METRO_COUNCIL"
              ? true
              : o.party === c.party
        );
        if (sameParty.length === 1) {
          c.status_label = "Advances unopposed";
        } else {
          c.status_label =
            office === "MAYOR" || office === "METRO_COUNCIL"
              ? "Top-two — advances to November"
              : "Won primary — advances to November";
        }
      } else if (c.votes == null) {
        c.status_label =
          total_in_bucket > 1 ? "Result pending" : "Filed, no primary recorded";
      } else if ((c.votes ?? 0) === 0) {
        c.status_label = "Withdrew / no votes recorded";
      } else {
        c.status_label = "Eliminated";
      }
    }
  }

  return enriched;
}
