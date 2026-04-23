"use client";

import Link from "next/link";
import { Folder, Mail } from "lucide-react";

// Client component because the "Email chair" anchor carries an onClick
// handler to stop the card-link bubble. Kept in its own file so the
// page-level server component can render it without tripping the RSC
// "Event handlers cannot be passed to Client Component props" error.

type CommitteeCardProps = {
  code: string;
  name: string;
  adhoc: boolean;
  adhocNote: string | null;
  chairName: string | null;
  chairEmail: string | null;
  memberCount: number;
};

export function CommitteeCard({
  code,
  name,
  adhoc,
  adhocNote,
  chairName,
  chairEmail,
  memberCount,
}: CommitteeCardProps) {
  return (
    <div
      className={`group relative flex flex-col rounded-lg border bg-white p-4 transition-colors hover:border-[var(--color-ldp-navy-700)] hover:shadow-sm ${
        adhoc ? "border-[var(--color-ldp-gold)]" : "border-[var(--color-ldp-line)]"
      }`}
    >
      <Link
        href={`/committees/${code.toLowerCase()}`}
        className="absolute inset-0 z-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)]"
        aria-label={`Open ${name} committee detail`}
      />
      <div className="relative z-10 pointer-events-none">
        {adhoc && (
          <span className="mb-2 inline-flex w-fit items-center rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ldp-navy-900)]">
            Ad hoc
          </span>
        )}
        <div className="text-base font-semibold text-[var(--color-ldp-navy-900)]">{name}</div>
        <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
          Chair: <span className="font-medium">{chairName ?? "—"}</span>
          {memberCount > 0 && (
            <span>
              {" "}
              · {memberCount} member{memberCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        {adhocNote && (
          <p className="mt-2 text-xs italic text-[var(--color-ldp-ink-700)]">{adhocNote}</p>
        )}
      </div>
      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-3 text-xs">
        {chairEmail && (
          <a
            href={`mailto:${chairEmail}?subject=${encodeURIComponent(`Interested in ${name} Committee`)}`}
            className="inline-flex items-center gap-1 rounded border border-[var(--color-ldp-line)] bg-white px-2 py-1 font-medium text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail aria-hidden="true" className="size-3" />
            Email chair
          </a>
        )}
        <span className="inline-flex items-center gap-1 text-[var(--color-ldp-navy-700)] group-hover:underline">
          <Folder className="size-3.5" /> View detail →
        </span>
      </div>
    </div>
  );
}
