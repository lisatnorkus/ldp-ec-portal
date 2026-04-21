import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { EcMember, Committee } from "@/lib/db/members-types";

// Re-export client-safe types + helpers so existing server imports still work.
export * from "@/lib/db/members-types";

export async function fetchAllMembers(): Promise<EcMember[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ec_members")
    .select("*")
    .eq("active", true)
    .order("last_name");
  if (error) throw error;
  return data as EcMember[];
}

export async function fetchCommittees(): Promise<Committee[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("committees")
    .select("*")
    .eq("active", true)
    .order("display_order");
  if (error) throw error;
  return data as Committee[];
}
