import Link from "next/link";
import { ExternalLink, Globe, Mail, Star, AlertTriangle, Trophy } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  fetchEnrichedCandidates,
  type EnrichedCandidate,
  type OfficeType,
} from "@/lib/db/candidate-results";
import { JeffersonShareCallout } from "@/components/election-results/JeffersonShareCallout";

export const dynamic = "force-dynamic";
export const metadata = { title: "2026 Primary Results" };

type Candidate = EnrichedCandidate;

const OFFICE_META: Record<OfficeType, { label: string; blurb: string }> = {
  MAYOR: {
    label: "Louisville Metro Mayor",
    blurb:
      "Nonpartisan top-two primary — the two highest finishers advance to the November ballot regardless of party.",
  },
  US_SENATE: {
    label: "U.S. Senate · Kentucky",
    blurb:
      "Open seat. Partisan primaries — Democratic and Republican winners each advance to November.",
  },
  US_HOUSE: {
    label: "U.S. House",
    blurb:
      "KY-3 is Louisville-anchored; KY-2 covers a small slice of Jefferson County. Partisan primaries.",
  },
  STATE_SENATE: {
    label: "Kentucky State Senate",
    blurb:
      "Even-numbered Senate districts up in 2026 (4-year staggered terms). Partisan primaries.",
  },
  STATE_HOUSE: {
    label: "Kentucky State House",
    blurb:
      "All 18 Louisville-area State House districts are up every even year. Partisan primaries.",
  },
  METRO_COUNCIL: {
    label: "Metro Council",
    blurb:
      "Nonpartisan top-two primary. LDPEC-endorsed candidates cleared a 60% secret-ballot vote at an EC meeting.",
  },
  COUNTY_OFFICE: {
    label: "Jefferson County Offices",
    blurb:
      "Countywide partisan offices — County Attorney, County Clerk, Sheriff. Democratic and Republican primaries each advance a nominee.",
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
    fetchEnrichedCandidates(),
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
  const advancingCount = candidates.filter((c) => c.advances).length;
  const endorsedAdvanceCount = candidates.filter(
    (c) => c.is_endorsed && c.advances
  ).length;

  return (
    <HubShell
      eyebrow="2026 Primary Results"
      title="Who advanced — and who didn't."
      subtitle="Primary was Tuesday, May 19, 2026. Grouped by office. Winners of each partisan primary plus the top two in each nonpartisan race advance to the November 3 general election."
    >
        <div className="mb-6 rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
          <Link
            href="/ballot"
            className="group flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-700)]">
                See the November ballot →
              </div>
              <div className="mt-0.5 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                {advancingCount} candidates advance · {endorsedAdvanceCount} of them LDP-endorsed
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-[var(--color-ldp-navy-700)] group-hover:underline">
              Open /ballot →
            </span>
          </Link>
        </div>

        <JeffersonShareCallout candidates={candidates} />

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
    </HubShell>
  );
}

function OfficeSection({ office, candidates }: { office: OfficeType; candidates: Candidate[] }) {
  const meta = OFFICE_META[office];
  // Bucket by race_bucket_key so COUNTY_OFFICE splits into separate
  // sub-race cards (Attorney / Clerk / Sheriff / PVA / Judge Executive)
  // instead of one collapsed list.
  const byBucket = new Map<string, Candidate[]>();
  for (const c of candidates) {
    const k = c.race_bucket_key;
    const list = byBucket.get(k);
    if (list) list.push(c);
    else byBucket.set(k, [c]);
  }
  const buckets = Array.from(byBucket.keys()).sort((a, b) => {
    const partA = a.split("|")[1] ?? "";
    const partB = b.split("|")[1] ?? "";
    const na = Number(partA);
    const nb = Number(partB);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return partA.localeCompare(partB);
  });

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
        {buckets.map((k) => {
          const list = byBucket.get(k) ?? [];
          const first = list[0];
          return (
            <DistrictBlock
              key={k}
              office={office}
              district={first.district_number}
              countySubOffice={first.county_sub_office}
              candidates={list}
            />
          );
        })}
      </div>
    </section>
  );
}

function officeSlug(
  office: OfficeType,
  district: number,
  countySubOffice: string | null
): string {
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
      return countySubOffice
        ? `Jefferson County · ${countySubOffice}`
        : "Jefferson County";
  }
}

