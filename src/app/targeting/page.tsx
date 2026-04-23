import Link from "next/link";
import { ArrowRight, Compass, Target as TargetIcon } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import {
  STRATEGY_COLOR_VAR,
  STRATEGY_FRIENDLY,
  type Strategy,
} from "@/lib/db/precincts-types";
import {
  PHASE_LABEL,
  STRATEGY_EVERGREEN,
  STRATEGY_STATS,
  STRATEGY_WHY_NOW,
  currentPhaseForDate,
  type CyclePhase,
} from "@/content/strategy-copy";
import { themeFor } from "@/components/this-month/month-themes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Voter Targeting Explained" };

const STRATEGY_ORDER: Strategy[] = ["PRIMARY", "ACTIVATE", "DEFEND", "GROW"];
const PHASE_ORDER: CyclePhase[] = [
  "OFF_CYCLE",
  "PRIMARY_WINDOW",
  "POST_PRIMARY",
  "SUMMER",
  "GENERAL",
  "ELECTION_WEEK",
  "POST_GENERAL",
];

export default function TargetingPage() {
  const phase = currentPhaseForDate();
  const phaseTheme = themeFor(phase);
  const PhaseIcon = phaseTheme.Icon;

  return (
    <HubShell
      eyebrow="Voter Targeting · Strategy Buckets Explained"
      title="Power Base, Hold the Line, Wake the Vote, Plant the Flag."
      subtitle="Every Jefferson County precinct scored into one of four strategy buckets. What each bucket is, who's in it, what your job is there year-round, and what matters in THIS phase of the cycle."
      maxWidthClass="max-w-6xl"
      actions={
        <Link
          href="/glossary"
          className="rounded border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
        >
          <Compass aria-hidden="true" className="mr-1 inline size-3" />
          Glossary
        </Link>
      }
    >
      {/* Quick-reference strip: 4 icon tiles summarizing the county split. */}
      <section className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Jefferson County · 629 precincts · strategy split
          </div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: phaseTheme.accent }}
          >
            <PhaseIcon aria-hidden="true" className="size-3.5" />
            Current phase: {PHASE_LABEL[phase]}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {STRATEGY_ORDER.map((s) => (
            <QuickTile key={s} strategy={s} />
          ))}
        </div>
        <div className="mt-2 text-[11px] italic text-[var(--color-ldp-ink-700)]">
          &ldquo;Why now&rdquo; boxes below reflect the{" "}
          <strong className="text-[var(--color-ldp-navy-900)]">{PHASE_LABEL[phase]}</strong> phase.
          Other phases collapse into each block&apos;s accordion.
        </div>
      </section>

      <div className="space-y-6">
        {STRATEGY_ORDER.map((s) => (
          <StrategyBlock key={s} strategy={s} currentPhase={phase} />
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          <TargetIcon aria-hidden="true" className="size-4" />
          How this drives your week
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
          The strategy map assigns every precinct to a bucket. When you open your LD or a canvass
          cut, the bucket tells you what conversation you&apos;re having at the door — turning out
          a reliable Dem, persuading a toss-up, waking a sleeper, or registering a hidden Dem.
          The cycle phase tells you whether this is the week to be there at all.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/plan-map"
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white"
          >
            Countywide strategy map →
          </Link>
          <Link
            href="/my-ld"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)]"
          >
            My LD&apos;s buckets →
          </Link>
          <Link
            href="/captains"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)]"
          >
            Captain coverage by bucket →
          </Link>
        </div>
      </section>
    </HubShell>
  );
}

function QuickTile({ strategy }: { strategy: Strategy }) {
  const accent = STRATEGY_COLOR_VAR[strategy];
  const stats = STRATEGY_STATS[strategy];
  const Icon = stats.Icon;
  const marginLabel =
    stats.avgMargin >= 0 ? `D+${stats.avgMargin}` : `D${stats.avgMargin}`;
  return (
    <article
      className="flex items-center gap-3 rounded-xl border-2 bg-white p-3 shadow-sm"
      style={{ borderColor: accent }}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: accent }}
      >
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div
          className="text-[9px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {strategy}
        </div>
        <div className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
          {STRATEGY_FRIENDLY[strategy]}
        </div>
        <div className="mt-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">
          <strong className="text-[var(--color-ldp-navy-900)]">
            {stats.precincts}
          </strong>{" "}
          precincts · avg{" "}
          <strong className="text-[var(--color-ldp-navy-900)]">{marginLabel}</strong>
        </div>
      </div>
    </article>
  );
}

