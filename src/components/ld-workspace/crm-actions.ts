"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  ContactMethod,
  ContactSource,
  InteractionOutcome,
  PipelineStage,
} from "@/lib/db/ld-contacts";

type Author = {
  name: string;
  role: string | null;
  ld: number | null;
};

export async function createContact(
  ld_number: number,
  input: {
    first_name: string;
    last_name: string;
    phone?: string | null;
    email?: string | null;
    home_precinct?: string | null;
    address_street?: string | null;
    address_city?: string | null;
    address_zip?: string | null;
    voter_file_id?: string | null;
    pipeline_stage?: PipelineStage;
    source?: ContactSource;
    interest_tags?: string[];
    is_key_relationship?: boolean;
    assigned_to_name?: string | null;
    notes?: string | null;
  },
  author: Author
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  if (!input.first_name.trim() || !input.last_name.trim())
    return { ok: false, error: "First and last name required." };
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ld_contacts")
    .insert({
      ld_number,
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      home_precinct: input.home_precinct?.trim() || null,
      address_street: input.address_street?.trim() || null,
      address_city: input.address_city?.trim() || null,
      address_zip: input.address_zip?.trim() || null,
      voter_file_id: input.voter_file_id?.trim() || null,
      pipeline_stage: input.pipeline_stage ?? "IDENTIFIED",
      source: input.source ?? "OTHER",
      interest_tags: input.interest_tags ?? [],
      is_key_relationship: input.is_key_relationship ?? false,
      assigned_to_name: input.assigned_to_name?.trim() || null,
      notes: input.notes?.trim() || null,
      author_name: author.name.trim(),
      author_role: author.role,
      author_ld: author.ld,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}/recruiting`);
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true, id: data.id as string };
}

export async function updateContact(
  contact_id: string,
  ld_number: number,
  patch: {
    first_name?: string;
    last_name?: string;
    phone?: string | null;
    email?: string | null;
    home_precinct?: string | null;
    address_street?: string | null;
    address_city?: string | null;
    address_zip?: string | null;
    voter_file_id?: string | null;
    pipeline_stage?: PipelineStage;
    source?: ContactSource;
    interest_tags?: string[];
    is_key_relationship?: boolean;
    assigned_to_name?: string | null;
    notes?: string | null;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const trimmedPatch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) continue;
    trimmedPatch[k] = typeof v === "string" ? (v.trim() ? v.trim() : null) : v;
  }
  const { error } = await supabase
    .from("ld_contacts")
    .update(trimmedPatch)
    .eq("id", contact_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}/recruiting`);
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true };
}

export async function logInteraction(
  contact_id: string,
  ld_number: number,
  input: {
    contact_method: ContactMethod;
    outcome: InteractionOutcome;
    outcome_detail?: string | null;
    new_stage?: PipelineStage | null;
    notes?: string | null;
    follow_up?: {
      title: string;
      due_date?: string | null;
      priority?: "LOW" | "MEDIUM" | "HIGH";
    } | null;
  },
  author: Author
): Promise<{ ok: true; interaction_id: string } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  const supabase = await getSupabaseServer();

  // Create the follow-up task first, if requested, so we can link the
  // interaction to it via follow_up_task_id.
  let followUpTaskId: string | null = null;
  if (input.follow_up?.title.trim()) {
    const { data: taskRow, error: taskErr } = await supabase
      .from("ld_tasks")
      .insert({
        ld_number,
        title: input.follow_up.title.trim(),
        priority: input.follow_up.priority ?? "MEDIUM",
        due_date: input.follow_up.due_date || null,
        status: "OPEN",
        author_name: author.name.trim(),
        author_role: author.role,
        author_ld: author.ld,
      })
      .select("id")
      .single();
    if (taskErr) return { ok: false, error: taskErr.message };
    followUpTaskId = taskRow.id as string;
  }

  const { data, error } = await supabase
    .from("ld_interactions")
    .insert({
      contact_id,
      ld_number,
      contact_method: input.contact_method,
      outcome: input.outcome,
      outcome_detail: input.outcome_detail?.trim() || null,
      new_stage: input.new_stage ?? null,
      follow_up_task_id: followUpTaskId,
      notes: input.notes?.trim() || null,
      author_name: author.name.trim(),
      author_role: author.role,
      author_ld: author.ld,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/my-ld/${ld_number}/recruiting`);
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true, interaction_id: data.id as string };
}

export async function toggleKeyRelationship(
  contact_id: string,
  ld_number: number,
  is_key: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("ld_contacts")
    .update({ is_key_relationship: is_key, updated_at: new Date().toISOString() })
    .eq("id", contact_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}/recruiting`);
  return { ok: true };
}
