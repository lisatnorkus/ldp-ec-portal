import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  DollarSign,
  HeartHandshake,
  Target,
  Timer,
  Users,
} from "lucide-react";
import type { DashboardKpis } from "@/lib/db/dashboard-health";

// The state-of-the-party strip at the top of the dashboard. Six big
// numbers, color-coded, no tiny type. Meant to answer "how's the
// operation today" in one glance.

export function KpiHero({
  kpis,
  daysToPrimary,
}: {
  kpis: DashboardKpis;
  daysToPrimary: number | null;
}) {
  const coveragePct =
    kpis.priorityPrecincts > 0
      ? Math.round((kpis.capturedPrecincts / kpis.priorityPrecincts) * 100)
      : 0;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
          State of the operation
        </h2>
        <span className="text-[10px] font-medium italic text-[var(--color-ldp-ink-700)]">
          Updated on every visit
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiTile
          icon={Timer}
          value={daysToPrimary != null && daysToPrimary >= 0 ? String(daysToPrimary) : "—"}
          label="Days to primary"
          color="var(--color-ldp-red)"
          sub="Tuesday, May 19"
        />
        <KpiTile
          icon={Target}
          value={`${coveragePct}%`}
          label="Priority precinct coverage"
          color="#0E4C9E"
          sub={`${kpis.capturedPrecincts} / ${kpis.priorityPrecincts} captains`}
        />
        <KpiTile
          icon={HeartHandshake}
          value={String(kpis.activeVolunteers)}
          label="Active volunteers"
          color="#059669"
          sub={`${kpis.totalVolunteers} on the roster`}
        />
        <KpiTile
          icon={Timer}
          value={String(kpis.tasksOverdue)}
          label="Tasks overdue"
          color={kpis.tasksOverdue > 0 ? "var(--color-ldp-red)" : "#94a3b8"}
          sub="Across every LD + committee"
        />
        <KpiTile
          icon={CalendarCheck}
          value={kpis.attendanceRatePct != null ? `${kpis.attendanceRatePct}%` : "—"}
          label="EC attendance rate"
          color="#F59E0B"
          sub="Rolling, last 12 months"
        />
        <KpiTile
          icon={DollarSign}
          value={`$${(kpis.annualRaiseFloor / 1000).toFixed(0)}K`}
          label="Annual raise floor"
          color="#7c3aed"
          sub={`${kpis.memberCount} members × $620`}
        />
      </div>
    </section>
  );
}

function KpiTile({
  icon: Icon,
  value,
  label,
  color,
  sub,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
  sub: string;
}) {
  return (
    <article
      className="flex flex-col rounded-xl border bg-white p-3 shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
        <Icon aria-hidden="true" className="size-3" />
        {label}
      </div>
      <div className="mt-1 text-3xl font-black leading-none tracking-tight text-[var(--color-ldp-navy-900)]">
        {value}
      </div>
      <div className="mt-1 text-[10px] text-[var(--color-ldp-ink-700)]">{sub}</div>
    </article>
  );
}
