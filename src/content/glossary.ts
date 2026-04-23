// Portal glossary — the terms a new EC member might not know. First
// draft in Lisa's voice where possible; she'll red-pen in her edit pass.

export type GlossaryTerm = {
  term: string;
  short: string; // one-line tooltip def
  long?: string; // optional longer explanation for /glossary
  seeAlso?: string[]; // other terms worth linking
};

export const GLOSSARY: GlossaryTerm[] = [
  // ---- Targeting ----
  {
    term: "Power Base",
    short: "Precincts where Democrats win by 20+ points. Our reliable floor.",
    long: "The 328 Jefferson County precincts scored PRIMARY in the strategy map. Average D-margin +44. Our organizing mission here is turnout + volunteer recruitment — never persuasion.",
    seeAlso: ["Hold the Line", "Wake the Vote", "Plant the Flag", "D-margin"],
  },
  {
    term: "Hold the Line",
    short: "Toss-up precincts — decided by under 5 points.",
    long: "The 79 DEFEND precincts in Jefferson County. Every contact is a margin vote. Best canvass ROI in the county.",
  },
  {
    term: "Wake the Vote",
    short: "Dem-leaning precincts where many registered Dems skip primaries.",
    long: "The 150 ACTIVATE precincts. Home of the 'sleeper Dem' universe. Activating a sleeper is a 2x vote — they'll show in both the primary and the general once woken.",
  },
  {
    term: "Plant the Flag",
    short: "R-leaning precincts where we're building base for future cycles.",
    long: "72 GROW precincts. Long-term work: identify hidden Dems, register new ones, build infrastructure for 2028 and beyond. Skip during primary and peak GOTV; invest in summer and off-cycle.",
  },
  {
    term: "Sleeper Dems",
    short: "Registered Dems who vote in general elections but skip primaries.",
    long: "Column `dem_gen_not_pri` in the kypolitics dataset. The most mobilizable universe in Jefferson County — already registered, already Dem-identifying, just inconsistent in May. Activating a sleeper is 3x cheaper than persuading an Independent.",
  },
  {
    term: "D-margin",
    short: "Democratic advantage in a precinct — how many points Dems win or lose by on average.",
    long: "Computed from historical vote shares. D+44 means Dems win by 44 points on average; D-16 means Rs win by 16. Drives the ACTIVATE / DEFEND / PRIMARY / GROW bucket assignment.",
  },
  {
    term: "GOTV",
    short: "Get Out The Vote — the turnout push in the final weeks before an election.",
    long: "The operation that converts IDed supporters into actual voters. Door knocks, calls, texts, rides, polling-place coverage. For KY: runs Oct 1 → Nov 3 in a general year; final 2-3 weeks in a primary year.",
  },
  {
    term: "Drop-off voters",
    short: "People who voted in 2020 but not 2024 — the universe Democrats need to reactivate.",
    long: "Per the 2026 DNC Organizing Playbook, these are the #1 target for year-round engagement. The party's path back runs through people who've voted Dem before but fell off.",
  },

  // ---- Organizing mechanics ----
  {
    term: "Turf",
    short: "The specific geographic area — a precinct, a block, an apartment complex — assigned to a canvasser.",
    long: "Also called a 'cut' or 'walk list.' Good turf design keeps canvassers efficient — small, contiguous, right-sized to a 2-hour shift.",
  },
  {
    term: "Cuts",
    short: "VoteBuilder lists filtered down to a specific universe for a specific tactic.",
    long: "e.g., 'pull me a cut of reliable Dems in LD41 who haven't voted in the last two primaries.' LD chairs and above have cut access.",
  },
  {
    term: "Universe",
    short: "A specific group of voters we're targeting for a specific tactic.",
    long: "e.g., the 'GOTV universe' (people to turn out), the 'persuasion universe' (people to move), the 'sleeper universe' (inconsistent primary voters). Every campaign conversation eventually comes back to which universe you're contacting.",
  },
  {
    term: "Layering",
    short: "Every voter contact triggers the next one — don't stop at one touch.",
    long: "The 2026 DNC Playbook's central reframe. Door knock → text within 48 hours → invite to event → election-eve call. Tracked per-captain: 10-20 working relationships, reviewed weekly.",
  },
  {
    term: "Pipeline",
    short: "The recruiting CRM's stages: Identified → Contacted → Warm → Committed → Active → EC Member.",
    long: "Tracks where every potential recruit is in the funnel. Each stage has a specific next action. Built into /my-ld/[n]/recruiting.",
  },
  {
    term: "Precinct Captain",
    short: "The Democratic Party's person in a given precinct — the neighborhood organizer.",
    long: "Per LJCDP bylaws, up to three per precinct (Man / Woman / Youth). Knows the voters, pulls the list, runs contact year-round. Backbone of the ground game.",
  },
  {
    term: "Relational organizing",
    short: "Volunteers contact people they already know — not strangers from a list.",
    long: "3-5x more persuasive than cold contact. The DNC's People's Network trained 500 volunteers to 6,000+ conversations through personal networks in 2025.",
  },

  // ---- Governance / compliance ----
  {
    term: "JCDEC",
    short: "Jefferson County Democratic Executive Committee — the official county committee.",
    long: "Also called LDPEC, LJCDP, or 'the board' depending on who's talking. Governed by KDP bylaws + LJCDP bylaws. 56+ voting members.",
  },
  {
    term: "CEC",
    short: "County Executive Committee — same as JCDEC.",
  },
  {
    term: "SCEC",
    short: "State Central Executive Committee — KDP's statewide governing body.",
  },
  {
    term: "KDP",
    short: "Kentucky Democratic Party — the state party.",
  },
  {
    term: "LJCDP",
    short: "Louisville-Jefferson County Democratic Party — the legal name of JCDEC in bylaws.",
  },
  {
    term: "KREF",
    short: "Kentucky Registry of Election Finance — the state campaign-finance regulator.",
    long: "JCDEC files semi-annually. 2026 deadlines: 2/2, 7/31, 2/1/2027. Delinquent filers list is public.",
  },
  {
    term: "KRS",
    short: "Kentucky Revised Statutes — Kentucky's codified state law.",
    long: "KRS 116 = voter registration and party change. KRS 117 = election administration (early voting, voter ID). KRS 121 = campaign finance.",
  },
  {
    term: "SBE",
    short: "Kentucky State Board of Elections — statewide rules, sample ballots, precinct lookup.",
  },
  {
    term: "Proxy",
    short: "A written authorization for another EC member to vote on your behalf at a meeting.",
    long: "Allowed under LJCDP §23 for most votes, NOT allowed for elections, dismissals, or endorsement votes. Must be at HQ before the meeting starts.",
  },
  {
    term: "Quorum",
    short: "Minimum attendance required for the committee to do business.",
    long: "40% of the LD bloc (LD Chairs + Vice Chairs + At-Large members). Proxies count for general quorum but not for elections or dismissals.",
  },
  {
    term: "LD bloc",
    short: "LD Chairs + LD Vice Chairs + LD At-Large members combined — the core voting body.",
  },

  // ---- Portal-specific ----
  {
    term: "Continuity Package",
    short: "The 7-section handoff document every outgoing LD chair or committee chair writes.",
    long: "Ensures institutional memory survives leadership changes. State narrative, key contacts, task dispositions, precinct notes, chair note to successor. DRAFT → SUBMITTED → LOCKED lifecycle.",
  },
  {
    term: "Dark precinct",
    short: "A precinct with no precinct captain assigned — we have no eyes there.",
    long: "The /captains page's punch list. ACTIVATE + DEFEND dark precincts are the highest-priority recruit targets.",
  },
  {
    term: "Amplify",
    short: "The board-share board — Comms publishes a post, every EC member one-click shares to their networks.",
  },

  // ---- Cycle phases ----
  {
    term: "Primary window",
    short: "February → mid-May — candidate filing, endorsements, primary ramp, primary election.",
  },
  {
    term: "Off-cycle",
    short: "January + December — planning, infrastructure, captain recruitment. No active election.",
  },
  {
    term: "Power map",
    short: "The 2026 LDP Strategy Map — every precinct scored and colored by strategy bucket.",
    long: "Live at 26ldp-strategy-map.vercel.app. Click a precinct to see its voter breakdown, bucket assignment, and GOTV target count.",
  },
];

// Quick lookup for the Term tooltip component.
export const GLOSSARY_MAP: Record<string, GlossaryTerm> = Object.fromEntries(
  GLOSSARY.map((t) => [t.term.toLowerCase(), t])
);

export function findTerm(term: string): GlossaryTerm | undefined {
  return GLOSSARY_MAP[term.toLowerCase()];
}
