import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Compass,
  HeartHandshake,
  Home,
  Share2,
  Target,
  Ticket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CycleTimeline } from "@/components/cycle/CycleTimeline";
import { VoterGuideCallout } from "@/components/dashboard/VoterGuideCallout";
import { WorkingSetHeader } from "@/components/dashboard/WorkingSetHeader";
import { YourWeekPanel } from "@/components/dashboard/YourWeekPanel";
import { FirstTimeNudge } from "@/components/dashboard/FirstTimeNudge";
import { KdpCallStrip } from "@/components/dashboard/KdpCallStrip";
import { KpiHero } from "@/components/dashboard/KpiHero";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { fetchAssignedTasks } from "@/lib/db/my-tasks";
import { HubShell } from "@/components/hub/HubShell";
import { fetchRightNowContext } from "@/lib/db/right-now";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  fetchDashboardKpis,
  fetchNeedsAttention,
  fetchRecentActivity,
} from "@/lib/db/dashboard-health";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

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

  const [voterSettings, rightNow, assignedTasks, kpis, attention, activity] =
    await Promise.all([
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
    ]);

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
      title="State of the party, right now."
      subtitle={todayLabel}
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

      <VoterGuideCallout
        primaryUrl={voterSettings.voterGuidePrimaryUrl}
        generalUrl={voterSettings.voterGuideGeneralUrl}
        mode={voterSettings.voterGuideMode}
      />

      <FirstTimeNudge />

      <WorkingSetHeader />

      {/* KPI hero — six big numbers at the top. State of the operation
          in one glance. */}
      {kpis && <KpiHero kpis={kpis} daysToPrimary={daysToPrimary} />}

      {/* Needs-attention queue — concrete surfaces, one-click CTAs. */}
      <NeedsAttention items={attention} />

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

      {/* Focused jump row — six surfaces people actually open, not a
          full sitemap. The old widget grid moved to /overview for
          people who want the full surface list. */}
      <section className="mb-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
            Jump to
          </h2>
          <Link
            href="/overview"
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)] hover:underline"
          >
            Full surface list <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <JumpTile
            href="/my-ld"
            label="My LD"
            icon={Home}
            color="var(--color-ldp-red)"
          />
          <JumpTile
            href="/targeting"
            label="Targeting"
            icon={Compass}
            color="#0E4C9E"
          />
          <JumpTile
            href="/captains"
            label="Captains"
            icon={Target}
            color="#0E4C9E"
          />
          <JumpTile
            href="/events"
            label="Events"
            icon={Ticket}
            color="#059669"
          />
          <JumpTile
            href="/volunteers"
            label="Volunteers"
            icon={HeartHandshake}
            color="#059669"
          />
          <JumpTile
            href="/amplify"
            label="Amplify"
            icon={Share2}
            color="#0891b2"
          />
        </div>
      </section>

      {/* Live activity feed — shows the place is alive. */}
      <ActivityFeed events={activity} />
    </HubShell>
  );
}

function JumpTile({
  href,
  label,
  icon: Icon,
  color,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-2 rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <span
        className="flex size-10 items-center justify-center rounded-lg text-white"
        style={{ backgroundColor: color }}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="text-xs font-semibold text-[var(--color-ldp-navy-900)] group-hover:text-[var(--color-ldp-navy-800)]">
        {label}
      </span>
    </Link>
  );
}
