// 2026 LDP General Strategic Plan — content module.
//
// Source: "07 - 26 LDP General Strategic Plan.html" prepared by Lisa
// Norkus (41st LD Vice Chair), May 2026. Phase 2 of the cycle; picks
// up from the primary voter education plan with real data.
//
// Per Lisa: this is the plan unless/until a coordinated campaign budget
// changes the resourcing tier. Numbers below are baked from the source;
// when the post-primary VAN refresh lands, update the universes table.

export type GeneralPlanZone = {
  zone: "DEFEND" | "ACTIVATE" | "PRIMARY" | "GROW";
  what: string;
  precincts: number;
  voters: number;
  primary_focus: string;
  general_focus: string;
};

export const GENERAL_PLAN_ZONES: GeneralPlanZone[] = [
  {
    zone: "DEFEND",
    what: "Dem margin <5 pts",
    precincts: 79,
    voters: 72_283,
    primary_focus: "Full canvass, every door",
    general_focus:
      "Persuasion + heavy GOTV. Highest contact rate per voter. Sleeper Dem activation is the margin of victory.",
  },
  {
    zone: "ACTIVATE",
    what: "Dem margin 5–20 pts",
    precincts: 150,
    voters: 143_385,
    primary_focus: "Wake up sleeper Dems",
    general_focus:
      "Targeted GOTV + yard signs. Sleeper Dems contacted in primary get priority follow-up.",
  },
  {
    zone: "PRIMARY",
    what: "Dem margin 20+ pts",
    precincts: 328,
    voters: 256_449,
    primary_focus: "Turnout & data collection",
    general_focus:
      "Base maintenance + volunteer recruiting. These precincts carry themselves. They fund the rest of the operation in volunteers.",
  },
  {
    zone: "GROW",
    what: "R margin 5+ pts",
    precincts: 72,
    voters: 63_090,
    primary_focus: "Plant the flag, collect data",
    general_focus:
      "Data collection + relationship building. 2027 starts here. Don't ignore — but don't over-invest.",
  },
];

export type GeneralPlanUniverse = {
  name: string;
  size_label: string;
  what: string;
  phase_2_job: string;
};

export const GENERAL_PLAN_UNIVERSES: GeneralPlanUniverse[] = [
  {
    name: "Sleeper Dems (Post-Primary)",
    size_label: "~87,000",
    what:
      "Registered Dems who voted general but skipped May 19. Single biggest pool of untapped Dem votes.",
    phase_2_job:
      "Contact every one before Nov 3. The conversation is short: 'you showed up in November before — here's what's on the ballot.'",
  },
  {
    name: "GOTV Targets",
    size_label: "~80,000",
    what: "Low-propensity Dems who vote inconsistently.",
    phase_2_job:
      "Persuasion + mobilization. Layer mail, doors, calls. Lock in early-vote plans.",
  },
  {
    name: "Independents (General Voters)",
    size_label: "~95,000",
    what:
      "Registered Independents who vote generals. New nonpartisan-ballot voters.",
    phase_2_job:
      "Persuasion universe. The party brand carries here, not the candidate's party. Issue-based messaging.",
  },
  {
    name: "GOP High-Propensity",
    size_label: "~31,000",
    what: "Reliable R voters. They will show up.",
    phase_2_job:
      "Not our target. Plan around them. Our job is to show up bigger.",
  },
];

export type RaceRow = {
  metric: string;
  value: string;
};

export type PhaseRow = {
  phase: string;
  strategy: string;
};

export type GeneralPlanRace = {
  id: string; // slug
  title: string; // "District 11 — Melina Hettiaratchi (LDP-endorsed)"
  callout_kind: "priority" | "warn" | "info";
  callout_label: string;
  callout_body: string;
  metrics: RaceRow[];
  phases: PhaseRow[];
};

