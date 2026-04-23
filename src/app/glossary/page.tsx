import Link from "next/link";
import { HubShell } from "@/components/hub/HubShell";
import { GLOSSARY, findTerm } from "@/content/glossary";

export const metadata = { title: "Glossary" };

// Sort alphabetically for the main list; people will scan by letter.
const SORTED = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

export default function GlossaryPage() {
  return (
    <HubShell
      eyebrow="Glossary"
      title="What the lingo means."
      subtitle="Political operatives speak a trade language. Nothing in this portal gets dumbed down — but every term here has a one-line definition so new members can learn the vocabulary as they go instead of having to ask every time."
      maxWidthClass="max-w-4xl"
    >
      <ul className="space-y-4">
        {SORTED.map((t) => (
          <li
            key={t.term}
            id={t.term}
            className="scroll-mt-24 rounded-xl border border-[var(--color-ldp-line)] bg-white p-4"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-base font-bold text-[var(--color-ldp-navy-900)]">{t.term}</h2>
              <a
                href={`#${encodeURIComponent(t.term)}`}
                aria-label={`Permalink to ${t.term}`}
                className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)] hover:text-[var(--color-ldp-navy-700)]"
              >
                #
              </a>
            </div>
            <p className="mt-1 text-sm font-medium text-[var(--color-ldp-navy-800)]">{t.short}</p>
            {t.long && (
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">{t.long}</p>
            )}
            {t.seeAlso && t.seeAlso.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  See also
                </span>
                {t.seeAlso.map((other) =>
                  findTerm(other) ? (
                    <Link
                      key={other}
                      href={`#${encodeURIComponent(other)}`}
                      className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-2 py-0.5 text-[11px] text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
                    >
                      {other}
                    </Link>
                  ) : null
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <section className="mt-8 rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          Missing a term?
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
          If something in the portal uses lingo that isn&apos;t here, flag it via the help button
          in the bottom-right corner. We&apos;ll add it.
        </p>
      </section>
    </HubShell>
  );
}
