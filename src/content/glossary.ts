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
    term: "LDP",
    short: "Louisville Democratic Party — the party itself. The brand we use in public-facing copy.",
    long: "Formally the Louisville-Jefferson County Democratic Party (LJCDP). 'LDP' is the everyday name; 'LJCDP' shows up in bylaw citations.",
    seeAlso: ["LDPEC", "LJCDP", "KDP"],
  },
  {
    term: "LDPEC",
    short: "LDP Executive Committee — the 56+ voting members who govern the party between conventions.",
    long: "Four countywide officers, 18 LD Chairs, 18 LD Vice Chairs, 18 At-Large Chairs, plus the LYD and JCDWC Presidents. Governed by KDP bylaws + LJCDP bylaws. Audience of this portal.",
    seeAlso: ["LDP", "JCDEC", "CEC", "LJCDP"],
  },
  {
    term: "JCDEC",
    short: "Jefferson County Democratic Executive Committee — older name for the LDPEC.",
    long: "Same body as LDPEC. The internal-bylaws name. User-facing copy uses LDPEC.",
    seeAlso: ["LDPEC"],
  },
  {
    term: "CEC",
    short: "County Executive Committee — same body as LDPEC.",
    seeAlso: ["LDPEC"],
  },
  {
    term: "SCEC",
    short: "State Central Executive Committee — KDP's statewide governing body.",
    long: "Meets quarterly in Frankfort plus called meetings. More formal than LDPEC — your countywide officers serve as the link.",
  },
  {
    term: "KDP",
    short: "Kentucky Democratic Party — the state party.",
  },
  {
    term: "LJCDP",
    short: "Louisville-Jefferson County Democratic Party — the legal name of the LDP in bylaws.",
    seeAlso: ["LDP"],
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
  {
    term: "DNC Charter",
    short: "The national party's foundational document — what the DNC is and how it works.",
    long: "Cited alongside KDP bylaws, LJCDP bylaws, and Robert's Rules in the portal's Compliance Q&A. Read the cited section before acting on anything load-bearing.",
    seeAlso: ["Compliance Q&A", "KDP", "LJCDP"],
  },
  {
    term: "Robert's Rules",
    short: "Robert's Rules of Order — the parliamentary procedure that governs how LDPEC meetings run.",
    long: "Motion, second, debate, vote. The Chair runs the room by Robert's Rules unless the bylaws say otherwise. The Compliance Q&A chat answers procedural questions citing it.",
    seeAlso: ["Compliance Q&A", "Proxy", "Quorum"],
  },
  {
    term: "§26 drift",
    short: "LJCDP §26 lists 10 standing committees; practice runs 8 standing + 3 ad hoc. The bylaws need amending.",
    long: "§26 still names Youth and Labor as standing (they aren't running) and omits Branding, Endorsement Process, and Platform (which are running as ad hoc). The Bylaws Committee will amend. Until then, the portal flags this drift wherever committees are listed.",
    seeAlso: ["LJCDP"],
  },
  {
    term: "Reorg",
    short: "The party-wide reorganization that elects every LDPEC seat. Presidential-year cadence: 2028, 2032, 2036.",
    long: "Two-step process: Precinct Conventions elect PCs (and resolve LD officer races if uncontested), then LD Conventions seat LD officers. KDP postponed the 2024 reorg to 2025 as a one-time shift; the cycle is back on presidential-year cadence going forward. Tour Step 6 is the load-bearing reference.",
    seeAlso: ["Precinct Convention", "LD Convention", "SCEC"],
  },
  {
    term: "Precinct Convention",
    short: "The local reorg meeting in each precinct where PCs are elected.",
    long: "Called and advertised by the LDPEC Chair (KDP Art. II.B.f). Party Officers — in practice LD Chairs — preside as Convention Chairs (Art. II.B.g). 7–30 days advance notice required, using ≥3 of 6 notification methods. No prefiling for PC seats — elected at the convention itself.",
    seeAlso: ["Reorg", "Precinct Captain"],
  },
  {
    term: "LD Convention",
    short: "The reorg meeting where LD Chair, Vice Chair, and LD At-Large seats get seated.",
    long: "Held after Precinct Conventions in each LD. Prefiling for LD Chair / VC / LD At-Large runs Oct 1 (year-before) through the 5pm filing deadline of the reorg year, per LJCDP §4.2.1. Nominations from the floor also allowed.",
    seeAlso: ["Reorg", "Precinct Convention"],
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
  {
    term: "Workspace",
    short: "The shared work surface for an LD or a committee: posts, action items, meeting records, continuity tools.",
    long: "Every LD has one (at /my-ld/[n]) and every standing/ad-hoc committee has one (at /committees/[code]). Same pattern in both places. The 'work happens here, not in side-channel emails' surface.",
    seeAlso: ["Action Items", "Meeting Records", "Continuity Package"],
  },
  {
    term: "Action Items",
    short: "Discrete to-dos assigned to a specific LDPEC member with accept/decline. Distinct from tasks.",
    long: "Action items have an owner, an optional due date, and a state (open / accepted / declined / done). Live inside committee + LD workspaces and roll up to your dashboard's 'Your Week' panel. Extracted automatically by the ingest pipeline from meeting minutes.",
    seeAlso: ["Workspace", "Meeting Records"],
  },
  {
    term: "Meeting Records",
    short: "Verbatim LDPEC and committee meeting minutes with motions, decisions, action items, and attendance pre-parsed.",
    long: "The ingest pipeline reads the canonical minutes and writes a structured annotations block alongside the verbatim text. Powers the rollups on /official-records, the per-committee record list, and the dashboard's published-awaiting-approval count.",
    seeAlso: ["Official Records", "Ingest pipeline", "Action Items"],
  },
  {
    term: "Official Records",
    short: "The portal's full audit trail of approved LDPEC meeting records.",
    long: "Lives at /official-records. The reference behind every governance claim — quorum, attendance, motions, finance decisions. Officers see a published-awaiting-approval queue on their dashboard.",
    seeAlso: ["Meeting Records", "Officer Dashboard"],
  },
  {
    term: "Ingest pipeline",
    short: "The script that reads raw meeting minutes and writes the parsed annotations back to Supabase.",
    long: "Run by Lisa after each LDPEC meeting. Pulls motions, decisions, action items, and attendance out of the verbatim minutes so the rest of the portal can filter and roll them up. The verbatim content stays canonical.",
    seeAlso: ["Meeting Records"],
  },
  {
    term: "Role Banner",
    short: "The colored strip at the top of the dashboard that names which role you're currently viewing as.",
    long: "Color-coded by role family — officers navy, LD chair/VC red, At-Large/LYD/JCDWC violet, Precinct Captain emerald. Tells you at a glance which lens the dashboard is rendering in.",
    seeAlso: ["View as", "Officer Dashboard"],
  },
  {
    term: "View as",
    short: "The dropdown that lets multi-hat LDPEC members swap which role the dashboard renders for.",
    long: "Lives in the 'Signed in as' strip just below the Role Banner. Only shows up if you've declared more than one hat in your profile. Swapping doesn't change your permissions — it changes the layout the dashboard renders.",
    seeAlso: ["Role Banner", "Officer Dashboard"],
  },
  {
    term: "Officer Dashboard",
    short: "The dashboard layout shown to LDPEC officers: countywide governance focus.",
    long: "Committee health, transitions in the last 90 days, signature-event countdown, total open action items, published-awaiting-approval records. LD chairs and VCs see the district-flavored layout instead. Multi-hat members can switch via 'View as'.",
    seeAlso: ["Role Banner", "View as"],
  },
  {
    term: "Leadership Transition",
    short: "The post-meeting officer roster — who holds what seat right now after the latest LDPEC meeting.",
    long: "Lives at /leadership-transition. Distinct from /transitions (which is the historical change log). The reference for the current state of the roster.",
    seeAlso: ["Officer Dashboard"],
  },
  {
    term: "Compliance Q&A",
    short: "The portal's chat that answers party-rules questions with citations to the DNC Charter, KDP bylaws, LJCDP bylaws, and Robert's Rules.",
    long: "Lives at /compliance-chat. Research assistant, not the bylaws themselves — every answer cites the section, and load-bearing decisions should be verified against the source.",
    seeAlso: ["DNC Charter", "Robert's Rules", "LJCDP", "KDP"],
  },
  {
    term: "$120 Club",
    short: "The annual personal-give component of the LDPEC member commitment — $120/year, typically $10/month auto-pay.",
    long: "Half of the $620 math. The other half is the $500 raise from signature-event ticket-link sales.",
    seeAlso: ["$620 math"],
  },
  {
    term: "$620 math",
    short: "Each LDPEC member's annual financial commitment — $120 personal give + $500 raised.",
    long: "Funds the party's operating budget. The $500 raise comes from personalized ticket-sale links to the three signature events (Celebration of Democracy, Women Deliver Democracy, Dems at the Downs). Automatic per-member credit tracking isn't wired up yet — for 2026 it's tracked manually by Communications.",
    seeAlso: ["$120 Club"],
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
