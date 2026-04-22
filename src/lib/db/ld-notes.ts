import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";

export type LdNote = {
  id: string;
  ld_number: number;
  body: string;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchNotesByLd(ld_number: number): Promise<LdNote[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ld_notes")
    .select("*")
    .eq("ld_number", ld_number)
    .eq("is_archived", false)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchNotesByLd error", error);
    return [];
  }
  return (data ?? []) as LdNote[];
}
