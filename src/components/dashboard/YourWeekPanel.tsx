"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  Check,
  ChevronRight,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { MyTask } from "@/lib/db/my-tasks";
import type { TaskPriority } from "@/lib/db/ld-tasks";
import {
  acceptMyTask,
  completeMyTask,
  declineMyTask,
} from "@/components/ld-workspace/my-week-actions";

const PRIORITY_DOT: Record<TaskPriority, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-amber-400",
  LOW: "bg-gray-300",
};

function isOverdue(due: string | null): boolean {
  if (!due) return false;
  return due < new Date().toISOString().slice(0, 10);
}

function isThisWeek(due: string | null): boolean {
  if (!due) return false;
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 7);
  const d = new Date(due + "T00:00:00");
  return d >= new Date(now.toISOString().slice(0, 10) + "T00:00:00") && d <= end;
}

function formatDue(due: string | null): string {
  if (!due) return "No due date";
  const d = new Date(due + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function YourWeekPanel({ allAssignedTasks }: { allAssignedTasks: MyTask[] }) {
  const { profile, hydrated } = useUserProfile();
  const myName = profile.display_name ?? "";
  const [isPending, startTransition] = useTransition();

  if (!hydrated) {
    return (
      <section className="mb-6 h-40 animate-pulse rounded-xl border border-[var(--color-ldp-line)] bg-white" />
    );
  }
  if (!myName) return null; // don't render the panel when no profile

  const mine = allAssignedTasks.filter((t) => t.assigned_to_name === myName);
  if (mine.length === 0) return null;

  const pending = mine.filter((t) => !t.accepted_at);
  const acceptedAndOverdue = mine.filter((t) => t.accepted_at && isOverdue(t.due_date));
  const acceptedThisWeek = mine.filter(
    (t) => t.accepted_at && !isOverdue(t.due_date) && isThisWeek(t.due_date)
  );
  const acceptedLater = mine.filter(
    (t) =>
      t.accepted_at &&
      !isOverdue(t.due_date) &&
      !isThisWeek(t.due_date)
  );

  function handleAccept(t: MyTask) {
    startTransition(async () => {
      await acceptMyTask(t.scope, t.scope_id, t.id, myName);
    });
  }
  function handleComplete(t: MyTask) {
    startTransition(async () => {
      await completeMyTask(t.scope, t.scope_id, t.id);
    });
  }
  function handleDecline(t: MyTask) {
    const note = prompt("Optional — tell the assigner why you're declining:") ?? "";
    startTransition(async () => {
      await declineMyTask(t.scope, t.scope_id, t.id, myName, note);
    });
  }

  return (
    <section className="mb-6 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-navy-800) 0%, var(--color-ldp-gold) 60%, var(--color-ldp-red) 100%)",
        }}
      />
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
              <Sparkles aria-hidden="true" className="inline size-3.5" /> Your week
            </div>
            <h2 className="mt-0.5 text-xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              {countsHeadline(pending.length, acceptedAndOverdue.length, acceptedThisWeek.length)}
            </h2>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            {mine.length} task{mine.length === 1 ? "" : "s"} on you
          </div>
        </div>

        {pending.length > 0 && (
          <Group
            title="Awaiting your acceptance"
            tone="gold"
            tasks={pending}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onComplete={handleComplete}
            disabled={isPending}
            variant="pending"
          />
        )}
        {acceptedAndOverdue.length > 0 && (
          <Group
            title="Overdue"
            tone="red"
            tasks={acceptedAndOverdue}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onComplete={handleComplete}
            disabled={isPending}
            variant="accepted"
          />
        )}
        {acceptedThisWeek.length > 0 && (
          <Group
            title="Due this week"
            tone="navy"
            tasks={acceptedThisWeek}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onComplete={handleComplete}
            disabled={isPending}
            variant="accepted"
          />
        )}
        {acceptedLater.length > 0 && (
          <Group
            title="Queued"
            tone="muted"
            tasks={acceptedLater}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onComplete={handleComplete}
            disabled={isPending}
            variant="accepted"
          />
        )}
      </div>
    </section>
  );
}