// District 11 — the headline offensive flip
export const GP_D11: GeneralPlanRace = {
  id: "mc11",
  title: "District 11 — Melina Hettiaratchi (LDP-endorsed)",
  callout_kind: "priority",
  callout_label: "Highest priority — D offensive flip",
  callout_body:
    "The only Metro Council race where the partisan baseline is genuinely 50/50. Two-candidate race against the Republican. Highest marginal return per dollar and per door of any race on the map. Win this and the cycle is a success.",
  metrics: [
    { metric: "Total voters", value: "20,521" },
    { metric: "Dem registration", value: "46.6%" },
    { metric: "Booker 2022 share", value: "50.8% (won by 0.8 points)" },
    { metric: "Harris 2024 share", value: "51.6%" },
    { metric: "Sleeper Dems (post-primary)", value: "3,463" },
    { metric: "Independent general voters", value: "1,672" },
    { metric: "Win number (50% +1 of ~14K projected turnout)", value: "~7,000+" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "Heavy persuasion in DEFEND precincts. Issue-based messaging from Q1/Q2 primary data. Multi-channel: mail + digital + door. Coordinate with Hettiaratchi campaign. Independent voter outreach.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy:
        "Highest contact rate per voter on the map. Sleeper Dems are the margin. Daily early-vote tracking.",
    },
  ],
};

export const GP_D17: GeneralPlanRace = {
  id: "mc17",
  title: "District 17 — CM Markus Winkler (LDP-endorsed)",
  callout_kind: "priority",
  callout_label: "Highest priority — GOP targeted all year",
  callout_body:
    "Specifically targeted by the Republican Party. Winkler won the three-way primary at 59.9%; faces Walters (21.92% primary) in November. Essentially a 50/50 district by registration. The 3,934 sleeper Dems are the margin of victory.",
  metrics: [
    { metric: "Total voters", value: "22,782" },
    { metric: "Dem registration", value: "49.7%" },
    { metric: "Booker 2022 share", value: "57.0%" },
    { metric: "Harris 2024 share", value: "58.0%" },
    { metric: "Sleeper Dems", value: "3,934" },
    { metric: "Independent general voters", value: "1,930" },
    { metric: "DEFEND precincts", value: "6 (margin under 5 pts)" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "Heavy persuasion in DEFEND precincts. Issue-based messaging from primary data (public safety led D17 issue capture). Walters' Anchorage school-board attendance record is the strongest contrast point for persuasion mail.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy:
        "Every identified supporter gets contacted. The 3,934 sleeper Dems are the margin.",
    },
  ],
};

export const GP_D7: GeneralPlanRace = {
  id: "mc7",
  title: "District 7 — CW Paula McCraney (LDP-endorsed)",
  callout_kind: "priority",
  callout_label: "Highest priority — R defense",
  callout_body:
    "McCraney faces a declared Republican challenger and has been specifically targeted by the GOP. At 50.1% Dem registration this is near parity — one of the most competitive Metro Council races of the cycle.",
  metrics: [
    { metric: "Total voters", value: "23,367" },
    { metric: "Dem registration", value: "50.1%" },
    { metric: "Booker 2022 share", value: "60.2%" },
    { metric: "Harris 2024 share", value: "60.0%" },
    { metric: "Sleeper Dems", value: "4,081" },
    { metric: "Independent general voters", value: "1,978" },
    { metric: "ACTIVATE precincts", value: "18 of 25" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "Most competitive MC race of the cycle. Heavy persuasion + sleeper Dem activation. The 4,081 sleeper Dems and 1,978 Independents are the universe.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy: "Full court press. Every identified Democrat gets contacted.",
    },
  ],
};

export const GP_D21: GeneralPlanRace = {
  id: "mc21",
  title: "District 21 — CW Betsy Ruhe (LDP-endorsed)",
  callout_kind: "warn",
  callout_label: "Turnout critical — R defense",
  callout_body:
    "Ruhe won a four-way primary at 49.17%. Faces Lonnie Joseph (25.81% primary) in November. Risk: Joseph consolidating his uncle JJ Joseph's D12 voter base. Friendliest baseline of the R-defense races at 57.8% Dem registration, but historically a low-turnout district.",
  metrics: [
    { metric: "Total voters", value: "16,734" },
    { metric: "Dem registration", value: "57.8%" },
    { metric: "Booker 2022 share", value: "62.0%" },
    { metric: "Harris 2024 share", value: "58.9%" },
    { metric: "GOTV Targets", value: "3,324" },
    { metric: "Sleeper Dems", value: "2,777" },
    { metric: "PRIMARY precincts", value: "19 of 26" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "Consolidate Dem support behind Ruhe. Persuasion targets: primary opponents' voters. Emphasize Ruhe's incumbent record on parks and the shelter ordinance.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy: "Low-turnout district historically. GOTV intensity must be above average.",
    },
  ],
};

