import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ClipboardList,
  Clock,
  Handshake,
  Home,
  Map as MapIcon,
  Megaphone,
  ScrollText,
  Ticket,
  Users,
  Vote,
  Folder,
  ArrowLeftRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import { fetchAllMembers } from "@/lib/db/members";
import { CycleTimeline } from "@/components/cycle/CycleTimeline";
import { VoterGuideCallout } from "@/components/dashboard/VoterGuideCallout";
import { WorkingSetHeader } from "@/components/dashboard/WorkingSetHeader";
import { MyAreaWidget } from "@/components/dashboard/MyAreaWidget";
import { YourWeekPanel } from "@/components/dashboard/YourWeekPanel";
import { fetchAssignedTasks } from "@/lib/db/my-tasks";
import { HubShell } from "@/components/hub/HubShell";
import { fetchRightNowContext } from "@/lib/db/right-now";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

type Transition = {
  seat_code: string;
  status: "VACANT" | "FILLED";
  departed_date: string | null;
};

async function fetchDashboardData() {
  const supabase = await getSupabaseServer();
  const today = new Date().toISOString().slice(0, 10);
  const [transitions, monthCard, candidates, committees, nextEvent, voterSettings] =
    await Promise.all([
      supabase.from("transitions").select("seat_code, status, departed_date"),
      supabase
        .from("month_cards")
        .select("month, content_md, theme_tag")
        .eq("year", new Date().getFullYear())
        .eq("month", new Date().getMonth() + 1)
        .eq("published", true)
        .maybeSingle(),
      supabase
        .from("candidates")
        .select("id, is_endorsed")
        .eq("cycle_year", 2026),
      supabase.from("committees").select("code").eq("active", true),
      supabase
        .from("events")
        .select("id, name, event_date, event_window_description, date_is_approximate")
        .eq("active", true)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("settings")
        .select("key, value")
        .in("key", ["voter_guide_url", "general_voter_guide_url", "post_primary_callout_mode"]),
    ]);
  const settingsMap = new Map<string, string>(
    ((voterSettings.data ?? []) as Array<{ key: string; value: string }>).map((s) => [s.key, s.value])
  );
  return {
    transitions: (transitions.data ?? []) as Transition[],
    monthCard: monthCard.data as { month: number; content_md: string; theme_tag: string | null } | null,
    candidates: (candidates.data ?? []) as Array<{ id: string; is_endorsed: boolean }>,
    committeeCount: (committees.data ?? []).length,
    nextEvent: nextEvent.data as {
      id: string;
      name: string;
      event_date: string;
      event_window_description: string | null;
      date_is_approximate: boolean;
    } | null,
    voterGuidePrimaryUrl: settingsMap.get("voter_guide_url") || null,
    voterGuideGeneralUrl: settingsMap.get("general_voter_guide_url") || null,
    voterGuideMode: settingsMap.get("post_primary_callout_mode") || "AUTO",
  };
}

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function DashboardPage() {
  const [data, members, rightNow, assignedTasks] = await Promise.all([
    fetchDashboardData(),
    fetchAllMembers(),
    fetchRightNowContext().catch((err) => {
      console.error("fetchRightNowContext failed", err);
      return undefined;
    }),
    fetchAssignedTasks().catch((err) => {
      console.error("fetchAssignedTasks failed", err);
      return [];
    }),
  ]);
  const {
    transitions,
    monthCard,
    candidates,
    committeeCount,
    nextEvent,
    voterGuidePrimaryUrl,
    voterGuideGeneralUrl,
    voterGuideMode,
  } = data;

  const todayIso = new Date().toISOString().slice(0, 10);
  const vacancies = transitions.filter(
    (t) =>
      t.status === "VACANT" &&
      (t.departed_date == null || t.departed_date <= todayIso)
  );
  const announcedTransitions = transitions.filter(
    (t) =>
      t.status === "VACANT" &&
      t.departed_date != null &&
      t.departed_date > todayIso
  );
  const endorsedCount = candidates.filter((c) => c.is_endorsed).length;
  const currentMonth = new Date().getMonth() + 1;
  const eventDaysUntil = nextEvent?.event_date
    ? Math.max(
        0,
        Math.round(
          (new Date(nextEvent.event_date + "T00:00:00").getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const daysToPrimary = rightNow?.days_to_primary ?? null;

  return (
    <HubShell
      eyebrow="Dashboard"
      title="Dashboard."
      subtitle={todayLabel}
      actions={
        <>
          <Link
            href="/tour/1"
            className="rounded text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ldp-navy-900)]"
          >
            Revisit the tour
          </Link>
          <Button asChild variant="ldp" size="sm" className="border border-white/20 bg-white/10 hover:bg-white/20">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </>
      }
    >
      <VoterGuideCallout
        primaryUrl={voterGuidePrimaryUrl}
        generalUrl={voterGuideGeneralUrl}
        mode={voterGuideMode}
      />

      <WorkingSetHeader />

      <YourWeekPanel allAssignedTasks={assignedTasks} />

      {/* Widget grid — everything compact, every tile a door into its section. */}
      <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Widget
          href="/this-month"
          accent="#F59E0B"
          eyebrow={`This month · ${MONTH_NAMES[currentMonth]}`}
          title={monthCard?.theme_tag ? titleCase(monthCard.theme_tag.replace(/_/g, " ")) : "Live playbook"}
          icon={Calendar}
        >
          <p className="line-clamp-3 text-sm text-[var(--color-ldp-ink-900)]">
            {monthCard?.content_md ?? "No card this month yet."}
          </p>
        </Widget>

        {nextEvent && eventDaysUntil != null ? (
          <Widget
            href="/events"
            accent="#059669"
            eyebrow="Next signature event"
            title={nextEvent.name}
            icon={Ticket}
            urgent={eventDaysUntil <= 30}
          >
            {nextEvent.event_window_description && (
              <div className="mb-1 text-[11px] font-medium text-[var(--color-ldp-navy-700)]">
                {nextEvent.event_window_description}
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[var(--color-ldp-navy-900)]">
                {nextEvent.date_is_approximate ? "~" : ""}
                {eventDaysUntil}
              </span>
              <span className="text-xs text-[var(--color-ldp-ink-700)]">
                day{eventDaysUntil === 1 ? "" : "s"} out
                {nextEvent.date_is_approximate && " (approx)"}
              </span>
            </div>
            {eventDaysUntil <= 30 && (
              <p className="mt-1 text-xs font-semibold text-[var(--color-ldp-red)]">
                Ticket links live — push yours.
              </p>
            )}
          </Widget>
        ) : (
          <Widget
            href="/events"
            accent="#059669"
            eyebrow="Signature events"
            title="Three events fund the party"
            icon={Ticket}
          >
            <p className="text-xs text-[var(--color-ldp-ink-700)]">
              No event on the immediate calendar.
            </p>
          </Widget>
        )}

        <Widget
          href="/candidates"
          accent="#C8102E"
          eyebrow="2026 Primary Ballot"
          title={`${candidates.length} candidates · ${endorsedCount} endorsed`}
          icon={ClipboardList}
          urgent={daysToPrimary != null && daysToPrimary <= 45}
        >
          {daysToPrimary != null && daysToPrimary > 0 ? (
            <div className="text-xs text-[var(--color-ldp-ink-700)]">
              Primary is <strong className="text-[var(--color-ldp-navy-900)]">{daysToPrimary} days</strong> out.
              Tuesday, May 19.
            </div>
          ) : (
            <div className="text-xs text-[var(--color-ldp-ink-700)]">
              Full 2026 ballot, LDP-endorsed first.
            </div>
          )}
        </Widget>

        <MyAreaWidget />

        <Widget
          href="/plan-map"
          accent="#C8102E"
          eyebrow="Plan & Map"
          title="Countywide strategy"
          icon={MapIcon}
        >
          <p className="text-xs text-[var(--color-ldp-ink-700)]">
            Jefferson County precincts scored into four strategies. Jump to the interactive map.
          </p>
        </Widget>

        <Widget
          href="/canvass-tools"
          accent="#C8102E"
          eyebrow="Canvass Tools"
          title="MC 17 · 21 · 7"
          icon={Vote}
        >
          <p className="text-xs text-[var(--color-ldp-ink-700)]">
            Priority Metro Council districts, volunteer pipeline, VoteBuilder, and canvass guides.
          </p>
        </Widget>

        <Widget
          href="/tour/2"
          accent="#0E4C9E"
          eyebrow="Standing duties"
          title="What your seat always asks"
          icon={ScrollText}
        >
          <p className="text-xs text-[var(--color-ldp-ink-700)]">
            The 7 standing duties every EC seat carries — every one cited to bylaws. Role one-pagers
            inside.
          </p>
        </Widget>

        <Widget
          href="/comms"
          accent="#0891b2"
          eyebrow="Amplify"
          title="Follow · Share · Repost"
          icon={Megaphone}
        >
          <p className="text-xs text-[var(--color-ldp-ink-700)]">
            One reshare = free reach. Seven official LDP handles — follow, share, repost.
          </p>
        </Widget>

        <Widget
          href="/people"
          accent="#7c3aed"
          eyebrow="Directory"
          title={`${members.length} members · ${committeeCount} committees`}
          icon={Users}
        >
          <p className="text-xs text-[var(--color-ldp-ink-700)]">
            Search by name, LD, or committee. Attendance tracked since the June 2025 reorg.
          </p>
        </Widget>

        <Widget
          href="/transitions"
          accent={announcedTransitions.length > 0 ? "#F59E0B" : "#64748b"}
          eyebrow="Transitions"
          title={
            announcedTransitions.length > 0
              ? `${announcedTransitions.length} announced · ${vacancies.length} vacant`
              : `${vacancies.length} vacant`
          }
          icon={ArrowLeftRight}
          urgent={announcedTransitions.length > 0 || vacancies.length >= 3}
        >
          <p className="text-xs text-[var(--color-ldp-ink-700)]">
            {announcedTransitions.length > 0
              ? "Chair transition announced — see schedule on Transitions."
              : "Seats changed hands since the June 2025 reorg. CEC has 90 days to fill."}
          </p>
        </Widget>

        <Widget
          href="/partners"
          accent="#7c3aed"
          eyebrow="Partners"
          title="Labor · Advocacy · Clubs"
          icon={Handshake}
        >
          <p className="text-xs text-[var(--color-ldp-ink-700)]">
            Organizations that endorse, fund, or organize with the Louisville Democratic Party.
          </p>
        </Widget>

        <Widget
          href="/drive"
          accent="#b45309"
          eyebrow="Drive"
          title="Committee folders & forms"
          icon={Folder}
        >
          <p className="text-xs text-[var(--color-ldp-ink-700)]">
            Every committee&apos;s working folder plus the party&apos;s top-traffic forms.
          </p>
        </Widget>
      </section>

      {/* Cycle reference — full-arc context at the bottom. */}
      <section className="mb-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Where we are in the cycle
          </h2>
          <Clock aria-hidden="true" className="size-4 text-[var(--color-ldp-ink-700)]" />
        </div>
        <CycleTimeline />
      </section>
    </HubShell>
  );
}

function titleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function Widget({
  href,
  accent,
  eyebrow,
  title,
  icon: Icon,
  children,
  urgent = false,
}: {
  href: string;
  accent: string;
  eyebrow: string;
  title: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  children: React.ReactNode;
  urgent?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        borderColor: urgent ? accent : "var(--color-ldp-line)",
        borderWidth: urgent ? 2 : 1,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-center gap-2">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-white"
          style={{ backgroundColor: accent }}
        >
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <div
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {eyebrow}
        </div>
      </div>
      <h3 className="mt-2 text-base font-bold leading-tight text-[var(--color-ldp-navy-900)]">
        {title}
      </h3>
      <div className="mt-2 flex-1">{children}</div>
      <div
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: accent }}
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
