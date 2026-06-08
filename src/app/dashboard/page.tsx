import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CycleTimeline } from "@/components/cycle/CycleTimeline";
import { VoterGuideCallout } from "@/components/dashboard/VoterGuideCallout";
import { WorkingSetHeader } from "@/components/dashboard/WorkingSetHeader";
import { RoleBanner } from "@/components/dashboard/RoleBanner";
import { YourWeekPanel } from "@/components/dashboard/YourWeekPanel";
import { FirstTimeNudge } from "@/components/dashboard/FirstTimeNudge";
import { KdpCallStrip } from "@/components/dashboard/KdpCallStrip";
import { KpiHero } from "@/components/dashboard/KpiHero";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { SpecialMeetingBanner } from "@/components/dashboard/SpecialMeetingBanner";
import { RoadToNovemberCallout } from "@/components/dashboard/RoadToNovemberCallout";
import { fetchAssignedTasks } from "@/lib/db/my-tasks";
import { HubShell } from "@/components/hub/HubShell";
import { fetchRightNowContext } from "@/lib/db/right-now";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  fetchDashboardKpis,
  fetchNeedsAttention,
  fetchRecentActivity,
} from "@/lib/db/dashboard-health";
import { fetchUpcomingMeetings } from "@/lib/db/workspace";
import { fetchAllMembers, fetchCommittees, displayName } from "@/lib/db/members";
import {
  WorkspaceForYou,
  type DashboardAudience,
} from "@/components/dashboard/WorkspaceForYou";
import { JumpToTiles } from "@/components/dashboard/JumpToTiles";
import { DashboardLayoutSwitcher } from "@/components/dashboard/DashboardLayoutSwitcher";
import type { OfficerDashboardData } from "@/components/dashboard/OfficerDashboard";
import { fetchCommitteeHealth } from "@/lib/db/committee-health";
import { fetchAllMeetingRecords } from "@/lib/db/meeting-records";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

// Officer dashboard needs: transitions of the last 90 days + the next
// signature event. Both are cheap one-off queries; keep them local to
// avoid bloating the dashboard-health module.
async function fetchOfficerTransitions90() {
  const supabase = await getSupabaseServer();
  const since = new Date();
  since.setDate(since.getDate() - 90);
  const sinceIso = since.toISOString().slice(0, 10);
  const { data } = await supabase
    .from("transitions")
    .select(
      "seat_code, previous_holder_name, successor_id, successor_name, status, departed_date"
    )
    .or(`departed_date.gte.${sinceIso},status.eq.VACANT`)
    .order("departed_date", { ascending: false, nullsFirst: false });
  return (data ?? []) as Array<{
    seat_code: string;
    previous_holder_name: string | null;
    successor_id: string | null;
    successor_name: string | null;
    status: string;
    departed_date: string | null;
  }>;
}

async function fetchNextSignatureEvent() {
  const supabase = await getSupabaseServer();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("events")
    .select("name, event_date")
    .eq("active", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data as { name: string; event_date: string } | null;
}

async function fetchVoterGuideSettings() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["voter_guide_url", "general_voter_guide_url", "post_primary_callout_mode"]);
  const map = new Map<string, string>(
    ((data ?? []) as Array<{ key: string; value: string }>).map((s) => [s.key, s.value])
  );
  return {
    voterGuidePrimaryUrl: map.get("voter_guide_url") || null,
    voterGuideGeneralUrl: map.get("general_voter_guide_url") || null,
    voterGuideMode: map.get("post_primary_callout_mode") || "AUTO",
  };
}

