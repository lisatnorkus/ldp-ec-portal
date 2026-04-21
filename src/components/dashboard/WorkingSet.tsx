"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Megaphone,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { RoleKey } from "@/content/highest-leverage-rules";
import { ALWAYS_DUTIES } from "@/content/role-duties";
import { SOCIAL_PLATFORMS } from "@/content/social-platforms";

const SELECTABLE_ROLES: { key: RoleKey; label: string; needsLd: boolean }[] = [
  { key: "LD_CHAIR", label: "LD Chair", needsLd: true },
  { key: "LD_VC", label: "LD Vice Chair", needsLd: true },
  { key: "AT_LARGE", label: "At-Large Member", needsLd: false },
  { key: "LYD_PRES", label: "LYD President", needsLd: false },
  { key: "WOMENS_CLUB_PRES", label: "JCDWC President", needsLd: false },
  { key: "PRECINCT_CAPTAIN", label: "Precinct Captain", needsLd: true },
  {
    key: "COMMITTEE_CHAIR_ONLY",
    label: "Committee Chair / Member (no LD seat)",
    needsLd: false,
  },
];

const LD_NUMBERS = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 46, 48];

export function WorkingSet() {
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
      <div className="mb-8 h-80 animate-pulse rounded-xl border border-[var(--color-ldp-line)] bg-white" />
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

  // Picker state — role not set yet
  if (!hasProfile || editing) {
    const draftNeedsLd = SELECTABLE_ROLES.find((r) => r.key === roleDraft)?.needsLd ?? false;
    return (
      <section className="mb-8 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-6">
        <div className="flex items-center gap-2">
          <User aria-hidden="true" className="size-4 text-[var(--color-ldp-navy-800)]" />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            Tell the portal who you are
          </h2>
        </div>
        <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
          So we can show what your seat already owes the county — and what doing that looks like
          right now in this specific week of this specific cycle. Saved in your browser; replaced
          by Google sign-in post-testing.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label htmlFor="ws-role" className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">Your role</span>
            <select
              id="ws-role"
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
            <label htmlFor="ws-ld" className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-ldp-ink-700)]">Your LD</span>
              <select
                id="ws-ld"
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

  const ldLink = profile.ld_number != null ? `/my-ld/${profile.ld_number}` : null;

  return (
    <section className="mb-8 space-y-4">
      {/* Header strip — role context */}
      <div className="rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              Your working set
            </div>
            <div className="mt-0.5 text-lg font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
              {selectedRole?.label}
              {profile.ld_number != null && <> · LD{profile.ld_number}</>}
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
        <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
          What this seat asks of you has always been what the bylaws say it asks. Below: those
          standing duties, the weekly amplifier work that&apos;s always live, and the specific
          pressing versions for this cycle phase.
        </p>

        {/* Quick links for personalized depth */}
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {ldLink && (
            <Link
              href={ldLink}
              className="inline-flex items-center gap-1.5 rounded border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-xs font-medium text-[var(--color-ldp-navy-900)] transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
            >
              <MapPin aria-hidden="true" className="size-3.5 text-[var(--color-ldp-navy-700)]" />
              Your LD{profile.ld_number} deep page →
            </Link>
          )}
          <Link
            href={`/tour/2?role=${profile.role?.toLowerCase() ?? ""}`}
            className="inline-flex items-center gap-1.5 rounded border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-xs font-medium text-[var(--color-ldp-navy-900)] transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <User aria-hidden="true" className="size-3.5 text-[var(--color-ldp-navy-700)]" />
            Your role one-pager →
          </Link>
          <Link
            href="/tour/4"
            className="inline-flex items-center gap-1.5 rounded border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-xs font-medium text-[var(--color-ldp-navy-900)] transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <ShieldCheck aria-hidden="true" className="size-3.5 text-[var(--color-ldp-navy-700)]" />
            Meetings · proxy · voting →
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* ALWAYS DUTIES */}
        <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            What this seat asks of you — always
          </div>
          <h3 className="mt-0.5 text-base font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Your standing duties
          </h3>
          <p className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
            Every line cites LJCDP / KDP bylaws or the committee that owns it. This list is what
            the role has always asked — not a plan someone invented.
          </p>
          <ol className="mt-4 space-y-3">
            {ALWAYS_DUTIES.map((d, i) => (
              <li key={d.id} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                    {d.label}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
                    {d.shortBody}
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]/70">
                    {d.cite}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* SOCIAL AMPLIFY + AD FUND */}
        <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
          <div className="flex items-center gap-2">
            <Megaphone aria-hidden="true" className="size-4 text-[var(--color-ldp-red)]" />
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              Follow · Share · Repost
            </div>
          </div>
          <h3 className="mt-0.5 text-base font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            You&apos;re the amplifier team.
          </h3>
          <p className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
            One reshare = free reach. When 50 board members reshare a post, organic reach
            5–10x&apos;s overnight. This is the easiest unpaid lift anyone on this board can do.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SOCIAL_PLATFORMS.map((p) => (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-2.5 py-2 text-xs font-medium text-[var(--color-ldp-navy-900)] transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
                title={`${p.label} · ${p.handle}`}
              >
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center rounded bg-[var(--color-ldp-navy-800)] text-[10px] font-bold text-white group-hover:bg-[var(--color-ldp-red)]"
                >
                  {p.glyph}
                </span>
                <span className="min-w-0 flex-1 truncate">{p.label}</span>
              </a>
            ))}
          </div>
          <div className="mt-3 text-[10px] text-[var(--color-ldp-ink-700)]/70">
            Official LDP channels. Verified handles per the Communications Committee.
          </div>

          {/* Ad fund */}
          <div className="mt-5 border-t border-[var(--color-ldp-line)] pt-4">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              Fund the ad program
            </div>
            <h4 className="mt-0.5 text-sm font-bold text-[var(--color-ldp-navy-900)]">
              Paid digital — Beth&apos;s ad budget
            </h4>
            <p className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
              Beth runs targeted Meta/Instagram ads, boosted posts, candidate-aligned creative,
              GOTV reminders. She fundraises for this specifically so it doesn&apos;t compete with
              HQ rent or canvass printing.
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex gap-2">
                <span className="shrink-0 rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
                  If $
                </span>
                <span className="text-[var(--color-ldp-ink-900)]">
                  <strong>$100 buys a sponsored post. $500 funds a targeted week.</strong>{" "}
                  Earmark to &ldquo;Ad Fund&rdquo; via ActBlue or tell Beth directly. Separate
                  line from the $120 Club + your $500 ticket-raise target.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
                  If network
                </span>
                <span className="text-[var(--color-ldp-ink-900)]">
                  Bring a sponsor — PAC, LD committee, allied business, or individual donor. Beth
                  preps the ask deck; you make the intro. She&apos;ll close.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
                  If content
                </span>
                <span className="text-[var(--color-ldp-ink-900)]">
                  Submit a pre-approved ad via the Event Request form (note &ldquo;pre-approved
                  ad&rdquo;). Beth&apos;s team turns it into runnable creative and slots it into
                  the calendar.
                </span>
              </li>
            </ul>
          </div>

          {/* Comms protocol */}
          <div className="mt-5 rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-3 text-xs">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Comms protocol
            </div>
            <ul className="mt-1.5 space-y-1 text-[var(--color-ldp-ink-900)]">
              <li>
                <strong>Don&apos;t text Beth at 9pm.</strong> Use the intake form.
              </li>
              <li>
                All asks (graphics, social, ads, print):{" "}
                <a
                  href="https://loukydemparty.fillout.com/eventrequest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-ldp-navy-700)] hover:underline"
                >
                  Event Request form <ExternalLink aria-hidden="true" className="size-3" />
                </a>
              </li>
              <li>
                Press inquiries:{" "}
                <a
                  href="mailto:communications@louisvilledems.com"
                  className="text-[var(--color-ldp-navy-700)] hover:underline"
                >
                  communications@louisvilledems.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
