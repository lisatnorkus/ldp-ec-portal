"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Target, User } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { RoleKey } from "@/content/highest-leverage-rules";

// Roles the user can pick from the dashboard. Matches the rules-engine
// RoleKey set. Excludes OFFICER (countywide officers know who they are
// and also hold an LD seat — they can pick either the officer-facing
// LD role or continue without setting).
const SELECTABLE_ROLES: { key: RoleKey; label: string; needsLd: boolean }[] = [
  { key: "LD_CHAIR", label: "LD Chair", needsLd: true },
  { key: "LD_VC", label: "LD Vice Chair", needsLd: true },
  { key: "AT_LARGE", label: "At-Large Member", needsLd: false },
  { key: "LYD_PRES", label: "LYD President", needsLd: false },
  { key: "WOMENS_CLUB_PRES", label: "JCDWC President", needsLd: false },
  { key: "PRECINCT_CAPTAIN", label: "Precinct Captain", needsLd: true },
  { key: "COMMITTEE_CHAIR_ONLY", label: "Committee Chair / Member (no LD seat)", needsLd: false },
];

const LD_NUMBERS = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 46, 48];

export function PersonalizedHero() {
  const { profile, setProfile, clearProfile, hydrated } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [roleDraft, setRoleDraft] = useState<RoleKey | "">(profile.role ?? "");
  const [ldDraft, setLdDraft] = useState<string>(
    profile.ld_number != null ? String(profile.ld_number) : ""
  );

  useEffect(() => {
    setRoleDraft(profile.role ?? "");
    setLdDraft(profile.ld_number != null ? String(profile.ld_number) : "");
  }, [profile.role, profile.ld_number]);

  if (!hydrated) {
    return (
      <div className="mb-8 h-40 animate-pulse rounded-xl border border-[var(--color-ldp-line)] bg-white" />
    );
  }

  const hasProfile = profile.role != null;
  const selectedRole = SELECTABLE_ROLES.find((r) => r.key === profile.role);

  function save() {
    if (!roleDraft) return;
    const role = roleDraft as RoleKey;
    const needsLd = SELECTABLE_ROLES.find((r) => r.key === role)?.needsLd ?? false;
    setProfile({
      role,
      ld_number: needsLd && ldDraft ? Number(ldDraft) : null,
    });
    setEditing(false);
  }

  if (!hasProfile || editing) {
    const draftNeedsLd = SELECTABLE_ROLES.find((r) => r.key === roleDraft)?.needsLd ?? false;
    return (
      <section className="mb-8 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5">
        <div className="flex items-center gap-2">
          <User className="size-4 text-[var(--color-ldp-navy-800)]" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            Tell the portal who you are
          </h2>
        </div>
        <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
          Saved in your browser only — used to show your LD&apos;s highest-leverage move of the week
          and personalize your dashboard. This gets replaced by Google sign-in post-testing.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">Your role</span>
            <select
              value={roleDraft}
              onChange={(e) => setRoleDraft(e.target.value as RoleKey | "")}
              className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm"
            >
              <option value="">— pick one —</option>
              {SELECTABLE_ROLES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          {draftNeedsLd && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">Your LD</span>
              <select
                value={ldDraft}
                onChange={(e) => setLdDraft(e.target.value)}
                className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm"
              >
                <option value="">— pick one —</option>
                {LD_NUMBERS.map((n) => (
                  <option key={n} value={n}>
                    LD{n}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={save}
            disabled={!roleDraft || (draftNeedsLd && !ldDraft)}
            className="rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
          {hasProfile && (
            <button
              onClick={() => {
                setEditing(false);
                setRoleDraft(profile.role ?? "");
                setLdDraft(profile.ld_number != null ? String(profile.ld_number) : "");
              }}
              className="rounded-md border border-[var(--color-ldp-line)] bg-white px-4 py-2 text-sm text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)]"
            >
              Cancel
            </button>
          )}
        </div>
      </section>
    );
  }

  // Profile is set — render the personalized hero.
  return (
    <section className="mb-8 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Target className="mt-1 size-5 shrink-0 text-[var(--color-ldp-red)]" />
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              Your highest-leverage move this week
            </div>
            <button
              onClick={() => setEditing(true)}
              className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)] hover:underline"
            >
              Edit
            </button>
            <button
              onClick={clearProfile}
              className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)] hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="mt-2 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            {selectedRole?.label}
            {profile.ld_number != null && <> · LD{profile.ld_number}</>}
          </div>
          {profile.ld_number != null ? (
            <div className="mt-3">
              <p className="text-sm text-[var(--color-ldp-ink-700)]">
                Your personalized recommendation lives on your LD page — it uses live precinct data
                + cycle phase to tell you the one thing most worth doing this week.
              </p>
              <Link
                href={`/my-ld/${profile.ld_number}`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
              >
                Open LD{profile.ld_number} with your move →
              </Link>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-[var(--color-ldp-ink-700)]">
                {profile.role === "AT_LARGE"
                  ? "As At-Large, your highest-leverage work is countywide — jump into Canvass Tools to see the priority MC 7/17/21 coordination, or pick an LD that's thin on leadership to plug in."
                  : "Your role-specific highest-leverage move this week renders on the role one-pager. The tour-step 2 role page has your full scope."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/canvass-tools"
                  className="rounded-md bg-[var(--color-ldp-red)] px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
                >
                  Canvass Tools →
                </Link>
                <Link
                  href={`/tour/2?role=${profile.role?.toLowerCase()}`}
                  className="rounded-md border border-[var(--color-ldp-line)] bg-white px-4 py-2 text-sm text-[var(--color-ldp-navy-900)] hover:border-[var(--color-ldp-navy-700)]"
                >
                  Your role one-pager →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
