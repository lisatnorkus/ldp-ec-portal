"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Megaphone,
  ExternalLink,
  ShieldCheck,
  Map as MapIcon,
  Clock,
  Star,
  Users,
  Vote,
} from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { RoleKey } from "@/content/highest-leverage-rules";
import { ALWAYS_DUTIES } from "@/content/role-duties";
import { SOCIAL_PLATFORMS } from "@/content/social-platforms";
import { SocialIcon } from "@/components/social/SocialIcon";

type LdSnapshotClient = {
  ld_number: number;
  precinct_count: number;
  pc_count: number;
  pc_precinct_count: number;
  dark_precinct_count: number;
  endorsed_candidate_count: number;
};

export type RightNowContextClient = {
  days_to_primary: number | null;
  primary_date_iso: string;
  voter_guide_url: string | null;
  next_event_name: string | null;
  next_event_days_until: number | null;
  next_event_tickets_url: string | null;
  ld_snapshots: LdSnapshotClient[];
};

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

export function WorkingSet({ rightNow }: { rightNow?: RightNowContextClient }) {
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
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
            href="/my-ld"
            className="inline-flex items-center gap-1.5 rounded border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-xs font-medium text-[var(--color-ldp-navy-900)] transition-colors hover:border-[var(--color-ldp-red)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
          >
            <MapIcon aria-hidden="true" className="size-3.5 text-[var(--color-ldp-navy-700)]" />
            Browse all 18 LDs →
          </Link>
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
                <span className="flex size-7 shrink-0 items-center justify-center rounded bg-[var(--color-ldp-navy-800)] text-white transition-colors group-hover:bg-[var(--color-ldp-red)]">
                  <SocialIcon platform={p.key} className="size-4" />
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

      {rightNow && (
        <RightNowPanel
          rightNow={rightNow}
          role={profile.role ?? null}
          ldNumber={profile.ld_number ?? null}
        />
      )}
    </section>
  );
}

function RightNowPanel({
  rightNow,
  role,
  ldNumber,
}: {
  rightNow: RightNowContextClient;
  role: RoleKey | null;
  ldNumber: number | null;
}) {
  const ldSnap = ldNumber
    ? rightNow.ld_snapshots.find((s) => s.ld_number === ldNumber) ?? null
    : null;

  const items: { id: string; icon: React.ReactNode; label: string; body: React.ReactNode; accent: string }[] = [];

  // Days to primary — always show if primary is in the future.
  if (rightNow.days_to_primary != null) {
    const d = rightNow.days_to_primary;
    const dateLabel = new Date(rightNow.primary_date_iso + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    items.push({
      id: "primary",
      icon: <Vote aria-hidden="true" className="size-4" />,
      label: "Primary election",
      body: (
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            {d} day{d === 1 ? "" : "s"} out — {dateLabel}
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            Share the voter guide. Plan poll rides (
            <a href="tel:5025821999" className="text-[var(--color-ldp-navy-700)] hover:underline">
              502-582-1999
            </a>
            ). Personal knocks move the needle for endorsed candidates.
          </div>
          {rightNow.voter_guide_url && (
            <Link
              href="/candidates"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-red)] hover:underline"
            >
              See the ballot →
            </Link>
          )}
        </div>
      ),
      accent: "var(--color-ldp-red)",
    });
  }

  // PC coverage for the user's LD — LD Chair / VC / PC roles.
  if (ldSnap && (role === "LD_CHAIR" || role === "LD_VC" || role === "PRECINCT_CAPTAIN")) {
    const totalSeats = ldSnap.precinct_count * 3;
    items.push({
      id: "pc-coverage",
      icon: <Users aria-hidden="true" className="size-4" />,
      label: `LD${ldSnap.ld_number} precinct captains`,
      body: (
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            {ldSnap.pc_count} of {totalSeats} seats filled · {ldSnap.dark_precinct_count} dark
            precincts
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            PC recruitment is a 90-day CEC obligation (KDP Art. III.B). Your LD page lists every
            named PC with contact info where known.
          </div>
          <Link
            href={`/my-ld/${ldSnap.ld_number}`}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
          >
            Open LD{ldSnap.ld_number} →
          </Link>
        </div>
      ),
      accent: "var(--color-ldp-navy-800)",
    });
  }

  // Endorsed candidates in the user's LD.
  if (ldSnap && ldSnap.endorsed_candidate_count > 0) {
    items.push({
      id: "endorsed",
      icon: <Star aria-hidden="true" className="size-4" />,
      label: `LD${ldSnap.ld_number} endorsed candidates`,
      body: (
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            {ldSnap.endorsed_candidate_count} candidate
            {ldSnap.endorsed_candidate_count === 1 ? "" : "s"} with an LDP endorsement
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            Share their pages, donate personally, knock for them. Endorsements cleared a 60%
            LDPEC vote — the party is on record.
          </div>
          <Link
            href="/candidates"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-gold)] hover:underline"
          >
            See who →
          </Link>
        </div>
      ),
      accent: "var(--color-ldp-gold)",
    });
  }

  // Next signature event if close.
  if (rightNow.next_event_days_until != null && rightNow.next_event_days_until <= 60) {
    const d = rightNow.next_event_days_until;
    items.push({
      id: "event",
      icon: <Clock aria-hidden="true" className="size-4" />,
      label: "Next signature event",
      body: (
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            {rightNow.next_event_name} · {d} day{d === 1 ? "" : "s"} out
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            {rightNow.next_event_tickets_url
              ? "Your personal ticket-sale link is live — every ticket counts toward your $500 raise."
              : "Ticket links open about 30 days out. Watch for yours from Comms."}
          </div>
          <Link
            href="/events"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
          >
            Open events →
          </Link>
        </div>
      ),
      accent: "var(--color-ldp-red)",
    });
  }

  // Early voting window — within 30 days.
  if (rightNow.days_to_primary != null && rightNow.days_to_primary <= 35) {
    items.push({
      id: "early-voting",
      icon: <MapPin aria-hidden="true" className="size-4" />,
      label: "Early voting",
      body: (
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            May 14 – 16, 8am – 6pm · 24 locations
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            Any Jefferson County voter can use any location. Share the one nearest each voter.
          </div>
          <Link
            href="/early-voting"
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
          >
            Browse the 24 →
          </Link>
        </div>
      ),
      accent: "var(--color-ldp-navy-700)",
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
      <div className="flex items-center gap-2">
        <Clock aria-hidden="true" className="size-4 text-[var(--color-ldp-red)]" />
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          Right now — {rightNow.days_to_primary != null ? `${rightNow.days_to_primary} days to primary` : "between cycles"}
        </div>
      </div>
      <h3 className="mt-0.5 text-base font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
        What those duties look like this week
      </h3>
      <p className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
        Cycle-aware prompts that apply the standing duties to what&apos;s time-sensitive. Pulled
        from live data — precinct captains, endorsed candidates, event calendar, and the 2026
        election timeline.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.id}
            className="rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-3"
            style={{ borderLeftWidth: 3, borderLeftColor: it.accent }}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              <span style={{ color: it.accent }}>{it.icon}</span>
              {it.label}
            </div>
            <div className="mt-1">{it.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