function StrategyBlock({
  strategy,
  currentPhase,
}: {
  strategy: Strategy;
  currentPhase: CyclePhase;
}) {
  const accent = STRATEGY_COLOR_VAR[strategy];
  const evergreen = STRATEGY_EVERGREEN[strategy];
  const whyNow = STRATEGY_WHY_NOW[strategy];
  const stats = STRATEGY_STATS[strategy];
  const StrategyIcon = stats.Icon;
  const phaseTheme = themeFor(currentPhase);
  const CurrentPhaseIcon = phaseTheme.Icon;
  const marginLabel =
    stats.avgMargin >= 0 ? `D+${stats.avgMargin}` : `D${stats.avgMargin}`;

  return (
    <article
      className="overflow-hidden rounded-xl border-2 bg-white shadow-sm"
      style={{ borderColor: accent }}
    >
      {/* Header band — icon + name + stats */}
      <div
        className="relative flex items-center gap-4 px-5 py-4 text-white"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)` }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 14px)",
          }}
        />
        <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/25 backdrop-blur">
          <StrategyIcon aria-hidden="true" className="size-7" />
        </span>
        <div className="relative min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">
            Strategy bucket · {strategy}
          </div>
          <h2 className="mt-0.5 text-2xl font-black tracking-[-0.02em]">
            {STRATEGY_FRIENDLY[strategy]}
          </h2>
          <div className="mt-1 text-xs text-white/85">
            {stats.precincts} precincts · avg {marginLabel}
          </div>
        </div>
      </div>

      {/* Evergreen — what / who / your job */}
      <div className="grid gap-4 px-5 py-4 md:grid-cols-3">
        <EvergreenCell kicker="What it is" body={evergreen.what} accent={accent} />
        <EvergreenCell kicker="Who's in it" body={evergreen.who} accent={accent} />
        <EvergreenCell kicker="Your standing job" body={evergreen.yourJob} accent={accent} />
      </div>

      {/* Current-phase why-now — highlighted with phase icon */}
      <div
        className="border-y px-5 py-4"
        style={{ borderColor: accent, backgroundColor: `${accent}10` }}
      >
        <div
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          <span
            className="flex size-6 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: accent }}
          >
            <CurrentPhaseIcon aria-hidden="true" className="size-3.5" />
          </span>
          Why now · {PHASE_LABEL[currentPhase]}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </div>
        <p
          className="mt-2 text-base font-bold leading-snug"
          style={{ color: accent }}
        >
          {whyNow[currentPhase]}
        </p>
      </div>

      {/* Other phases — collapsed; each row has its phase icon */}
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-5 py-3 text-xs font-semibold text-[var(--color-ldp-ink-700)] hover:bg-[#FAFBFC]">
          <span>See how this bucket changes across the full cycle</span>
          <span className="text-[10px] uppercase tracking-widest group-open:hidden">
            Expand ↓
          </span>
          <span className="hidden text-[10px] uppercase tracking-widest group-open:inline">
            Collapse ↑
          </span>
        </summary>
        <div className="border-t border-[var(--color-ldp-line)] bg-[#FAFBFC] px-5 py-4">
          <ul className="space-y-3 text-sm">
            {PHASE_ORDER.filter((p) => p !== currentPhase).map((p) => {
              const theme = themeFor(p);
              const PIcon = theme.Icon;
              return (
                <li key={p} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: theme.accent }}
                  >
                    <PIcon aria-hidden="true" className="size-3.5" />
                  </span>
                  <div className="flex-1">
                    <div
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: theme.accent }}
                    >
                      {PHASE_LABEL[p]}
                    </div>
                    <div className="mt-0.5 text-[var(--color-ldp-ink-900)]">
                      {whyNow[p]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </details>
    </article>
  );
}

function EvergreenCell({
  kicker,
  body,
  accent,
}: {
  kicker: string;
  body: string;
  accent: string;
}) {
  return (
    <div>
      <div
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {kicker}
      </div>
      <p className="mt-1 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">{body}</p>
    </div>
  );
}
