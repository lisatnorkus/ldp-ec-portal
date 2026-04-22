"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { TaskPriority, TaskStatus } from "@/lib/db/ld-tasks";

type Author = {
  name: string;
  role: string | null;
  ld: number | null;
};

function committeePath(code: string): string {
  return `/committees/${code.toLowerCase()}`;
}

// Notes --------------------------------------------------------------

export async function createCommitteeNote(
  code: string,
  body: string,
  author: Author
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Note body is empty." };
  if (!author.name.trim()) return { ok: false, error: "Set your name first." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("committee_notes").insert({
    committee_code: code,
    body: trimmed,
    author_name: author.name.trim(),
    author_role: author.role,
    author_ld: author.ld,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function updateCommitteeNote(
  id: string,
  code: string,
  body: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Note body is empty." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("committee_notes")
    .update({ body: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function toggleCommitteeNotePin(
  id: string,
  code: string,
  is_pinned: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("committee_notes")
    .update({ is_pinned, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function archiveCommitteeNote(
  id: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("committee_notes")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

// Tasks --------------------------------------------------------------

export async function createCommitteeTask(
  code: string,
  input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    due_date?: string | null;
    assigned_to_name?: string | null;
  },
  author: Author
): Promise<{ ok: true } | { ok: false; error: string }> {
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required." };
  if (!author.name.trim()) return { ok: false, error: "Set your name first." };
  const assignee = input.assigned_to_name?.trim() || null;
  const isSelfAssign = assignee != null && assignee === author.name.trim();
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("committee_tasks").insert({
    committee_code: code,
    title,
    description: input.description?.trim() || null,
    priority: input.priority ?? "MEDIUM",
    due_date: input.due_date || null,
    status: "OPEN",
    author_name: author.name.trim(),
    author_role: author.role,
    author_ld: author.ld,
    assigned_to_name: assignee,
    assigned_by_name: assignee ? author.name.trim() : null,
    accepted_at: isSelfAssign ? new Date().toISOString() : null,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function setCommitteeTaskStatus(
  id: string,
  code: string,
  status: TaskStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const patch: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  patch.completed_at = status === "DONE" ? new Date().toISOString() : null;
  const { error } = await supabase.from("committee_tasks").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function acceptCommitteeTask(
  id: string,
  code: string,
  accepter_name: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!accepter_name.trim()) return { ok: false, error: "Set your name first." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("committee_tasks")
    .update({
      accepted_at: new Date().toISOString(),
      declined_at: null,
      decline_note: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("assigned_to_name", accepter_name.trim());
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function declineCommitteeTask(
  id: string,
  code: string,
  decliner_name: string,
  note: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!decliner_name.trim()) return { ok: false, error: "Set your name first." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("committee_tasks")
    .update({
      declined_at: new Date().toISOString(),
      decline_note: note.trim() || null,
      assigned_to_name: null,
      accepted_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("assigned_to_name", decliner_name.trim());
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}
