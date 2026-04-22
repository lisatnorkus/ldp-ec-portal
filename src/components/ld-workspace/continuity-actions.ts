"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  PackageStatus,
  PipelineSnapshotRow,
  PrecinctHandoffNote,
  TaskDisposition,
} from "@/lib/db/ld-continuity";

type Author = {
  name: string;
  role: string | null;
  ld: number | null;
};

export async function startPackage(
  ld_number: number,
  cycle: string,
  author: Author
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  const supabase = await getSupabaseServer();
  // Only one non-archived package per LD at a time.
  const { data: existing } = await supabase
    .from("ld_continuity_packages")
    .select("id")
    .eq("ld_number", ld_number)
    .in("status", ["DRAFT", "SUBMITTED", "LOCKED"])
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "There's already an active handoff package for this LD." };
  }
  const { data, error } = await supabase
    .from("ld_continuity_packages")
    .insert({
      ld_number,
      cycle,
      outgoing_chair_name: author.name.trim(),
      status: "DRAFT",
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}/continuity`);
  return { ok: true, id: data.id as string };
}

export async function saveDraft(
  id: string,
  ld_number: number,
  patch: {
    state_narrative?: string | null;
    resource_notes?: string | null;
    chair_note_to_successor?: string | null;
    key_contact_ids?: string[];
    task_dispositions?: Record<string, TaskDisposition>;
    precinct_notes?: Record<string, PrecinctHandoffNote>;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const trimmed: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.state_narrative !== undefined) trimmed.state_narrative = patch.state_narrative?.trim() || null;
  if (patch.resource_notes !== undefined) trimmed.resource_notes = patch.resource_notes?.trim() || null;
  if (patch.chair_note_to_successor !== undefined)
    trimmed.chair_note_to_successor = patch.chair_note_to_successor?.trim() || null;
  if (patch.key_contact_ids !== undefined) trimmed.key_contact_ids = patch.key_contact_ids;
  if (patch.task_dispositions !== undefined) trimmed.task_dispositions = patch.task_dispositions;
  if (patch.precinct_notes !== undefined) trimmed.precinct_notes = patch.precinct_notes;
  const { error } = await supabase
    .from("ld_continuity_packages")
    .update(trimmed)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}/continuity`);
  return { ok: true };
}

// Submit freezes the pipeline snapshot + flips to SUBMITTED. Admin then
// reviews and calls lockPackage().
export async function submitPackage(
  id: string,
  ld_number: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();

  // Snapshot the current WARM/COMMITTED pipeline at submit time.
  const { data: pipeline } = await supabase
    .from("ld_contacts")
    .select("first_name, last_name, pipeline_stage, last_contacted_at, interest_tags, notes")
    .eq("ld_number", ld_number)
    .in("pipeline_stage", ["WARM", "COMMITTED"])
    .order("last_contacted_at", { ascending: false });
  const snapshot: PipelineSnapshotRow[] = (pipeline ?? []) as PipelineSnapshotRow[];

  const { error } = await supabase
    .from("ld_continuity_packages")
    .update({
      status: "SUBMITTED",
      submitted_at: new Date().toISOString(),
      pipeline_snapshot: snapshot,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}/continuity`);
  return { ok: true };
}

export async function lockPackage(
  id: string,
  ld_number: number,
  author: Author
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  const supabase = await getSupabaseServer();

  // When we lock a package we also apply task dispositions: tasks
  // marked CLOSE get DEFERRED, HAND_OFF tasks stay OPEN for the new
  // chair, ESCALATE tasks get tagged but stay open.
  const { data: pkg } = await supabase
    .from("ld_continuity_packages")
    .select("task_dispositions")
    .eq("id", id)
    .single();
  if (pkg?.task_dispositions) {
    const dispositions = pkg.task_dispositions as Record<string, TaskDisposition>;
    for (const [taskId, disposition] of Object.entries(dispositions)) {
      await supabase
        .from("ld_tasks")
        .update({
          continuity_disposition: disposition,
          status: disposition === "CLOSE" ? "DEFERRED" : "OPEN",
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);
    }
  }

  const { error } = await supabase
    .from("ld_continuity_packages")
    .update({
      status: "LOCKED",
      locked_at: new Date().toISOString(),
      locked_by_name: author.name.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}/continuity`);
  return { ok: true };
}

export async function reopenToDraft(
  id: string,
  ld_number: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("ld_continuity_packages")
    .update({ status: "DRAFT" as PackageStatus, submitted_at: null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}/continuity`);
  return { ok: true };
}
