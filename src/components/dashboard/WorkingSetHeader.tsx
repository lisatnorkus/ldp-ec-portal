"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, MapPin } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { RoleKey } from "@/content/highest-leverage-rules";

// Compact role header for the widget-grid dashboard. Replaces the
// full WorkingSet panel once a profile is saved. First-time visitors
// still see the picker — but inline and small.

const SELECTABLE_ROLES: {
  key: RoleKey;
  label: string;
  needsLd: boolean;
  needsPrecinct?: boolean;
}[] = [
  { key: "LD_CHAIR", label: "LD Chair", needsLd: true },
  { key: "LD_VC", label: "LD Vice Chair", needsLd: true },
  { key: "AT_LARGE", label: "At-Large Member", needsLd: false },
  { key: "LYD_PRES", label: "LYD President", needsLd: false },
  { key: "WOMENS_CLUB_PRES", label: "JCDWC President", needsLd: false },
  { key: "PRECINCT_CAPTAIN", label: "Precinct Captain", needsLd: true, needsPrecinct: true },
  { key: "COMMITTEE_CHAIR_ONLY", label: "Committee Chair / Member", needsLd: false },
];

const LD_NUMBERS = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 46, 48];

export function WorkingSetHeader() {
  const { profile, setProfile, clearProfile, hydrated } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [roleDraft, setRoleDraft] = useState<RoleKey | "">(profile.role ?? "");
  const [ldDraft, setLdDraft] = useState<string>(
    profile.ld_number != null ? String(profile.ld_number) : ""
  );
  const [precinctDraft, setPrecinctDraft] = useState<string>(profile.precinct_code ?? "");
  const [precinctOptions, setPrecinctOptions] = useState<string[]>([]);
  const [loadingPrecincts, setLoadingPrecincts] = useState(false);

  useEffect(() => {
    setRoleDraft(profile.role ?? "");
    setLdDraft(profile.ld_number != null ? String(profile.ld_number) : "");
    setPrecinctDraft(profile.precinct_code ?? "");
  }, [profile.role, profile.ld_number, profile.precinct_code]);

  // Fetch precinct list when the LD draft changes and the role wants it
  useEffect(() => {
    const draftRole = SELECTABLE_ROLES.find((r) => r.key === roleDraft);
    if (!draftRole?.needsPrecinct || !ldDraft) {
      setPrecinctOptions([]);
      return;
    }
    let cancelled = false;
    setLoadingPrecincts(true);
    fetch(`/api/precincts-by-ld?ld=${encodeURIComponent(ldDraft)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setPrecinctOptions(j.precincts ?? []);
      })
      .catch(() => {
        if (!cancelled) setPrecinctOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingPrecincts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roleDraft, ldDraft]);

  if (!hydrated) {
    return <div className="mb-6 h-14 animate-pulse rounded-lg border border-[var(--color-ldp-line)] bg-white" />;
  }

  const hasProfile = profile.role != null;
  const selectedRole = SELECTABLE_ROLES.find((r) => r.key === profile.role);
  const draftRole = SELECTABLE_ROLES.find((r) => r.key === roleDraft);
  const draftNeedsLd = draftRole?.needsLd ?? false;
  const draftNeedsPrecinct = draftRole?.needsPrecinct ?? false;

  function save() {
    if (!roleDraft) return;
    const role = roleDraft as RoleKey;
    const selected = SELECTABLE_ROLES.find((r) => r.key === role);
    const needsLd = selected?.needsLd ?? false;
    const needsPrecinct = selected?.needsPrecinct ?? false;
    setProfile({
      role,
      ld_number: needsLd && ldDraft ? Number(ldDraft) : null,
      precinct_code: needsPrecinct && precinctDraft ? precinctDraft : null,
    });
    setEditing(false);
  }

  if (!hasProfile || editing) {
    return (
      <section className="mb-6 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5">
        <div className="flex items-center gap-2">
          <User aria-hidden="true" className="size-4 text-[var(--color-ldp-navy-800)]" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            Tell the portal who you are
          </h2>
        </div>
        <p className="mt-1.5 text-xs text-[var(--color-ldp-ink-700)]">
          So the portal can tailor what&apos;s pressing for your seat this week. Saved in your
          browser.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <label htmlFor="ws-role" className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">Your role</span>
            <select
              id="ws-role"
              value={roleDraft}
              onChange={(e) => {
                setRoleDraft(e.target.value as RoleKey | "");
                setPrecinctDraft("");
              }}
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
            <label htmlFor="ws-ld" className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">Your LD</span>
              <select
                id="ws-ld"
                value={ldDraft}
                onChange={(e) => {
                  setLdDraft(e.target.value);
                  setPrecinctDraft("");
                }}
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
          {draftNeedsPrecinct && ldDraft && (
            <label htmlFor="ws-precinct" className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">
                Your precinct
              </span>
              <select
                id="ws-precinct"
                value={precinctDraft}
                onChange={(e) => setPrecinctDraft(e.target.value)}
                disabled={loadingPrecincts || precinctOptions.length === 0}
                className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)] disabled:opacity-60"
              >
                <option value="">
                  {loadingPrecincts
                    ? "Loading precincts…"
                    : precinctOptions.length === 0
                      ? "No precincts found"
                      : "— pick one —"}
                </option>
                {precinctOptions.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={
              !roleDraft ||
              (draftNeedsLd && !ldDraft) ||
              (draftNeedsPrecinct && !precinctDraft)
            }
            className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
          >
            Save
          </button>
          {hasProfile && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)]"
            >
              Cancel
            </button>
          )}
        </div>
      </section>
    );
  }

  // Saved-state header
  const homeLink = profile.precinct_code
    ? { href: `/precincts/${profile.precinct_code}`, label: `Your precinct ${profile.precinct_code}` }
    : profile.ld_number != null
      ? { href: `/my-ld/${profile.ld_number}`, label: `Your LD${profile.ld_number}` }
      : null;

  return (
    <section className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-ldp-line)] bg-white px-5 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-white">
          <User aria-hidden="true" className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Signed in as
          </div>
          <div className="truncate text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            {selectedRole?.label}
            {profile.ld_number != null && <> · LD{profile.ld_number}</>}
            {profile.precinct_code && <> · {profile.precinct_code}</>}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {homeLink && (
          <Link
            href={homeLink.href}
            className="inline-flex items-center gap-1 rounded font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <MapPin aria-hidden="true" className="size-3.5" />
            {homeLink.label} →
          </Link>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded text-[var(--color-ldp-ink-700)] hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={clearProfile}
          className="rounded text-[var(--color-ldp-ink-700)] hover:underline"
        >
          Clear
        </button>
      </div>
    </section>
  );
}
