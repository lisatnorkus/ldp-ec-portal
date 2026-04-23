"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";

type Author = { name: string; role: string | null; ld: number | null };

export type VoterRegEventInput = {
  name: string;
  starts_at: string;
  ends_at?: string | null;
  location: string;
  address?: string | null;
  ld_number?: number | null;
  description?: string | null;
  organizer_name?: string | null;
  organizer_committee?: string | null;
  signup_url?: string | null;
  target_populations?: string[];
};

function clean(v: string | null | undefined): string | null {
  if (v == null) return null;
  const t = v.trim();
  return t || null;
}

export async function createVoterRegEvent(
  input: VoterRegEventInput,
  author: Author
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  if (!input.name.trim()) return { ok: false, error: "Event name required." };
  if (!input.location.trim()) return { ok: false, error: "Location required." };
  if (!input.starts_at) return { ok: false, error: "Start time required." };

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("voter_reg_events")
    .insert({
      name: input.name.trim(),
      starts_at: input.starts_at,
      ends_at: input.ends_at || null,
      location: input.location.trim(),
      address: clean(input.address),
      ld_number: input.ld_number ?? null,
      description: clean(input.description),
      organizer_name: clean(input.organizer_name),
      organizer_committee: clean(input.organizer_committee),
      signup_url: clean(input.signup_url),
      target_populations: input.target_populations ?? [],
      author_name: author.name.trim(),
      author_role: author.role,
      author_ld: author.ld,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/voter-registration");
  return { ok: true, id: data.id as string };
}

export async function deleteVoterRegEvent(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("voter_reg_events").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/voter-registration");
  return { ok: true };
}