export const GP_D9: GeneralPlanRace = {
  id: "mc9",
  title: "District 9 — Brotzge-Elder · Parr (general endorsement pending)",
  callout_kind: "warn",
  callout_label: "Turnout critical — R defense",
  callout_body:
    "Four-way primary advanced two candidates: Alison Brotzge-Elder (33.18%) and Andrea Parr (29.13%). Lowest Democratic registration share of the priority districts at 56% — the partisan baseline alone won't carry this race. Candidate vetting in progress before DEC endorsement.",
  metrics: [
    { metric: "Total voters", value: "23,141" },
    { metric: "Dem registration", value: "56.1%" },
    { metric: "Booker 2022 share", value: "68.2%" },
    { metric: "Harris 2024 share", value: "68.8%" },
    { metric: "Sleeper Dems", value: "4,118 (highest of priority races)" },
    { metric: "Independent general voters", value: "1,941" },
    { metric: "Precincts", value: "30" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "DEC endorsement first, then full canvass. The 4,118 sleeper Dems are the activation universe. Issue-based messaging from primary data.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy:
        "Lower Dem registration share means turnout intensity must be above average. Coordinate with endorsed candidate.",
    },
  ],
};

export const GP_D1: GeneralPlanRace = {
  id: "mc1",
  title: "District 1 — CW Tammy Hawkins (general endorsement pending)",
  callout_kind: "info",
  callout_label: "General election race — nonpartisan defense",
  callout_body:
    "Hawkins is the incumbent and was LDP-endorsed in the primary. Two-candidate auto-advance race. The DEC has not yet voted on the general endorsement. At 73.3% Dem registration the partisan baseline is friendly, but the nonpartisan ballot format means voters don't see party labels — voter contact has to name candidates.",
  metrics: [
    { metric: "Total voters", value: "18,021" },
    { metric: "Dem registration", value: "73.3%" },
    { metric: "Booker 2022 share", value: "78.9%" },
    { metric: "Harris 2024 share", value: "76.1%" },
    { metric: "Sleeper Dems", value: "3,514" },
    { metric: "GOTV Targets", value: "4,579" },
    { metric: "Independent general voters", value: "739" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "DEC endorsement first. Voter contact names Hawkins explicitly — nonpartisan ballot doesn't give voters a party label to follow. Strong Dem registration carries the race if turnout holds.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy:
        "Sleeper Dem activation + GOTV Target mobilization. Highest Dem registration share of priority races — base mobilization wins.",
    },
  ],
};

export const GP_D5: GeneralPlanRace = {
  id: "mc5",
  title: "District 5 — CW Donna Purvis (general endorsement pending)",
  callout_kind: "info",
  callout_label: "General election race — nonpartisan defense",
  callout_body:
    "Purvis is the incumbent. She faces a challenger after a six-way primary. The Executive Committee did not endorse in the primary. At 77.8% Dem registration this is one of the most Democratic Metro Council districts in the county — a partisan ballot would make this safe — but the nonpartisan ballot format introduces structural risk. DEC general endorsement and candidate vetting in progress.",
  metrics: [
    { metric: "Total voters", value: "18,049" },
    { metric: "Dem registration", value: "77.8%" },
    { metric: "Booker 2022 share", value: "89.9%" },
    { metric: "Harris 2024 share", value: "86.5%" },
    { metric: "Sleeper Dems", value: "2,931" },
    { metric: "GOTV Targets", value: "5,789" },
    { metric: "Independent general voters", value: "589" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "DEC endorsement decision required. Voter contact strategy depends on endorsement outcome. Regardless of endorsement, voter contact in D5 has to name candidates — nonpartisan ballot doesn't give voters a party label to follow.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy:
        "Strong Dem base if mobilized. 5,789 GOTV Targets are the priority.",
    },
  ],
};

export const PRIORITY_MC_RACES: GeneralPlanRace[] = [
  GP_D11,
  GP_D17,
  GP_D7,
  GP_D21,
  GP_D9,
  GP_D1,
  GP_D5,
];

