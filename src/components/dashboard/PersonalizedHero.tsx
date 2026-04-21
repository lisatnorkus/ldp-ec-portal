"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Target, User, MapPin, Users, Calendar, Vote } from "lucide-react";
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
          Saved in your browser only. Used to route you directly to your role one-pager, your
          district page, and your highest-leverage move this week. Replaced by Google sign-in
          post-testing.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label htmlFor="hero-role" className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">Your role</span>
            <select
              id="hero-role"
              value={roleDraft}
              onChange={(e) => setRoleDraft(e.target.value as RoleKey | "")}
              className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
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
            <label htmlFor="hero-ld" className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">Your LD</span>
              <select
                id="hero-ld"
                value={ldDraft}
                onChange={(e) => setLdDraft(e.target.value)}
                className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
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
            type="button"
            onClick={save}
            disabled={!roleDraft || (draftNeedsLd && !ldDraft)}
            className="rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
          {hasProfile && (
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setRoleDraft(profile.role ?? "");
                setLdDraft(profile.ld_number != null ? String(profile.ld_number) : "");
              }}
              className="rounded-md border border-[var(--color-ldp-line)] bg-white px-4 py-2 text-sm text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
            >
              Cancel
            </button>
          )}
        </div>
      </section>
    );
  }

  // Profile set — render the personalized hero with direct paths to the
  // five priorities (role, district, month, meetings, reorg).
  const roleSlug = profile.role?.toLowerCase() ?? "";
  const ldLink = profile.ld_number != null ? `/my-ld/${profile.ld_number}` : null;
  return (
    <section className="mb-8 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-start gap-2">
          <Target className="mt-1 size-5 shrink-0 text-[var(--color-ldp-red)]" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              Your working set
            </div>
            <div className="mt-0.5 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
              {selectedRole?.label}
              {profile.ld_number != null && <> · LD{profile.ld_number}</>}
            </div>
          </div>
        </div>
        <div className="flex gap-3 text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit your role and district"
            className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={clearProfile}
            aria-label="Clear your saved role and district"
            className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Priority 1: What your role requires */}
        <Link
          href={`/tour/2?role=${roleSlug}`}
          className="group rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4 transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
        >
          <Users className="size-4 text-[var(--color-ldp-navy-800)]" />
          <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Your role
          </div>
          <div className="mt-1 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            {selectedRole?.label}
          </div>
          <div className="mt-1 text-[11px] text-[var(--color-ldp-ink-700)]">
            What you&apos;re supposed to do, how to catch up, 2028 ask →
          </div>
        </Link>

        {/* Priority 2: Your district (applied targeting) */}
        {ldLink ? (
          <Link
            href={ldLink}
            className="group rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4 transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <MapPin className="size-4 text-[var(--color-ldp-navy-800)]" />
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Your district
            </div>
            <div className="mt-1 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
              LD{profile.ld_number}
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-ldp-ink-700)]">
              Strategy mix, precincts, races, this week&apos;s move →
            </div>
          </Link>
        ) : (
          <Link
            href="/canvass-tools"
            className="group rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4 transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <MapPin className="size-4 text-[var(--color-ldp-navy-800)]" />
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Countywide
            </div>
            <div className="mt-1 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
              Priority MCs 7 / 17 / 21
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-ldp-ink-700)]">
              Where countywide hours move the most votes →
            </div>
          </Link>
        )}

        {/* Priority 3: What's happening this month */}
        <Link
          href="/this-month"
          className="group rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4 transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
        >
          <Calendar className="size-4 text-[var(--color-ldp-navy-800)]" />
          <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            This month
          </div>
          <div className="mt-1 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            What&apos;s live now
          </div>
          <div className="mt-1 text-[11px] text-[var(--color-ldp-ink-700)]">
            Playbook, events, canvass windows →
          </div>
        </Link>

        {/* Priority 4: How meetings work */}
        <Link
          href="/tour/4"
          className="group rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4 transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
        >
          <Vote className="size-4 text-[var(--color-ldp-navy-800)]" />
          <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Meetings
          </div>
          <div className="mt-1 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            Zoom, proxy, voting
          </div>
          <div className="mt-1 text-[11px] text-[var(--color-ldp-ink-700)]">
            Robert&apos;s Rules basics + endorsement process →
          </div>
        </Link>
      </div>
    </section>
  );
}
