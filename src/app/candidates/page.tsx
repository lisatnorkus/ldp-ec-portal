import Link from "next/link";
import { ExternalLink, Star, AlertTriangle } from "lucide-react";
import { PageMasthead } from "@/components/nav/PageMasthead";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "2026 Candidates" };

type OfficeType =
  | "MAYOR"
  | "US_SENATE"
  | "US_HOUSE"
  | "STATE_SENATE"
  | "STATE_HOUSE"
  | "METRO_COUNCIL"
  | "COUNTY_OFFICE";

type Candidate = {
  id: string;
  office_type: OfficeType;
  district_number: number;
  full_name: string;
  party: string;
  is_incumbent: boolean;
  is_endorsed: boolean;
  notes: string | null;
};

const OFFICE_META: Record<OfficeType, { label: string; blurb: string }> = {
  MAYOR: {
    label: "Louisville Metro Mayor · 2026 Primary",
    blurb:
      "The LDPEC endorses in the Mayoral primary — the endorsed candidate below cleared a 60% secret-ballot vote at an LDPEC meeting. The Mayor race appears on a nonpartisan general ballot in November.",
  },
  US_SENATE: {
    label: "U.S. Senate · 2026 Democratic Primary",
    blurb:
      "The Kentucky Democratic primary for the U.S. Senate seat currently held by a Republican. Louisville voters weigh in alongside the rest of the state.",
  },
  US_HOUSE: {
    label: "U.S. House · 2026 Primary",
    blurb:
      "Federal House races. Kentucky's 3rd Congressional District is Louisville-anchored; the 2nd crosses a small part of Jefferson County.",
  },
  STATE_SENATE: {
    label: "Kentucky State Senate · 2026 Primary",
    blurb:
      "State Senate races on the 2026 primary ballot. Senate seats are 4-year staggered, so only a subset of Louisville-area districts show up each cycle.",
  },
  STATE_HOUSE: {
    label: "Kentucky State House · 2026 Primary",
    blurb:
      "Your 18 Louisville-area State House races. Most Democratic incumbents are unopposed in the primary; contested primaries happen where seats are flipping or where incumbents aren't seeking re-election.",
  },
  METRO_COUNCIL: {
    label: "Metro Council · 2026 Primary",
    blurb:
      "LDPEC endorsed candidates in ten open Metro Council races (nonpartisan general ballot). Endorsed candidates cleared a 60% secret-ballot vote at an LDPEC meeting. Your personal share, donation, and doorknock moves the needle.",
  },
  COUNTY_OFFICE: {
    label: "Jefferson County Offices · 2026 Primary",
    blurb:
      "Countywide offices: PVA (Property Valuation Administrator), Judge Executive, County Attorney, County Clerk, Sheriff. Democratic primary results below.",
  },
};

const OFFICE_ORDER: OfficeType[] = [
  "MAYOR",
  "METRO_COUNCIL",
  "US_SENATE",
  "US_HOUSE",
  "STATE_HOUSE",
  "STATE_SENATE",
  "COUNTY_OFFICE",
];

async function fetchCandidates(): Promise<Candidate[]> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("candidates")
    .select("*")
    .eq("cycle_year", 2026)
    .order("office_type")
    .order("district_number")
    .order("is_endorsed", { ascending: false })
    .order("is_incumbent", { ascending: false })
    .order("full_name");
  return (data ?? []) as Candidate[];
}

async function fetchVoterGuideUrl(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "voter_guide_url")
    .maybeSingle();
  return (data?.value as string | undefined) ?? null;
}

