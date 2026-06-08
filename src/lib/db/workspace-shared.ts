// Client-safe types + constants for the committee workspace. Pulled out
// of workspace.ts so client components can import these without
// dragging "server-only" / next/headers into the client bundle.
// Server fetchers (with their `import "server-only"` guard) live in
// workspace.ts and re-export from here.

export type PostType =
  | "AGENDA"
  | "NOTES"
  | "IDEA"
  | "DECISION"
  | "ACTION_ITEM"
  | "LINK"
  | "FILE";

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "DONE";

export type WorkspacePostRow = {
  id: string;
  committee_code: string;
  author_member_id: string | null;
  author_display_name: string;
  post_type: PostType;
  title: string | null;
  content_md: string | null;
  tags: string[];
  meeting_date: string | null;
  meeting_location: string | null;
  link_url: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type PostAssignmentRow = {
  id: string;
  post_id: string;
  assignee_member_id: string;
  status: AssignmentStatus;
  rejection_reason: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
};

// A post enriched with its assignments. Non-ACTION_ITEM posts carry an
// empty array. UI computes a rollup status from the per-assignee statuses.
export type WorkspacePost = WorkspacePostRow & {
  assignments: PostAssignmentRow[];
};

export type WorkspaceAssignable = {
  member_id: string;
  name: string;
  role: string;
};

// Roll up per-assignee statuses into a single label for list rendering.
export type RollupStatus =
  | "NO_ASSIGNEES"
  | "ALL_PENDING"
  | "ALL_DONE"
  | "ANY_REJECTED"
  | "IN_PROGRESS"
  | "MIXED";

export function rollupAssignmentStatus(
  assignments: PostAssignmentRow[]
): RollupStatus {
  if (assignments.length === 0) return "NO_ASSIGNEES";
  const statuses = assignments.map((a) => a.status);
  if (statuses.every((s) => s === "DONE")) return "ALL_DONE";
  if (statuses.every((s) => s === "PENDING")) return "ALL_PENDING";
  if (statuses.some((s) => s === "REJECTED")) return "ANY_REJECTED";
  if (
    statuses.some(
      (s) => s === "IN_PROGRESS" || s === "DONE" || s === "ACCEPTED"
    )
  )
    return "IN_PROGRESS";
  return "MIXED";
}

export const POST_TYPE_LABEL: Record<PostType, string> = {
  AGENDA: "Agenda / meeting",
  NOTES: "Notes / minutes",
  IDEA: "Idea",
  DECISION: "Decision",
  ACTION_ITEM: "Action item",
  LINK: "Link",
  FILE: "File",
};
