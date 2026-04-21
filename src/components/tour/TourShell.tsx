import Link from "next/link";
import { TOUR_STEPS, type TourStep } from "@/lib/tour/steps";
import { Button } from "@/components/ui/button";

export function TourShell({ step, children }: { step: TourStep; children: React.ReactNode }) {
  const prev = step.num > 1 ? TOUR_STEPS[step.num - 2] : null;
  const next = step.num < 6 ? TOUR_STEPS[step.num] : null;

  return (
    <div className="min-h-screen bg-[var(--color-ldp-navy-900)] text-white">
      <header className="border-b border-white/10 bg-[var(--color-ldp-navy-900)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              LDPEC Portal
            </div>
            <div className="text-sm font-semibold">Welcome tour</div>
          </div>
          <Link
            href="/dashboard"
            className="rounded text-xs font-medium text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ldp-navy-900)]"
          >
            Skip to dashboard →
          </Link>
        </div>
        <ProgressBar currentStep={step.num} />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
            Step {step.num} of 6
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{step.title}</h1>
          <p className="mt-2 text-white/70">{step.subtitle}</p>
        </div>

        <div className="prose prose-invert max-w-none text-white/90 [&_a]:text-[var(--color-ldp-gold)] [&_strong]:text-white">
          {children}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          {prev ? (
            <Link
              href={`/tour/${prev.num}`}
              className="rounded text-sm font-medium text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ldp-navy-900)]"
            >
              ← Step {prev.num}: {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Button asChild variant="ldpGold" size="lg">
              <Link href={`/tour/${next.num}`}>{step.nextLabel} →</Link>
            </Button>
          ) : (
            <Button asChild variant="ldpGold" size="lg">
              <Link href="/dashboard">{step.nextLabel} →</Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-4">
      <ol
        className="flex gap-1.5"
        aria-label={`Tour progress: step ${currentStep} of ${TOUR_STEPS.length}`}
      >
        {TOUR_STEPS.map((s) => (
          <li
            key={s.num}
            aria-current={s.num === currentStep ? "step" : undefined}
            className={[
              "h-1.5 flex-1 rounded-full transition-colors",
              s.num < currentStep
                ? "bg-[var(--color-ldp-gold)]"
                : s.num === currentStep
                  ? "bg-[var(--color-ldp-gold)]"
                  : "bg-white/15",
            ].join(" ")}
          >
            <span className="sr-only">
              Step {s.num}
              {s.num < currentStep ? " (complete)" : s.num === currentStep ? " (current)" : ""}: {s.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
