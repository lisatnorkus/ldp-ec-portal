"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Lock, Save, Send } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type {
  CommitteeContinuityPackage,
} from "@/lib/db/committee-continuity";
import type { PackageStatus, TaskDisposition } from "@/lib/db/ld-continuity";
import type { CommitteeTask } from "@/lib/db/committee-workspace";
import {
  lockCommitteePackage,
  reopenCommitteeToDraft,
  saveCommitteeDraft,
  submitCommitteePackage,
} from "./committee-continuity-actions";

type MemberRow = { name: string; role: string };

export function CommitteeContinuityBuilder({
  committeeCode,
  pkg,
  openTasks,
  members,
}: {
  committeeCode: string;
  pkg: CommitteeContinuityPackage;
  openTasks: CommitteeTask[];
  members: MemberRow[];
}) {
  const { profile } = useUserProfile();
  const author = {
    name: profile.display_name ?? "",
    role: profile.role,
    ld: profile.ld_number,
  };

  const isDraft = pkg.status === "DRAFT";
  const isSubmitted = pkg.status === "SUBMITTED";
  const isLocked = pkg.status === "LOCKED";

  const [state, setState] = useState(pkg.state_narrative ?? "");
  const [scope, setScope] = useState(pkg.scope_and_workflow_notes ?? "");
  const [successorNote, setSuccessorNote] = useState(pkg.chair_note_to_successor ?? "");
  const [dispositions, setDispositions] = useState<Record<string, TaskDisposition>>(
    pkg.task_dispositions ?? {}
  );
  const [memberNotes, setMemberNotes] = useState<
    Record<string, { note: string; keep_on_committee: boolean }>
  >(pkg.member_notes ?? {});

  const [saveHint, setSaveHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const readOnly = !isDraft;

  function persistNow(extra?: Partial<{
    state_narrative: string;
    scope_and_workflow_notes: string;
    chair_note_to_successor: string;
  }>) {
    setError(null);
    setSaveHint("Saving…");
    startTransition(async () => {
      const res = await saveCommitteeDraft(pkg.id, committeeCode, {
        state_narrative: extra?.state_narrative ?? state,
        scope_and_workflow_notes: extra?.scope_and_workflow_notes ?? scope,
        chair_note_to_successor: extra?.chair_note_to_successor ?? successorNote,
        task_dispositions: dispositions,
        member_notes: memberNotes,
      });
      if (!res.ok) {
        setError(res.error);
        setSaveHint(null);
        return;
      }
      setSaveHint("Saved.");
      setTimeout(() => setSaveHint(null), 1500);
    });
  }

  function setDisposition(taskId: string, value: TaskDisposition | null) {
    setDispositions((prev) => {
      const next = { ...prev };
      if (value == null) delete next[taskId];
      else next[taskId] = value;
      return next;
    });
  }

  function setMemberNote(
    name: string,
    patch: Partial<{ note: string; keep_on_committee: boolean }>
  ) {
    setMemberNotes((prev) => ({
      ...prev,
      [name]: {
        note: patch.note ?? prev[name]?.note ?? "",
        keep_on_committee:
          patch.keep_on_committee ?? prev[name]?.keep_on_committee ?? true,
      },
    }));
  }

  function handleSubmit() {
    if (!confirm("Submit this package for admin review? You won't be able to edit after submit.")) return;
    persistNow();
    startTransition(async () => {
      const res = await submitCommitteePackage(pkg.id, committeeCode);
      if (!res.ok) setError(res.error);
    });
  }

  function handleLock() {
    if (!confirm("Lock this package? This is final — dispositions apply to tasks.")) return;
    startTransition(async () => {
      const res = await lockCommitteePackage(pkg.id, committeeCode, author);
      if (!res.ok) setError(res.error);
    });
  }

  function handleReopen() {
    if (!confirm("Re-open this package back to DRAFT for edits?")) return;
    startTransition(async () => {
      const res = await reopenCommitteeToDraft(pkg.id, committeeCode);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <div className="space-y-8">
      <StatusBanner status={pkg.status} />

      <Section
        title="1 · State of the committee"
        subtitle="How's the committee doing? What worked this cycle, what didn't, what should the next chair know on day one?"
      >
        <textarea
          value={state}
          onChange={(e) => setState(e.target.value)}
          onBlur={() => !readOnly && persistNow({ state_narrative: state })}
          disabled={readOnly}
          rows={8}
          placeholder="The committee's state in your voice…"
          className="w-full rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)] disabled:bg-[#FAFAFA]"
        />
      </Section>

      <Section
        title="2 · Scope & workflow notes"
        subtitle="What does this committee actually do day-to-day? Who owns what? Any recurring cadences or decision rhythms the next chair should preserve?"
      >
        <textarea
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          onBlur={() => !readOnly && persistNow({ scope_and_workflow_notes: scope })}
          disabled={readOnly}
          rows={6}
          placeholder="Meeting cadence, subcommittees, who does what, standing decisions…"
          className="w-full rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)] disabled:bg-[#FAFAFA]"
        />
      </Section>

      <Section
        title="3 · Members"
        subtitle="Flag members who should stay on next cycle and leave a short note about what each brings."
      >
        {members.length === 0 ? (
          <Empty>No members on file.</Empty>
        ) : (
          <ul className="divide-y divide-[var(--color-ldp-line)] rounded-lg border border-[var(--color-ldp-line)] bg-white">
            {members.map((m) => {
              const v = memberNotes[m.name] ?? { note: "", keep_on_committee: true };
              return (
                <li key={m.name} className="p-3">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                        {m.name}
                      </div>
                      <div className="text-xs text-[var(--color-ldp-ink-700)]">{m.role}</div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={v.keep_on_committee}
                        disabled={readOnly}
                        onChange={(e) =>
                          setMemberNote(m.name, { keep_on_committee: e.target.checked })
                        }
                        className="size-3.5"
                      />
                      <span
                        className={
                          v.keep_on_committee
                            ? "font-semibold text-emerald-700"
                            : "text-[var(--color-ldp-ink-700)]"
                        }
                      >
                        Recommend for next cycle
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={v.note}
                    disabled={readOnly}
                    onChange={(e) => setMemberNote(m.name, { note: e.target.value })}
                    placeholder="Optional — what they bring, what they do well, what to rely on them for"
                    className="mt-2 w-full rounded border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)] disabled:bg-[#FAFAFA]"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section
        title="4 · Open tasks"
        subtitle="For every open task, decide: hand off to the next chair, close as obsolete, or escalate to LDP admin."
      >
        {openTasks.length === 0 ? (
          <Empty>No open tasks. Clean slate.</Empty>
        ) : (
          <ul className="divide-y divide-[var(--color-ldp-line)] rounded-lg border border-[var(--color-ldp-line)] bg-white">
            {openTasks.map((t) => {
              const current = dispositions[t.id] ?? null;
              return (
                <li key={t.id} className="flex flex-wrap items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-[var(--color-ldp-navy-900)]">{t.title}</div>
                    {t.assigned_to_name && (
                      <div className="text-[10px] text-[var(--color-ldp-ink-700)]">
                        Assigned to {t.assigned_to_name}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {(["HAND_OFF", "CLOSE", "ESCALATE"] as TaskDisposition[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          if (readOnly) return;
                          setDisposition(t.id, current === d ? null : d);
                        }}
                        disabled={readOnly}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest disabled:opacity-50 ${
                          current === d
                            ? d === "HAND_OFF"
                              ? "bg-emerald-600 text-white"
                              : d === "CLOSE"
                                ? "bg-[var(--color-ldp-ink-700)] text-white"
                                : "bg-[var(--color-ldp-red)] text-white"
                            : "border border-[var(--color-ldp-line)] bg-white text-[var(--color-ldp-ink-700)] hover:border-[var(--color-ldp-navy-700)]"
                        }`}
                      >
                        {d.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section
        title="5 · Note to your successor"
        subtitle="Personal, unstructured. 'Avoid scheduling Tuesdays during session.'"
      >
        <textarea
          value={successorNote}
          onChange={(e) => setSuccessorNote(e.target.value)}
          onBlur={() => !readOnly && persistNow({ chair_note_to_successor: successorNote })}
          disabled={readOnly}
          rows={5}
          placeholder="What would you tell yourself on day one of this role?"
          className="w-full rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)] disabled:bg-[#FAFAFA]"
        />
      </Section>

      <div className="sticky bottom-0 -mx-6 border-t border-[var(--color-ldp-line)] bg-white px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[var(--color-ldp-ink-700)]">
            {saveHint && <span className="text-emerald-700">{saveHint}</span>}
            {error && <span className="text-[var(--color-ldp-red)]">{error}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {isDraft && (
              <>
                <button
                  type="button"
                  onClick={() => persistNow()}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
                >
                  <Save aria-hidden="true" className="size-3.5" />
                  Save draft
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
                >
                  <Send aria-hidden="true" className="size-3.5" />
                  Submit for review
                </button>
              </>
            )}
            {isSubmitted && (
              <>
                <button
                  type="button"
                  onClick={handleReopen}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
                >
                  Re-open to draft
                </button>
                <button
                  type="button"
                  onClick={handleLock}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Lock aria-hidden="true" className="size-3.5" />
                  Lock package (admin)
                </button>
              </>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
                Locked
                {pkg.locked_at && ` · ${new Date(pkg.locked_at).toLocaleDateString()}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBanner({ status }: { status: PackageStatus }) {
  const label =
    status === "DRAFT"
      ? "Draft · your working copy"
      : status === "SUBMITTED"
        ? "Submitted · awaiting admin lock"
        : status === "LOCKED"
          ? "Locked · permanent record"
          : "Archived";
  const bg =
    status === "DRAFT"
      ? "bg-[var(--color-ldp-navy-800)]"
      : status === "SUBMITTED"
        ? "bg-[var(--color-ldp-gold)] text-[var(--color-ldp-navy-900)]"
        : status === "LOCKED"
          ? "bg-emerald-600"
          : "bg-[var(--color-ldp-ink-700)]";
  const text = status === "SUBMITTED" ? "" : "text-white";
  return (
    <div className={`rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest ${bg} ${text}`}>
      {label}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2">
        <h2 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-4 text-xs text-[var(--color-ldp-ink-700)]">
      {children}
    </div>
  );
}

