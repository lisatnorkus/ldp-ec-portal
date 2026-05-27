"use client";

import { useEffect, useState } from "react";

// Sticky in-page jump panel for the LD page. Lives on the right edge,
// fixed-positioned so it stays visible as the user scrolls. Hidden on
// mobile because the screen is too narrow for a sidebar; the page
// still scrolls top-to-bottom there.
//
// Each item links to an anchor on the page. The corresponding section
// must have a matching `id="ld-<slug>"` set on its container.

type Section = {
  slug: string;
  label: string;
};

export type LdJumpItem = Section;

const DEFAULT_SECTIONS: Section[] = [
  { slug: "results", label: "Primary Results" },
  { slug: "tasks", label: "Tasks" },
  { slug: "play", label: "This Week" },
  { slug: "leadership", label: "Leadership" },
  { slug: "notes", label: "Notes" },
  { slug: "takeaways", label: "Takeaways" },
  { slug: "early-voting", label: "Early Voting" },
  { slug: "captains", label: "Captains" },
  { slug: "strategy", label: "Strategy Mix" },
  { slug: "races", label: "Races on Ballot" },
  { slug: "playbook", label: "Precinct Playbook" },
];

export function LdJumpNav({ sections = DEFAULT_SECTIONS }: { sections?: Section[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the section closest to the top of the viewport that is
        // intersecting. We just want the "current" section to highlight.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id.replace(/^ld-/, ""));
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 }
    );
    for (const s of sections) {
      const el = document.getElementById(`ld-${s.slug}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  function jump(slug: string) {
    const el = document.getElementById(`ld-${slug}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="LD page sections"
      className="pointer-events-none fixed right-4 top-28 z-20 hidden w-44 xl:block"
    >
      <div className="pointer-events-auto rounded-xl border border-[var(--color-ldp-line)] bg-white/95 p-2 shadow-md backdrop-blur">
        <div className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-ink-700)]">
          Jump to
        </div>
        <ul className="space-y-0.5">
          {sections.map((s) => {
            const isActive = active === s.slug;
            return (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => jump(s.slug)}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-ldp-navy-700)] text-white"
                      : "text-[var(--color-ldp-ink-900)] hover:bg-[var(--color-ldp-cream,#fbf8f1)]"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`size-1.5 shrink-0 rounded-full ${
                      isActive
                        ? "bg-[var(--color-ldp-gold,#c89a3b)]"
                        : "bg-[var(--color-ldp-ink-300,#9aa0aa)]"
                    }`}
                  />
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
