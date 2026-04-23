import "server-only";
import { getKypoliticsServer } from "@/lib/supabase/kypolitics";
import type { Precinct } from "./precincts-types";

// Re-export client-safe types + helpers so existing server-side imports
// keep working. Client components should import directly from
// precincts-types to avoid dragging next/headers into the client bundle.
export * from "./precincts-types";

const SELECT_COLS =
  "precinct, hd, sd, cd, metro_council, total_voters, dem_total, rep_total, ind_total, dem_primary_high, dem_general_high, dem_gen_not_pri, dem_gotv_targets, ind_general_voters, d_margin_pct, strategy, priority_score";

// Both fetchers below swallow ANY failure from the kypolitics project
// (missing env vars, network error, Supabase down) and return []. The
// pages that use them render honest empty states rather than throwing.

export async function fetchPrecinctsByLd(ld_number: number): Promise<Precinct[]> {
  try {
    const supabase = await getKypoliticsServer();
    const { data, error } = await supabase
      .from("jeffco_voter_targeting")
      .select(SELECT_COLS)
      .eq("hd", String(ld_number))
      .order("priority_score", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("fetchPrecinctsByLd supabase error", error);
      return [];
    }
    return (data ?? []) as Precinct[];
  } catch (err) {
    console.error("fetchPrecinctsByLd failed", err);
    return [];
  }
}

// Fetch a single precinct row by its canonical code ("L204"). The
// underlying string in jeffco_voter_targeting is formatted like
// "Precinct 204 41 District - L204" — this matcher expects the trailing
// L-code and does an exact suffix match so L204 doesn't collide with
// L2040 if such a precinct exists.
export async function fetchPrecinctByCode(code: string): Promise<Precinct | null> {
  try {
    const normalized = code.toUpperCase().trim();
    const supabase = await getKypoliticsServer();
    const { data, error } = await supabase
      .from("jeffco_voter_targeting")
      .select(SELECT_COLS)
      .ilike("precinct", `%- ${normalized}`)
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("fetchPrecinctByCode supabase error", error);
      return null;
    }
    return (data as Precinct | null) ?? null;
  } catch (err) {
    console.error("fetchPrecinctByCode failed", err);
    return null;
  }
}

// All 629 Jefferson County precincts. Used by the captain-coverage
// dashboard to compute how many of each strategy bucket have a captain
// assigned.
export async function fetchAllPrecincts(): Promise<Precinct[]> {
  try {
    const supabase = await getKypoliticsServer();
    const { data, error } = await supabase
      .from("jeffco_voter_targeting")
      .select(SELECT_COLS)
      .order("hd", { ascending: true })
      .order("precinct", { ascending: true });
    if (error) {
      console.error("fetchAllPrecincts supabase error", error);
      return [];
    }
    return (data ?? []) as Precinct[];
  } catch (err) {
    console.error("fetchAllPrecincts failed", err);
    return [];
  }
}

export async function fetchPrecinctsForMcPriority(mc_number: number): Promise<Precinct[]> {
  try {
    const supabase = await getKypoliticsServer();
    const { data, error } = await supabase
      .from("jeffco_voter_targeting")
      .select(SELECT_COLS)
      .eq("metro_council", String(mc_number))
      .order("priority_score", { ascending: false, nullsFirst: false });
    if (error) {
      console.error("fetchPrecinctsForMcPriority supabase error", error);
      return [];
    }
    return (data ?? []) as Precinct[];
  } catch (err) {
    console.error("fetchPrecinctsForMcPriority failed", err);
    return [];
  }
}
