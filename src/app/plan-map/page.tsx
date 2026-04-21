import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getKypoliticsServer } from "@/lib/supabase/kypolitics";

export const dynamic = "force-dynamic";

type Counts = {
  total: number;
  primary_base: number;
  defend: number;
  activate: number;
  grow: number;
  sleeper_dems: number;
};

async function fetchCountywideCounts(): Promise<Counts> {
  const supabase = await getKypoliticsServer();
  const { data } = await supabase
    .from("jeffco_voter_targeting")
    .select("strategy, dem_gen_not_pri");
  const rows = (data ?? []) as Array<{ strategy: string | null; dem_gen_not_pri: number | null }>;
  const counts: Counts = {
    total: rows.length,
    primary_base: 0,
    defend: 0,
    activate: 0,
    grow: 0,
    sleeper_dems: 0,
  };
  for (const r of rows) {
    if (r.strategy === "PRIMARY") counts.primary_base++;
    else if (r.strategy === "DEFEND") counts.defend++;
    else if (r.strategy === "ACTIVATE") counts.activate++;
    else if (r.strategy === "GROW") counts.grow++;
    counts.sleeper_dems += r.dem_gen_not_pri ?? 0;
  }
  return counts;
}

export default async function PlanMapPage() {
  const counts = await fetchCountywideCounts();

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            Plan &amp; Map
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Jefferson County, {counts.total} precincts, four strategies.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">
            Every precinct in the county is scored into one of four strategies. The 2026 LDP Strategy
            Map visualizes this — click below to jump in. The counts here are the countywide baseline.
          </p>
        </div>

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
                Priority MC districts (17, 7, 21), volunteer pipeline, VoteBuilder, canvass guides.
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
      </main>
    </div>
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
