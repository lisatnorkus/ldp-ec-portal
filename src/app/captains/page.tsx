import Link from "next/link";
import { Target } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import {
  fetchAllPrecincts,
  precinctCodeFrom,
  STRATEGY_COLOR_VAR,
  STRATEGY_FRIENDLY,
  STRATEGY_ONELINE,
  type Strategy,
} from "@/lib/db/precincts";
import { fetchAllPrecinctCaptains } from "@/lib/db/precinct-captains";
import { UncoveredPrecinctList } from "@/components/captains/UncoveredPrecinctList";

export const dynamic = "force-dynamic";
export const metadata = { title: "Captain Coverage" };

const STRATEGY_ORDER: Strategy[] = ["ACTIVATE", "DEFEND", "PRIMARY", "GROW"];

export default async function CaptainCoveragePage() {
  const [precincts, captains] = await Promise.all([
    fetchAllPrecincts(),
    fetchAllPrecinctCaptains(),
  ]);

  // Set of covered precinct codes — any precinct with at least one
  // precinct_captains row counts as "covered." (Even though the bylaws
  // call for up to 3 per precinct — Man/Woman/Youth — the skill's bar
  // is "does this precinct have a party presence," which is 1+.)
  const coveredCodes = new Set(captains.map((c) => c.precinct_code.toUpperCase()));

  // Shape the precinct list into bucket totals + an "uncovered" subset
  // that the client list will filter.
  type Row = {
    precinctFull: string;
    precinctCode: string | null;
    ldNumber: number | null;
    strategy: Strategy | null;
    dem_gotv_targets: number | null;
    d_margin_pct: number | null;
    covered: boolean;
  };
  const rows: Row[] = precincts.map((p) => {
    const code = precinctCodeFrom(p.precinct) ?? null;
    const covered = code ? coveredCodes.has(code.toUpperCase()) : false;
    const ldNumber = p.hd ? parseInt(p.hd, 10) : null;
    return {
      precinctFull: p.precinct,
      precinctCode: code,
      ldNumber: Number.isFinite(ldNumber as number) ? ldNumber : null,
      strategy: p.strategy,
      dem_gotv_targets: p.dem_gotv_targets,
      d_margin_pct: p.d_margin_pct,
      covered,
    };
  });

  const totals = aggregateByStrategy(rows);

  const uncovered = rows.filter((r) => !r.covered);
  const uncoveredForList = uncovered.map(({ covered: _covered, ...rest }) => rest);

  const overallCovered = rows.filter((r) => r.covered).length;
  const overallTotal = rows.length;

  return (
    <HubShell
      eyebrow="Captain Coverage · 629 Jefferson County Precincts"
      title="How close are we to a captain in every priority precinct."
      subtitle="The dem-organizing skill's bar: a qualified captain in every ACTIVATE and DEFEND precinct. This dashboard surfaces how close we are and which precincts need a recruit."
      maxWidthClass="max-w-6xl"
      actions={
        <Link
          href="/plan-map"
          className="rounded border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
        >
          Plan & Map →
        </Link>
      }
    >
      {/* Overall headline tile. */}
      <section className="mb-6 rounded-xl border-2 border-[var(--color-ldp-navy-900)] bg-white p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
          <Target aria-hidden="true" className="size-4" />
          Countywide coverage
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-3">
          <div className="text-4xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
            {overallCovered} / {overallTotal}
          </div>
          <div className="text-sm text-[var(--color-ldp-ink-700)]">
            precincts with at least one captain ·{" "}
            <strong className="text-[var(--color-ldp-navy-900)]">
              {overallTotal > 0 ? Math.round((overallCovered / overallTotal) * 100) : 0}%
            </strong>
          </div>
        </div>
      </section>

      {/* Per-strategy coverage cards. ACTIVATE + DEFEND first since
          the skill says they're the priority. */}
      <section className="mb-8">
        <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          By strategy bucket · priority order
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {STRATEGY_ORDER.map((s) => (
            <StrategyCoverageCard
              key={s}
              strategy={s}
              covered={totals[s].covered}
              total={totals[s].total}
              gotvTargets={totals[s].gotvTargets}
            />
          ))}
        </div>
      </section>

      {/* Uncovered precincts list — the punch list. */}
      <section>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Uncovered precincts · the recruit punch list
          </h2>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Filter defaults to ACTIVATE — the skill&apos;s top priority
          </span>
        </div>
        {precincts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-6 text-center text-sm text-[var(--color-ldp-ink-700)]">
            Couldn&apos;t load precinct data from kypolitics. Check the Supabase connection.
          </div>
        ) : (
          <UncoveredPrecinctList rows={uncoveredForList} />
        )}
      </section>

      <p className="mt-6 text-[11px] italic text-[var(--color-ldp-ink-700)]">
        A precinct counts as &ldquo;covered&rdquo; when there is at least one precinct_captains row
        for it in the portal. The bylaws allow up to three per precinct (Man / Woman / Youth); that
        fuller coverage model will be added here once the basic recruit pipeline is in motion.
      </p>
    </HubShell>
  );
}

function aggregateByStrategy(
  rows: {
    strategy: Strategy | null;
    covered: boolean;
    dem_gotv_targets: number | null;
  }[]
): Record<Strategy, { covered: number; total: number; gotvTargets: number }> {
  const out = {
    ACTIVATE: { covered: 0, total: 0, gotvTargets: 0 },
    DEFEND: { covered: 0, total: 0, gotvTargets: 0 },
    PRIMARY: { covered: 0, total: 0, gotvTargets: 0 },
    GROW: { covered: 0, total: 0, gotvTargets: 0 },
  } satisfies Record<Strategy, { covered: number; total: number; gotvTargets: number }>;
  for (const r of rows) {
    if (!r.strategy) continue;
    out[r.strategy].total += 1;
    if (r.covered) out[r.strategy].covered += 1;
    out[r.strategy].gotvTargets += r.dem_gotv_targets ?? 0;
  }
  return out;
}

function StrategyCoverageCard({
  strategy,
  covered,
  total,
  gotvTargets,
}: {
  strategy: Strategy;
  covered: number;
  total: number;
  gotvTargets: number;
}) {
  const accent = STRATEGY_COLOR_VAR[strategy];
  const pct = total > 0 ? Math.round((covered / total) * 100) : 0;

  return (
    <article
      className="rounded-xl border-2 bg-white p-4 shadow-sm"
      style={{ borderColor: accent }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {STRATEGY_FRIENDLY[strategy]}
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-black leading-none text-[var(--color-ldp-navy-900)]">
          {covered}
        </span>
        <span className="text-sm text-[var(--color-ldp-ink-700)]">of {total}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: accent }}
        />
      </div>
      <div className="mt-1 text-[11px] font-semibold" style={{ color: accent }}>
        {pct}% covered
      </div>
      <p className="mt-2 text-[11px] leading-snug text-[var(--color-ldp-ink-700)]">
        {STRATEGY_ONELINE[strategy]}
      </p>
      <p className="mt-1 text-[10px] text-[var(--color-ldp-ink-700)]">
        {gotvTargets.toLocaleString()} GOTV targets in bucket
      </p>
    </article>
  );
}
