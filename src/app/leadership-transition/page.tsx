import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ListChecks,
  Pin,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import {
  YirWelcomeStrip,
  type YirAudience,
} from "@/components/workspace/YirWelcomeStrip";
import { fetchAllMembers, displayName } from "@/lib/db/members";
import {
  MEETING_STATUS_COLOR,
  MEETING_STATUS_LABEL,
  fetchMeetingRecordsSince,
  type MeetingRecord,
} from "@/lib/db/meeting-records";
import { fetchUpcomingMeetings } from "@/lib/db/workspace";
import {
  OFFICER_ORDER,
  OFFICER_ROLE_LABEL,
  type OfficerRole,
  attendancePct,
  attendanceLabel,
} from "@/lib/db/members-types";
import { aggregateMinutes, parseMinutes } from "@/lib/content/minutes-parser";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leadership Transition" };

function formatMeetingDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function LeadershipTransitionPage() {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const [members, records, upcoming] = await Promise.all([
    fetchAllMembers(),
    fetchMeetingRecordsSince(oneYearAgo),
    fetchUpcomingMeetings(),
  ]);

  // Audience snapshot (same logic as the dashboard briefing card).
  const audience: YirAudience = {
    current_officers: {},
    incoming_leaders: {},
  };
  for (const m of members) {
    if (m.primary_role !== "OFFICER" || !m.officer_role) continue;
    const termStart = m.term_start ? new Date(m.term_start) : null;
    const isIncoming =
      termStart != null &&
      termStart.getTime() > today.getTime() &&
      (m.officer_role === "CHAIR" || m.officer_role === "VICE_CHAIR");
    const termEnd = m.term_end ? new Date(m.term_end) : null;
    const isCurrent =
      !isIncoming &&
      (termStart == null || termStart.getTime() <= today.getTime()) &&
      (termEnd == null || termEnd.getTime() >= today.getTime());
    const name = displayName(m);
    if (isIncoming) audience.incoming_leaders[name] = m.officer_role;
    else if (isCurrent) audience.current_officers[name] = m.officer_role;
  }

  const ldpecRecords = records.filter((r) => r.meeting_type === "LDPEC");
  const committeeRecords = records.filter((r) => r.meeting_type === "COMMITTEE");

  // Parse every minutes post we have. The seeded LDPEC minutes are
  // intentionally null (no FK target), so this only fires meaningfully
  // for committee records right now — which is the truth-in-data
  // surface Lisa asked for.
  const parsedByRecord = new Map<string, ReturnType<typeof parseMinutes>>();
  for (const r of records) {
    parsedByRecord.set(r.id, parseMinutes(r.minutes?.content_md ?? null));
  }
  const allParsed = Array.from(parsedByRecord.values());
  const rollup = aggregateMinutes(allParsed);
  const recordsWithContent = records.filter(
    (r) => (parsedByRecord.get(r.id)?.decisions.length ?? 0) > 0 ||
           (parsedByRecord.get(r.id)?.action_items.length ?? 0) > 0
  );

  // Attendance leaderboard — sort active members by attendance %,
  // tie-break on raw present count. Show top 6 + bottom 3 (the
  // chair-relevant view is "who's reliable" + "who needs a nudge").
  const attendanceRows = members
    .filter((m) => m.active && m.attendance_eligible && m.attendance_eligible > 0)
    .map((m) => ({
      id: m.id,
      name: displayName(m),
      role: m.primary_role,
      pct: attendancePct(m) ?? 0,
      label: attendanceLabel(m),
    }))
    .sort((a, b) => b.pct - a.pct);

  const officerRoster: Array<{ name: string; role: OfficerRole; email: string | null }> = [];
  for (const role of OFFICER_ORDER) {
    const holder = members.find(
      (m) => m.primary_role === "OFFICER" && m.officer_role === role && m.active
    );
    if (holder) {
      officerRoster.push({
        name: displayName(holder),
        role,
        email: holder.email ?? null,
      });
    }
  }
  const incomingList = Object.entries(audience.incoming_leaders).map(
    ([name, role]) => ({ name, role })
  );

  return (
    <HubShell
      eyebrow="Year in Review · Leadership Transition"
      title="The briefing."
      subtitle="Pulled from live workspace activity — every decision, every action item, every meeting on the record. Built for incoming Chair + Vice Chair + current Officers."
      maxWidthClass="max-w-4xl"
    >
      <YirWelcomeStrip audience={audience} />

      {/* Year-in-review rollup — the actual content, not just counts */}
      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile
          icon={<ScrollText className="size-4" />}
          label="Meetings"
          value={String(records.length)}
          sub="LDPEC + committees · 12mo"
          color="var(--color-ldp-navy-800)"
        />
        <Tile
          icon={<CheckCircle2 className="size-4" />}
          label="Decisions"
          value={String(rollup.total_decisions)}
          sub="recorded in minutes"
          color="#059669"
        />
        <Tile
          icon={<ListChecks className="size-4" />}
          label="Action items"
          value={String(rollup.total_action_items)}
          sub="captured across meetings"
          color="var(--color-ldp-gold)"
        />
        <Tile
          icon={<CalendarDays className="size-4" />}
          label="On deck"
          value={String(upcoming.length)}
          sub="forward AGENDA posts"
          color="var(--color-ldp-red)"
        />
      </section>

      {/* The year on the record — actual content from minutes */}
      <Section
        icon={<ScrollText />}
        title="The year, on the record"
        body="Every meeting record from the last 12 months. Records with linked NOTES posts show the decisions made and action items taken — pulled straight from the minutes."
      >
        {recordsWithContent.length === 0 ? (
          <EmptyHint>
            No minutes posts have been linked to meeting records yet. As
            Secretary, write minutes as a NOTES post in the committee
            workspace, then click Publish on /official-records to attach
            them — they&apos;ll appear here parsed.
          </EmptyHint>
        ) : (
          <ul className="space-y-3">
            {recordsWithContent.slice(0, 12).map((r) => {
              const parsed = parsedByRecord.get(r.id);
              return (
                <RecordCard
                  key={r.id}
                  record={r}
                  decisions={parsed?.decisions ?? []}
                  action_items={parsed?.action_items ?? []}
                />
              );
            })}
            {recordsWithContent.length > 12 && (
              <li className="text-[11px] italic text-[var(--color-ldp-ink-700)]">
                +{recordsWithContent.length - 12} more on{" "}
                <Link href="/official-records" className="underline">
                  Official Records
                </Link>
                .
              </li>
            )}
          </ul>
        )}
      </Section>

      {/* Records without content - records that exist but have no linked minutes */}
      {(ldpecRecords.length > 0 || committeeRecords.length > 0) &&
        recordsWithContent.length < records.length && (
          <Section
            icon={<Pin />}
            title="On the calendar but no minutes attached"
            body="These records exist on the official list but haven't had their NOTES post linked yet. As Secretary, attach the minutes via /official-records → Publish."
          >
            <ul className="space-y-1.5">
              {records
                .filter(
                  (r) =>
                    (parsedByRecord.get(r.id)?.decisions.length ?? 0) === 0 &&
                    (parsedByRecord.get(r.id)?.action_items.length ?? 0) === 0
                )
                .slice(0, 10)
                .map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-1.5 text-[12px]"
                  >
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white"
                      style={{ backgroundColor: MEETING_STATUS_COLOR[r.status] }}
                    >
                      {MEETING_STATUS_LABEL[r.status]}
                    </span>
                    <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                      {formatMeetingDate(r.meeting_date)}
                    </span>
                    <span className="text-[var(--color-ldp-ink-700)]">
                      {r.meeting_type === "LDPEC"
                        ? "LDPEC"
                        : r.committee_name ?? r.committee_code}
                    </span>
                  </li>
                ))}
            </ul>
          </Section>
        )}

      {/* Attendance leaderboard — who actually shows up */}
      {attendanceRows.length > 0 && (
        <Section
          icon={<TrendingUp />}
          title="Attendance"
          body="Who's at every meeting and who's drifted. From the live EC attendance log on the ec_members table."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AttendanceColumn title="Reliable attendees" rows={attendanceRows.slice(0, 6)} />
            {attendanceRows.length > 6 && (
              <AttendanceColumn
                title="Could use a nudge"
                rows={attendanceRows.slice(-3).reverse()}
              />
            )}
          </div>
        </Section>
      )}

      {/* Upcoming meetings */}
      <Section
        icon={<CalendarDays />}
        title="What's on deck"
        body="Forward-looking AGENDA posts. The Chair and VC are expected to walk in knowing the cadence."
      >
        {upcoming.length === 0 ? (
          <EmptyHint>
            No upcoming meetings scheduled yet. As Chair, the Meeting Setter on each
            committee workspace lets you stand one up in seconds.
          </EmptyHint>
        ) : (
          <ul className="space-y-2">
            {upcoming.slice(0, 10).map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                    {m.committee_code}
                    {m.meeting_location ? ` · ${m.meeting_location}` : ""}
                  </div>
                  <div className="text-[var(--color-ldp-navy-900)]">
                    {m.title ?? "(untitled meeting)"}
                  </div>
                </div>
                <div className="text-[12px] font-semibold text-[var(--color-ldp-navy-900)]">
                  {m.meeting_date ? formatMeetingDate(m.meeting_date) : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Officers + incoming */}
      <Section
        icon={<Users />}
        title="Who's in the room"
        body="The four officers carry countywide responsibility; incoming Chair/VC inherit during the handoff window and have early access to this page."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <RosterColumn title="Current officers" entries={officerRoster} />
          <div>
            <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Incoming leadership
            </h4>
            {incomingList.length === 0 ? (
              <EmptyHint>
                No incoming Chair or Vice Chair on file. After the next election,
                set <code className="rounded bg-[#FAFBFC] px-1 text-[11px]">term_start</code>{" "}
                in the future on the new officer&apos;s ec_members row.
              </EmptyHint>
            ) : (
              <ul className="space-y-1.5">
                {incomingList.map((i) => (
                  <li
                    key={i.name}
                    className="rounded-md border border-[var(--color-ldp-gold)]/40 bg-[var(--color-ldp-gold)]/10 px-3 py-2 text-sm"
                  >
                    <div className="font-semibold text-[var(--color-ldp-navy-900)]">
                      {i.name}
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                      Incoming · {OFFICER_ROLE_LABEL[i.role]}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      {/* Permission map — kept from previous version */}
      <Section
        icon={<ShieldCheck />}
        title="The permission map"
        body="What each role can do. Mirrored from docs/committee-workspaces-v1.md §4 — the single source of truth that drives both the UI gates and (post-OAuth) RLS."
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b-2 border-[var(--color-ldp-navy-900)] text-left text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Post</th>
                <th className="py-2 pr-3">Assign</th>
                <th className="py-2 pr-3">Respond</th>
                <th className="py-2 pr-3">Minutes</th>
                <th className="py-2 pr-3">Treasurer</th>
                <th className="py-2 pr-3">YIR</th>
              </tr>
            </thead>
            <tbody>
              <PermRow role="Committee Member" cells={[1, 0, 1, 0, 0, 0]} />
              <PermRow role="Committee Chair" cells={[1, 1, 1, 0, 0, 0]} />
              <PermRow role="Secretary" cells={[1, 1, 1, 1, 0, 0]} />
              <PermRow role="Treasurer" cells={[1, 1, 1, 0, 1, 0]} />
              <PermRow role="Officers (Chair, VC)" cells={[1, 1, 1, 1, 1, 1]} highlight />
              <PermRow role="Incoming Chair / VC" cells={[1, 1, 1, 1, 1, 1]} highlight />
            </tbody>
          </table>
        </div>
      </Section>
    </HubShell>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────

function Tile({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
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
      {sub && (
        <div className="mt-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">{sub}</div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  body?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-start gap-2">
        <span className="mt-0.5 text-[var(--color-ldp-navy-800)]">{icon}</span>
        <div>
          <h3 className="text-lg font-bold text-[var(--color-ldp-navy-900)]">{title}</h3>
          {body && (
            <p className="mt-0.5 text-[13px] text-[var(--color-ldp-ink-700)]">{body}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function RecordCard({
  record,
  decisions,
  action_items,
}: {
  record: MeetingRecord;
  decisions: string[];
  action_items: string[];
}) {
  const statusColor = MEETING_STATUS_COLOR[record.status];
  return (
    <li
      className="overflow-hidden rounded-lg border bg-white shadow-sm"
      style={{ borderLeft: `4px solid ${statusColor}` }}
    >
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
            style={{ backgroundColor: statusColor }}
          >
            {MEETING_STATUS_LABEL[record.status]}
          </span>
          <span className="font-semibold text-[var(--color-ldp-navy-900)]">
            {formatMeetingDate(record.meeting_date)}
          </span>
          <span className="text-[var(--color-ldp-ink-700)]">
            {record.meeting_type === "LDPEC"
              ? "LDPEC"
              : record.committee_name ?? record.committee_code}
          </span>
          {record.committee_code && (
            <Link
              href={`/committees/${record.committee_code.toLowerCase()}#committee-workspace`}
              className="ml-auto text-[11px] font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
            >
              Open workspace →
            </Link>
          )}
        </div>

        {decisions.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#059669]">
              <CheckCircle2 aria-hidden="true" className="size-3" />
              Decisions · {decisions.length}
            </div>
            <ul className="mt-1 space-y-0.5 text-[13px] text-[var(--color-ldp-ink-900)]">
              {decisions.map((d, i) => (
                <li key={i} className="flex gap-2">
                  <span className="select-none text-[#059669]">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {action_items.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-gold)]">
              <ListChecks aria-hidden="true" className="size-3" />
              Action items · {action_items.length}
            </div>
            <ul className="mt-1 space-y-0.5 text-[13px] text-[var(--color-ldp-ink-900)]">
              {action_items.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="select-none text-[var(--color-ldp-gold)]">→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}

function AttendanceColumn({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ id: string; name: string; pct: number; label: string }>;
}) {
  return (
    <div>
      <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {rows.map((r) => {
          const goodPct = r.pct >= 75;
          return (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm"
            >
              <span className="truncate font-semibold text-[var(--color-ldp-navy-900)]">
                {r.name}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-[11px] text-[var(--color-ldp-ink-700)]">
                  {r.label}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold text-white"
                  style={{ backgroundColor: goodPct ? "#059669" : "var(--color-ldp-red)" }}
                >
                  {r.pct}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function RosterColumn({
  title,
  entries,
}: {
  title: string;
  entries: Array<{ name: string; role: OfficerRole; email: string | null }>;
}) {
  return (
    <div>
      <h4 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {title}
      </h4>
      {entries.length === 0 ? (
        <EmptyHint>No officers found.</EmptyHint>
      ) : (
        <ul className="space-y-1.5">
          {entries.map((e) => (
            <li
              key={e.name}
              className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm"
            >
              <div className="font-semibold text-[var(--color-ldp-navy-900)]">
                {e.name}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                {OFFICER_ROLE_LABEL[e.role]}
              </div>
              {e.email && (
                <a
                  href={`mailto:${e.email}`}
                  className="text-[12px] text-[var(--color-ldp-navy-700)] hover:underline"
                >
                  {e.email}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PermRow({
  role,
  cells,
  highlight,
}: {
  role: string;
  cells: Array<0 | 1>;
  highlight?: boolean;
}) {
  return (
    <tr
      className={`border-b border-[var(--color-ldp-line)] ${
        highlight ? "bg-[var(--color-ldp-gold)]/10" : ""
      }`}
    >
      <td className="py-2 pr-3 font-semibold text-[var(--color-ldp-navy-900)]">
        {role}
      </td>
      {cells.map((c, i) => (
        <td key={i} className="py-2 pr-3">
          {c === 1 ? (
            <CheckCircle2 aria-hidden="true" className="size-4 text-[#059669]" />
          ) : (
            <span className="text-[var(--color-ldp-ink-700)]">—</span>
          )}
        </td>
      ))}
    </tr>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-[12px] text-[var(--color-ldp-ink-700)]">
      <Pin aria-hidden="true" className="mt-0.5 size-3 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
