import { CYCLE_PHASES, getCurrentCyclePhase, daysUntil, type CyclePhase } from "@/content/cycle-phases";

// Per-phase accent color, chosen so the timeline reads as a cycle of
// distinct modes rather than a gray strip.
const PHASE_COLOR: Record<CyclePhase["phase"], string> = {
  PRIMARY: "#C8102E", // red
  POST_PRIMARY: "#db2777", // pink-rose
  SUMMER: "#F59E0B", // amber
  GENERAL: "#0E4C9E", // deep blue
  POST_GENERAL: "#7c3aed", // violet
  "2027": "#0891b2", // cyan
  "2028": "#059669", // emerald
};

export function CycleTimeline() {
  const current = getCurrentCyclePhase();
  const primaryAnchor = CYCLE_PHASES.find((p) => p.id === "primary-2026")?.anchor;
  const generalAnchor = CYCLE_PHASES.find((p) => p.id === "general-2026")?.anchor;
  const daysToPrimary = primaryAnchor ? daysUntil(primaryAnchor) : null;
  const daysToGeneral = generalAnchor ? daysUntil(generalAnchor) : null;

  const currentColor = PHASE_COLOR[current.phase];
  const currentIdx = CYCLE_PHASES.findIndex((p) => p.id === current.id);

  return (
    <section
      className="mb-6 overflow-hidden rounded-xl border-2 bg-white shadow-sm"
      style={{ borderColor: currentColor }}
    >
      {/* Top stripe that adopts the current phase's color */}
      <div className="h-1.5 w-full" style={{ backgroundColor: currentColor }} />

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: currentColor }}
            >
              You are here · {current.shortLabel}
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              {current.label}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--color-ldp-ink-700)]">
              {current.description}
            </p>
          </div>

          {daysToPrimary != null && daysToPrimary > 0 && (
            <BigCountdown label="Primary election" days={daysToPrimary} color="var(--color-ldp-red)" />
          )}
          {daysToPrimary === 0 && daysToGeneral != null && (
            <BigCountdown label="General election" days={daysToGeneral} color="var(--color-ldp-navy-800)" />
          )}
        </div>

        {/* Visual progress bar */}
        <div className="mt-6">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--color-ldp-line)]">
            {CYCLE_PHASES.map((p, i) => {
              const width = `${100 / CYCLE_PHASES.length}%`;
              const offset = `${(100 / CYCLE_PHASES.length) * i}%`;
              const isPast = i < currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div
                  key={p.id}
                  className="absolute top-0 h-3"
                  style={{
                    left: offset,
                    width,
                    backgroundColor: isPast
                      ? `${PHASE_COLOR[p.phase]}99`
                      : isCurrent
                      ? PHASE_COLOR[p.phase]
                      : "transparent",
                    borderRight: i < CYCLE_PHASES.length - 1 ? "2px solid white" : undefined,
                  }}
                />
              );
            })}
          </div>

          {/* Phase labels */}
          <ol className="mt-3 grid grid-cols-7 gap-1 text-[10px]">
            {CYCLE_PHASES.map((p, i) => {
              const color = PHASE_COLOR[p.phase];
              const isCurrent = i === currentIdx;
              return (
                <li
                  key={p.id}
                  className="text-center"
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <div
                    className={`font-bold uppercase tracking-widest ${
                      isCurrent ? "" : "text-[var(--color-ldp-ink-700)]"
                    }`}
                    style={isCurrent ? { color } : undefined}
                  >
                    {p.shortLabel}
                  </div>
                  <div className="mt-0.5 text-[10px] text-[var(--color-ldp-ink-700)]">
                    {formatStart(p.start)}
                    {p.anchor && <> · {formatAnchor(p.anchor)}</>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function BigCountdown({ label, days, color }: { label: string; days: number; color: string }) {
  return (
    <div
      className="flex min-w-[120px] flex-col items-center rounded-2xl px-4 py-3 text-white shadow-md"
      style={{ backgroundColor: color }}
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">{label}</div>
      <div className="text-5xl font-black leading-none">{days}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest opacity-90">
        day{days === 1 ? "" : "s"} out
      </div>
    </div>
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
