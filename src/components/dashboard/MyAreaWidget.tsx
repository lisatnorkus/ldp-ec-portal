"use client";

import Link from "next/link";
import { ArrowRight, Home, MapPin } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";

// Dashboard tile that follows the user's saved profile:
//   PC with precinct → "Your precinct L204"
//   Someone with LD  → "Your LD41"
//   No profile       → generic "My LD — 18 districts"

const ACCENT = "#0E4C9E";

export function MyAreaWidget() {
  const { profile, hydrated } = useUserProfile();

  if (!hydrated) {
    return (
      <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
        <div className="h-32 animate-pulse rounded-lg bg-[#FAFBFC]" />
      </div>
    );
  }

  let href = "/my-ld";
  let eyebrow = "My LD";
  let title = "18 Legislative Districts";
  let body =
    "Your district, its precincts, PCs, races on the ballot, and what to do this week.";
  let icon = <Home aria-hidden="true" className="size-4" />;

  if (profile.precinct_code) {
    href = `/precincts/${profile.precinct_code}`;
    eyebrow = "Your precinct";
    title = profile.precinct_code;
    body = "Voter counts, strategy, sleeper Dems, PCs on file, and races on your precinct ballot.";
    icon = <MapPin aria-hidden="true" className="size-4" />;
  } else if (profile.ld_number != null) {
    href = `/my-ld/${profile.ld_number}`;
    eyebrow = "Your LD";
    title = `LD${profile.ld_number}`;
    body = "Leadership, precincts, PCs on file, and the highest-leverage move for this week.";
  }

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{
        borderColor: "var(--color-ldp-line)",
        borderWidth: 1,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: ACCENT }}
      />
      <div className="flex items-center gap-2">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-white"
          style={{ backgroundColor: ACCENT }}
        >
          {icon}
        </span>
        <div
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: ACCENT }}
        >
          {eyebrow}
        </div>
      </div>
      <h3 className="mt-2 text-base font-bold leading-tight text-[var(--color-ldp-navy-900)]">
        {title}
      </h3>
      <div className="mt-2 flex-1">
        <p className="text-xs text-[var(--color-ldp-ink-700)]">{body}</p>
      </div>
      <div
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: ACCENT }}
      >
        Open
        <ArrowRight
          aria-hidden="true"
          className="size-3 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  );
}
