"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";

type Author = {
  name: string;
  role: string | null;
};

export async function addTakeaway(
  ld_number: number,
  election_key: string,
  body: string,
  author: Author
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, error: "Add a thought before saving." };
  if (!author.name.trim())
    return { ok: false, error: "Tell the portal who you are first (header above)." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("ld_election_takeaways").insert({
    ld_number,
    election_key,
    body: trimmed,
    author_name: author.name.trim(),
    author_role: author.role,
  });
  if (error) return { ok: false, error: error.message };
  // ld_number = 0 means a countywide takeaway; revalidate the at-large
  // surface plus all LD pages.
  if (ld_number === 0) {
    revalidatePath("/my-ld");
  } else {
    revalidatePath(`/my-ld/${ld_number}`);
  }
  return { ok: true };
}