function countsHeadline(pending: number, overdue: number, thisWeek: number): string {
  const parts: string[] = [];
  if (pending > 0) parts.push(`${pending} to accept`);
  if (overdue > 0) parts.push(`${overdue} overdue`);
  if (thisWeek > 0) parts.push(`${thisWeek} due this week`);
  if (parts.length === 0) return "You're caught up.";
  return parts.join(" · ");
}

function Group({
  title,
  tone,
  tasks,
  onAccept,
  onDecline,
  onComplete,
  disabled,
  variant,
}: {
  title: string;
  tone: "gold" | "red" | "navy" | "muted";
  tasks: MyTask[];
  onAccept: (t: MyTask) => void;
  onDecline: (t: MyTask) => void;
  onComplete: (t: MyTask) => void;
  disabled: boolean;
  variant: "pending" | "accepted";
}) {
  const toneStyle =
    tone === "gold"
      ? "border-[var(--color-ldp-gold)] bg-[#FEF9E7]"
      : tone === "red"
        ? "border-[var(--color-ldp-red)]/40 bg-[#FFF5F6]"
        : tone === "navy"
          ? "border-[var(--color-ldp-line)] bg-white"
          : "border-[var(--color-ldp-line)] bg-white";
  const toneLabel =
    tone === "gold"
      ? "text-[var(--color-ldp-gold)]"
      : tone === "red"
        ? "text-[var(--color-ldp-red)]"
        : tone === "navy"
          ? "text-[var(--color-ldp-navy-700)]"
          : "text-[var(--color-ldp-ink-700)]";
  return (
    <div className={`mb-3 overflow-hidden rounded-lg border ${toneStyle}`}>
      <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${toneLabel}`}>
        {title} · {tasks.length}
      </div>
      <ul className="divide-y divide-[var(--color-ldp-line)] bg-white">
        {tasks.map((t) => (
          <li key={`${t.scope}-${t.id}`} className="p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <span
                    aria-hidden="true"
                    className={`inline-block size-1.5 shrink-0 rounded-full ${PRIORITY_DOT[t.priority]}`}
                  />
                  <span className="font-semibold text-[var(--color-ldp-navy-900)]">{t.title}</span>
                  {t.due_date && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        isOverdue(t.due_date)
                          ? "bg-[var(--color-ldp-red)] text-white"
                          : "bg-[#FAFAFA] text-[var(--color-ldp-ink-700)]"
                      }`}
                    >
                      {formatDue(t.due_date)}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">
                  <Link href={t.scope_href} className="font-medium text-[var(--color-ldp-navy-700)] hover:underline">
                    {t.scope_label}
                  </Link>
                  {t.assigned_by_name && <span>· assigned by {t.assigned_by_name}</span>}
                  {variant === "accepted" && t.accepted_at && (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <UserCheck aria-hidden="true" className="size-3" /> Accepted
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                {variant === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onAccept(t)}
                      disabled={disabled}
                      className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Check aria-hidden="true" className="size-3" />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => onDecline(t)}
                      disabled={disabled}
                      className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-2.5 py-1 text-[11px] text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-red)] hover:text-[var(--color-ldp-red)] disabled:opacity-50"
                    >
                      <X aria-hidden="true" className="size-3" />
                      Decline
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => onComplete(t)}
                    disabled={disabled}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Check aria-hidden="true" className="size-3" />
                    Done
                  </button>
                )}
                <Link
                  href={t.scope_href}
                  className="inline-flex items-center rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1 text-[var(--color-ldp-ink-700)] hover:border-[var(--color-ldp-navy-700)]"
                  aria-label={`Open ${t.scope_label}`}
                >
                  <ChevronRight aria-hidden="true" className="size-3.5" />
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

