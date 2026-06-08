"use client";

import { useState, useTransition } from "react";
import {
  Calendar,
  ExternalLink,
  FileText,
  Lightbulb,
  Link2,
  ListChecks,
  Paperclip,
  Pin,
  PinOff,
  Scale,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PostType, WorkspacePost } from "@/lib/db/workspace-shared";
import { deletePost, togglePostPin } from "./workspace-actions";
import { ActionItemCard } from "./ActionItemCard";

const TYPE_ICON: Record<PostType, LucideIcon> = {
  AGENDA: Calendar,
  ACTION_ITEM: ListChecks,
  NOTES: FileText,
  DECISION: Scale,
  IDEA: Lightbulb,
  LINK: Link2,
  FILE: Paperclip,
};

const TYPE_ACCENT: Record<PostType, string> = {
  AGENDA: "var(--color-ldp-navy-700)",
  ACTION_ITEM: "var(--color-ldp-gold)",
  NOTES: "#64748b",
  DECISION: "#0891b2",
  IDEA: "#a855f7",
  LINK: "#059669",
  FILE: "#0E4C9E",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMeetingDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function PostList({
  posts,
  committeeCode,
  myName,
  memberNamesById,
  onError,
}: {
  posts: WorkspacePost[];
  committeeCode: string;
  myName: string;
  memberNamesById: Record<string, string>;
  onError: (msg: string | null) => void;
}) {
  return (
    <div className="space-y-3">
      {posts.map((p) =>
        p.post_type === "ACTION_ITEM" ? (
          <ActionItemCard
            key={p.id}
            post={p}
            committeeCode={committeeCode}
            myName={myName}
            memberNamesById={memberNamesById}
            onError={onError}
            renderHeader={(actions) => (
              <PostHeader post={p} committeeCode={committeeCode} actions={actions} onError={onError} />
            )}
          />
        ) : (
          <GenericPost
            key={p.id}
            post={p}
            committeeCode={committeeCode}
            onError={onError}
          />
        )
      )}
    </div>
  );
}

function GenericPost({
  post,
  committeeCode,
  onError,
}: {
  post: WorkspacePost;
  committeeCode: string;
  onError: (msg: string | null) => void;
}) {
  const Icon = TYPE_ICON[post.post_type];
  const accent = TYPE_ACCENT[post.post_type];
  const isAgenda = post.post_type === "AGENDA";
  const isLink = post.post_type === "LINK" || post.post_type === "FILE";
  return (
    <article
      className="overflow-hidden rounded-lg border bg-white shadow-sm"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <PostHeader post={post} committeeCode={committeeCode} onError={onError} />

      <div className="px-4 pb-4">
        {isAgenda && post.meeting_date && (
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            <Icon aria-hidden="true" className="size-4" style={{ color: accent }} />
            {formatMeetingDate(post.meeting_date)}
            {post.meeting_location && (
              <span className="text-xs font-medium text-[var(--color-ldp-ink-700)]">
                · {post.meeting_location}
              </span>
            )}
          </div>
        )}

        {post.title && (
          <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
            {post.title}
          </h3>
        )}

        {post.content_md && (
          <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--color-ldp-ink-900)]">
            {post.content_md}
          </p>
        )}

        {isLink && post.link_url && (
          <a
            href={post.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-2.5 py-1 text-xs font-semibold text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
          >
            <ExternalLink aria-hidden="true" className="size-3" />
            Open
          </a>
        )}
      </div>
    </article>
  );
}

// Header is shared between GenericPost and ActionItemCard so author /
// pinned / type chip / pin & delete controls render consistently.
export function PostHeader({
  post,
  committeeCode,
  actions,
  onError,
}: {
  post: WorkspacePost;
  committeeCode: string;
  actions?: React.ReactNode;
  onError: (msg: string | null) => void;
}) {
  const Icon = TYPE_ICON[post.post_type];
  const accent = TYPE_ACCENT[post.post_type];
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleTogglePin() {
    startTransition(async () => {
      const res = await togglePostPin(post.id, committeeCode, !post.is_pinned);
      if (!res.ok) onError(res.error);
    });
  }

  function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const res = await deletePost(post.id, committeeCode);
      if (!res.ok) onError(res.error);
    });
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-ldp-ink-700)]">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
          style={{ backgroundColor: accent }}
        >
          <Icon aria-hidden="true" className="size-3" />
          {post.post_type.replace("_", " ").toLowerCase()}
        </span>
        {post.is_pinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-gold)]/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
            <Pin aria-hidden="true" className="size-3" />
            Pinned
          </span>
        )}
        <span>
          <strong className="text-[var(--color-ldp-navy-900)]">
            {post.author_display_name}
          </strong>{" "}
          · {formatDate(post.created_at)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {actions}
        <button
          type="button"
          onClick={handleTogglePin}
          disabled={isPending}
          aria-label={post.is_pinned ? "Unpin" : "Pin"}
          title={post.is_pinned ? "Unpin" : "Pin"}
          className="rounded p-1 text-[var(--color-ldp-ink-700)] hover:bg-[#FAFBFC] hover:text-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {post.is_pinned ? (
            <PinOff aria-hidden="true" className="size-3.5" />
          ) : (
            <Pin aria-hidden="true" className="size-3.5" />
          )}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          aria-label={confirming ? "Confirm delete" : "Delete"}
          title={confirming ? "Click again to confirm" : "Delete"}
          className={`rounded p-1 transition-colors disabled:opacity-50 ${
            confirming
              ? "bg-[var(--color-ldp-red)] text-white"
              : "text-[var(--color-ldp-ink-700)] hover:bg-[#FFF5F6] hover:text-[var(--color-ldp-red)]"
          }`}
          onBlur={() => setConfirming(false)}
        >
          <Trash2 aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </header>
  );
}
