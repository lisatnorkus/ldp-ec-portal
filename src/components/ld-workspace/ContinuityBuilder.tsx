"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Lock, Send, Save, Star } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type {
  LdContinuityPackage,
  PackageStatus,
  PrecinctHandoffNote,
  TaskDisposition,
} from "@/lib/db/ld-continuity";
import type { LdTask } from "@/lib/db/ld-tasks";
import type { LdContact } from "@/lib/db/ld-contacts";
import {
  lockPackage,
  reopenToDraft,
  saveDraft,
  submitPackage,
} from "./continuity-actions";

type Precinct = {
  precinct: string;
  strategy: string | null;
  total_voters: number | null;
  d_margin_pct: number | null;
  pcCount: number;
};

export function ContinuityBuilder({
  ldNumber,
  pkg,
  openTasks,
  contacts,
  precincts,
}: {
  ldNumber: number;
  pkg: LdContinuityPackage;
  openTasks: LdTask[];
  contacts: LdContact[];
  precincts: Precinct[];
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
  const [resource, setResource] = useState(pkg.resource_notes ?? "");
  const [successorNote, setSuccessorNote] = useState(pkg.chair_note_to_successor ?? "");
  const [keyIds, setKeyIds] = useState<string[]>(pkg.key_contact_ids ?? []);
  const [dispositions, setDispositions] = useState<Record<string, TaskDisposition>>(
    pkg.task_dispositions ?? {}
  );
  const [precinctNotes, setPrecinctNotes] = useState<Record<string, PrecinctHandoffNote>>(
    pkg.precinct_notes ?? {}
  );
  const [saveHint, setSaveHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentKeys = useMemo(() => {
    if (pkg.key_contact_ids.length > 0 || keyIds.length > 0) {
      return contacts.filter((c) => keyIds.includes(c.id));
    }
    // Seed from the is_key_relationship flag if nothing has been
    // explicitly selected yet.
    return contacts.filter((c) => c.is_key_relationship);
  }, [contacts, keyIds, pkg.key_contact_ids]);

  const readOnly = !isDraft;

  function persistNow(extra?: Partial<{ state_narrative: string; resource_notes: string; chair_note_to_successor: string }>) {
    setError(null);
    setSaveHint("Saving…");
    startTransition(async () => {
      const res = await saveDraft(pkg.id, ldNumber, {
        state_narrative: extra?.state_narrative ?? state,
        resource_notes: extra?.resource_notes ?? resource,
        chair_note_to_successor: extra?.chair_note_to_successor ?? successorNote,
        key_contact_ids: keyIds,
        task_dispositions: dispositions,
        precinct_notes: precinctNotes,
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

  function toggleKey(contactId: string) {
    setKeyIds((prev) =>
      prev.includes(contactId) ? prev.filter((x) => x !== contactId) : [...prev, contactId]
    );
  }

  function setDisposition(taskId: string, value: TaskDisposition | null) {
    setDispositions((prev) => {
      const next = { ...prev };
      if (value == null) delete next[taskId];
      else next[taskId] = value;
      return next;
    });
  }

  function setPrecinctNote(code: string, patch: Partial<PrecinctHandoffNote>) {
    setPrecinctNotes((prev) => ({
      ...prev,
      [code]: {
        note: patch.note ?? prev[code]?.note ?? "",
        status: patch.status ?? prev[code]?.status ?? "",
      },
    }));
  }

  function handleSubmit() {
    if (!confirm("Submit this package for admin review? You won't be able to edit after submit.")) return;
    persistNow();
    startTransition(async () => {
      const res = await submitPackage(pkg.id, ldNumber);
      if (!res.ok) setError(res.error);
    });
  }

  function handleLock() {
    if (!confirm("Lock this package? This is final — the incoming chair will see the locked version and dispositions apply to tasks.")) return;
    startTransition(async () => {
      const res = await lockPackage(pkg.id, ldNumber, author);
      if (!res.ok) setError(res.error);
    });
  }

  function handleReopen() {
    if (!confirm("Re-open this package back to DRAFT for edits?")) return;
    startTransition(async () => {
      const res = await reopenToDraft(pkg.id, ldNumber);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <div className="space-y-8">
      {/* Status banner */}
      <StatusBanner status={pkg.status} />

      {/* Section 1: State of the LD */}
      <Section title="1 · State of the LD" subtitle="How is the district? What worked this cycle? What should the next chair know on day one?">
        <textarea
          value={state}
          onChange={(e) => setState(e.target.value)}
          onBlur={() => !readOnly && persistNow({ state_narrative: state })}
          disabled={readOnly}
          rows={8}
          placeholder="Write your state-of-the-LD in your own voice…"
          className="w-full rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)] disabled:bg-[#FAFAFA]"
        />
      </Section>

      {/* Section 2: Key contacts */}
      <Section title="2 · Key contacts" subtitle="Flag the people the next chair must know. Defaults to anyone marked as a key relationship in the pipeline.">
        {contacts.length === 0 ? (
          <Empty>No prospects in the pipeline yet.</Empty>
        ) : (
          <ul className="divide-y divide-[var(--color-ldp-line)] rounded-lg border border-[var(--color-ldp-line)] bg-white">
            {contacts.map((c) => {
              const selected = keyIds.length > 0 ? keyIds.includes(c.id) : c.is_key_relationship;
              return (
                <li key={c.id} className="flex items-center gap-3 p-3 text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (readOnly) return;
                      toggleKey(c.id);
                    }}
                    disabled={readOnly}
                    aria-label={selected ? "Unflag key" : "Flag as key"}
                    className={`inline-flex size-6 items-center justify-center rounded-full border disabled:opacity-50 ${
                      selected
                        ? "border-[var(--color-ldp-gold)] bg-[var(--color-ldp-gold)] text-[var(--color-ldp-navy-900)]"
                        : "border-[var(--color-ldp-line)] text-[var(--color-ldp-ink-700)]"
                    }`}
                  >
                    <Star aria-hidden="true" className={`size-3.5 ${selected ? "fill-[var(--color-ldp-navy-900)]" : ""}`} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[var(--color-ldp-navy-900)]">
                      {c.first_name} {c.last_name}
                    </div>
                    <div className="text-xs text-[var(--color-ldp-ink-700)]">
                      {c.pipeline_stage.replace(/_/g, " ").toLowerCase()}
                      {c.last_contacted_at && (
                        <> · last contact {new Date(c.last_contacted_at).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2 text-[11px] text-[var(--color-ldp-ink-700)]">
          {currentKeys.length} flagged.
        </p>
      </Section>

      {/* Section 3: Open tasks → dispositions */}
      <Section title="3 · Open tasks" subtitle="For every open task, decide: hand off to the next chair, close as obsolete, or escalate to LDP admin.">
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
                    {t.due_date && (
                      <div className="text-[10px] text-[var(--color-ldp-ink-700)]">
                        due {new Date(t.due_date).toLocaleDateString()}
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

      {/* Section 4: Precinct status */}
      <Section title="4 · Precinct status" subtitle="Add a note for any precinct with history worth carrying forward.">
        {precincts.length === 0 ? (
          <Empty>No precinct data available.</Empty>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
            <table className="w-full text-xs">
              <thead className="bg-[#FAFAFA] text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                <tr>
                  <th className="px-3 py-2 text-left">Precinct</th>
                  <th className="px-3 py-2 text-left">Strategy</th>
                  <th className="px-3 py-2 text-left">PCs</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-ldp-line)]">
                {precincts.map((p) => {
                  const code = p.precinct.match(/L\d+\s*$/i)?.[0] ?? p.precinct;
                  const v = precinctNotes[code] ?? { note: "", status: "" };
                  return (
                    <tr key={p.precinct}>
                      <td className="px-3 py-2 font-medium text-[var(--color-ldp-navy-900)]">
                        {p.precinct}
                      </td>
                      <td className="px-3 py-2 text-[var(--color-ldp-ink-700)]">{p.strategy ?? "—"}</td>
                      <td className="px-3 py-2 text-[var(--color-ldp-ink-700)]">{p.pcCount}</td>
                      <td className="px-3 py-2">
                        <select
                          value={v.status}
                          disabled={readOnly}
                          onChange={(e) =>
                            setPrecinctNote(code, { status: e.target.value as PrecinctHandoffNote["status"] })
                          }
                          className="rounded border border-[var(--color-ldp-line)] bg-white px-2 py-1 text-[11px] disabled:bg-[#FAFAFA]"
                        >
                          <option value="">—</option>
                          <option value="DARK">Dark</option>
                          <option value="COVERED">Covered</option>
                          <option value="STRONG">Strong</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={v.note}
                          disabled={readOnly}
                          onChange={(e) => setPrecinctNote(code, { note: e.target.value })}
                          placeholder="Optional"
                          className="w-full rounded border border-[var(--color-ldp-line)] bg-white px-2 py-1 text-[11px] disabled:bg-[#FAFAFA]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Section 5: Pipeline snapshot (auto on submit) */}
      <Section title="5 · Active recruiting pipeline" subtitle={isLocked ? "Frozen snapshot from the moment you submitted." : "Auto-captured on submit — Warm + Committed contacts."}>
        {pkg.pipeline_snapshot.length > 0 ? (
          <ul className="divide-y divide-[var(--color-ldp-line)] rounded-lg border border-[var(--color-ldp-line)] bg-white">
            {pkg.pipeline_snapshot.map((row, i) => (
              <li key={i} className="p-3 text-sm">
                <span className="font-medium text-[var(--color-ldp-navy-900)]">
                  {row.first_name} {row.last_name}
                </span>
                <span className="ml-2 text-xs text-[var(--color-ldp-ink-700)]">
                  {row.pipeline_stage.replace(/_/g, " ").toLowerCase()}
                  {row.last_contacted_at && <> · last contact {new Date(row.last_contacted_at).toLocaleDateString()}</>}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>{isLocked ? "Pipeline was empty at submission." : "Populates on submit."}</Empty>
        )}
      </Section>

      {/* Section 6: Resource notes */}
      <Section title="6 · Resource notes" subtitle="Meeting venues, parking, A/V, recurring vendors, where credentials live.">
        <textarea
          value={resource}
          onChange={(e) => setResource(e.target.value)}
          onBlur={() => !readOnly && persistNow({ resource_notes: resource })}
          disabled={readOnly}
          rows={5}
          placeholder="Meeting space we use at the church on 4th, parking is rough — arrive by 6:40…"
          className="w-full rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)] disabled:bg-[#FAFAFA]"
        />
      </Section>

      {/* Section 7: Personal note */}
      <Section title="7 · Note to your successor" subtitle="Personal, unstructured. 'Don't schedule anything the week before Derby.'">
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

      {/* Actions */}
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
