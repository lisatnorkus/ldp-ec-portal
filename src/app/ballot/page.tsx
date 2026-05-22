import Link from "next/link";
import {
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  fetchEnrichedCandidates,
  type EnrichedCandidate,
  type OfficeType,
} from "@/lib/db/candidate-results";
import { BallotLdPicker } from "@/components/ballot/BallotLdPicker";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your November Ballot" };

type LdOverlap = {
  number: number;
  state_senate_overlap: number[];
  metro_council_overlap: number[];
  us_house_overlap: number[];
};

async function fetchLdOverlaps(): Promise<LdOverlap[]> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("legislative_districts")
    .select("number, state_senate_overlap, metro_council_overlap, us_house_overlap")
    .order("number");
  return (data ?? []) as LdOverlap[];
}

// What's the user's "your races" set, given their LD? Returns the
// (office_type, district_number) tuples that should appear in the
// LD-specific section. Countywide / federal races are NOT in this
// list — they appear in the bottom section for every user.
function ldSpecificRaceFilter(ld: LdOverlap) {
  return (c: EnrichedCandidate) => {
    if (c.office_type === "STATE_HOUSE") return c.district_number === ld.number;
    if (c.office_type === "STATE_SENATE")
      return ld.state_senate_overlap.includes(c.district_number);
    if (c.office_type === "METRO_COUNCIL")
      return ld.metro_council_overlap.includes(c.district_number);
    if (c.office_type === "US_HOUSE")
      return ld.us_house_overlap.includes(c.district_number);
    return false;
  };
}

const COUNTYWIDE_OFFICES: OfficeType[] = [
  "MAYOR",
  "US_SENATE",
  "COUNTY_OFFICE",
];

export default async function BallotPage({
  searchParams,
}: {
  searchParams: Promise<{ ld?: string }>;
}) {
  const { ld: ldParam } = await searchParams;
  const [enriched, overlaps] = await Promise.all([
    fetchEnrichedCandidates(),
    fetchLdOverlaps(),
  ]);

  // Only finalists — no primary losers, no withdrawn, no noise.
  const finalists = enriched.filter((c) => c.advances);

  const selected_ld_num = ldParam ? Number(ldParam) : null;
  const selected_ld =
    selected_ld_num != null && !Number.isNaN(selected_ld_num)
      ? overlaps.find((o) => o.number === selected_ld_num) ?? null
      : null;

  // Split into LD-specific (when an LD is chosen) vs countywide/federal.
  const countywide_set: OfficeType[] = COUNTYWIDE_OFFICES;
  const countywide = finalists.filter((c) =>
    countywide_set.includes(c.office_type)
  );

  let your_races: EnrichedCandidate[] = [];
  if (selected_ld) {
    const filter = ldSpecificRaceFilter(selected_ld);
    your_races = finalists.filter((c) => filter(c));
  }

  return (
    <HubShell
      eyebrow="November Ballot"
      title="Your fall ballot."
      subtitle="What you'll actually choose on Tuesday, November 3, 2026 — finalists only. No primary noise."
    >
      <BallotLdPicker
        lds={overlaps.map((o) => o.number)}
        selected_ld={selected_ld_num}
      />

      {selected_ld && (
        <BallotSection
          eyebrow={`Your district — LD${selected_ld.number}`}
          title="The races on your specific ballot"
          races={your_races}
        />
      )}

      <BallotSection
        eyebrow="Countywide + federal"
        title={
          selected_ld
            ? "Every Louisville voter sees these"
            : "Every Louisville voter sees these — pick your LD above to add your district-specific races"
        }
        races={countywide}
      />

      <footer className="mt-10 rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-white p-5 text-xs text-[var(--color-ldp-ink-700)]">
        <p>
          This page only shows candidates who advanced past the May 19 primary.
          For full primary results — including who came in second, vote totals,
          and the takeaways your LD has saved —{" "}
          <Link
            href="/candidates"
            className="font-semibold text-[var(--color-ldp-navy-700)] underline"
          >
            open the primary results page
          </Link>
          .
        </p>
      </footer>
    </HubShell>
  );
}

