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
      {/* Sample Ballot Mobile App — Robert + Beth's public-facing tool.
          Surface it here so EC members can hand it to neighbors who
          want a take-it-to-the-booth voter guide. */}
      <section className="mb-6 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-700)] bg-white shadow-sm">
        <div className="bg-[var(--color-ldp-navy-700)] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          Take to the booth · Sample Ballot mobile app
        </div>
        <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
              Public-facing sample-ballot lookup with LDP endorsements + party affiliations.
              Saves to the voter&apos;s phone gallery so they can carry it into the booth.
              Built by Robert Kahne + Beth Thorpe. Share this with anyone who&apos;s asked
              you what&apos;s on the ballot.
            </p>
          </div>
          <a
            href="https://sample-ballot-2026.louisvilledems.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-ldp-red)]/90"
          >
            Open the app →
          </a>
        </div>
      </section>

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
          This page only shows candidates who advanced past the 2026
          Democratic primary. For full primary results — vote totals, who came
          in second, and the takeaways your LD has saved —{" "}
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
  // Group finalists by their actual race bucket — for COUNTY_OFFICE
  // this splits Attorney / Clerk / Sheriff / PVA / Judge Executive
  // into separate cards rather than collapsing them all into "Jefferson
  // County".
  const groups = new Map<string, EnrichedCandidate[]>();
  for (const c of races) {
    const key = c.race_bucket_key;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }

  const sorted_keys = Array.from(groups.keys()).sort((a, b) => {
    const [oa, partA] = a.split("|");
    const [ob, partB] = b.split("|");
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
    // For COUNTY_OFFICE the second segment is a sub-office name; for
    // everything else it's a district number. Both sort lexically OK.
    const na = Number(partA);
    const nb = Number(partB);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return partA.localeCompare(partB);
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
          const first = list[0];
          return (
            <BallotRace
              key={key}
              office={first.office_type}
              district={first.district_number}
              countySubOffice={first.county_sub_office}
              nominees={list}
            />
          );
        })}
      </div>
    </section>
  );
}

function raceLabel(
  office: OfficeType,
  district: number,
  countySubOffice: string | null
): string {
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
      return countySubOffice
        ? `Jefferson County ${countySubOffice}`
        : "Jefferson County";
  }
}

function isNonpartisan(office: OfficeType): boolean {
  return office === "MAYOR" || office === "METRO_COUNCIL";
}

function BallotRace({
  office,
  district,
  countySubOffice,
  nominees,
}: {
  office: OfficeType;
  district: number;
  countySubOffice: string | null;
  nominees: EnrichedCandidate[];
}) {
  const label = raceLabel(office, district, countySubOffice);
  // Sort: D first, then R, then independents/others; within party, endorsed first.
  const partyOrder: Record<string, number> = { D: 0, R: 1, NP: 2 };
  const sorted = [...nominees].sort((a, b) => {
    const p = (partyOrder[a.party] ?? 9) - (partyOrder[b.party] ?? 9);
    if (p !== 0) return p;
    if (a.is_endorsed !== b.is_endorsed) return a.is_endorsed ? -1 : 1;
    return a.full_name.localeCompare(b.full_name);
  });

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
