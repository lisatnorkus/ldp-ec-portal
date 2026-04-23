import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CheckSquare,
  FileText,
  HeartHandshake,
  MessageCircle,
  Sparkles,
  UserPlus,
} from "lucide-react";
import type { ActivityEvent } from "@/lib/db/dashboard-health";

const KIND_META: Record<
  ActivityEvent["kind"],
  { Icon: LucideIcon; color: string }
> = {
  note: { Icon: FileText, color: "#F59E0B" },
  task: { Icon: CheckSquare, color: "var(--color-ldp-navy-700)" },
  volunteer: { Icon: UserPlus, color: "#059669" },
  activity: { Icon: Sparkles, color: "#7c3aed" },
  captain: { Icon: HeartHandshake, color: "#0E4C9E" },
  interaction: { Icon: MessageCircle, color: "var(--color-ldp-red)" },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  return `${Math.round(days / 30)}mo`;
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
          Live activity · last 2 weeks
        </h2>
        {events.length > 0 && (
          <span className="text-[10px] italic text-[var(--color-ldp-ink-700)]">
            {events.length} recent event{events.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5 text-center text-sm text-[var(--color-ldp-ink-700)]">
          No portal activity in the last 2 weeks. When people add notes, log interactions, or
          intake volunteers, it shows up here.
        </div>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-[var(--color-ldp-line)] bg-white">
          {events.map((e) => {
            const meta = KIND_META[e.kind];
            const Icon = meta.Icon;
            const row = (
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-[#FAFBFC]">
                <span
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: meta.color }}
                >
                  <Icon aria-hidden="true" className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                      {e.label}
                    </span>
                    <span className="shrink-0 text-[10px] text-[var(--color-ldp-ink-700)]">
                      {relativeTime(e.timestamp)}
                    </span>
                  </div>
                  {e.detail && (
                    <div className="mt-0.5 line-clamp-1 text-xs text-[var(--color-ldp-ink-900)]">
                      {e.detail}
                    </div>
                  )}
                  {e.author && (
                    <div className="mt-0.5 text-[10px] italic text-[var(--color-ldp-ink-700)]">
                      by {e.author}
                    </div>
                  )}
                </div>
              </div>
            );
            return (
              <li key={e.id} className="border-b border-[var(--color-ldp-line)] last:border-b-0">
                {e.href ? (
                  <Link href={e.href} className="block">
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