function BallotSection({
  eyebrow,
  title,
  races,
}: {
  eyebrow: string;
  title: string;
  races: EnrichedCandidate[];
}) {
  // Group finalists by (office_type, district_number).
  const groups = new Map<string, EnrichedCandidate[]>();
  for (const c of races) {
    const key = `${c.office_type}|${c.district_number}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }

  const sorted_keys = Array.from(groups.keys()).sort((a, b) => {
    const [oa, da] = a.split("|");
    const [ob, db] = b.split("|");
    const oOrder: Record<string, number> = {
      US_SENATE: 0,
      US_HOUSE: 1,
      STATE_SENATE: 2,
      STATE_HOUSE: 3,
      MAYOR: 4,
      METRO_COUNCIL: 5,
      COUNTY_OFFICE: 6,
    };
    const oDiff = (oOrder[oa] ?? 99) - (oOrder[ob] ?? 99);
    if (oDiff !== 0) return oDiff;
    return Number(da) - Number(db);
  });

  if (sorted_keys.length === 0) return null;

  return (
    <section className="mb-10">
      <header className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-700)]">
          {eyebrow}
        </div>
        <h2 className="mt-0.5 text-base font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          {title}
        </h2>
      </header>

      <div className="space-y-4">
        {sorted_keys.map((key) => {
          const list = groups.get(key)!;
          const [office_type, district] = key.split("|");
          return (
            <BallotRace
              key={key}
              office={office_type as OfficeType}
              district={Number(district)}
              nominees={list}
            />
          );
        })}
      </div>
    </section>
  );
}

function raceLabel(office: OfficeType, district: number): string {
  switch (office) {
    case "MAYOR":
      return "Louisville Metro Mayor";
    case "US_SENATE":
      return "U.S. Senate (Kentucky)";
    case "US_HOUSE":
      return `U.S. House — KY-${district}`;
    case "STATE_SENATE":
      return `Kentucky State Senate — SD${district}`;
    case "STATE_HOUSE":
      return `Kentucky State House — HD${district}`;
    case "METRO_COUNCIL":
      return `Louisville Metro Council — District ${district}`;
    case "COUNTY_OFFICE":
      return "Jefferson County";
  }
}

function isNonpartisan(office: OfficeType): boolean {
  return office === "MAYOR" || office === "METRO_COUNCIL";
}

function BallotRace({
  office,
  district,
  nominees,
}: {
  office: OfficeType;
  district: number;
  nominees: EnrichedCandidate[];
}) {
  const label = raceLabel(office, district);
  // Sort: D first, then R, then independents/others; within party, endorsed first.
  const partyOrder: Record<string, number> = { D: 0, R: 1, NP: 2 };
  const sorted = [...nominees].sort((a, b) => {
    const p = (partyOrder[a.party] ?? 9) - (partyOrder[b.party] ?? 9);
    if (p !== 0) return p;
    if (a.is_endorsed !== b.is_endorsed) return a.is_endorsed ? -1 : 1;
    return a.full_name.localeCompare(b.full_name);
  });

  // For COUNTY_OFFICE, each candidate's "district_number" is the
  // tagged county-office sub-race. We don't have a clean
  // per-county-office label other than what's in the data itself — fall
  // back to a generic Jefferson County header per row.
  if (office === "COUNTY_OFFICE") {
    return (
      <article className="rounded-xl border bg-white p-4">
        <header className="mb-3 text-sm font-bold text-[var(--color-ldp-navy-900)]">
          {label}
        </header>
        <div className="space-y-3">
          {sorted.map((n) => (
            <NomineeCard key={n.id} c={n} nonpartisan={false} />
          ))}
        </div>
      </article>
    );
  }

  const nonpartisan = isNonpartisan(office);

  return (
    <article className="rounded-xl border bg-white p-4">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
          {label}
        </h3>
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          {nonpartisan
            ? `${nominees.length} on November ballot`
            : sorted.length === 1
              ? "Unopposed in November"
              : `${nominees.length} on November ballot`}
        </div>
      </header>
      <div className="space-y-3">
        {sorted.map((n) => (
          <NomineeCard key={n.id} c={n} nonpartisan={nonpartisan} />
        ))}
      </div>
    </article>
  );
}

function NomineeCard({
  c,
  nonpartisan,
}: {
  c: EnrichedCandidate;
  nonpartisan: boolean;
}) {
  // Brand line color per party
  const accent =
    c.party === "D"
      ? "var(--color-ldp-navy-700)"
      : c.party === "R"
        ? "var(--color-ldp-red)"
        : "var(--color-ldp-ink-400, #7a808b)";

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border bg-[var(--color-ldp-cream,#fbf8f1)] p-3 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
            {c.full_name}
          </span>
          {!nonpartisan && <PartyPill party={c.party} />}
          {c.is_endorsed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              <Star aria-hidden="true" className="size-3 fill-white" /> LDP
              Endorsed
            </span>
          )}
          {c.is_incumbent && (
            <span className="rounded-full border border-[var(--color-ldp-line)] bg-white px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Incumbent
            </span>
          )}
        </div>
      </div>
      {(c.website_url || c.email) && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs">
          {c.website_url && (
            <a
              href={c.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ldp-line)] bg-white px-2 py-0.5 text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
            >
              <Globe aria-hidden="true" className="size-3" />
              Website
            </a>
          )}
          {c.email && (
            <a
              href={`mailto:${c.email}`}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ldp-line)] bg-white px-2 py-0.5 text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
            >
              <Mail aria-hidden="true" className="size-3" />
              <span className="hidden sm:inline">{c.email}</span>
              <span className="sm:hidden">Email</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function PartyPill({ party }: { party: string }) {
  if (party === "D")
    return (
      <span className="rounded-full bg-[var(--color-ldp-navy-800)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
        D
      </span>
    );
  if (party === "R")
    return (
      <span className="rounded-full bg-[var(--color-ldp-red)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
        R
      </span>
    );
  return (
    <span className="rounded-full border border-[var(--color-ldp-line)] bg-white px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
      {party || "—"}
    </span>
  );
}
