import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PLAN_CARDS, type PlanCard } from "@/content/cycle-phases";

export function PlanCards() {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        Plan · November first, primary as reference, long horizon
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
    <article className={`flex flex-col overflow-hidden rounded-xl shadow-sm ${styles.cardBg} ${styles.textTheme}`}>
      <div className={`${styles.stripeBg} px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${styles.stripeText}`}>
        {plan.eyebrow}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`text-xl font-black tracking-tight ${styles.titleClass}`}>{plan.title}</h3>
        <p className={`mt-2 flex-1 text-sm leading-relaxed ${styles.bodyClass}`}>{plan.body}</p>

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
          <div className={`mt-3 flex flex-wrap gap-2 border-t pt-3 ${styles.borderClass}`}>
            {plan.secondaryLinks.map((link) => {
              const linkExternal = link.href.startsWith("http");
              const className = `text-[11px] ${styles.secondaryLinkClass} hover:underline inline-flex items-center gap-1`;
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
      </div>
    </article>
  );
}

const PLAN_STYLES: Record<
  PlanCard["status"],
  {
    cardBg: string;
    textTheme: string;
    stripeBg: string;
    stripeText: string;
    titleClass: string;
    bodyClass: string;
    ctaClass: string;
    borderClass: string;
    secondaryLinkClass: string;
  }
> = {
  // LIVE — filled red. Demands attention.
  LIVE: {
    cardBg: "bg-gradient-to-br from-[#E11D48] to-[var(--color-ldp-red)] text-white",
    textTheme: "text-white",
    stripeBg: "bg-black/20",
    stripeText: "text-white",
    titleClass: "text-white",
    bodyClass: "text-white/90",
    ctaClass: "bg-white text-[var(--color-ldp-red)] hover:bg-white/90",
    borderClass: "border-white/20",
    secondaryLinkClass: "text-white/90",
  },
  // TEED UP — navy solid. Next up, confident.
  TEED_UP: {
    cardBg: "bg-gradient-to-br from-[var(--color-ldp-navy-900)] to-[var(--color-ldp-navy-700)] text-white",
    textTheme: "text-white",
    stripeBg: "bg-black/20",
    stripeText: "text-white",
    titleClass: "text-white",
    bodyClass: "text-white/85",
    ctaClass: "bg-white text-[var(--color-ldp-navy-900)] hover:bg-white/90",
    borderClass: "border-white/20",
    secondaryLinkClass: "text-white/90",
  },
  // HORIZON — clean white. Reference material, not urgent.
  HORIZON: {
    cardBg: "bg-white border border-[var(--color-ldp-line)]",
    textTheme: "text-[var(--color-ldp-ink-900)]",
    stripeBg: "bg-[var(--color-ldp-gold)]",
    stripeText: "text-[var(--color-ldp-navy-900)]",
    titleClass: "text-[var(--color-ldp-navy-900)]",
    bodyClass: "text-[var(--color-ldp-ink-700)]",
    ctaClass: "bg-[var(--color-ldp-navy-800)] text-white hover:bg-[var(--color-ldp-navy-900)]",
    borderClass: "border-[var(--color-ldp-line)]",
    secondaryLinkClass: "text-[var(--color-ldp-navy-700)]",
  },
  // WRAPPED — desaturated. Plan is done; this is the memory of it.
  WRAPPED: {
    cardBg: "bg-[#FAFAFA] border border-[var(--color-ldp-line)]",
    textTheme: "text-[var(--color-ldp-ink-900)]",
    stripeBg: "bg-[var(--color-ldp-ink-200,#d8dbe1)]",
    stripeText: "text-[var(--color-ldp-ink-700)]",
    titleClass: "text-[var(--color-ldp-ink-700)]",
    bodyClass: "text-[var(--color-ldp-ink-700)]",
    ctaClass:
      "border border-[var(--color-ldp-navy-800)] text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-navy-900)] hover:text-white",
    borderClass: "border-[var(--color-ldp-line)]",
    secondaryLinkClass: "text-[var(--color-ldp-navy-700)]",
  },
};