export const TOP_OF_TICKET_BOOKER: GeneralPlanRace = {
  id: "us-senate",
  title: "U.S. Senate — Charles Booker (D)",
  callout_kind: "priority",
  callout_label: "Highest priority — the JeffCo anchor",
  callout_body:
    "JeffCo provides roughly 30–40% of statewide Democratic votes. If Booker doesn't hit his 2022 number here, the statewide math doesn't work. The seat is open — McConnell retiring — and Andy Barr is the Republican nominee.",
  metrics: [
    { metric: "Booker 2022 JeffCo performance", value: "164,065 votes (59.1%)" },
    { metric: "2022 US Senate JeffCo turnout", value: "277,772" },
    { metric: "2026 projected JeffCo turnout", value: "295,000–330,000" },
    { metric: "Target Booker JeffCo share", value: "60%+ (open seat raises the ceiling)" },
    { metric: "Implied Booker JeffCo vote range", value: "~177,000–198,000" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "Every Democratic voter in JeffCo sees Booker's name and knows why he's on the ballot. Coordinate with the Booker campaign. Where the campaign goes light, the party fills in.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy:
        "Top of every script. Booker is the first name on the sample ballot lit piece.",
    },
  ],
};

export const TOP_OF_TICKET_MAYOR: GeneralPlanRace = {
  id: "mayor",
  title: "Louisville Mayor — Craig Greenberg (LDP-endorsed)",
  callout_kind: "warn",
  callout_label: "Intra-Dem general — messaging different from 2022",
  callout_body:
    "Greenberg (52.5% primary) and Parrish-Wright (26.3% primary) both advanced under nonpartisan top-2. Both are Democrats. The LDP endorsed Greenberg; that carries to General. But the party can't run 'vote the Democratic ticket' on this race — voters need to know which Democrat the party stands behind. Parrish-Wright's organized progressive base overlaps with Metro Council base demographics; coordinate carefully so the Mayoral race doesn't pull volunteers from Metro Council defense.",
  metrics: [
    { metric: "Greenberg primary share", value: "52.5% (74,836 votes)" },
    { metric: "Parrish-Wright primary share", value: "26.3% (37,490 votes)" },
    { metric: "Other primary candidates eliminated", value: "21.2% combined (~30,000)" },
    { metric: "Total mayoral primary turnout", value: "~142,500" },
    { metric: "Projected mayoral general turnout", value: "~280,000–315,000" },
  ],
  phases: [
    {
      phase: "General (June–Oct)",
      strategy:
        "Name Greenberg explicitly in every party communication. Don't run anti-Parrish-Wright content — she's a Democrat. Coordinate calendar with Greenberg campaign.",
    },
    {
      phase: "GOTV (final 2 wks)",
      strategy:
        "Sample ballot lit piece names Greenberg. Voter contact closes with 'LDP endorses Greenberg for Mayor.'",
    },
  ],
};

export type BattlegroundHd = {
  hd: number;
  dem_margin: string;
  precincts: number;
  voters: number;
  sleeper_dems: number;
  note: string;
};

export const BATTLEGROUND_HDS: BattlegroundHd[] = [
  {
    hd: 48,
    dem_margin: "−1.8%",
    precincts: 29,
    voters: 29_966,
    sleeper_dems: 4_604,
    note: "Suhas Kulkarni won D primary 72.88%. Top D offensive flip target.",
  },
  {
    hd: 29,
    dem_margin: "+0.2%",
    precincts: 35,
    voters: 34_255,
    sleeper_dems: 6_077,
    note: "Highest sleeper Dem count of battlegrounds.",
  },
  {
    hd: 33,
    dem_margin: "+2.8%",
    precincts: 25,
    voters: 22_823,
    sleeper_dems: 3_725,
    note: "Jennifer Hardin won D primary 64.76%.",
  },
  {
    hd: 31,
    dem_margin: "+3.6%",
    precincts: 36,
    voters: 32_415,
    sleeper_dems: 5_501,
    note: "—",
  },
  {
    hd: 37,
    dem_margin: "+4.2%",
    precincts: 30,
    voters: 26_196,
    sleeper_dems: 4_391,
    note: "—",
  },
];

