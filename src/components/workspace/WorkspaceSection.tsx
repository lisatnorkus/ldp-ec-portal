"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Pin, Plus } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import {
  POST_TYPE_LABEL,
  type PostType,
  type WorkspaceAssignable,
  type WorkspacePost,
} from "@/lib/db/workspace-shared";
import { PostComposer } from "./PostComposer";
import { PostList } from "./PostList";

const FILTER_ORDER: (PostType | "ALL")[] = [
  "ALL",
  "AGENDA",
  "ACTION_ITEM",
  "NOTES",
  "DECISION",
  "IDEA",
  "LINK",
  "FILE",
];

// Names used in filter pills. Slightly tighter than the canonical
// POST_TYPE_LABEL because filter chips are tight.
const FILTER_LABEL: Record<PostType | "ALL", string> = {
  ALL: "All",
  AGENDA: "Agendas",
  NOTES: "Notes",
  IDEA: "Ideas",
  DECISION: "Decisions",
  ACTION_ITEM: "Action items",
  LINK: "Links",
  FILE: "Files",
};

export function WorkspaceSection({
  committeeCode,
  posts,
  assignables,
  memberNamesById,
}: {
  committeeCode: string;
  posts: WorkspacePost[];
  assignables: WorkspaceAssignable[];
  memberNamesById: Record<string, string>;
}) {
  const { profile, hydrated } = useUserProfile();
  const [filter, setFilter] = useState<PostType | "ALL">("ALL");
  const [composing, setComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canWrite = hydrated && !!profile.display_name;
  const myName = profile.display_name ?? "";

  const filtered = useMemo(() => {
    if (filter === "ALL") return posts;
    return posts.filter((p) => p.post_type === filter);
  }, [posts, filter]);

  const counts = useMemo(() => {
    const out: Record<string, number> = { ALL: posts.length };
    for (const p of posts) {
      out[p.post_type] = (out[p.post_type] ?? 0) + 1;
    }
    return out;
  }, [posts]);

  const pinnedCount = posts.filter((p) => p.is_pinned).length;
  const myOpenActionItems = useMemo(() => {
    if (!myName) return 0;
    let count = 0;
    for (const p of posts) {
      if (p.post_type !== "ACTION_ITEM") continue;
      for (const a of p.assignments) {
        if (
          memberNamesById[a.assignee_member_id] === myName &&
          a.status !== "DONE" &&
          a.status !== "REJECTED"
        ) {
          count += 1;
          break;
        }
      }
    }
    return count;
  }, [posts, myName, memberNamesById]);

  return (
    <section id="committee-workspace" className="mb-10 scroll-mt-24">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare
            aria-hidden="true"
            className="size-4 text-[var(--color-ldp-navy-800)]"
          />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Workspace
          </h2>
          {pinnedCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-gold)]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
              <Pin aria-hidden="true" className="size-3" />
              {pinnedCount} pinned
            </span>
          )}
          {myOpenActionItems > 0 && (
            <span className="rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
              {myOpenActionItems} on your plate
            </span>
          )}
        </div>
        {canWrite && !composing && (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            Post to workspace
          </button>
        )}
      </div>

      {composing && (
        <PostComposer
          committeeCode={committeeCode}
          author={{ display_name: myName }}
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

      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTER_ORDER.map((f) => {
          if (f !== "ALL" && (counts[f] ?? 0) === 0) return null;
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                active
                  ? "border-[var(--color-ldp-navy-800)] bg-[var(--color-ldp-navy-800)] text-white"
                  : "border-[var(--color-ldp-line)] bg-white text-[var(--color-ldp-ink-700)] hover:border-[var(--color-ldp-navy-700)]"
              }`}
            >
              {FILTER_LABEL[f]}
              <span
                className={`ml-1 ${active ? "text-white/80" : "text-[var(--color-ldp-ink-700)]"}`}
              >
                {counts[f] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {posts.length === 0 ? (
        <EmptyHero
          canWrite={canWrite}
          onCompose={() => setComposing(true)}
        />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-6 text-center text-sm text-[var(--color-ldp-ink-700)]">
          No {POST_TYPE_LABEL[filter as PostType]?.toLowerCase() ?? ""} posts yet.
        </div>
      ) : (
        <PostList
          posts={filtered}
          committeeCode={committeeCode}
          myName={myName}
          memberNamesById={memberNamesById}
          onError={setError}
        />
      )}
    </section>
  );
}

function EmptyHero({
  canWrite,
  onCompose,
}: {
  canWrite: boolean;
  onCompose: () => void;
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
            <MessageSquare aria-hidden="true" className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
              Workspace is empty
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              {canWrite
                ? "Set the next meeting, drop an agenda, or assign the first action item."
                : "Set your name on the dashboard to start posting."}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              Agendas, running notes, ideas, decisions, action items, links, files — one
              committee message board. Posts stay with the committee so the next chair walks
              in with everything.
            </p>
            {canWrite && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onCompose}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Post to workspace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
