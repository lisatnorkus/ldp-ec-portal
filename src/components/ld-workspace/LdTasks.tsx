"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, CheckSquare, ChevronRight, ListTodo, Plus, Sparkles, Square, SquareCheck } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { LdTask, TaskPriority } from "@/lib/db/ld-tasks";
import {
  createTask,
  insertNewChairTemplate,
  setTaskStatus,
} from "./task-actions";

const PRIORITY_DOT: Record<TaskPriority, string> = {
  HIGH: "bg-red-500",
  MEDIUM: "bg-amber-400",
  LOW: "bg-gray-300",
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

function isOverdue(due: string | null): boolean {
  if (!due) return false;
  const today = new Date().toISOString().slice(0, 10);
  return due < today;
}

function isThisWeek(due: string | null): boolean {
  if (!due) return false;
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 7);
  const dueDate = new Date(due + "T00:00:00");
  return dueDate >= new Date(now.toISOString().slice(0, 10) + "T00:00:00") && dueDate <= end;
}

function formatDue(due: string | null): string {
  if (!due) return "No due date";
  const d = new Date(due + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function LdTasks({ ldNumber, tasks }: { ldNumber: number; tasks: LdTask[] }) {
  const { profile, hydrated } = useUserProfile();
  const [composing, setComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canWrite = hydrated && !!profile.display_name;
  const author = {
    name: profile.display_name ?? "",
    role: profile.role,
    ld: profile.ld_number,
  };

  const open = tasks.filter((t) => t.status !== "DONE" && t.status !== "DEFERRED");
  const done = tasks.filter((t) => t.status === "DONE");
  const deferred = tasks.filter((t) => t.status === "DEFERRED");

  const overdue = open.filter((t) => isOverdue(t.due_date));
  const thisWeek = open.filter((t) => !isOverdue(t.due_date) && isThisWeek(t.due_date));
  const later = open.filter(
    (t) => !isOverdue(t.due_date) && !isThisWeek(t.due_date) && t.due_date != null
  );
  const noDate = open.filter((t) => t.due_date == null);

  function handleStatus(task: LdTask, status: LdTask["status"]) {
    startTransition(async () => {
      await setTaskStatus(task.id, ldNumber, status);
    });
  }

  function handleInsertTemplate() {
    if (!canWrite) return;
    if (!confirm("Insert 8 new-chair onboarding tasks? This is a one-time bulk-add.")) return;
    setError(null);
    startTransition(async () => {
      const res = await insertNewChairTemplate(ldNumber, author);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <section className="mb-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Open tasks
          </h2>
          {open.length > 0 && (
            <span className="rounded-full bg-[var(--color-ldp-navy-800)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              {open.length} open
            </span>
          )}
          {overdue.length > 0 && (
            <span className="rounded-full bg-[var(--color-ldp-red)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              {overdue.length} overdue
            </span>
          )}
        </div>
        {/* Add-task button is always rendered when there are tasks
            and a profile — keeping it present makes the section's
            action model obvious without adding visual noise to the
            empty-state card below. */}
        {canWrite && tasks.length > 0 && !composing && (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            Add task
          </button>
        )}
      </div>

      {composing && (
        <TaskComposer
          ldNumber={ldNumber}
          author={author}
          onClose={() => {
            setComposing(false);
            setError(null);
          }}
          onError={setError}
        />
      )}

      {error && (
        <div className="mb-3 rounded-lg border border-[var(--color-ldp-red)]/30 bg-[#FFF5F6] p-3 text-xs text-[var(--color-ldp-red)]">
          {error}
        </div>
      )}

      {/* Empty state: unified card with clear actions. Changes shape
          based on whether the user has set their name yet. */}
      {tasks.length === 0 && (
        <EmptyTasksHero
          canWrite={canWrite}
          isPending={isPending}
          onInsertTemplate={handleInsertTemplate}
          onAddTask={() => setComposing(true)}
        />
      )}

      {open.length === 0 && tasks.length > 0 ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-800">
          <CheckSquare aria-hidden="true" className="mx-auto mb-2 size-6 text-emerald-600" />
          No open tasks. Nice.
        </div>
      ) : open.length === 0 ? null : (
        <div className="space-y-4">
          {overdue.length > 0 && (
            <TaskGroup title="Overdue" tone="red" tasks={overdue} onStatus={handleStatus} disabled={isPending} />
          )}
          {thisWeek.length > 0 && (
            <TaskGroup title="Due this week" tone="navy" tasks={thisWeek} onStatus={handleStatus} disabled={isPending} />
          )}
          {later.length > 0 && (
            <TaskGroup title="Due later" tone="muted" tasks={later} onStatus={handleStatus} disabled={isPending} />
          )}
          {noDate.length > 0 && (
            <TaskGroup title="No due date" tone="muted" tasks={noDate} onStatus={handleStatus} disabled={isPending} />
          )}
        </div>
      )}

      {(done.length > 0 || deferred.length > 0) && (
        <details className="mt-4 rounded-lg border border-[var(--color-ldp-line)] bg-white">
          <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Completed · {done.length} {deferred.length > 0 && `· Deferred · ${deferred.length}`}
          </summary>
          <ul className="divide-y divide-[var(--color-ldp-line)]">
            {done.map((t) => (
              <TaskRow key={t.id} task={t} onStatus={handleStatus} disabled={isPending} />
            ))}
            {deferred.map((t) => (
              <TaskRow key={t.id} task={t} onStatus={handleStatus} disabled={isPending} />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function EmptyTasksHero({
  canWrite,
  isPending,
  onInsertTemplate,
  onAddTask,
}: {
  canWrite: boolean;
  isPending: boolean;
  onInsertTemplate: () => void;
  onAddTask: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-navy-800) 0%, var(--color-ldp-gold) 100%)",
        }}
      />
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-white">
            <ListTodo aria-hidden="true" className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
              Start your task list
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              {canWrite ? "Drop in the 8 onboarding tasks or add your own." : "Set your name first — then start tracking."}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              Tasks live with the LD, not with you. Anything you track here carries forward to
              the next chair so the district never starts from scratch again.
            </p>

            {canWrite ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onInsertTemplate}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-gold)] px-4 py-2 text-sm font-bold text-[var(--color-ldp-navy-900)] shadow hover:bg-[var(--color-ldp-gold)]/90 disabled:opacity-50"
                >
                  <Sparkles aria-hidden="true" className="size-4" />
                  Insert new-chair template · 8 tasks
                </button>
                <button
                  type="button"
                  onClick={onAddTask}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-md border-2 border-[var(--color-ldp-navy-800)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-navy-900)] hover:text-white disabled:opacity-50"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Add a custom task
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Set your name on the dashboard
                </Link>
                <span className="text-xs text-[var(--color-ldp-ink-700)]">
                  Takes 5 seconds. Required so we can credit who added what.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskGroup({
  title,
  tone,
  tasks,
  onStatus,
  disabled,
}: {
  title: string;
  tone: "red" | "navy" | "muted";
  tasks: LdTask[];
  onStatus: (t: LdTask, s: LdTask["status"]) => void;
  disabled: boolean;
}) {
  const toneColor =
    tone === "red"
      ? "text-[var(--color-ldp-red)]"
      : tone === "navy"
        ? "text-[var(--color-ldp-navy-700)]"
        : "text-[var(--color-ldp-ink-700)]";
  const toneBorder =
    tone === "red"
      ? "border-[var(--color-ldp-red)]/30 bg-[#FFF5F6]"
      : tone === "navy"
        ? "border-[var(--color-ldp-line)] bg-white"
        : "border-[var(--color-ldp-line)] bg-white";
  return (
    <div className={`overflow-hidden rounded-lg border ${toneBorder}`}>
      <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${toneColor}`}>
        {title} · {tasks.length}
      </div>
      <ul className="divide-y divide-[var(--color-ldp-line)] bg-white">
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} onStatus={onStatus} disabled={disabled} />
        ))}
      </ul>
    </div>
  );
}

function TaskRow({
  task,
  onStatus,
  disabled,
}: {
  task: LdTask;
  onStatus: (t: LdTask, s: LdTask["status"]) => void;
  disabled: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const done = task.status === "DONE";
  return (
    <li className="p-3 hover:bg-[#FAFBFC]">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onStatus(task, done ? "OPEN" : "DONE")}
          disabled={disabled}
          aria-label={done ? "Mark task open" : "Mark task done"}
          className="mt-0.5 shrink-0 rounded text-[var(--color-ldp-ink-700)] hover:text-emerald-600 disabled:opacity-50"
        >
          {done ? (
            <SquareCheck aria-hidden="true" className="size-5 text-emerald-600" />
          ) : (
            <Square aria-hidden="true" className="size-5" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex w-full items-start justify-between gap-2 text-left"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                <span
                  aria-hidden="true"
                  className={`inline-block size-1.5 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`}
                />
                <span
                  className={`font-medium ${
                    done
                      ? "text-[var(--color-ldp-ink-700)] line-through"
                      : "text-[var(--color-ldp-navy-900)]"
                  }`}
                >
                  {task.title}
                </span>
                {task.due_date && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      !done && isOverdue(task.due_date)
                        ? "bg-[var(--color-ldp-red)] text-white"
                        : "bg-[#FAFAFA] text-[var(--color-ldp-ink-700)]"
                    }`}
                  >
                    {formatDue(task.due_date)}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight
              aria-hidden="true"
              className={`mt-1 size-4 shrink-0 text-[var(--color-ldp-ink-700)] transition-transform ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </button>
          {expanded && (
            <div className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">
              {task.description && (
                <p className="mb-2 whitespace-pre-wrap text-[var(--color-ldp-ink-900)]">
                  {task.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Priority: {PRIORITY_LABEL[task.priority]}</span>
                {task.author_name && <span>Added by {task.author_name}</span>}
              </div>
              {!done && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onStatus(task, "DONE")}
                    disabled={disabled}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Check aria-hidden="true" className="size-3" /> Mark done
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatus(task, "DEFERRED")}
                    disabled={disabled}
                    className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2.5 py-1 text-[11px] text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
                  >
                    Defer
                  </button>
                </div>
              )}
              {done && task.completed_at && (
                <div className="mt-1 text-[10px] text-emerald-700">
                  Completed {new Date(task.completed_at).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function TaskComposer({
  ldNumber,
  author,
  onClose,
  onError,
}: {
  ldNumber: number;
  author: { name: string; role: string | null; ld: number | null };
  onClose: () => void;
  onError: (msg: string | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!title.trim()) {
      onError("Title is required.");
      return;
    }
    onError(null);
    startTransition(async () => {
      const res = await createTask(
        ldNumber,
        { title, description, priority, due_date: dueDate || null },
        author
      );
      if (!res.ok) {
        onError(res.error);
        return;
      }
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
      onClose();
    });
  }

  return (
    <div className="mb-4 rounded-lg border-2 border-[var(--color-ldp-navy-800)] bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
          autoFocus
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Notes (optional)"
        className="mt-2 w-full rounded border border-[var(--color-ldp-line)] bg-white p-3 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isPending || !title.trim()}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Add task"}
        </button>
      </div>
    </div>
  );
}