export type EndorsedSlateRow = {
  race: string;
  endorsed: string;
  status: string;
  pending: boolean;
};

export const ENDORSED_SLATE: EndorsedSlateRow[] = [
  { race: "Mayor", endorsed: "Craig Greenberg", status: "LDP endorsement carries — contested vs Parrish-Wright (Dem)", pending: false },
  { race: "MC District 1", endorsed: "Tammy Hawkins", status: "General endorsement pending DEC vote", pending: true },
  { race: "MC District 3", endorsed: "Kumar Rashad", status: "Rashad placed 2nd; DEC must choose between Dorsey and Rashad", pending: true },
  { race: "MC District 5", endorsed: "No primary endorsement", status: "DEC must decide on general endorsement", pending: true },
  { race: "MC District 7", endorsed: "Paula McCraney", status: "Carries — auto-advanced", pending: false },
  { race: "MC District 9", endorsed: "No primary endorsement", status: "DEC must endorse after candidate vetting", pending: true },
  { race: "MC District 11", endorsed: "Melina Hettiaratchi", status: "Carries — auto-advanced", pending: false },
  { race: "MC District 13", endorsed: "No endorsement", status: "Standard general process", pending: false },
  { race: "MC District 15", endorsed: "Jennifer Chappell", status: "Carries", pending: false },
  { race: "MC District 17", endorsed: "Markus Winkler", status: "Carries — won primary at 59.9%", pending: false },
  { race: "MC District 19", endorsed: "No endorsement", status: "Standard general process", pending: false },
  { race: "MC District 21", endorsed: "Betsy Ruhe", status: "Carries — won primary at 49.2%", pending: false },
  { race: "MC District 23", endorsed: "Ainsley Jones", status: "Carries", pending: false },
  { race: "MC District 25", endorsed: "No endorsement", status: "Standard general process", pending: false },
];

export type KpiRow = {
  kpi: string;
  target: string;
  why: string;
};

export const PHASE_2_KPIS: KpiRow[] = [
  { kpi: "Booker JeffCo share", target: "60%+", why: "2022 floor. Below this, statewide math fails." },
  { kpi: "Win D11", target: "Yes", why: "The cycle's offensive flip. Only true 50/50 MC race." },
  { kpi: "Win HD 48", target: "Yes", why: "Top State House flip. Father-daughter Kulkarni delegation if both win." },
  { kpi: "Hold D7, D9, D17, D21", target: "All four", why: "The R-defense slate. Losing one is a cycle of incumbent work undone." },
  { kpi: "Hold D1, D5", target: "Both", why: "Nonpartisan defense. Losing one would signal the nonpartisan switch works as a vote-suppression tool." },
  { kpi: "JeffCo turnout", target: "295,000+ ballots", why: "Model floor based on May primary expansion. Beating it gives margin." },
  { kpi: "Active volunteers", target: "500+ in priority districts", why: "Party-health metric. Determines 2027 capacity." },
  { kpi: "Active precinct captains", target: "25+ across the county", why: "Long-term infrastructure measure." },
];

export const PHASE_2_PLAYBOOK_STEPS: string[] = [
  "Log in to votebuilder.com",
  "Open folder: Voters → My Folders → 26 LDP General Searches & Lists",
  "Choose your Phase 2 list: Sleeper Dem GOTV, Persuasion (DEFEND/ACTIVATE), or Yard Sign List",
  "Filter to your precinct(s)",
  "Create Canvass Program (Actions → Create Canvass Program) and cut turf within the program",
  "Print or load to MiniVAN",
  "Know the Phase 2 script and the sample ballot",
  "Order sample ballot lit pieces for your district from the party — the lit piece does most of the work",
  "Recruit and equip volunteers — primary canvassers + Q6 yes signups",
  "Enter data after each shift (MiniVAN auto-syncs; paper lists use MyCampaign → Canvassing → Data Entry)",
  "Coordinate weekly with priority Metro Council and HD campaigns overlapping your territory",
  "Report progress weekly to the Vice Chair",
];

