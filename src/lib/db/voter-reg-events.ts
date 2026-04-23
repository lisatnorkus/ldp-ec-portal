import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { VoterRegEvent } from "./voter-reg-events-types";

export type { VoterRegEvent } from "./voter-reg-events-types";

export async function fetchUpcomingVoterRegEvents(): Promise<VoterRegEvent[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("voter_reg_events")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });
  if (error) {
    console.error("fetchUpcomingVoterRegEvents error", error);
    return [];
  }
  return (data ?? []) as VoterRegEvent[];
}

export async function fetchPastVoterRegEvents(limit = 10): Promise<VoterRegEvent[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("voter_reg_events")
    .select("*")
    .eq("is_published", true)
    .lt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("fetchPastVoterRegEvents error", error);
    return [];
  }
  return (data ?? []) as VoterRegEvent[];
}
