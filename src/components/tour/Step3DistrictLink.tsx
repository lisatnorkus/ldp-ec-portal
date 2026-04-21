"use client";

import Link from "next/link";
import { useUserProfile } from "@/lib/userContext";

export function Step3DistrictLink() {
  const { profile, hydrated } = useUserProfile();

  if (!hydrated) {
    return (
      <div className="h-24 animate-pulse rounded-lg border border-white/10 bg-white/5" />
    );
  }

  const hasLd = profile.ld_number != null;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {hasLd ? (
        <Link
          href={`/my-ld/${profile.ld_number}`}
          className="rounded-lg border-2 border-[var(--color-ldp-gold)] bg-white/5 p-5 transition-colors hover:bg-white/10"
        >
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
            Go directly
          </div>
          <div className="mt-1 text-lg font-bold text-white">LD{profile.ld_number} →</div>
          <div className="mt-2 text-xs text-white/70">
            Open your district page with live precinct data, races on the ballot, and your highest-leverage move this week.
          </div>
        </Link>
      ) : (
        <Link
          href="/my-ld"
          className="rounded-lg border border-[var(--color-ldp-gold)] bg-white/5 p-5 transition-colors hover:bg-white/10"
        >
          <div className="text-sm font-semibold text-white">All 18 LDs →</div>
          <div className="mt-1 text-xs text-white/70">
            Pick your district; see leadership, precinct strategy mix, and races.
          </div>
        </Link>
      )}
      <div className="rounded-lg border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white">What you&apos;ll find there</div>
        <ul className="mt-2 space-y-1 text-xs text-white/70">
          <li>• Your LD&apos;s Chair + Vice Chair (or &ldquo;Vacant&rdquo;)</li>
          <li>• Strategy mix: Power Base / Hold the Line / Wake the Vote / Plant the Flag</li>
          <li>• Races on the 2026 ballot your LD&apos;s work moves</li>
          <li>• Precinct-by-precinct playbook with voter counts and sleeper Dem numbers</li>
          <li>• Your highest-leverage move this week (cycle-aware + LD-specific)</li>
        </ul>
      </div>
    </div>
  );
}
