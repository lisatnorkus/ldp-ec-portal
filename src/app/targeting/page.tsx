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
  STRATEGY_WHY_NOW,
  currentPhaseForDate,
  type CyclePhase,
} from "@/content/strategy-copy";

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

  return (
    <HubShell
      eyebrow="Voter Targeting · Strategy Buckets Explained"
      title="Power Base, Hold the Line, Wake the Vote, Plant the Flag."
      subtitle={`Every Jefferson County precinct is scored into one of four strategy buckets. This page explains what each bucket is, who's in it, what your job is there year-round, and — because priorities shift with the cycle — what matters in THIS phase (${PHASE_LABEL[phase].toLowerCase()}).`}
      maxWidthClass="max-w-5xl"
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
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-ldp-navy-800)] bg-white px-3 py-1.5 text-xs">
        <TargetIcon aria-hidden="true" className="size-3.5 text-[var(--color-ldp-navy-800)]" />
        <span className="font-semibold text-[var(--color-ldp-navy-900)]">
          Current phase:
        </span>
        <span className="font-bold text-[var(--color-ldp-red)]">
          {PHASE_LABEL[phase]}
        </span>
        <span className="text-[var(--color-ldp-ink-700)]">
          · &ldquo;Why now&rdquo; below reflects this phase. Other phases collapsed.
        </span>
      </div>

      <div className="space-y-6">
        {STRATEGY_ORDER.map((s) => (
          <StrategyBlock key={s} strategy={s} currentPhase={phase} />
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          How this drives your week
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
          The strategy map assigns every precinct in Jefferson County to one of these buckets.
          When you open your LD or a canvass cut, the bucket tells you what conversation you&apos;re
          having at the door — whether you&apos;re turning out a reliable Dem, persuading a
          toss-up voter, waking up a sleeper, or registering a hidden Dem. The cycle phase tells
          you whether THIS is the week to be there at all.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/plan-map"
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white"
          >
            See the countywide strategy map →
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

  return (
    <article
      className="overflow-hidden rounded-xl border-2 bg-white shadow-sm"
      style={{ borderColor: accent }}
    >
      {/* Header band */}
      <div
        className="px-5 py-4 text-white"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)` }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">
          Strategy bucket · {strategy}
        </div>
        <h2 className="mt-0.5 text-2xl font-black tracking-[-0.02em]">
          {STRATEGY_FRIENDLY[strategy]}
        </h2>
      </div>

      {/* Evergreen — what / who / your job */}
      <div className="grid gap-4 px-5 py-4 md:grid-cols-3">
        <EvergreenCell kicker="What it is" body={evergreen.what} accent={accent} />
        <EvergreenCell kicker="Who's in it" body={evergreen.who} accent={accent} />
        <EvergreenCell kicker="Your standing job" body={evergreen.yourJob} accent={accent} />
      </div>

      {/* Current-phase why-now — highlighted */}
      <div
        className="border-y px-5 py-4"
        style={{ borderColor: accent, backgroundColor: `${accent}10` }}
      >
        <div
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          <ArrowRight aria-hidden="true" className="size-3.5" />
          Why now · {PHASE_LABEL[currentPhase]}
        </div>
        <p
          className="mt-1 text-base font-bold leading-snug"
          style={{ color: accent }}
        >
          {whyNow[currentPhase]}
        </p>
      </div>

      {/* Other phases — collapsed */}
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
          <ul className="space-y-2.5 text-sm">
            {PHASE_ORDER.filter((p) => p !== currentPhase).map((p) => (
              <li key={p} className="flex gap-3">
                <span
                  className="min-w-[130px] shrink-0 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  {PHASE_LABEL[p]}
                </span>
                <span className="text-[var(--color-ldp-ink-900)]">{whyNow[p]}</span>
              </li>
            ))}
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
