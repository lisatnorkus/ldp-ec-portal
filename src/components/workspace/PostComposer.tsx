"use client";

import { useState, useTransition } from "react";
import { Calendar, FileText, Lightbulb, Link2, ListChecks, MessageSquare, Paperclip, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { type PostType, type WorkspaceAssignable } from "@/lib/db/workspace-shared";
import { createPost } from "./workspace-actions";

const TYPE_OPTIONS: { value: PostType; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "AGENDA", label: "Agenda / meeting", hint: "Set a meeting date and what you'll cover.", icon: Calendar },
  { value: "ACTION_ITEM", label: "Action item", hint: "Assign work — each assignee accepts or rejects with a reason.", icon: ListChecks },
  { value: "NOTES", label: "Notes / minutes", hint: "Running notes or post-meeting minutes (link to a meeting date).", icon: FileText },
  { value: "DECISION", label: "Decision", hint: "Capture what the committee decided so it's findable later.", icon: Scale },
  { value: "IDEA", label: "Idea", hint: "Half-formed thought worth keeping. No commitment.", icon: Lightbulb },
  { value: "LINK", label: "Link", hint: "External URL — drive doc, news article, dashboard.", icon: Link2 },
  { value: "FILE", label: "File", hint: "Drive / Dropbox URL for a doc you want at hand.", icon: Paperclip },
];

export function PostComposer({
  committeeCode,
  author,
  assignables,
  onClose,
  onError,
}: {
  committeeCode: string;
  author: { display_name: string };
  assignables: WorkspaceAssignable[];
  onClose: () => void;
  onError: (msg: string | null) => void;
}) {
  const [postType, setPostType] = useState<PostType>("AGENDA");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const meta = TYPE_OPTIONS.find((t) => t.value === postType)!;

  function toggleAssignee(id: string) {
    setAssigneeIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  }

  function submit() {
    onError(null);
    if (postType === "AGENDA" && !meetingDate) {
      onError("Pick a meeting date.");
      return;
    }
    if (postType === "ACTION_ITEM") {
      if (!title.trim()) {
        onError("Action items need a title.");
        return;
      }
      if (assigneeIds.length === 0) {
        onError("Assign the action item to at least one person.");
        return;
      }
    }
    if (postType === "LINK" && !linkUrl.trim()) {
      onError("Link URL is required.");
      return;
    }
    startTransition(async () => {
      const res = await createPost(
        {
          committee_code: committeeCode,
          post_type: postType,
          title: title.trim() || undefined,
          content_md: content.trim() || undefined,
          meeting_date: postType === "AGENDA" || postType === "NOTES" ? meetingDate || null : null,
          meeting_location: postType === "AGENDA" ? meetingLocation.trim() || null : null,
          link_url: postType === "LINK" || postType === "FILE" ? linkUrl.trim() || null : null,
          is_pinned: isPinned,
          assignee_member_ids: postType === "ACTION_ITEM" ? assigneeIds : undefined,
        },
        { display_name: author.display_name }
      );
      if (!res.ok) {
        onError(res.error);
        return;
      }
      setTitle("");
      setContent("");
      setMeetingDate("");
      setMeetingLocation("");
      setLinkUrl("");
      setIsPinned(false);
      setAssigneeIds([]);
      onClose();
    });
  }

  const showMeetingFields = postType === "AGENDA" || postType === "NOTES";
  const showLinkField = postType === "LINK" || postType === "FILE";
  const showAssignees = postType === "ACTION_ITEM";

  return (
    <div className="mb-4 rounded-lg border-2 border-[var(--color-ldp-navy-800)] bg-white p-4">
      <div className="mb-3">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-700)]">
          New post
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {TYPE_OPTIONS.map((t) => {
            const Icon = t.icon;
            const active = postType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setPostType(t.value)}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  active
                    ? "border-[var(--color-ldp-navy-800)] bg-[var(--color-ldp-navy-800)] text-white"
                    : "border-[var(--color-ldp-line)] bg-white text-[var(--color-ldp-ink-700)] hover:border-[var(--color-ldp-navy-700)]"
                }`}
              >
                <Icon aria-hidden="true" className="size-3" />
                {t.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] italic text-[var(--color-ldp-ink-700)]">{meta.hint}</p>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            postType === "ACTION_ITEM"
              ? "What needs doing? (required)"
              : postType === "DECISION"
                ? "What was decided?"
                : "Title (optional)"
          }
          className="w-full rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
          autoFocus
        />

        {showMeetingFields && (
          <div className="grid gap-2 md:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                Meeting date {postType === "AGENDA" && <span className="text-[var(--color-ldp-red)]">*</span>}
              </span>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
              />
            </label>
            {postType === "AGENDA" && (
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  Location (optional)
                </span>
                <input
                  type="text"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  placeholder="Zoom · HQ · etc."
                  className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
                />
              </label>
            )}
          </div>
        )}

        {showLinkField && (
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
          />
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={postType === "AGENDA" ? 5 : 3}
          placeholder={
            postType === "AGENDA"
              ? "Agenda items (one per line). Markdown supported."
              : postType === "NOTES"
                ? "Notes or minutes. Markdown supported."
                : "Details (optional). Markdown supported."
          }
          className="w-full rounded border border-[var(--color-ldp-line)] bg-white p-3 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
        />

        {showAssignees && (
          <div>
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Assign to <span className="text-[var(--color-ldp-red)]">*</span> · pick one or more
            </div>
            {assignables.length === 0 ? (
              <p className="rounded border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-xs italic text-[var(--color-ldp-ink-700)]">
                No committee members on file yet. Add members on the committee page first.
              </p>
            ) : (
              <div className="grid gap-1 md:grid-cols-2">
                {assignables.map((a) => {
                  const checked = assigneeIds.includes(a.member_id);
                  return (
                    <label
                      key={a.member_id}
                      className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm transition-colors ${
                        checked
                          ? "border-[var(--color-ldp-navy-800)] bg-[#EFF6FF]"
                          : "border-[var(--color-ldp-line)] bg-white hover:border-[var(--color-ldp-navy-700)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAssignee(a.member_id)}
                        className="size-4 accent-[var(--color-ldp-navy-800)]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="font-medium text-[var(--color-ldp-navy-900)]">{a.name}</span>
                        <span className="ml-1 text-[11px] text-[var(--color-ldp-ink-700)]">· {a.role}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <label className="flex items-center gap-2 text-xs text-[var(--color-ldp-ink-700)]">
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            className="size-4 accent-[var(--color-ldp-navy-800)]"
          />
          Pin to top
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-2">
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
          disabled={isPending}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {isPending ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
