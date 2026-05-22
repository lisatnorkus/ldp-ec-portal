// Client-safe types + helpers for 2026 primary results. Split from
// election-results.ts so client components can import the types without
// dragging next/headers into the client bundle.

export type RaceParty = "" | "DEM" | "REP";

export type ResultRow = {
  ld_number: number;
  party: RaceParty;
  office: string;
  district: string;
  candidate: string;
  ld_votes: number;
  ld_race_total: number;
  ld_vote_pct: number;
  precincts_reporting: number;
};

export type TurnoutRow = {
  ld_number: number;
  precincts: number;
  total_ballots: number;
  dem_ballots: number;
  rep_ballots: number;
  np_ballots: number;
  total_mail: number;
  total_early_3day: number;
  total_eday: number;
};

export type GroupedRace = {
  key: string;
  party: RaceParty;
  office: string;
  district: string;
  total_votes: number;
  precincts_reporting: number;
  candidates: { name: string; votes: number; pct: number }[];
};

// Roll a flat list of candidate-rows up into per-race groups. Works the
// same shape for LD-scoped and countywide rollups. The input table has
// one row per (LD, race, candidate) — so a candidate in a countywide
// race (Mayor, Senate, etc.) appears up to 18 times. We aggregate by
// candidate name within each race, sum votes, sum precincts_reporting
// across the LDs that race covers, and recompute percentages.
export function groupRaces(rows: ResultRow[]): GroupedRace[] {
  type Agg = {
    party: RaceParty;
    office: string;
    district: string;
    candidates: Map<string, number>;
    ld_precincts: Map<number, number>; // ld -> precincts_reporting for that LD/race
  };
  const map = new Map<string, Agg>();
  for (const r of rows) {
    const key = `${r.party}|${r.office}|${r.district}`;
    let g = map.get(key);
    if (!g) {
      g = {
        party: r.party,
        office: r.office,
        district: r.district,
        candidates: new Map<string, number>(),
        ld_precincts: new Map<number, number>(),
      };
      map.set(key, g);
    }
    g.candidates.set(
      r.candidate,
      (g.candidates.get(r.candidate) ?? 0) + r.ld_votes
    );
    // Track max precincts_reporting per LD (the CSV rolls precincts up
    // per-race per-LD; one record per candidate within that race
    // restates it, so max-by-LD is the right reduction).
    const prevPrecs = g.ld_precincts.get(r.ld_number) ?? 0;
    if (r.precincts_reporting > prevPrecs) {
      g.ld_precincts.set(r.ld_number, r.precincts_reporting);
    }
  }
  const out: GroupedRace[] = [];
  for (const [key, g] of map) {
    const total_votes = [...g.candidates.values()].reduce((s, v) => s + v, 0);
    const precincts_reporting = [...g.ld_precincts.values()].reduce(
      (s, v) => s + v,
      0
    );
    const candidates = [...g.candidates.entries()]
      .map(([name, votes]) => ({
        name,
        votes,
        pct: total_votes > 0 ? (votes / total_votes) * 100 : 0,
      }))
      .sort((a, b) => b.votes - a.votes);
    out.push({
      key,
      party: g.party,
      office: g.office,
      district: g.district,
      total_votes,
      precincts_reporting,
      candidates,
    });
  }
  // Sort races: nonpartisan first (mayor, metro council), then DEM, then
  // REP — and inside each band, alphabetical by office.
  const partyOrder: Record<RaceParty, number> = { "": 0, DEM: 1, REP: 2 };
  return out.sort((a, b) => {
    const p = partyOrder[a.party] - partyOrder[b.party];
    if (p !== 0) return p;
    const o = a.office.localeCompare(b.office);
    if (o !== 0) return o;
    return a.district.localeCompare(b.district);
  });
}

// Countywide rollup is now just groupRaces — the aggregation by
// candidate name is built in. Kept as a thin alias for callers that
// document intent.
export function rollupCounty(rows: ResultRow[]): GroupedRace[] {
  return groupRaces(rows);
}

// Sum a list of per-LD turnout rows into a single countywide row.
export function rollupTurnout(rows: TurnoutRow[]): TurnoutRow {
  const sum = (k: keyof TurnoutRow) =>
    rows.reduce((acc, r) => acc + (r[k] as number), 0);
  return {
    ld_number: 0,
    precincts: sum("precincts"),
    total_ballots: sum("total_ballots"),
    dem_ballots: sum("dem_ballots"),
    rep_ballots: sum("rep_ballots"),
    np_ballots: sum("np_ballots"),
    total_mail: sum("total_mail"),
    total_early_3day: sum("total_early_3day"),
    total_eday: sum("total_eday"),
  };
}

export function fmtRaceLabel(g: GroupedRace): string {
  const office = g.office.replace(/\s+/g, " ").trim();
  const district = g.district ? ` District ${g.district}` : "";
  const party = g.party === "DEM" ? "DEM — " : g.party === "REP" ? "REP — " : "";
  return `${party}${office}${district}`;
}
