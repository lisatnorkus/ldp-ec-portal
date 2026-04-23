import { getKypoliticsServer } from "@/lib/supabase/kypolitics";

export type Strategy = "DEFEND" | "ACTIVATE" | "PRIMARY" | "GROW";

export type Precinct = {
  precinct: string;
  hd: string | null;
  sd: string | null;
  cd: string | null;
  metro_council: string | null;
  total_voters: number | null;
  dem_total: number | null;
  rep_total: number | null;
  ind_total: number | null;
  // Targeting rollups
  dem_primary_high: number | null;
  dem_general_high: number | null;
  dem_gen_not_pri: number | null; // sleeper Dems (general voters who skip primaries)
  dem_gotv_targets: number | null;
  ind_general_voters: number | null;
  // Strategy
  d_margin_pct: number | null;
  strategy: Strategy | null;
  priority_score: number | null;
};

export const STRATEGY_FRIENDLY: Record<Strategy, string> = {
  PRIMARY: "Power Base",
  DEFEND: "Hold the Line",
  ACTIVATE: "Wake the Vote",
  GROW: "Plant the Flag",
};

export const STRATEGY_ONELINE: Record<Strategy, string> = {
  PRIMARY: "Democrats win by 20+ points. Keep them voting.",
  DEFEND: "Decided by under 5 points. These pick November.",
  ACTIVATE: "Dem-leaning, many skip primaries. Wake them up.",
  GROW: "R-leaning precincts. Find hidden Dems, build for 2028.",
};

export const STRATEGY_COLOR_VAR: Record<Strategy, string> = {
  PRIMARY: "var(--color-strategy-power-base)",
  DEFEND: "var(--color-strategy-hold-the-line)",
  ACTIVATE: "var(--color-strategy-wake-the-vote)",
  GROW: "var(--color-strategy-plant-the-flag)",
};

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

// Extract the canonical short code (e.g., "L204", "C101", "V167")
// from a precinct string like "Precinct 204 41 District - L204".
// The strategy-map's TARGETING keys use this short form with a
// single-letter prefix followed by digits. Returns null if the
// pattern isn't present — the caller decides whether to fall back
// to the full string.
export function precinctCodeFrom(precinct: string): string | null {
  const m = precinct.match(/\b([A-Z]\d+)\s*$/i);
  return m ? m[1].toUpperCase() : null;
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

export type StrategyCounts = {
  total: number;
  PRIMARY: number;
  DEFEND: number;
  ACTIVATE: number;
  GROW: number;
  sleeper_dems: number;
};

export function countByStrategy(precincts: Precinct[]): StrategyCounts {
  const out: StrategyCounts = {
    total: precincts.length,
    PRIMARY: 0,
    DEFEND: 0,
    ACTIVATE: 0,
    GROW: 0,
    sleeper_dems: 0,
  };
  for (const p of precincts) {
    if (p.strategy) out[p.strategy]++;
    out.sleeper_dems += p.dem_gen_not_pri ?? 0;
  }
  return out;
}
