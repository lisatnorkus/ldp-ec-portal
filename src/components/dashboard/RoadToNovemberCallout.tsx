import Link from "next/link";
import { ArrowRight, BookOpen, CheckSquare, Trophy } from "lucide-react";

// Post-primary framing strip. Surfaces what just happened (primary
// closed) and where the EC's attention should sit now (November ballot,
// primary takeaways stay as memory for each LD). Renders only once
// focus_election has flipped to GENERAL.

export function RoadToNovemberCallout({
  daysToGeneral,
}: {
  daysToGeneral: number | null;
}) {
  const days = daysToGeneral != null && daysToGeneral >= 0 ? daysToGeneral : null;
  return (
    <section className="mb-8 overflow-hidden rounded-2xl border-2 border-[var(--color-ldp-navy-700)] bg-white shadow-sm">
      <div className="bg-gradient-to-r from-[var(--color-ldp-navy-900)] to-[var(--color-ldp-navy-700)] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-gold,#c89a3b)]">
        Primary closed · road to November 3, 2026
      </div>
      <div className="grid gap-4 p-5 md:grid-cols-[1fr,auto]">
        <div className="min-w-0">
          <h3 className="text-lg font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            The May numbers are now your November baseline.
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
            Primary results are kept as institutional memory on every LD page
            — vote totals, who turned out, what each LD chair noted. The
            <strong> general election</strong> is where it all lands.{" "}
            {days != null ? (
              <>
                <strong>{days} days</strong> until November 3. Hold-the-Line
                precincts are now the entire game.
              </>
            ) : (
              <>Hold-the-Line precincts are now the entire game.</>
            )}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <FactTile
              icon={CheckSquare}
              label="See the November ballot"
              sub="Finalists only, no primary noise"
              href="/ballot"
            />
            <FactTile
              icon={Trophy}
              label="Open the primary results"
              sub="Full vote totals + who advanced"
              href="/candidates"
            />
            <FactTile
              icon={BookOpen}
              label="Your LD's takeaways"
              sub="Memory each LD wrote about its primary"
              href="/my-ld"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FactTile({
  icon: Icon,
  label,
  sub,
  href,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  sub: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-lg border bg-[var(--color-ldp-cream,#fbf8f1)] p-3 transition-colors hover:border-[var(--color-ldp-navy-700)] hover:bg-white"
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </div>
      <div className="text-[11px] text-[var(--color-ldp-ink-700)]">{sub}</div>
      <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--color-ldp-navy-700)] group-hover:underline">
        Open <ArrowRight className="size-3" aria-hidden />
      </div>
    </Link>
  );
}
