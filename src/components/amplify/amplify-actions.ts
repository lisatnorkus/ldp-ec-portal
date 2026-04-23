"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { AmplifyStatus } from "@/lib/db/amplify-types";

type Author = { name: string; role: string | null };

function clean(v: string | null | undefined): string | null {
  if (v == null) return null;
  const t = v.trim();
  return t || null;
}

export async function createBroadcast(
  input: {
    title: string;
    body_text: string;
    url?: string | null;
    image_url?: string | null;
    publish?: boolean;
  },
  author: Author
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  if (!input.title.trim()) return { ok: false, error: "Title required." };
  if (!input.body_text.trim()) return { ok: false, error: "Body required." };

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("amplify_broadcasts")
    .insert({
      title: input.title.trim(),
      body_text: input.body_text.trim(),
      url: clean(input.url),
      image_url: clean(input.image_url),
      status: input.publish ? "PUBLISHED" : "DRAFT",
      published_at: input.publish ? new Date().toISOString() : null,
      author_name: author.name.trim(),
      author_role: author.role,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/amplify");
  return { ok: true, id: data.id as string };
}

export async function setStatus(
  id: string,
  status: AmplifyStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const patch: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (status === "PUBLISHED") patch.published_at = new Date().toISOString();
  const { error } = await supabase.from("amplify_broadcasts").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/amplify");
  return { ok: true };
}

export async function deleteBroadcast(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("amplify_broadcasts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/amplify");
  return { ok: true };
}
