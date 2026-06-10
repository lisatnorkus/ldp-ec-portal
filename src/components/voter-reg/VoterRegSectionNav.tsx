"use client";

import { useEffect, useState } from "react";

// Sticky horizontal section nav for the voter-registration page. The
// page is long and content-dense; this gives a one-tap jump to each
// block and signals the page's structure up front. Works on mobile
// (horizontally scrollable chip row) and desktop. Each target section
// must carry a matching id="vr-<slug>".

type Section = { slug: string; label: string };

const SECTIONS: Section[] = [
  { slug: "deadlines", label: "Deadlines" },
  { slug: "register", label: "How to Register" },
  { slug: "eligibility", label: "Eligibility & ID" },
  { slug: "restoration", label: "Returning Citizens" },
  { slug: "targets", label: "Who We Prioritize" },
  { slug: "events", label: "Reg Events" },
  { slug: "sources", label: "Official Sources" },
];

export function VoterRegSectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id.replace(/^vr-/, ""));
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(`vr-${s.slug}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  function jump(slug: string) {
    document
      .getElementById(`vr-${slug}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Voter registration sections"
      className="sticky top-16 z-20 -mx-1 mb-8 overflow-x-auto rounded-xl border border-[var(--color-ldp-line)] bg-white/95 px-2 py-2 shadow-sm backdrop-blur"
    >
      <ul className="flex gap-1.5 whitespace-nowrap">
        {SECTIONS.map((s) => {
          const isActive = active === s.slug;
          return (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => jump(s.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--color-ldp-navy-800)] text-white"
                    : "text-[var(--color-ldp-ink-700)] hover:bg-[#F1F4F8] hover:text-[var(--color-ldp-navy-900)]"
                }`}
              >
                {s.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