export default async function DashboardPage() {
  // Track which fetches failed so the UI can surface a "some data
  // couldn't load" banner rather than silently rendering blank tiles.
  const fetchErrors: string[] = [];

  const [
    voterSettings,
    rightNow,
    assignedTasks,
    kpis,
    attention,
    activity,
    upcomingMeetings,
    members,
    committees,
    committeeHealth,
    meetingRecords,
    transitionsLast90,
    nextSignatureEvent,
  ] = await Promise.all([
      fetchVoterGuideSettings(),
      fetchRightNowContext().catch((err) => {
        console.error("[dashboard] fetchRightNowContext failed", err);
        fetchErrors.push("cycle context");
        return undefined;
      }),
      fetchAssignedTasks().catch((err) => {
        console.error("[dashboard] fetchAssignedTasks failed", err);
        fetchErrors.push("assigned tasks");
        return [];
      }),
      fetchDashboardKpis().catch((err) => {
        console.error("[dashboard] fetchDashboardKpis failed", err);
        fetchErrors.push("KPIs");
        return null;
      }),
      fetchNeedsAttention().catch((err) => {
        console.error("[dashboard] fetchNeedsAttention failed", err);
        fetchErrors.push("needs-attention queue");
        return [];
      }),
      fetchRecentActivity(12).catch((err) => {
        console.error("[dashboard] fetchRecentActivity failed", err);
        fetchErrors.push("activity feed");
        return [];
      }),
      fetchUpcomingMeetings().catch((err) => {
        console.error("[dashboard] fetchUpcomingMeetings failed", err);
        fetchErrors.push("upcoming meetings");
        return [];
      }),
      fetchAllMembers().catch((err) => {
        console.error("[dashboard] fetchAllMembers failed", err);
        fetchErrors.push("members roster");
        return [];
      }),
      fetchCommittees().catch((err) => {
        console.error("[dashboard] fetchCommittees failed", err);
        fetchErrors.push("committees");
        return [];
      }),
      fetchCommitteeHealth().catch((err) => {
        console.error("[dashboard] fetchCommitteeHealth failed", err);
        fetchErrors.push("committee health");
        return [];
      }),
      fetchAllMeetingRecords().catch((err) => {
        console.error("[dashboard] fetchAllMeetingRecords failed", err);
        fetchErrors.push("meeting records");
        return [];
      }),
      fetchOfficerTransitions90().catch((err) => {
        console.error("[dashboard] fetchOfficerTransitions90 failed", err);
        fetchErrors.push("transitions");
        return [];
      }),
      fetchNextSignatureEvent().catch((err) => {
        console.error("[dashboard] fetchNextSignatureEvent failed", err);
        fetchErrors.push("next event");
        return null;
      }),
    ]);

  // Build the workspace-context props for the "Upcoming for you" +
  // officer-briefing combo card. Snapshot logic mirrors the YIR page so
  // the dashboard and /leadership-transition show consistent audiences.
  const today = new Date();
  const audience: DashboardAudience = {
    current_officers: {},
    incoming_leaders: {},
  };
  const committeesByDisplayName: Record<string, string[]> = {};
  for (const m of members) {
    const name = displayName(m);
    const merged = [...m.committee_chair_codes, ...m.committee_member_codes];
    if (merged.length) committeesByDisplayName[name] = merged;
    if (m.primary_role !== "OFFICER" || !m.officer_role) continue;
    const ts = m.term_start ? new Date(m.term_start) : null;
    const te = m.term_end ? new Date(m.term_end) : null;
    const isIncoming =
      ts != null &&
      ts.getTime() > today.getTime() &&
      (m.officer_role === "CHAIR" || m.officer_role === "VICE_CHAIR");
    const isCurrent =
      !isIncoming &&
      (ts == null || ts.getTime() <= today.getTime()) &&
      (te == null || te.getTime() >= today.getTime());
    if (isIncoming) audience.incoming_leaders[name] = m.officer_role;
    else if (isCurrent) audience.current_officers[name] = m.officer_role;
  }
  const committeeNameByCode: Record<string, string> = {};
  for (const c of committees) committeeNameByCode[c.code] = c.name;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const daysToPrimary = rightNow?.days_to_primary ?? null;
  const daysToGeneral = rightNow?.days_to_general ?? null;
  const focusElection = rightNow?.focus_election ?? "PRIMARY";

  // Officer-dashboard data bundle. Sums across committeeHealth so we
  // don't double-count action items. `role` is provisional; the client
  // switcher overrides with the active lens.
  const totalOpenActionItems = committeeHealth.reduce(
    (acc, c) => acc + c.open_action_items,
    0
  );
  const publishedAwaitingApproval = meetingRecords.filter(
    (r) => r.status === "PUBLISHED"
  ).length;
  let signatureEventDaysUntil: number | null = null;
  if (nextSignatureEvent) {
    const eventTs = new Date(nextSignatureEvent.event_date + "T00:00:00").getTime();
    signatureEventDaysUntil = Math.max(
      0,
      Math.round((eventTs - Date.now()) / (1000 * 60 * 60 * 24))
    );
  }
  const officerData: OfficerDashboardData = {
    todayLabel,
    role: "OFFICER",
    upcomingMeetings,
    committeeNameByCode,
    committeeHealth,
    recentMeetingRecords: meetingRecords.slice(0, 12),
    publishedAwaitingApproval,
    totalActiveMembers: kpis?.memberCount ?? members.length,
    countywideAttendanceRate: kpis?.attendanceRatePct ?? null,
    totalOpenActionItems,
    signatureEventDaysUntil,
    signatureEventName: nextSignatureEvent?.name ?? null,
    daysToGeneral,
    transitionsLast90,
    // Secondary hat is computed client-side from profile.additional_roles
    // — server doesn't know which hat the viewer is wearing besides
    // primary. The OfficerDashboard currently leaves it null; future
    // work can hydrate it.
    secondaryHat: null,
  };

  return (
    <HubShell
      eyebrow="Dashboard"
      title={
        focusElection === "GENERAL"
          ? "The road to November 3."
          : "State of the party, right now."
      }
      subtitle={
        focusElection === "GENERAL" && daysToGeneral != null
          ? `${todayLabel} · ${daysToGeneral} days out`
          : todayLabel
      }
      actions={
        <>
          <Link
            href="/tour/1"
            className="rounded text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ldp-navy-900)]"
          >
            Revisit the tour
          </Link>
          <Button
            asChild
            variant="ldp"
            size="sm"
            className="border border-white/20 bg-white/10 hover:bg-white/20"
          >
            <a
              href="https://us02web.zoom.us/j/89692618777"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join EC Meeting
            </a>
          </Button>
        </>
      }
    >
      {fetchErrors.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-md border-l-4 border-[var(--color-ldp-red)] bg-[#FFF5F6] p-3 text-xs text-[var(--color-ldp-ink-900)]">
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-red)]"
          />
          <div>
            <div className="font-semibold text-[var(--color-ldp-red)]">
              Some dashboard data didn&apos;t load
            </div>
            <div className="mt-0.5">
              Couldn&apos;t fetch: {fetchErrors.join(", ")}. The portal is still working — try a
              hard refresh. If it persists,{" "}
              <a
                href="mailto:lisatnorkus@gmail.com?subject=LDPEC%20Portal%20dashboard%20fetch%20error"
                className="underline"
              >
                tell Lisa
              </a>
              .
            </div>
          </div>
        </div>
      )}

      <SpecialMeetingBanner />

      {focusElection === "GENERAL" && (
        <RoadToNovemberCallout daysToGeneral={daysToGeneral} />
      )}

      <VoterGuideCallout
        primaryUrl={voterSettings.voterGuidePrimaryUrl}
        generalUrl={voterSettings.voterGuideGeneralUrl}
        mode={voterSettings.voterGuideMode}
      />

      <FirstTimeNudge />

      <RoleBanner />

      <WorkingSetHeader />

      {/* Layout swap by active lens. Officers see the OfficerDashboard
          (committee health, transitions, meeting cadence) — everyone
          else sees the default LD-flavored layout below. */}
      <DashboardLayoutSwitcher officerData={officerData}>
        {/* KPI hero — six big numbers at the top. State of the
            operation in one glance. */}
        {kpis && (
          <KpiHero
            kpis={kpis}
            daysToPrimary={daysToPrimary}
            daysToGeneral={daysToGeneral}
            focusElection={focusElection}
          />
        )}

        {/* Needs-attention queue — concrete surfaces, one-click CTAs. */}
        <NeedsAttention items={attention} />

        {/* Officer briefing (if eligible) + Upcoming for you strip. */}
        <WorkspaceForYou
          upcomingMeetings={upcomingMeetings}
          committeeNameByCode={committeeNameByCode}
          committeesByDisplayName={committeesByDisplayName}
          audience={audience}
        />

        {/* Personalized: your assigned tasks across LDs + committees. */}
        <YourWeekPanel allAssignedTasks={assignedTasks} />

        {/* Cycle phase + KDP call — the context strip. */}
        <section className="mb-8">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
              Where we are in the cycle
            </h2>
            <Clock aria-hidden="true" className="size-4 text-[var(--color-ldp-ink-700)]" />
          </div>
          <CycleTimeline />
        </section>

        <KdpCallStrip />

        {/* Role-aware jump row — tile set swaps when the user switches
            their View-as lens. */}
        <JumpToTiles />

        {/* Live activity feed — shows the place is alive. */}
        <ActivityFeed events={activity} />
      </DashboardLayoutSwitcher>
    </HubShell>
  );
}
