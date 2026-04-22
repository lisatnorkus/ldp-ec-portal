"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";

// Cross-scope accept / done / defer so the dashboard "Your week"
// panel can act on either LD tasks or committee tasks without the
// client having to know which table the row is in.

type Scope = "LD" | "COMMITTEE";

function tableFor(scope: Scope): string {
  return scope === "LD" ? "ld_tasks" : "committee_tasks";
}

async function revalidateScope(
  scope: Scope,
  scope_id: string
): Promise<void> {
  revalidatePath("/dashboard");
  if (scope === "LD") revalidatePath(`/my-ld/${scope_id}`);
  else revalidatePath(`/committees/${scope_id.toLowerCase()}`);
}

export async function acceptMyTask(
  scope: Scope,
  scope_id: string,
  task_id: string,
  accepter_name: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!accepter_name.trim()) return { ok: false, error: "Set your name first." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from(tableFor(scope))
    .update({
      accepted_at: new Date().toISOString(),
      declined_at: null,
      decline_note: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", task_id)
    .eq("assigned_to_name", accepter_name.trim());
  if (error) return { ok: false, error: error.message };
  await revalidateScope(scope, scope_id);
  return { ok: true };
}

export async function completeMyTask(
  scope: Scope,
  scope_id: string,
  task_id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from(tableFor(scope))
    .update({
      status: "DONE",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", task_id);
  if (error) return { ok: false, error: error.message };
  await revalidateScope(scope, scope_id);
  return { ok: true };
}

export async function declineMyTask(
  scope: Scope,
  scope_id: string,
  task_id: string,
  decliner_name: string,
  note: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!decliner_name.trim()) return { ok: false, error: "Set your name first." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from(tableFor(scope))
    .update({
      declined_at: new Date().toISOString(),
      decline_note: note.trim() || null,
      assigned_to_name: null,
      accepted_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", task_id)
    .eq("assigned_to_name", decliner_name.trim());
  if (error) return { ok: false, error: error.message };
  await revalidateScope(scope, scope_id);
  return { ok: true };
}
