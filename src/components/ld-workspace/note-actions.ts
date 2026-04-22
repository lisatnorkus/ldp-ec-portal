"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";

type Author = {
  name: string;
  role: string | null;
  ld: number | null;
};

export async function createNote(
  ld_number: number,
  body: string,
  author: Author
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Note body is empty." };
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("ld_notes").insert({
    ld_number,
    body: trimmed,
    author_name: author.name.trim(),
    author_role: author.role,
    author_ld: author.ld,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true };
}

export async function updateNote(
  note_id: string,
  ld_number: number,
  body: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Note body is empty." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("ld_notes")
    .update({ body: trimmed, updated_at: new Date().toISOString() })
    .eq("id", note_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true };
}

export async function togglePinNote(
  note_id: string,
  ld_number: number,
  is_pinned: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("ld_notes")
    .update({ is_pinned, updated_at: new Date().toISOString() })
    .eq("id", note_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true };
}

export async function archiveNote(
  note_id: string,
  ld_number: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase
    .from("ld_notes")
    .update({ is_archived: true, updated_at: new Date().toISOString() })
    .eq("id", note_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true };
}
