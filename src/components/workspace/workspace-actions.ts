"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  resolveMemberIdByDisplayName,
  type AssignmentStatus,
  type PostType,
} from "@/lib/db/workspace";

type Author = {
  display_name: string;
};

function committeePath(code: string): string {
  return `/committees/${code.toLowerCase()}`;
}

export type CreatePostInput = {
  committee_code: string;
  post_type: PostType;
  title?: string;
  content_md?: string;
  tags?: string[];
  meeting_date?: string | null;
  meeting_location?: string | null;
  link_url?: string | null;
  is_pinned?: boolean;
  // For ACTION_ITEM: list of ec_members.id to assign.
  assignee_member_ids?: string[];
};

export async function createPost(
  input: CreatePostInput,
  author: Author
): Promise<{ ok: true; post_id: string } | { ok: false; error: string }> {
  const name = author.display_name.trim();
  if (!name) return { ok: false, error: "Set your name on the dashboard first." };

  // Light validation per type — composer should already enforce these
  // but the action is the security boundary.
  if (input.post_type === "AGENDA" && !input.meeting_date) {
    return { ok: false, error: "Meeting date is required for agenda posts." };
  }
  if (input.post_type === "ACTION_ITEM") {
    if (!input.title?.trim()) return { ok: false, error: "Action items need a title." };
    if (!input.assignee_member_ids || input.assignee_member_ids.length === 0) {
      return { ok: false, error: "Assign the action item to at least one person." };
    }
  }
  if (input.post_type === "LINK" && !input.link_url?.trim()) {
    return { ok: false, error: "Link URL is required." };
  }

  const supabase = await getSupabaseServer();
  const author_member_id = await resolveMemberIdByDisplayName(name);

  const { data: post, error } = await supabase
    .from("workspace_posts")
    .insert({
      committee_code: input.committee_code,
      author_member_id,
      author_display_name: name,
      post_type: input.post_type,
      title: input.title?.trim() || null,
      content_md: input.content_md?.trim() || null,
      tags: input.tags ?? [],
      meeting_date: input.meeting_date || null,
      meeting_location: input.meeting_location?.trim() || null,
      link_url: input.link_url?.trim() || null,
      is_pinned: input.is_pinned ?? false,
    })
    .select("id")
    .single();

  if (error || !post) return { ok: false, error: error?.message ?? "Insert failed." };

  if (input.post_type === "ACTION_ITEM" && input.assignee_member_ids) {
    const rows = input.assignee_member_ids.map((mid) => ({
      post_id: post.id,
      assignee_member_id: mid,
    }));
    const { error: aErr } = await supabase.from("post_assignments").insert(rows);
    if (aErr) {
      // Best-effort cleanup so an orphaned ACTION_ITEM with no assignees
      // doesn't sit in the list confusing everyone.
      await supabase.from("workspace_posts").delete().eq("id", post.id);
      return { ok: false, error: `Couldn't create assignments: ${aErr.message}` };
    }
  }

  revalidatePath(committeePath(input.committee_code));
  return { ok: true, post_id: post.id };
}

export async function togglePostPin(
  post_id: string,
  committee_code: string,
  is_pinned: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("workspace_posts")
    .update({ is_pinned })
    .eq("id", post_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(committee_code));
  return { ok: true };
}

export async function deletePost(
  post_id: string,
  committee_code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  // post_assignments cascade-deletes via FK.
  const { error } = await supabase.from("workspace_posts").delete().eq("id", post_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(committee_code));
  return { ok: true };
}

// ─── Action item responses ────────────────────────────────────────────

// Accept your own assignment. Status → ACCEPTED.
export async function acceptAssignment(
  assignment_id: string,
  committee_code: string,
  responder_display_name: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const member_id = await resolveMemberIdByDisplayName(responder_display_name);
  if (!member_id) {
    return {
      ok: false,
      error: "Couldn't match your name to an EC member record. Check your dashboard name.",
    };
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("post_assignments")
    .update({
      status: "ACCEPTED" as AssignmentStatus,
      rejection_reason: null,
      responded_at: new Date().toISOString(),
    })
    .eq("id", assignment_id)
    .eq("assignee_member_id", member_id)
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) {
    return { ok: false, error: "This assignment isn't yours to accept." };
  }
  revalidatePath(committeePath(committee_code));
  return { ok: true };
}

// Reject your own assignment. Rejection reason required — half the
// value of this workflow is the disagreement being visible.
export async function rejectAssignment(
  assignment_id: string,
  committee_code: string,
  responder_display_name: string,
  reason: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    return { ok: false, error: "Tell the assigner why — a reason is required." };
  }
  const member_id = await resolveMemberIdByDisplayName(responder_display_name);
  if (!member_id) {
    return {
      ok: false,
      error: "Couldn't match your name to an EC member record. Check your dashboard name.",
    };
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("post_assignments")
    .update({
      status: "REJECTED" as AssignmentStatus,
      rejection_reason: trimmedReason,
      responded_at: new Date().toISOString(),
    })
    .eq("id", assignment_id)
    .eq("assignee_member_id", member_id)
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) {
    return { ok: false, error: "This assignment isn't yours to reject." };
  }
  revalidatePath(committeePath(committee_code));
  return { ok: true };
}

// Move your assignment to IN_PROGRESS or DONE. Only allowed if already
// ACCEPTED — you can't fast-track from PENDING to DONE without
// acknowledging the task first.
export async function setAssignmentStatus(
  assignment_id: string,
  committee_code: string,
  responder_display_name: string,
  status: "IN_PROGRESS" | "DONE"
): Promise<{ ok: true } | { ok: false; error: string }> {
  const member_id = await resolveMemberIdByDisplayName(responder_display_name);
  if (!member_id) {
    return {
      ok: false,
      error: "Couldn't match your name to an EC member record. Check your dashboard name.",
    };
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("post_assignments")
    .update({
      status,
      responded_at: new Date().toISOString(),
    })
    .eq("id", assignment_id)
    .eq("assignee_member_id", member_id)
    .in("status", ["ACCEPTED", "IN_PROGRESS", "DONE"])
    .select("id");
  if (error) return { ok: false, error: error.message };
  if (!data || data.length === 0) {
    return { ok: false, error: "Accept the task first before moving it." };
  }
  revalidatePath(committeePath(committee_code));
  return { ok: true };
}
