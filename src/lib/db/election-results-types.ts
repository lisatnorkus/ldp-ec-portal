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
// same shape for LD-scoped and countywide rollups.
export function groupRaces(rows: ResultRow[]): GroupedRace[] {
  const map = new Map<string, GroupedRace>();
  for (const r of rows) {
    const key = `${r.party}|${r.office}|${r.district}`;
    let g = map.get(key);
    if (!g) {
      g = {
        key,
        party: r.party,
        office: r.office,
        district: r.district,
        total_votes: 0,
        precincts_reporting: r.precincts_reporting,
        candidates: [],
      };
      map.set(key, g);
    }
    g.candidates.push({
      name: r.candidate,
      votes: r.ld_votes,
      pct: r.ld_vote_pct,
    });
    g.total_votes += r.ld_votes;
    if (r.precincts_reporting > g.precincts_reporting) {
      g.precincts_reporting = r.precincts_reporting;
    }
  }
  for (const g of map.values()) {
    g.candidates.sort((a, b) => b.votes - a.votes);
    // Recompute pct against the group's actual race total. The CSV's
    // per-row pct is already against ld_race_total, but when we sum
    // multiple LDs into a county view, those denominators don't match —
    // so trust the votes and recompute.
    if (g.total_votes > 0) {
      for (const c of g.candidates) c.pct = (c.votes / g.total_votes) * 100;
    }
  }
  // Sort races: nonpartisan first (mayor, metro council), then DEM, then
  // REP — and inside each band, alphabetical by office.
  const partyOrder: Record<RaceParty, number> = { "": 0, DEM: 1, REP: 2 };
  return [...map.values()].sort((a, b) => {
    const p = partyOrder[a.party] - partyOrder[b.party];
    if (p !== 0) return p;
    const o = a.office.localeCompare(b.office);
    if (o !== 0) return o;
    return a.district.localeCompare(b.district);
  });
}

// Roll precinct-scope candidate rows up across all LDs into a single
// countywide view. Reuses groupRaces by faking ld_number=0.
export function rollupCounty(rows: ResultRow[]): GroupedRace[] {
  return groupRaces(rows.map((r) => ({ ...r, ld_number: 0 })));
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
