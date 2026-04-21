import { getSupabaseServer } from "@/lib/supabase/server";
import type { Committee } from "@/lib/db/members";

export async function fetchCommitteeByCode(code: string): Promise<Committee | null> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("committees")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return data as Committee | null;
}

export async function fetchMemberByName(first_name: string, last_name: string) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ec_members")
    .select("id, first_name, last_name, preferred_name, email, phone, ld_number, primary_role, officer_role")
    .eq("first_name", first_name)
    .eq("last_name", last_name)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}
