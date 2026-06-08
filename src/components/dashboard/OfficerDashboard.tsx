"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ListChecks,
  ScrollText,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  ACTIVITY_COLOR,
  ACTIVITY_LABEL,
  activityBucket,
  type ActivityBucket,
  type CommitteeHealth,
} from "@/lib/db/committee-health-shared";
import type { WorkspacePostRow } from "@/lib/db/workspace-shared";
import {
  MEETING_STATUS_COLOR,
  MEETING_STATUS_LABEL,
  type MeetingRecord,
} from "@/lib/db/meeting-records-shared";
import type { RoleKey } from "@/content/highest-leverage-rules";

// Sub-types from existing dashboard fetchers — we accept the raw shapes
// and don't dig into them beyond what the small ribbons need. Avoids
// dragging the server-only db modules onto the client.
export type OfficerDashboardData = {
  todayLabel: string;
  // Role lens active when this dashboard renders (officer variant).
  role: RoleKey;
  // What's-running data
  upcomingMeetings: WorkspacePostRow[];
  committeeNameByCode: Record<string, string>;
  committeeHealth: CommitteeHealth[];
  recentMeetingRecords: MeetingRecord[];
  publishedAwaitingApproval: number;
  // High-level org numbers — pulled from dashboard-health.
  totalActiveMembers: number;
  countywideAttendanceRate: number | null; // 0–100
  totalOpenActionItems: number;
  signatureEventDaysUntil: number | null;
  signatureEventName: string | null;
  daysToGeneral: number | null;
  // Transitions
  transitionsLast90: Array<{
    seat_code: string;
    previous_holder_name: string | null;
    successor_id: string | null;
    successor_name: string | null;
    status: string;
    departed_date: string | null;
  }>;
  // Secondary-lens ("you also wear") summary
  secondaryHat: {
    role: RoleKey;
    label: string;
    href: string;
    blurb: string;
  } | null;
};

function formatMeetingDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatLongDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OfficerDashboard({ data }: { data: OfficerDashboardData }) {
  // Surface the next LDPEC-wide meeting + most recent published record
  // at the top — the chair's two most-recurring questions.
  const nextLdpecMeeting = data.upcomingMeetings[0] ?? null;
  const lastPublishedRecord = data.recentMeetingRecords.find(
    (r) => r.status === "PUBLISHED" || r.status === "APPROVED"
  ) ?? null;

  // Activity rollup across committees.
  const buckets: Record<ActivityBucket, CommitteeHealth[]> = {
    ACTIVE: [],
    QUIET: [],
    DARK: [],
    NEVER: [],
  };
  for (const c of data.committeeHealth) buckets[activityBucket(c)].push(c);

  return (
    <>
      {/* ── Top ribbon: org-wide vitals at a glance ── */}
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <VitalTile
          icon={<Users className="size-4" />}
          label="Roster"
          value={String(data.totalActiveMembers)}
          sub="active members"
          color="var(--color-ldp-navy-800)"
        />
        <VitalTile
          icon={<TrendingUp className="size-4" />}
          label="EC attendance"
          value={
            data.countywideAttendanceRate != null
              ? `${Math.round(data.countywideAttendanceRate)}%`
              : "—"
          }
          sub="last 12 months"
          color={
            data.countywideAttendanceRate != null && data.countywideAttendanceRate >= 75
              ? "#059669"
              : "var(--color-ldp-gold)"
          }
        />
        <VitalTile
          icon={<ListChecks className="size-4" />}
          label="Open action items"
          value={String(data.totalOpenActionItems)}
          sub="across all workspaces"
          color={data.totalOpenActionItems > 20 ? "var(--color-ldp-red)" : "var(--color-ldp-navy-700)"}
        />
        <VitalTile
          icon={<Ticket className="size-4" />}
          label="Next signature event"
          value={
            data.signatureEventDaysUntil != null
              ? `${data.signatureEventDaysUntil}d`
              : "—"
          }
          sub={data.signatureEventName ?? "no event set"}
          color="#db2777"
        />
      </section>

      {/* ── Meeting cadence: the two questions the chair asks first ── */}
      <section
        aria-labelledby="meeting-cadence-h"
        className="mb-6 grid gap-3 md:grid-cols-2"
      >
        <article className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
          <div className="flex items-center gap-2">
            <CalendarDays
              aria-hidden="true"
              className="size-4 text-[var(--color-ldp-navy-800)]"
            />
            <h3
              id="meeting-cadence-h"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]"
            >
              Next LDPEC meeting
            </h3>
          </div>
          {nextLdpecMeeting ? (
            <>
              <div className="mt-2 text-lg font-bold text-[var(--color-ldp-navy-900)]">
                {nextLdpecMeeting.meeting_date
                  ? formatLongDate(nextLdpecMeeting.meeting_date)
                  : "TBD"}
              </div>
              <div className="text-[12px] text-[var(--color-ldp-ink-700)]">
                {nextLdpecMeeting.title ?? "(untitled)"}
                {nextLdpecMeeting.meeting_location
                  ? ` · ${nextLdpecMeeting.meeting_location}`
                  : ""}
              </div>
              <Link
                href={`/committees/${nextLdpecMeeting.committee_code.toLowerCase()}#committee-workspace`}
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
              >
                Open agenda <ArrowRight aria-hidden="true" className="size-3" />
              </Link>
            </>
          ) : (
            <>
              <div className="mt-2 text-[14px] text-[var(--color-ldp-ink-900)]">
                Nothing scheduled.
              </div>
              <div className="text-[11px] text-[var(--color-ldp-ink-700)]">
                As Chair, post an AGENDA in a committee workspace to set the next
                meeting — it shows up here for the whole EC.
              </div>
            </>
          )}
        </article>

        <article className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
          <div className="flex items-center gap-2">
            <ScrollText
              aria-hidden="true"
              className="size-4 text-[var(--color-ldp-navy-800)]"
            />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
              Most recent minutes
            </h3>
          </div>
          {lastPublishedRecord ? (
            <>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
                  style={{
                    backgroundColor:
                      MEETING_STATUS_COLOR[lastPublishedRecord.status],
                  }}
                >
                  {MEETING_STATUS_LABEL[lastPublishedRecord.status]}
                </span>
                <span className="text-[14px] font-semibold text-[var(--color-ldp-navy-900)]">
                  {formatLongDate(lastPublishedRecord.meeting_date)}
                </span>
              </div>
              <div className="text-[11px] text-[var(--color-ldp-ink-700)]">
                {lastPublishedRecord.committee_name ?? "LDPEC (countywide)"}
              </div>
              {data.publishedAwaitingApproval > 0 && (
                <div className="mt-2 rounded-md bg-[var(--color-ldp-gold)]/15 px-2 py-1 text-[11px] text-[var(--color-ldp-navy-900)]">
                  <strong>{data.publishedAwaitingApproval}</strong> published
                  record{data.publishedAwaitingApproval === 1 ? "" : "s"} awaiting
                  ratification at the next meeting.
                </div>
              )}
              <Link
                href="/official-records"
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
              >
                Open Official Records{" "}
                <ArrowRight aria-hidden="true" className="size-3" />
              </Link>
            </>
          ) : (
            <>
              <div className="mt-2 text-[14px] text-[var(--color-ldp-ink-900)]">
                No published records yet.
              </div>
              <Link
                href="/official-records"
                className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
              >
                Publish the first one{" "}
                <ArrowRight aria-hidden="true" className="size-3" />
              </Link>
            </>
          )}
        </article>
      </section>

      {/* ── Committee health grid: who's running and who's gone dark ── */}
      <section className="mb-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
              Committee health
            </h3>
            <p className="text-[11px] text-[var(--color-ldp-ink-700)]">
              Active = workspace activity in the last 30 days. Dark = nothing in
              90+.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <Tally label="Active" count={buckets.ACTIVE.length} color={ACTIVITY_COLOR.ACTIVE} />
            <Tally label="Quiet" count={buckets.QUIET.length} color={ACTIVITY_COLOR.QUIET} />
            <Tally label="Dark" count={buckets.DARK.length} color={ACTIVITY_COLOR.DARK} />
            {buckets.NEVER.length > 0 && (
              <Tally label="Never met" count={buckets.NEVER.length} color={ACTIVITY_COLOR.NEVER} />
            )}
          </div>
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {data.committeeHealth.map((c) => (
            <CommitteeRow key={c.code} c={c} />
          ))}
        </ul>
      </section>

      {/* ── Transitions in flight ── */}
      <section
        aria-labelledby="transitions-h"
        className="mb-6 rounded-xl border border-[var(--color-ldp-line)] bg-white p-4"
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ArrowLeftRight
              aria-hidden="true"
              className="size-4 text-[var(--color-ldp-navy-800)]"
            />
            <h3
              id="transitions-h"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]"
            >
              Transitions · last 90 days
            </h3>
          </div>
          <Link
            href="/transitions"
            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)] hover:underline"
          >
            Full tracker →
          </Link>
        </div>
        {data.transitionsLast90.length === 0 ? (
          <p className="text-[12px] text-[var(--color-ldp-ink-700)]">
            No seats turned over in the last 90 days.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {data.transitionsLast90.slice(0, 6).map((t) => (
              <li
                key={t.seat_code + (t.departed_date ?? "")}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-1.5 text-[12px]"
              >
                <div>
                  <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                    {t.seat_code}
                  </span>
                  <span className="ml-2 text-[var(--color-ldp-ink-700)]">
                    {t.previous_holder_name ?? "—"}
                    {" → "}
                    {t.successor_name ?? (
                      <span className="text-[var(--color-ldp-red)]">
                        Vacant
                      </span>
                    )}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                    t.status === "VACANT"
                      ? "bg-[var(--color-ldp-red)]/15 text-[var(--color-ldp-red)]"
                      : "bg-[#059669]/15 text-[#059669]"
                  }`}
                >
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Secondary lens: "you also wear" ── */}
      {data.secondaryHat && <SecondaryHat hat={data.secondaryHat} />}
    </>
  );
}

function VitalTile({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg border bg-white p-3"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div
        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-[var(--color-ldp-navy-900)]">
        {value}
      </div>
      <div className="mt-0.5 truncate text-[11px] text-[var(--color-ldp-ink-700)]">
        {sub}
      </div>
    </div>
  );
}

function Tally({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold uppercase tracking-widest text-white"
      style={{ backgroundColor: color }}
    >
      {label} <span className="opacity-90">{count}</span>
    </span>
  );
}

function CommitteeRow({ c }: { c: CommitteeHealth }) {
  const bucket = activityBucket(c);
  const color = ACTIVITY_COLOR[bucket];
  return (
    <li
      className="overflow-hidden rounded-lg border bg-white"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <Link
        href={`/committees/${c.code.toLowerCase()}`}
        className="block p-3 hover:bg-[#FAFBFC]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                {c.name}
              </span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: color }}
              >
                {ACTIVITY_LABEL[bucket]}
              </span>
              {c.has_unpublished_minutes && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-gold)]/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
                  <ClipboardCheck aria-hidden="true" className="size-2.5" />
                  Minutes ready
                </span>
              )}
            </div>
            <div className="mt-0.5 truncate text-[11px] text-[var(--color-ldp-ink-700)]">
              Chair: {c.chair_name ?? "—"}
              {c.last_met_on ? ` · Last met ${formatMeetingDate(c.last_met_on)}` : ""}
              {c.next_meeting_on
                ? ` · Next ${formatMeetingDate(c.next_meeting_on)}`
                : ""}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-[11px]">
            {c.open_action_items > 0 && (
              <span className="inline-flex items-center gap-1 text-[var(--color-ldp-ink-700)]">
                <ListChecks aria-hidden="true" className="size-3" />
                {c.open_action_items} open
              </span>
            )}
            {c.pending_action_items > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-red)]/10 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-ldp-red)]">
                <AlertCircle aria-hidden="true" className="size-2.5" />
                {c.pending_action_items} unaccepted
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

function SecondaryHat({
  hat,
}: {
  hat: NonNullable<OfficerDashboardData["secondaryHat"]>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="mb-6 overflow-hidden rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left"
      >
        <div className="text-[11px]">
          <span className="font-semibold text-[var(--color-ldp-ink-700)]">
            You also wear:
          </span>{" "}
          <span className="text-[var(--color-ldp-navy-900)]">{hat.label}</span>
        </div>
        {open ? (
          <ChevronUp aria-hidden="true" className="size-4 text-[var(--color-ldp-ink-700)]" />
        ) : (
          <ChevronDown aria-hidden="true" className="size-4 text-[var(--color-ldp-ink-700)]" />
        )}
      </button>
      {open && (
        <div className="border-t border-[var(--color-ldp-line)] bg-white px-4 py-3 text-[12px]">
          <p className="text-[var(--color-ldp-ink-900)]">{hat.blurb}</p>
          <Link
            href={hat.href}
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
          >
            Open that workspace
            <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
          <div className="mt-2 text-[11px] text-[var(--color-ldp-ink-700)]">
            Tip: switch your active lens in the header strip to swap the entire
            dashboard into that role.
          </div>
        </div>
      )}
    </section>
  );
}

