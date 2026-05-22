import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { ResultRow, TurnoutRow } from "./election-results-types";

export * from "./election-results-types";

const RESULT_COLS =
  "ld_number, party, office, district, candidate, ld_votes, ld_race_total, ld_vote_pct, precincts_reporting";

export async function fetchPrimaryResults2026ByLd(
  ld_number: number
): Promise<ResultRow[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("election_results_2026_primary")
    .select(RESULT_COLS)
    .eq("ld_number", ld_number);
  if (error) {
    console.error("fetchPrimaryResults2026ByLd error", error);
    return [];
  }
  return (data ?? []) as ResultRow[];
}

export async function fetchPrimaryResults2026All(): Promise<ResultRow[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("election_results_2026_primary")
    .select(RESULT_COLS);
  if (error) {
    console.error("fetchPrimaryResults2026All error", error);
    return [];
  }
  return (data ?? []) as ResultRow[];
}

export async function fetchTurnout2026ByLd(
  ld_number: number
): Promise<TurnoutRow | null> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("election_turnout_2026_primary")
    .select("*")
    .eq("ld_number", ld_number)
    .maybeSingle();
  if (error) {
    console.error("fetchTurnout2026ByLd error", error);
    return null;
  }
  return (data as TurnoutRow | null) ?? null;
}

export async function fetchTurnout2026All(): Promise<TurnoutRow[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("election_turnout_2026_primary")
    .select("*");
  if (error) {
    console.error("fetchTurnout2026All error", error);
    return [];
  }
  return (data ?? []) as TurnoutRow[];
}