function DistrictBlock({
  office,
  district,
  countySubOffice,
  candidates,
}: {
  office: OfficeType;
  district: number;
  countySubOffice: string | null;
  candidates: Candidate[];
}) {
  const slug = officeSlug(office, district, countySubOffice);
  const hasEndorsed = candidates.some((c) => c.is_endorsed);
  // Mayor + Metro Council are nonpartisan on the KY ballot — even though
  // each candidate has a party affiliation on file, showing a D/R pill
  // there misrepresents how voters actually pick. Suppress.
  const nonpartisan = office === "MAYOR" || office === "METRO_COUNCIL";
  // Sort candidates so winners come first, then by vote count desc.
  // Unrecorded candidates (no votes) drop to the bottom.
  const sorted = [...candidates].sort((a, b) => {
    if (a.advances !== b.advances) return a.advances ? -1 : 1;
    const av = a.votes ?? -1;
    const bv = b.votes ?? -1;
    return bv - av;
  });
  const advancingHere = sorted.filter((c) => c.advances).length;
  const totalVotes = sorted.reduce((s, c) => s + (c.votes ?? 0), 0);

  return (
    <article
      className={`rounded-lg border bg-white p-4 ${
        hasEndorsed
          ? "border-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]"
          : "border-[var(--color-ldp-line)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-bold text-[var(--color-ldp-navy-900)]">{slug}</div>
          {nonpartisan && (
            <span className="rounded-full border border-[var(--color-ldp-line)] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Nonpartisan
            </span>
          )}
          {hasEndorsed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              <Star aria-hidden="true" className="size-3 fill-white" /> LDP Endorsed
            </span>
          )}
        </div>
        {totalVotes > 0 && (
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            {totalVotes.toLocaleString()} votes · {advancingHere}{" "}
            advance{advancingHere === 1 ? "s" : ""}
          </div>
        )}
      </div>
      <ul className="mt-3 divide-y divide-[var(--color-ldp-line)]">
        {sorted.map((c) => (
          <CandidateRow key={c.id} c={c} nonpartisan={nonpartisan} />
        ))}
      </ul>
    </article>
  );
}

function CandidateRow({ c, nonpartisan }: { c: Candidate; nonpartisan: boolean }) {
  const pct = c.pct ?? 0;
  const showBar = c.votes != null && c.votes > 0;
  return (
    <li
      className={`py-2.5 first:pt-0 last:pb-0 ${
        c.advances ? "" : c.votes != null && c.votes >= 0 ? "opacity-80" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {c.advances && (
          <Trophy
            aria-label="Advances to November"
            className="size-4 shrink-0 text-[var(--color-ldp-gold,#c89a3b)]"
          />
        )}
        {c.is_endorsed && (
          <Star
            aria-hidden="true"
            className="size-4 fill-emerald-600 text-emerald-600"
          />
        )}
        <span
          className={`text-sm ${
            c.advances
              ? "font-bold text-[var(--color-ldp-navy-900)]"
              : "font-semibold text-[var(--color-ldp-ink-900)]"
          }`}
        >
          {c.full_name}
        </span>
        {!nonpartisan && <PartyPill party={c.party} />}
        {c.is_incumbent && (
          <span className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Incumbent
          </span>
        )}
        {c.is_endorsed && (
          <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
            LDP Endorsed
          </span>
        )}
        {c.notes?.toLowerCase().includes("barred") && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-red)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
            <AlertTriangle aria-hidden="true" className="size-3" /> Not welcome at LDP events
          </span>
        )}
        <StatusPill label={c.status_label} advances={c.advances} />
      </div>

      {showBar && (
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-ldp-ink-100,#e6e7ea)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, pct)}%`,
                backgroundColor: c.advances
                  ? "var(--color-ldp-navy-700)"
                  : "var(--color-ldp-ink-400,#7a808b)",
              }}
            />
          </div>
          <div className="shrink-0 tabular-nums text-[11px] text-[var(--color-ldp-ink-700)]">
            {(c.votes ?? 0).toLocaleString()} ·{" "}
            <span
              className={c.advances ? "font-bold text-[var(--color-ldp-navy-900)]" : ""}
            >
              {pct.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {c.statewide_votes != null &&
        c.jefferson_share_pct != null &&
        c.jefferson_share_pct < 95 && (
          <div className="mt-1 text-[11px] text-[var(--color-ldp-ink-700)]">
            Statewide: {c.statewide_votes.toLocaleString()} votes ·{" "}
            <span className="font-semibold text-[var(--color-ldp-navy-900)]">
              {c.jefferson_share_pct.toFixed(1)}%
            </span>{" "}
            from Jefferson
          </div>
        )}

      {c.notes && !c.notes.toLowerCase().includes("barred") && (
        <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">{c.notes}</div>
      )}
      {(c.website_url || c.email) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
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
              {c.email}
            </a>
          )}
        </div>
      )}
    </li>
  );
}

function StatusPill({ label, advances }: { label: string; advances: boolean }) {
  if (!label) return null;
  if (advances) {
    return (
      <span className="rounded-full bg-[var(--color-ldp-gold,#c89a3b)] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
        {label}
      </span>
    );
  }
  return (
    <span className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
      {label}
    </span>
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