export default async function CandidatesPage() {
  const [candidates, voterGuideUrl] = await Promise.all([
    fetchCandidates(),
    fetchVoterGuideUrl(),
  ]);

  const byOffice: Record<OfficeType, Candidate[]> = {
    MAYOR: [],
    US_SENATE: [],
    US_HOUSE: [],
    STATE_SENATE: [],
    STATE_HOUSE: [],
    METRO_COUNCIL: [],
    COUNTY_OFFICE: [],
  };
  for (const c of candidates) byOffice[c.office_type].push(c);

  const endorsedCount = candidates.filter((c) => c.is_endorsed).length;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageMasthead
        eyebrow="2026 Primary Ballot"
        title="Who's on the ballot in Louisville."
        subtitle="Primary is Tuesday, May 19. Grouped by office, LDP-endorsed first. The party endorses in Metro Council and Mayoral primaries but traditionally does not endorse in contested partisan-primary races for state legislature."
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">

          <div className="mt-4 flex flex-wrap gap-2">
            {voterGuideUrl && (
              <a
                href={voterGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ldp-red)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-red)] focus-visible:ring-offset-2"
              >
                Open the voter guide <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            )}
            <Link
              href="/early-voting"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] transition-colors hover:bg-[var(--color-ldp-navy-900)] hover:text-white"
            >
              24 early voting locations →
            </Link>
            <Link
              href="/endorsement"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] transition-colors hover:bg-[var(--color-ldp-navy-900)] hover:text-white"
            >
              How endorsements work →
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[var(--color-ldp-ink-700)]">
            <span>
              <strong className="text-[var(--color-ldp-navy-900)]">{candidates.length}</strong>{" "}
              total candidates
            </span>
            <span>
              <strong className="text-[var(--color-ldp-navy-900)]">{endorsedCount}</strong>{" "}
              LDP-endorsed
            </span>
            <span>
              <strong className="text-[var(--color-ldp-navy-900)]">
                {byOffice.STATE_HOUSE.length}
              </strong>{" "}
              State House
            </span>
            <span>
              <strong className="text-[var(--color-ldp-navy-900)]">
                {byOffice.STATE_SENATE.length}
              </strong>{" "}
              State Senate
            </span>
            <span>
              <strong className="text-[var(--color-ldp-navy-900)]">
                {byOffice.METRO_COUNCIL.length}
              </strong>{" "}
              Metro Council
            </span>
          </div>
        </div>

        {OFFICE_ORDER.map((office) => {
          const list = byOffice[office];
          if (list.length === 0) return null;
          return <OfficeSection key={office} office={office} candidates={list} />;
        })}

        <section className="mt-10 rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-white p-5 text-sm">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Corrections & additions
          </div>
          <p className="mt-1 text-[var(--color-ldp-ink-900)]">
            If a candidate is missing, miscategorized, or an endorsement flag needs updating
            after a committee vote, send the change to{" "}
            <a href="mailto:communications@louisvilledems.com" className="text-[var(--color-ldp-navy-700)] underline">
              communications@louisvilledems.com
            </a>
            . Source of record is the Jefferson County Clerk&apos;s ballot filing + LDPEC
            Endorsement Process Committee votes.
          </p>
        </section>
      </main>
    </div>
  );
}

function OfficeSection({ office, candidates }: { office: OfficeType; candidates: Candidate[] }) {
  const meta = OFFICE_META[office];
  const byDistrict = new Map<number, Candidate[]>();
  for (const c of candidates) {
    const list = byDistrict.get(c.district_number);
    if (list) list.push(c);
    else byDistrict.set(c.district_number, [c]);
  }
  const districts = Array.from(byDistrict.keys()).sort((a, b) => a - b);

  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            {meta.label}
          </h2>
          <p className="mt-0.5 max-w-3xl text-xs text-[var(--color-ldp-ink-700)]">{meta.blurb}</p>
        </div>
      </div>

      <div className="space-y-4">
        {districts.map((d) => (
          <DistrictBlock key={d} office={office} district={d} candidates={byDistrict.get(d) ?? []} />
        ))}
      </div>
    </section>
  );
}

function officeSlug(office: OfficeType, district: number): string {
  switch (office) {
    case "METRO_COUNCIL":
      return `MC${district}`;
    case "STATE_HOUSE":
      return `HD${district}`;
    case "STATE_SENATE":
      return `SD${district}`;
    case "US_HOUSE":
      return `US House ${district}`;
    case "US_SENATE":
      return "U.S. Senate (KY)";
    case "MAYOR":
      return "Louisville Mayor";
    case "COUNTY_OFFICE":
      return "Jefferson County";
  }
}

function DistrictBlock({
  office,
  district,
  candidates,
}: {
  office: OfficeType;
  district: number;
  candidates: Candidate[];
}) {
  const slug = officeSlug(office, district);
  const hasEndorsed = candidates.some((c) => c.is_endorsed);

  return (
    <article
      className={`rounded-lg border bg-white p-4 ${
        hasEndorsed ? "border-[var(--color-ldp-gold)]" : "border-[var(--color-ldp-line)]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-sm font-bold text-[var(--color-ldp-navy-900)]">{slug}</div>
        {hasEndorsed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
            <Star aria-hidden="true" className="size-3 fill-[var(--color-ldp-navy-900)]" /> LDP
            Endorsed
          </span>
        )}
      </div>
      <ul className="mt-3 divide-y divide-[var(--color-ldp-line)]">
        {candidates.map((c) => (
          <li key={c.id} className="py-2 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {c.is_endorsed && (
                <Star
                  aria-hidden="true"
                  className="size-4 fill-[var(--color-ldp-gold)] text-[var(--color-ldp-gold)]"
                />
              )}
              <span className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                {c.full_name}
              </span>
              <PartyPill party={c.party} />
              {c.is_incumbent && (
                <span className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  Incumbent
                </span>
              )}
              {c.is_endorsed && (
                <span className="rounded-full bg-[var(--color-ldp-gold)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
                  LDP Endorsed
                </span>
              )}
              {c.notes?.toLowerCase().includes("barred") && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-red)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                  <AlertTriangle aria-hidden="true" className="size-3" /> Not welcome at LDP events
                </span>
              )}
            </div>
            {c.notes && !c.notes.toLowerCase().includes("barred") && (
              <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">{c.notes}</div>
            )}
          </li>
        ))}
      </ul>
    </article>
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
