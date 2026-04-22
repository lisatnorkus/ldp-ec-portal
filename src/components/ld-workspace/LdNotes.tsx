"use client";

import { useState, useTransition } from "react";
import { Pin, PinOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import {
  archiveNote,
  createNote,
  togglePinNote,
  updateNote,
} from "./note-actions";
import type { LdNote } from "@/lib/db/ld-notes";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.round(months / 12);
  return `${years}y ago`;
}

export function LdNotes({
  ldNumber,
  notes,
}: {
  ldNumber: number;
  notes: LdNote[];
}) {
  const { profile, hydrated } = useUserProfile();
  const [composing, setComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canWrite = hydrated && !!profile.display_name;
  const currentName = profile.display_name ?? "";

  function startNew() {
    setEditingId(null);
    setBody("");
    setError(null);
    setComposing(true);
  }

  function startEdit(n: LdNote) {
    setEditingId(n.id);
    setBody(n.body);
    setError(null);
    setComposing(true);
  }

  function cancel() {
    setComposing(false);
    setEditingId(null);
    setBody("");
    setError(null);
  }

  function submit() {
    if (!body.trim()) {
      setError("Can't save an empty note.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = editingId
        ? await updateNote(editingId, ldNumber, body)
        : await createNote(ldNumber, body, {
            name: currentName,
            role: profile.role,
            ld: profile.ld_number,
          });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      cancel();
    });
  }

  function handleTogglePin(n: LdNote) {
    startTransition(async () => {
      await togglePinNote(n.id, ldNumber, !n.is_pinned);
    });
  }

  function handleArchive(n: LdNote) {
    if (!confirm("Archive this note? It won't be visible anymore, but it's kept in the history log.")) return;
    startTransition(async () => {
      await archiveNote(n.id, ldNumber);
    });
  }

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          LD Notes · {notes.length}
        </h2>
        {!composing && canWrite && (
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            Add note
          </button>
        )}
      </div>

      {composing && (
        <div className="mb-3 rounded-lg border-2 border-[var(--color-ldp-navy-800)] bg-white p-4">
          <label htmlFor="note-body" className="sr-only">
            Note body
          </label>
          <textarea
            id="note-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What should the next chair know? What happened at a meeting? What's on your mind?"
            rows={4}
            className="w-full rounded border border-[var(--color-ldp-line)] bg-white p-3 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-xs text-[var(--color-ldp-red)]">{error}</p>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-[11px] text-[var(--color-ldp-ink-700)]">
              {editingId ? "Editing note" : `Posting as ${currentName}`}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancel}
                disabled={isPending}
                className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={isPending || !body.trim()}
                className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
              >
                {isPending ? "Saving…" : editingId ? "Save" : "Post note"}
              </button>
            </div>
          </div>
        </div>
      )}

      {!canWrite && !composing && (
        <div className="mb-3 rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-3 text-xs text-[var(--color-ldp-ink-700)]">
          Set your name on the dashboard to post notes. Reading is open to anyone.
        </div>
      )}

      {notes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-6 text-center text-sm text-[var(--color-ldp-ink-700)]">
          No notes yet. The first note becomes the start of this LD&apos;s memory.
        </div>
      ) : (
        <ul className="space-y-2">
          {notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              canEdit={canWrite && n.author_name === currentName}
              onEdit={() => startEdit(n)}
              onTogglePin={() => handleTogglePin(n)}
              onArchive={() => handleArchive(n)}
              disabled={isPending}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function NoteCard({
  note,
  canEdit,
  onEdit,
  onTogglePin,
  onArchive,
  disabled,
}: {
  note: LdNote;
  canEdit: boolean;
  onEdit: () => void;
  onTogglePin: () => void;
  onArchive: () => void;
  disabled: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const long = note.body.length > 240;
  const displayed = long && !expanded ? note.body.slice(0, 240) + "…" : note.body;
  return (
    <li
      className={`relative rounded-lg border bg-white p-4 transition-colors ${
        note.is_pinned
          ? "border-[var(--color-ldp-gold)]"
          : "border-[var(--color-ldp-line)]"
      }`}
    >
      {note.is_pinned && (
        <span className="absolute -top-2 left-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
          <Pin aria-hidden="true" className="size-3" /> Pinned
        </span>
      )}
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        {displayed}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-[11px] font-medium text-[var(--color-ldp-navy-700)] hover:underline"
        >
          {expanded ? "Collapse" : "Read more"}
        </button>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--color-ldp-ink-700)]">
        <div>
          <span className="font-semibold text-[var(--color-ldp-navy-900)]">
            {note.author_name ?? "Anonymous"}
          </span>
          {note.author_role && (
            <span className="ml-1">
              · {note.author_role.replace(/_/g, " ").toLowerCase()}
            </span>
          )}
          {note.author_ld != null && <span> · LD{note.author_ld}</span>}
          <span className="ml-2">· {relativeTime(note.created_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePin}
            disabled={disabled}
            aria-label={note.is_pinned ? "Unpin note" : "Pin note"}
            className="inline-flex items-center gap-1 rounded text-[var(--color-ldp-ink-700)] hover:text-[var(--color-ldp-gold)] disabled:opacity-50"
          >
            {note.is_pinned ? (
              <PinOff aria-hidden="true" className="size-3.5" />
            ) : (
              <Pin aria-hidden="true" className="size-3.5" />
            )}
          </button>
          {canEdit && (
            <>
              <button
                type="button"
                onClick={onEdit}
                disabled={disabled}
                aria-label="Edit note"
                className="rounded text-[var(--color-ldp-ink-700)] hover:text-[var(--color-ldp-navy-700)] disabled:opacity-50"
              >
                <Pencil aria-hidden="true" className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={onArchive}
                disabled={disabled}
                aria-label="Archive note"
                className="rounded text-[var(--color-ldp-ink-700)] hover:text-[var(--color-ldp-red)] disabled:opacity-50"
              >
                <Trash2 aria-hidden="true" className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

