import { CYCLE_PHASES, getCurrentCyclePhase, daysUntil, type CyclePhase } from "@/content/cycle-phases";

export function CycleTimeline() {
  const current = getCurrentCyclePhase();
  const primaryAnchor = CYCLE_PHASES.find((p) => p.id === "primary-2026")?.anchor;
  const generalAnchor = CYCLE_PHASES.find((p) => p.id === "general-2026")?.anchor;
  const daysToPrimary = primaryAnchor ? daysUntil(primaryAnchor) : null;
  const daysToGeneral = generalAnchor ? daysUntil(generalAnchor) : null;

  return (
    <section className="mb-6 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            2026 cycle
          </div>
          <h2 className="mt-1 text-xl font-bold text-[var(--color-ldp-navy-900)]">
            {current.label}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-ldp-ink-700)]">{current.description}</p>
        </div>
        {daysToPrimary != null && daysToPrimary > 0 && (
          <div className="rounded-lg bg-[var(--color-ldp-red)] px-3 py-2 text-center text-white">
            <div className="text-[10px] font-semibold uppercase tracking-widest">To primary</div>
            <div className="text-2xl font-bold leading-none">{daysToPrimary}</div>
            <div className="text-[10px] uppercase tracking-wider">day{daysToPrimary === 1 ? "" : "s"}</div>
          </div>
        )}
        {daysToPrimary === 0 && daysToGeneral != null && (
          <div className="rounded-lg bg-[var(--color-ldp-navy-900)] px-3 py-2 text-center text-white">
            <div className="text-[10px] font-semibold uppercase tracking-widest">To general</div>
            <div className="text-2xl font-bold leading-none">{daysToGeneral}</div>
            <div className="text-[10px] uppercase tracking-wider">day{daysToGeneral === 1 ? "" : "s"}</div>
          </div>
        )}
      </div>

      <div className="mt-5 overflow-x-auto">
        <ol className="flex min-w-[720px] gap-1">
          {CYCLE_PHASES.map((p) => (
            <PhaseBlock key={p.id} phase={p} isCurrent={p.id === current.id} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function PhaseBlock({ phase, isCurrent }: { phase: CyclePhase; isCurrent: boolean }) {
  return (
    <li
      className={`flex-1 rounded border-t-4 bg-[#FAFAFA] px-2 py-2 text-[11px] ${
        isCurrent
          ? "border-[var(--color-ldp-red)] bg-white shadow-sm"
          : "border-[var(--color-ldp-line)]"
      }`}
      aria-current={isCurrent ? "step" : undefined}
    >
      <div
        className={`font-semibold ${
          isCurrent ? "text-[var(--color-ldp-red)]" : "text-[var(--color-ldp-ink-700)]"
        }`}
      >
        {phase.shortLabel}
      </div>
      <div className="mt-0.5 text-[10px] text-[var(--color-ldp-ink-700)]">
        {formatStart(phase.start)}
        {phase.anchor && <> · {formatAnchor(phase.anchor)}</>}
      </div>
    </li>
  );
}

function formatStart(s: string): string {
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}
function formatAnchor(s: string): string {
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
