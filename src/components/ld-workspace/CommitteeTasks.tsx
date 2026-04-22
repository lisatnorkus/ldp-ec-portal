"use client";

import { useState, useTransition } from "react";
import {
  Check,
  CheckSquare,
  ChevronRight,
  ListTodo,
  Plus,
  Square,
  SquareCheck,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { CommitteeTask } from "@/lib/db/committee-workspace";
import type { Assignable, TaskPriority } from "@/lib/db/ld-tasks";
import {
  acceptCommitteeTask,
  createCommitteeTask,
  declineCommitteeTask,
  setCommitteeTaskStatus,
} from "./committee-actions";

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
  return due < new Date().toISOString().slice(0, 10);
}

function formatDue(due: string | null): string {
  if (!due) return "No due date";
  const d = new Date(due + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CommitteeTasks({
  committeeCode,
  tasks,
  assignables,
}: {
  committeeCode: string;
  tasks: CommitteeTask[];
  assignables: Assignable[];
}) {
  const { profile, hydrated } = useUserProfile();
  const [composing, setComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [justMine, setJustMine] = useState(false);

  const canWrite = hydrated && !!profile.display_name;
  const myName = profile.display_name ?? "";
  const author = { name: myName, role: profile.role, ld: profile.ld_number };

  const scoped = justMine && myName ? tasks.filter((t) => t.assigned_to_name === myName) : tasks;
  const open = scoped.filter((t) => t.status !== "DONE" && t.status !== "DEFERRED");
  const done = scoped.filter((t) => t.status === "DONE");
  const deferred = scoped.filter((t) => t.status === "DEFERRED");
  const overdue = open.filter((t) => isOverdue(t.due_date));
  const pendingForMe = myName
    ? tasks.filter(
        (t) => t.assigned_to_name === myName && t.accepted_at == null && t.status !== "DONE"
      ).length
    : 0;

  function handleStatus(task: CommitteeTask, status: CommitteeTask["status"]) {
    startTransition(async () => {
      await setCommitteeTaskStatus(task.id, committeeCode, status);
    });
  }

  function handleAccept(task: CommitteeTask) {
    startTransition(async () => {
      await acceptCommitteeTask(task.id, committeeCode, myName);
    });
  }

  function handleDecline(task: CommitteeTask) {
    const note = prompt("Optional — tell the assigner why you're declining:") ?? "";
    startTransition(async () => {
      await declineCommitteeTask(task.id, committeeCode, myName, note);
    });
  }

  return (
    <section className="mb-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Committee tasks
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
          {pendingForMe > 0 && (
            <span className="rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
              {pendingForMe} to accept
            </span>
          )}
          {myName && (
            <button
              type="button"
              onClick={() => setJustMine((v) => !v)}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                justMine
                  ? "border-[var(--color-ldp-navy-800)] bg-[var(--color-ldp-navy-800)] text-white"
                  : "border-[var(--color-ldp-line)] text-[var(--color-ldp-ink-700)] hover:border-[var(--color-ldp-navy-700)]"
              }`}
            >
              {justMine ? "✓ just mine" : "just mine"}
            </button>
          )}
        </div>
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
        <Composer
          committeeCode={committeeCode}
          author={author}
          assignables={assignables}
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

      {tasks.length === 0 && <EmptyHero canWrite={canWrite} onAddTask={() => setComposing(true)} />}

      {open.length === 0 && tasks.length > 0 ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-800">
          <CheckSquare aria-hidden="true" className="mx-auto mb-2 size-6 text-emerald-600" />
          No open committee tasks. Nice.
        </div>
      ) : open.length === 0 ? null : (
        <ul className="divide-y divide-[var(--color-ldp-line)] rounded-lg border border-[var(--color-ldp-line)] bg-white">
          {open.map((t) => (
            <Row
              key={t.id}
              task={t}
              onStatus={handleStatus}
              onAccept={handleAccept}
              onDecline={handleDecline}
              myName={myName}
              disabled={isPending}
            />
          ))}
        </ul>
      )}

      {(done.length > 0 || deferred.length > 0) && (
        <details className="mt-4 rounded-lg border border-[var(--color-ldp-line)] bg-white">
          <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Completed · {done.length} {deferred.length > 0 && `· Deferred · ${deferred.length}`}
          </summary>
          <ul className="divide-y divide-[var(--color-ldp-line)]">
            {[...done, ...deferred].map((t) => (
              <Row
                key={t.id}
                task={t}
                onStatus={handleStatus}
                onAccept={handleAccept}
                onDecline={handleDecline}
                myName={myName}
                disabled={isPending}
              />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

function EmptyHero({
  canWrite,
  onAddTask,
}: {
  canWrite: boolean;
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
              No committee tasks yet
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              {canWrite
                ? "Assign a task to a committee member to start the list."
                : "Set your name first — then start tracking."}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              Tasks live with the committee, not with any one chair. Next chair inherits the
              list automatically.
            </p>
            {canWrite && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onAddTask}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Add a task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  task,
  onStatus,
  onAccept,
  onDecline,
  myName,
  disabled,
}: {
  task: CommitteeTask;
  onStatus: (t: CommitteeTask, s: CommitteeTask["status"]) => void;
  onAccept: (t: CommitteeTask) => void;
  onDecline: (t: CommitteeTask) => void;
  myName: string;
  disabled: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const done = task.status === "DONE";
  const isAssignedToMe = !!myName && task.assigned_to_name === myName;
  const needsAcceptance = isAssignedToMe && !task.accepted_at && !done;
  const isAccepted = isAssignedToMe && !!task.accepted_at;

  return (
    <li className={`p-3 hover:bg-[#FAFBFC] ${needsAcceptance ? "bg-[#FEF9E7]" : ""}`}>
      {needsAcceptance && (
        <div className="mb-2 flex flex-wrap items-center gap-2 rounded border border-[var(--color-ldp-gold)] bg-white px-2 py-1.5 text-xs">
          <User aria-hidden="true" className="size-3.5 text-[var(--color-ldp-gold)]" />
          <span className="font-semibold text-[var(--color-ldp-navy-900)]">
            {task.assigned_by_name ?? "Someone"} assigned this to you.
          </span>
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAccept(task);
              }}
              disabled={disabled}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Check aria-hidden="true" className="size-3" />
              Accept
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDecline(task);
              }}
              disabled={disabled}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1 text-[11px] text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-red)] hover:text-[var(--color-ldp-red)] disabled:opacity-50"
            >
              <X aria-hidden="true" className="size-3" />
              Decline
            </button>
          </div>
        </div>
      )}
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
                {task.assigned_to_name && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      isAccepted
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-[var(--color-ldp-gold)]/30 text-[var(--color-ldp-navy-900)]"
                    }`}
                  >
                    {isAccepted ? (
                      <UserCheck aria-hidden="true" className="size-3" />
                    ) : (
                      <User aria-hidden="true" className="size-3" />
                    )}
                    {task.assigned_to_name}
                    {!task.accepted_at && !done && " · pending"}
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
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function Composer({
  committeeCode,
  author,
  assignables,
  onClose,
  onError,
}: {
  committeeCode: string;
  author: { name: string; role: string | null; ld: number | null };
  assignables: Assignable[];
  onClose: () => void;
  onError: (msg: string | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!title.trim()) {
      onError("Title is required.");
      return;
    }
    onError(null);
    const resolvedAssignee =
      assignee === "" ? null : assignee === "__self" ? author.name : assignee;
    startTransition(async () => {
      const res = await createCommitteeTask(
        committeeCode,
        {
          title,
          description,
          priority,
          due_date: dueDate || null,
          assigned_to_name: resolvedAssignee,
        },
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
      setAssignee("");
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
      <div className="mt-2">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Assign to (optional)
          </span>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
          >
            <option value="">— unassigned —</option>
            {author.name && <option value="__self">Me ({author.name})</option>}
            {assignables.length > 0 && (
              <optgroup label="Committee members">
                {assignables.map((a) => (
                  <option key={a.name + a.role} value={a.name}>
                    {a.name} — {a.role}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </label>
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