export const PHASE_2_DOOR_SCRIPT =
  "\"Hi, I'm [name], a volunteer with the Louisville Democratic Party. We're talking to neighbors about the November 3 election. Can I leave you with this sample ballot?\n\n[Present the ballot. Highlight LDP-endorsed candidates in the voter's district.]\n\nAre you planning to vote? Do you know whether you'll vote early or on Election Day?\n\n[Capture: voting plan, support level for top of ticket and priority races, any issue concerns to log.]\n\nThanks for your time. If you'd like to volunteer or get a yard sign, here's how.\"";

export type IssueLeadRow = {
  district: string;
  lead_issue: string;
  mail_lead: string;
};

export const ISSUE_LEADS: IssueLeadRow[] = [
  { district: "D11 (Hettiaratchi)", lead_issue: "Cost of Living (capture target ~30%)", mail_lead: "Cost of living mailer + digital, weeks 1–4 of Phase 2" },
  { district: "D17 (Winkler)", lead_issue: "Public Safety", mail_lead: "Public safety mailer; Walters' Anchorage attendance contrast" },
  { district: "D7 (McCraney)", lead_issue: "Mixed — Cost of Living + Education", mail_lead: "Two-track mail; sleeper Dem outreach prioritizes both issues" },
  { district: "D21 (Ruhe)", lead_issue: "Public Safety + Infrastructure", mail_lead: "Incumbent record on parks + shelter ordinance" },
  { district: "D9 (pending endorsement)", lead_issue: "Set after vetting", mail_lead: "Issue lead determined once candidate confirmed" },
  { district: "D1 (Hawkins) / D5 (Purvis)", lead_issue: "Run sample ballot first; issue messaging secondary", mail_lead: "Nonpartisan ballot education leads, issue follows" },
  { district: "HD 48 (Kulkarni)", lead_issue: "Cost of Living", mail_lead: "Cost of living focus through October; coordinate with Kulkarni campaign" },
];

export type ResourcingTier = {
  id: string;
  label: string;
  description: string;
  bullets: string[];
};

export const RESOURCING_TIERS: ResourcingTier[] = [
  {
    id: "baseline",
    label: "Baseline — what runs on current capacity",
    description: "These activities run regardless of additional fundraising.",
    bullets: [
      "Volunteer recruiting through the 26 LD chair structure",
      "Voter contact through existing precinct captain network",
      "Party social media and email lists for ticket promotion",
      "DEC endorsement process and visibility for endorsed candidates",
      "Coordination calls with candidate campaigns",
      "LD-level event support including yard signs in PRIMARY-strategy precincts",
    ],
  },
  {
    id: "coordinated-layer",
    label: "If the party invests in a coordinated layer",
    description: "If the Executive Committee allocates additional resources for coordinated operations, the plan also includes:",
    bullets: [
      "Coordinated mail in priority Metro Council districts — one piece per registered Democrat naming the endorsed candidate",
      "Geofenced digital ads in D11 (the offensive flip) and the priority defense districts",
      "Expanded volunteer training — two regional sessions focused on the nonpartisan ballot format",
      "Reimbursement budget for LD chairs running district-level voter contact",
      "Subsidized literature production for endorsed candidates in priority races",
    ],
  },
  {
    id: "coordinated-budget",
    label: "If the party fundraises a coordinated campaign budget",
    description: "If the Executive Committee and aligned fundraising partners raise a coordinated campaign budget, the plan also includes:",
    bullets: [
      "One paid field organizer working D11 (offensive flip) from August through Election Day",
      "One paid field organizer working D9 (defensive race in a competitive district)",
      "Voter ID program in priority defense districts — phone bank and door-knock waves",
      "Multi-channel persuasion in D11 — mail + digital + door",
      "Independent-voter outreach targeting the 95,000 Independents",
    ],
  },
  {
    id: "full-coordinated",
    label: "If the party commits to a fully coordinated cycle",
    description: "If sustained fundraising supports a full coordinated campaign infrastructure, the plan can further include:",
    bullets: [
      "Full field staff across the seven priority Metro Council races plus HD 48",
      "Coordinated absentee and early-vote chase program across JeffCo",
      "Year-round organizing presence in GROW-strategy precincts to set up 2027 and 2028",
      "Data infrastructure investment — VAN universe modernization, kypolitics integration",
    ],
  },
];
