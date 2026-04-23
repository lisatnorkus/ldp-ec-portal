// Client-safe types + label/color maps for precinct targeting. Split
// from precincts.ts so client components can import the enums and
// display helpers without dragging in next/headers (which is server-only
// and blows up the build when pulled into a "use client" file).

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
  dem_primary_high: number | null;
  dem_general_high: number | null;
  dem_gen_not_pri: number | null;
  dem_gotv_targets: number | null;
  ind_general_voters: number | null;
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

// Extract the canonical short code (e.g. "L204", "C101", "V167") from
// a precinct string like "Precinct 204 41 District - L204". Client-safe,
// no Supabase dependency — the map deep-link code uses this too.
export function precinctCodeFrom(precinct: string): string | null {
  const m = precinct.match(/\b([A-Z]\d+)\s*$/i);
  return m ? m[1].toUpperCase() : null;
}
