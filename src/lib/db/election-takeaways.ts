import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";

export type Takeaway = {
  id: string;
  ld_number: number; // 0 = countywide
  election_key: string;
  author_name: string | null;
  author_role: string | null;
  body: string;
  created_at: string;
};

// Fetch takeaways for one LD (or countywide if ld_number = 0) for a
// specific election. Newest first.
export async function fetchTakeaways(
  ld_number: number,
  election_key: string
): Promise<Takeaway[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ld_election_takeaways")
    .select("*")
    .eq("ld_number", ld_number)
    .eq("election_key", election_key)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchTakeaways error", error);
    return [];
  }
  return (data ?? []) as Takeaway[];
}
