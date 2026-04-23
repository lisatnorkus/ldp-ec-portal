import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { Volunteer, VolunteerActivity } from "./volunteers-types";

export type { Volunteer, VolunteerActivity } from "./volunteers-types";

export async function fetchAllVolunteers(): Promise<Volunteer[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .order("last_active_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchAllVolunteers error", error);
    return [];
  }
  return (data ?? []) as Volunteer[];
}

export async function fetchVolunteersByLd(ld_number: number): Promise<Volunteer[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("home_ld", ld_number)
    .order("last_active_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchVolunteersByLd error", error);
    return [];
  }
  return (data ?? []) as Volunteer[];
}

export async function fetchVolunteerById(id: string): Promise<Volunteer | null> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("volunteers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("fetchVolunteerById error", error);
    return null;
  }
  return (data as Volunteer) ?? null;
}

export async function fetchVolunteerActivities(
  volunteer_id: string
): Promise<VolunteerActivity[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("volunteer_activities")
    .select("*")
    .eq("volunteer_id", volunteer_id)
    .order("activity_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchVolunteerActivities error", error);
    return [];
  }
  return (data ?? []) as VolunteerActivity[];
}

export async function fetchRecentActivityCount(
  volunteer_ids: string[]
): Promise<Map<string, number>> {
  if (volunteer_ids.length === 0) return new Map();
  const supabase = await getSupabaseServer();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const { data, error } = await supabase
    .from("volunteer_activities")
    .select("volunteer_id")
    .in("volunteer_id", volunteer_ids)
    .gte("activity_date", cutoff.toISOString().slice(0, 10));
  if (error) {
    console.error("fetchRecentActivityCount error", error);
    return new Map();
  }
  const counts = new Map<string, number>();
  for (const row of (data ?? []) as { volunteer_id: string }[]) {
    counts.set(row.volunteer_id, (counts.get(row.volunteer_id) ?? 0) + 1);
  }
  return counts;
}

export type VolunteerSummary = {
  total: number;
  active: number;
  lapsed: number;
  paused: number;
  doNotContact: number;
  pendingReview: number; // SIGNUP_FORM + zero activities
};

export function summarize(
  volunteers: Volunteer[],
  reviewedPredicate: (v: Volunteer) => boolean
): VolunteerSummary {
  return {
    total: volunteers.length,
    active: volunteers.filter((v) => v.status === "ACTIVE").length,
    lapsed: volunteers.filter((v) => v.status === "LAPSED").length,
    paused: volunteers.filter((v) => v.status === "PAUSED").length,
    doNotContact: volunteers.filter((v) => v.status === "DO_NOT_CONTACT").length,
    pendingReview: volunteers.filter(
      (v) => v.source === "SIGNUP_FORM" && !reviewedPredicate(v)
    ).length,
  };
}

// A volunteer is "lapsed-risk" when they're ACTIVE but haven't been
// logged on an activity in the last N days. Jessica's retention queue.
export function filterLapsedRisk(volunteers: Volunteer[], days = 60): Volunteer[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return volunteers.filter((v) => {
    if (v.status !== "ACTIVE") return false;
    if (!v.last_active_at) return true; // never logged = top of the queue
    return new Date(v.last_active_at).getTime() < cutoff;
  });
}
