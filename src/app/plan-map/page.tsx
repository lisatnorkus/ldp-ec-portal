import Link from "next/link";
import { ExternalLink, MapPin, FileText } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { getKypoliticsServer } from "@/lib/supabase/kypolitics";

export const dynamic = "force-dynamic";
export const metadata = { title: "Plan & Map" };

type Counts = {
  total: number;
  primary_base: number;
  defend: number;
  activate: number;
  grow: number;
  sleeper_dems: number;
};

async function fetchCountywideCounts(): Promise<Counts> {
  const counts: Counts = {
    total: 0,
    primary_base: 0,
    defend: 0,
    activate: 0,
    grow: 0,
    sleeper_dems: 0,
  };
  try {
    const supabase = await getKypoliticsServer();
    const { data } = await supabase
      .from("jeffco_voter_targeting")
      .select("strategy, dem_gen_not_pri");
    const rows = (data ?? []) as Array<{ strategy: string | null; dem_gen_not_pri: number | null }>;
    counts.total = rows.length;
    for (const r of rows) {
      if (r.strategy === "PRIMARY") counts.primary_base++;
      else if (r.strategy === "DEFEND") counts.defend++;
      else if (r.strategy === "ACTIVATE") counts.activate++;
      else if (r.strategy === "GROW") counts.grow++;
      counts.sleeper_dems += r.dem_gen_not_pri ?? 0;
    }
  } catch (err) {
    console.error("plan-map fetchCountywideCounts failed", err);
  }
  return counts;
}

export default async function PlanMapPage() {
  const counts = await fetchCountywideCounts();

  return (
    <HubShell
      eyebrow="Plan & Map"
      title={`Jefferson County, ${counts.total} precincts, four strategies.`}
      maxWidthClass="max-w-5xl"
    >
        <div className="mb-8">
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">
            Every precinct in the county is scored into one of four strategies. The 2026 LDP Strategy
            Map visualizes this — click below to jump in. The counts here are the countywide baseline.
          </p>
        </div>

        {/* The general strategic plan is now the operating plan — primary is wrapped. */}
        <section className="mb-8 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-700)] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[var(--color-ldp-navy-900)] to-[var(--color-ldp-navy-700)] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-gold,#c89a3b)]">
            Live · Phase 2 general coordinated campaign
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-[1fr,auto]">
            <div className="min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
                2026 General Strategic Plan
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
                The plan for the November 3 general election. Same strategy zones, same
                LD chair structure — now with real primary data and a final candidate slate.
                Seven priority Metro Council races (D11 flip; D7/9/17/21 R-defense; D1/5
                nonpartisan defense) plus HD 48 (Kulkarni offensive flip) and Booker for
                U.S. Senate.
              </p>
              <Link
                href="/general-plan"
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-ldp-red)]/90"
              >
                <FileText aria-hidden className="size-3.5" />
                Open the general plan
              </Link>
            </div>
          </div>
        </section>


        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Countywide precinct mix
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StrategyTile
              label="Power Base"
              tag="PRIMARY"
              count={counts.primary_base}
              total={counts.total}
              oneLiner="D +20+. Keep them voting."
              color="var(--color-strategy-power-base)"
            />
            <StrategyTile
              label="Hold the Line"
              tag="DEFEND"
              count={counts.defend}
              total={counts.total}
              oneLiner="Under 5pt margin. Decides November."
              color="var(--color-strategy-hold-the-line)"
            />
            <StrategyTile
              label="Wake the Vote"
              tag="ACTIVATE"
              count={counts.activate}
              total={counts.total}
              oneLiner="Dem-leaning, skip primaries."
              color="var(--color-strategy-wake-the-vote)"
            />
            <StrategyTile
              label="Plant the Flag"
              tag="GROW"
              count={counts.grow}
              total={counts.total}
              oneLiner="R-leaning. Find hidden Dems."
              color="var(--color-strategy-plant-the-flag)"
            />
          </div>
        </section>

        <section className="mb-8 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
                Sleeper Dems countywide
              </div>
              <div className="mt-1 text-4xl font-bold text-[var(--color-ldp-navy-900)]">
                {counts.sleeper_dems.toLocaleString()}
              </div>
            </div>
            <p className="max-w-md text-sm text-[var(--color-ldp-ink-700)]">
              Registered Democrats who show up in November but skip primaries. The margin that decides
              close Metro Council races, especially in Hold the Line and Wake the Vote precincts.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Jump in
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <a
              href="https://26ldp-strategy-map.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border-2 border-[var(--color-ldp-navy-900)] bg-[var(--color-ldp-navy-900)] p-5 text-white transition-colors hover:bg-[var(--color-ldp-navy-800)]"
            >
              <div className="flex items-center gap-2">
                <MapPin className="size-5" />
                <div className="text-base font-semibold">2026 LDP Strategy Map</div>
              </div>
              <p className="mt-2 text-sm text-white/85">
                Interactive precinct map. Click any precinct for voters, strategy, margin, and
                turnout history. Built for LD Chairs to cut smarter turf.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-gold)]">
                Open map <ExternalLink className="size-3.5" />
              </div>
            </a>
            <Link
              href="/my-ld"
              className="group rounded-xl border border-[var(--color-ldp-line)] bg-white p-5 transition-colors hover:border-[var(--color-ldp-navy-700)]"
            >
              <div className="text-base font-semibold text-[var(--color-ldp-navy-900)]">My LD →</div>
              <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
                See just your district: leadership, strategy mix, races on the ballot, and precinct
                playbook.
              </p>
            </Link>
            <Link
              href="/canvass-tools"
              className="group rounded-xl border border-[var(--color-ldp-line)] bg-white p-5 transition-colors hover:border-[var(--color-ldp-navy-700)]"
            >
              <div className="text-base font-semibold text-[var(--color-ldp-navy-900)]">Canvass Tools →</div>
              <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
                Phase 2 priority races (D11 offensive flip; D7/9/17/21 R-defense; D1/5
                nonpartisan defense; HD 48 Kulkarni). VoteBuilder, volunteer pipeline,
                canvass guides.
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-5">
          <h3 className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">About the strategy tags</h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-ldp-ink-700)]">
            DEFEND / ACTIVATE / PRIMARY / GROW are the technical tags. Power Base / Hold the Line /
            Wake the Vote / Plant the Flag are the plain-English names we use in user-facing copy.
            The strategy score is derived from D-margin plus turnout history (primary vs general) —
            not just registration. A precinct can look Dem on paper but land in GROW if Democrats
            there don&apos;t turn out.
          </p>
        </section>
    </HubShell>
  );
}

function StrategyTile({
  label,
  tag,
  count,
  total,
  oneLiner,
  color,
}: {
  label: string;
  tag: string;
  count: number;
  total: number;
  oneLiner: string;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="rounded-lg border-l-4 bg-white p-4" style={{ borderLeftColor: color }}>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">{tag}</div>
      <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">{label}</div>
      <div className="mt-2 text-3xl font-bold text-[var(--color-ldp-navy-900)]">{count}</div>
      <div className="text-xs text-[var(--color-ldp-ink-700)]">{pct}% of {total}</div>
      <div className="mt-2 text-[11px] leading-snug text-[var(--color-ldp-ink-700)]">{oneLiner}</div>
    </div>
  );
}
