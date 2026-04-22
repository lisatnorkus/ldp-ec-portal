"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { PackageStatus, TaskDisposition } from "@/lib/db/ld-continuity";

type Author = {
  name: string;
  role: string | null;
  ld: number | null;
};

function committeePath(code: string): string {
  return `/committees/${code.toLowerCase()}/continuity`;
}

export async function startCommitteePackage(
  code: string,
  cycle: string,
  author: Author
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Set your name first." };
  const supabase = await getSupabaseServer();
  const { data: existing } = await supabase
    .from("committee_continuity_packages")
    .select("id")
    .eq("committee_code", code)
    .in("status", ["DRAFT", "SUBMITTED", "LOCKED"])
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "There's already an active handoff package for this committee." };
  }
  const { data, error } = await supabase
    .from("committee_continuity_packages")
    .insert({
      committee_code: code,
      cycle,
      outgoing_chair_name: author.name.trim(),
      status: "DRAFT",
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true, id: data.id as string };
}

export async function saveCommitteeDraft(
  id: string,
  code: string,
  patch: {
    state_narrative?: string | null;
    scope_and_workflow_notes?: string | null;
    chair_note_to_successor?: string | null;
    task_dispositions?: Record<string, TaskDisposition>;
    member_notes?: Record<string, { note: string; keep_on_committee: boolean }>;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const trimmed: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.state_narrative !== undefined)
    trimmed.state_narrative = patch.state_narrative?.trim() || null;
  if (patch.scope_and_workflow_notes !== undefined)
    trimmed.scope_and_workflow_notes = patch.scope_and_workflow_notes?.trim() || null;
  if (patch.chair_note_to_successor !== undefined)
    trimmed.chair_note_to_successor = patch.chair_note_to_successor?.trim() || null;
  if (patch.task_dispositions !== undefined) trimmed.task_dispositions = patch.task_dispositions;
  if (patch.member_notes !== undefined) trimmed.member_notes = patch.member_notes;
  const { error } = await supabase
    .from("committee_continuity_packages")
    .update(trimmed)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function submitCommitteePackage(
  id: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("committee_continuity_packages")
    .update({
      status: "SUBMITTED" as PackageStatus,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function lockCommitteePackage(
  id: string,
  code: string,
  author: Author
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Set your name first." };
  const supabase = await getSupabaseServer();

  // Apply task dispositions to committee_tasks (mirrors LD behavior).
  const { data: pkg } = await supabase
    .from("committee_continuity_packages")
    .select("task_dispositions")
    .eq("id", id)
    .single();
  if (pkg?.task_dispositions) {
    const dispositions = pkg.task_dispositions as Record<string, TaskDisposition>;
    for (const [taskId, disposition] of Object.entries(dispositions)) {
      await supabase
        .from("committee_tasks")
        .update({
          continuity_disposition: disposition,
          status: disposition === "CLOSE" ? "DEFERRED" : "OPEN",
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);
    }
  }

  const { error } = await supabase
    .from("committee_continuity_packages")
    .update({
      status: "LOCKED" as PackageStatus,
      locked_at: new Date().toISOString(),
      locked_by_name: author.name.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}

export async function reopenCommitteeToDraft(
  id: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("committee_continuity_packages")
    .update({
      status: "DRAFT" as PackageStatus,
      submitted_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(committeePath(code));
  return { ok: true };
}
