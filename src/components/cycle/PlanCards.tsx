import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PLAN_CARDS, type PlanCard } from "@/content/cycle-phases";

export function PlanCards() {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        Plan · primary, general, long horizon
      </h2>
      <div className="grid gap-3 lg:grid-cols-3">
        {PLAN_CARDS.map((p) => (
          <Card key={p.id} plan={p} />
        ))}
      </div>
    </section>
  );
}

function Card({ plan }: { plan: PlanCard }) {
  const styles = PLAN_STYLES[plan.status];
  const isExternal = plan.primaryCtaHref.startsWith("http");
  return (
    <article className={`flex flex-col rounded-xl border-2 bg-white p-5 ${styles.border}`}>
      <div className={`text-[10px] font-semibold uppercase tracking-widest ${styles.eyebrowClass}`}>
        {plan.eyebrow}
      </div>
      <h3 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">{plan.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-ldp-ink-700)]">{plan.body}</p>

      <div className="mt-4">
        {isExternal ? (
          <a
            href={plan.primaryCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold ${styles.ctaClass}`}
          >
            {plan.primaryCtaLabel}
            <ExternalLink className="size-3.5" />
          </a>
        ) : (
          <Link
            href={plan.primaryCtaHref}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold ${styles.ctaClass}`}
          >
            {plan.primaryCtaLabel}
          </Link>
        )}
      </div>

      {plan.secondaryLinks && plan.secondaryLinks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--color-ldp-line)] pt-3">
          {plan.secondaryLinks.map((link) => {
            const linkExternal = link.href.startsWith("http");
            const className =
              "text-[11px] text-[var(--color-ldp-navy-700)] hover:underline inline-flex items-center gap-1";
            return linkExternal ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {link.label} <ExternalLink className="size-3" />
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={className}>
                {link.label} →
              </Link>
            );
          })}
        </div>
      )}
    </article>
  );
}

const PLAN_STYLES: Record<
  PlanCard["status"],
  { border: string; eyebrowClass: string; ctaClass: string }
> = {
  LIVE: {
    border: "border-[var(--color-ldp-red)]",
    eyebrowClass: "text-[var(--color-ldp-red)]",
    ctaClass: "bg-[var(--color-ldp-red)] text-white hover:brightness-95",
  },
  TEED_UP: {
    border: "border-[var(--color-ldp-navy-800)]",
    eyebrowClass: "text-[var(--color-ldp-navy-800)]",
    ctaClass: "bg-[var(--color-ldp-navy-800)] text-white hover:bg-[var(--color-ldp-navy-900)]",
  },
  HORIZON: {
    border: "border-[var(--color-ldp-line)]",
    eyebrowClass: "text-[var(--color-ldp-gold)]",
    ctaClass: "bg-white border border-[var(--color-ldp-line)] text-[var(--color-ldp-navy-900)] hover:border-[var(--color-ldp-navy-700)]",
  },
};
