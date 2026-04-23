"use client";

import Link from "next/link";
import { findTerm } from "@/content/glossary";

// Inline tooltip for a glossary term. Preserves the operative vocabulary
// (the word stays as written) and adds a dotted underline — hover or
// tap shows a one-line definition, click-through goes to /glossary for
// the long version. Newcomers get a one-tap lesson without breaking the
// operator's flow.
//
// Usage: <Term>Power Base</Term>   (children must be the canonical term)
//        <Term term="Sleeper Dems">sleeper Dems</Term>  (for inflected forms)

export function Term({
  children,
  term,
}: {
  children: React.ReactNode;
  term?: string;
}) {
  const key = typeof children === "string" ? children : term ?? "";
  const resolved = findTerm(term ?? key);

  if (!resolved) {
    return <>{children}</>;
  }

  return (
    <Link
      href={`/glossary#${encodeURIComponent(resolved.term)}`}
      title={resolved.short}
      className="underline decoration-dotted decoration-[var(--color-ldp-ink-700)] underline-offset-2 hover:decoration-[var(--color-ldp-navy-700)] hover:text-[var(--color-ldp-navy-900)]"
    >
      {children}
    </Link>
  );
}
