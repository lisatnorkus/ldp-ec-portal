import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "2026 Candidates" };

type OfficeType = "STATE_HOUSE" | "STATE_SENATE" | "METRO_COUNCIL" | "US_HOUSE";

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
  METRO_COUNCIL: {
    label: "Metro Council · 2026 Primary",
    blurb:
      "LDPEC endorsed candidates in ten open Metro Council races (nonpartisan general ballot). Endorsed candidates cleared a 60% secret-ballot vote at an LDPEC meeting — your personal share, donation, and doorknock moves the needle.",
  },
  STATE_HOUSE: {
    label: "Kentucky State House · 2026 Primary",
    blurb:
      "Your 18 Louisville-area State House races. Most Democratic incumbents are unopposed in the primary; contested primaries happen where seats are flipping or where incumbents aren't seeking re-election.",
  },
  STATE_SENATE: {
    label: "Kentucky State Senate · 2026 Primary",
    blurb:
      "State Senate races on the 2026 primary ballot. Senate seats are 4-year staggered, so only a subset of Louisville-area districts show up each cycle.",
  },
  US_HOUSE: {
    label: "U.S. House · 2026 Primary",
    blurb: "Federal House races in Kentucky's 3rd Congressional District (Louisville-anchored).",
  },
};

const OFFICE_ORDER: OfficeType[] = ["METRO_COUNCIL", "STATE_HOUSE", "STATE_SENATE", "US_HOUSE"];

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
    METRO_COUNCIL: [],
    STATE_HOUSE: [],
    STATE_SENATE: [],
    US_HOUSE: [],
  };
  for (const c of candidates) byOffice[c.office_type].push(c);

  const endorsedCount = candidates.filter((c) => c.is_endorsed).length;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded text-sm text-[var(--color-ldp-navy-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> Dashboard
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            2026 Primary Ballot
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Who&apos;s on the ballot in Louisville.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">
            The 2026 primary is <strong>May 19</strong>. Candidates below are grouped by office —
            LDP-endorsed first. The party endorses in Metro Council and Mayoral primaries but
            traditionally does not endorse in contested partisan-primary races for state
            legislature.
          </p>

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
      return `US-${district}`;
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
