import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { AmplifyBroadcast } from "./amplify-types";

export type { AmplifyBroadcast, AmplifyStatus } from "./amplify-types";
export { shareLinks } from "./amplify-types";

export async function fetchPublishedBroadcasts(): Promise<AmplifyBroadcast[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("amplify_broadcasts")
    .select("*")
    .eq("status", "PUBLISHED")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("fetchPublishedBroadcasts error", error);
    return [];
  }
  return (data ?? []) as AmplifyBroadcast[];
}

export async function fetchAllBroadcasts(): Promise<AmplifyBroadcast[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("amplify_broadcasts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchAllBroadcasts error", error);
    return [];
  }
  return (data ?? []) as AmplifyBroadcast[];
}
