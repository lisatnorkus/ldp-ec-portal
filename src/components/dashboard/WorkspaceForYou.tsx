"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, ScrollText, Sparkles } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { WorkspacePostRow } from "@/lib/db/workspace-shared";
import {
  OFFICER_ROLE_LABEL,
  type OfficerRole,
} from "@/lib/db/members-types";

// Server-built audience snapshot — same shape as the YIR page uses. Lets
// us decide whether to surface the officer briefing card without a
// second roundtrip from the client.
export type DashboardAudience = {
  current_officers: Record<string, OfficerRole>;
  incoming_leaders: Record<string, OfficerRole>;
};

export type WorkspaceForYouProps = {
  upcomingMeetings: WorkspacePostRow[];
  committeeNameByCode: Record<string, string>;
  // display_name → committee codes (both chair + member). Used to filter
  // upcoming meetings down to the ones the signed-in user cares about.
  // Falls back to "all upcoming" when the user's name isn't on file.
  committeesByDisplayName: Record<string, string[]>;
  audience: DashboardAudience;
};

function formatMeetingDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function WorkspaceForYou({
  upcomingMeetings,
  committeeNameByCode,
  committeesByDisplayName,
  audience,
}: WorkspaceForYouProps) {
  const { profile, hydrated } = useUserProfile();
  if (!hydrated) {
    return <div className="mb-8 h-32 animate-pulse rounded-xl bg-white/60" />;
  }

  const name = profile.display_name?.trim() ?? "";
  const myCommittees = name ? committeesByDisplayName[name] : undefined;
  const officerRole = name ? audience.current_officers[name] : undefined;
  const incomingRole = name ? audience.incoming_leaders[name] : undefined;
  const eligibleRole = officerRole ?? incomingRole;
  const isIncoming = !officerRole && !!incomingRole;

  // If the user has committee memberships, filter the strip to those.
  // Otherwise show all forward meetings.
  const meetings = (() => {
    if (!myCommittees || myCommittees.length === 0) return upcomingMeetings;
    const codeSet = new Set(myCommittees);
    const matched = upcomingMeetings.filter((m) => codeSet.has(m.committee_code));
    // If a user IS on committees but none of them have upcoming meetings,
    // fall back to the global top-3 so the strip isn't an empty hole.
    if (matched.length === 0) return upcomingMeetings;
    return matched;
  })();

  const topThree = meetings.slice(0, 3);
  const nothingScheduled = topThree.length === 0;

  return (
    <div className="mb-8 space-y-4">
      {eligibleRole && (
        <OfficerBriefingCard role={eligibleRole} isIncoming={isIncoming} />
      )}

      <section
        aria-labelledby="upcoming-for-you-h"
        className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2
            id="upcoming-for-you-h"
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]"
          >
            <CalendarDays aria-hidden="true" className="size-4" />
            Upcoming for you
          </h2>
          <Link
            href="/committees"
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)] hover:underline"
          >
            All committees <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </div>

        {nothingScheduled ? (
          <p className="text-sm text-[var(--color-ldp-ink-700)]">
            No meetings on the calendar yet. As a chair, post an AGENDA in your
            committee workspace — it shows up here for everyone on the committee.
          </p>
        ) : (
          <ul className="space-y-2">
            {topThree.map((m) => {
              const committeeName =
                committeeNameByCode[m.committee_code] ?? m.committee_code;
              return (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/committees/${m.committee_code.toLowerCase()}#committee-workspace`}
                      className="block"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                        {committeeName}
                        {m.meeting_location ? ` · ${m.meeting_location}` : ""}
                      </div>
                      <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)] hover:underline">
                        {m.title ?? "(untitled meeting)"}
                      </div>
                    </Link>
                  </div>
                  <div className="shrink-0 text-[12px] font-semibold text-[var(--color-ldp-navy-900)]">
                    {m.meeting_date ? formatMeetingDate(m.meeting_date) : ""}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!name && (
          <p className="mt-3 text-[11px] text-[var(--color-ldp-ink-700)]">
            Tip: set your name on the dashboard to filter this list to your
            committees only.
          </p>
        )}
      </section>
    </div>
  );
}

function OfficerBriefingCard({
  role,
  isIncoming,
}: {
  role: OfficerRole;
  isIncoming: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-navy-800) 0%, var(--color-ldp-gold) 100%)",
        }}
      />
      <div className="p-4">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-white">
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
              {isIncoming ? "Incoming briefing" : "Officer briefing"}
            </div>
            <h3 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
              Your {OFFICER_ROLE_LABEL[role]} read-in is ready.
            </h3>
            <p className="mt-1 text-[13px] text-[var(--color-ldp-ink-900)]">
              Auto-generated from live workspace activity — the year on the
              record, what&apos;s on deck, who&apos;s in the room, and exactly
              which levers your role unlocks.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/leadership-transition"
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
            >
              Open the briefing
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
            <Link
              href="/official-records"
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:border-[var(--color-ldp-navy-700)]"
            >
              <ScrollText aria-hidden="true" className="size-3.5" />
              Records
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
