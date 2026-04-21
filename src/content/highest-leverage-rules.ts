// Highest-leverage-move rules engine.
// Canonical source: docs/highest-leverage-rules.md (Lisa red-pen April 21, 2026).
// Rule 8 deleted; Rule 15 deferred to post-June chair transition.
// Tone across all rules: supportive opportunities, not obligations.

import type { Strategy } from "@/lib/db/precincts";

export type Phase =
  | "PRIMARY"
  | "PRIMARY_LOCKDOWN"
  | "POST_PRIMARY"
  | "SUMMER"
  | "GENERAL"
  | "GENERAL_LOCKDOWN"
  | "POST_GENERAL";

export type RoleKey =
  | "OFFICER"
  | "LD_CHAIR"
  | "LD_VC"
  | "AT_LARGE"
  | "LYD_PRES"
  | "WOMENS_CLUB_PRES"
  | "PRECINCT_CAPTAIN"
  | "COMMITTEE_CHAIR_ONLY";

export type UserContext = {
  role: RoleKey;
  ld_number?: number | null;
  hold_the_line_count?: number;
  power_base_count?: number;
  wake_the_vote_count?: number;
  pc_vacancy_count?: number;
  pc_vacancy_count_in_hold_the_line?: number;
  priority_mc_overlap?: number[];
  has_contested_primary?: boolean;
  countywide_dark_precinct_count?: number;
  next_event_days_until?: number;
  next_event_name?: string;
  raise_progress_dollars?: number;
  precinct_id?: string;
  strategy?: Strategy | null;
};

export type Recommendation = {
  rule_id: number;
  priority: number;
  text: string;
  rationale: string;
};

// Phase determination from today's date.
export function getCurrentPhase(now: Date = new Date()): Phase {
  const y = now.getFullYear();
  const m = now.getMonth() + 1; // 1-12
  const d = now.getDate();
  const ymd = y * 10000 + m * 100 + d;

  // 2026 windows (per docs/highest-leverage-rules.md)
  const PRIMARY_LOCKDOWN_START = 20260514;
  const PRIMARY_END = 20260519;
  const POST_PRIMARY_END = 20260630;
  const SUMMER_END = 20260831;
  const GENERAL_LOCKDOWN_START = 20261029;
  const GENERAL_END = 20261103;
  const POST_GENERAL_END = 20261231;

  if (ymd < PRIMARY_LOCKDOWN_START) return "PRIMARY";
  if (ymd <= PRIMARY_END) return "PRIMARY_LOCKDOWN";
  if (ymd <= POST_PRIMARY_END) return "POST_PRIMARY";
  if (ymd <= SUMMER_END) return "SUMMER";
  if (ymd < GENERAL_LOCKDOWN_START) return "GENERAL";
  if (ymd <= GENERAL_END) return "GENERAL_LOCKDOWN";
  if (ymd <= POST_GENERAL_END) return "POST_GENERAL";
  // Default: pre-primary (treat as PRIMARY for v1)
  return "PRIMARY";
}

const FRIENDLY_STRATEGY: Record<Strategy, string> = {
  PRIMARY: "Power Base",
  DEFEND: "Hold the Line",
  ACTIVATE: "Wake the Vote",
  GROW: "Plant the Flag",
};

function plural(n: number): string {
  return n === 1 ? "" : "s";
}

function listJoin(xs: (number | string)[]): string {
  if (xs.length === 0) return "";
  if (xs.length === 1) return String(xs[0]);
  if (xs.length === 2) return `${xs[0]} and ${xs[1]}`;
  return xs.slice(0, -1).join(", ") + ", and " + xs[xs.length - 1];
}

type Rule = {
  id: number;
  priority: number;
  roles: RoleKey[];
  phases: Phase[];
  matches: (ctx: UserContext) => boolean;
  render: (ctx: UserContext, phase: Phase) => string;
  rationale: string;
};

// Active rule IDs: 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 16
// Rule 8 and Rule 15 intentionally omitted per Lisa's April 21 red-pen.
const RULES: Rule[] = [
  {
    id: 1,
    priority: 1,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["PRIMARY_LOCKDOWN", "GENERAL_LOCKDOWN"],
    matches: () => true,
    render: (ctx, phase) => {
      const isGeneral = phase === "GENERAL_LOCKDOWN";
      const endDate = isGeneral ? "November 3" : "May 19";
      const electionDay = isGeneral ? "November 3, 2026" : "May 19, 2026";
      const ld = ctx.ld_number ? `LD${ctx.ld_number}` : "Your LD";
      return `Election week — early voting is open through ${endDate}, and Election Day is ${electionDay}. The most important thing you can do is show up: doors, phones, rides to the polls, anything. ${ld} overlaps some real turf this cycle. After Tuesday, rest.`;
    },
    rationale: "Election-week lockdown always wins; recovery after.",
  },
  {
    id: 2,
    priority: 10,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["PRIMARY"],
    matches: (ctx) =>
      (ctx.hold_the_line_count ?? 0) >= 1 && (ctx.priority_mc_overlap?.length ?? 0) > 0,
    render: (ctx) =>
      `Your LD overlaps MC${listJoin(ctx.priority_mc_overlap ?? [])}, one of the three priority districts countywide. The ${ctx.hold_the_line_count} Hold the Line precincts there are where turnout decides the primary winner — any time you can give to doors in those precincts before May 19 would make a real difference.`,
    rationale: "Priority MCs are the countywide battlegrounds; frame as opportunity.",
  },
  {
    id: 3,
    priority: 15,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["PRIMARY"],
    matches: (ctx) => ctx.has_contested_primary === true,
    render: (ctx) =>
      `A contested Democratic primary is on your LD's ballot. Primaries are decided by turnout, not persuasion — the voters who already lean Democratic but don't always show up in May. Your ${ctx.power_base_count ?? "Power Base"} Power Base precincts are where those voters live. A door shift there this week would help.`,
    rationale: "Contested primaries reward the candidate whose people show up.",
  },
  {
    id: 4,
    priority: 20,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["PRIMARY"],
    matches: (ctx) =>
      (ctx.hold_the_line_count ?? 0) >= 1 &&
      (ctx.pc_vacancy_count_in_hold_the_line ?? 0) >= 1,
    render: (ctx) => {
      const n = ctx.pc_vacancy_count_in_hold_the_line ?? 0;
      return `You have ${n} Hold the Line precinct${plural(n)} in LD${ctx.ld_number ?? ""} without an active Precinct Captain. Those are battleground precincts — filling even one this week would be a real win, and the person you find doesn't have to be perfect to start.`;
    },
    rationale: "Dark battleground precincts are the most expensive organizing failure.",
  },
  {
    id: 5,
    priority: 30,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["PRIMARY"],
    matches: (ctx) => ctx.has_contested_primary === false,
    render: () =>
      `No contested Democratic primary in your LD this cycle — which is actually a gift. You can start November work early. Any Power Base voter you help mobilize in May is already a November voter.`,
    rationale: "Uncontested LDs get to start GOTV early; reframe as gift.",
  },
  {
    id: 6,
    priority: 40,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["POST_PRIMARY"],
    matches: () => true,
    render: () =>
      `Primary's done. The next six weeks are a great window to plug into one standing committee if you haven't already. Committees run year-round and this is when people are most available to join and actually contribute.`,
    rationale: "Post-primary = peak committee-engagement window before July slump.",
  },
  {
    id: 7,
    priority: 50,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["SUMMER"],
    matches: (ctx) => (ctx.pc_vacancy_count ?? 0) >= 1,
    render: (ctx) =>
      `${ctx.pc_vacancy_count} precincts in LD${ctx.ld_number ?? ""} are currently dark. Summer is a good season to identify Precinct Captain candidates for the 2028 Precinct Conventions — a conversation or two now can plant the seed.`,
    rationale: "2028 PC recruitment starts in summer 2026.",
  },
  // Rule 8 DELETED per red-pen (LDPEC meets monthly).
  {
    id: 9,
    priority: 60,
    roles: ["LD_CHAIR", "LD_VC", "AT_LARGE", "OFFICER"],
    phases: ["PRIMARY", "POST_PRIMARY", "SUMMER", "GENERAL", "POST_GENERAL"],
    matches: (ctx) =>
      ctx.next_event_days_until != null &&
      ctx.next_event_days_until <= 30 &&
      ctx.next_event_days_until >= 0 &&
      !!ctx.next_event_name,
    render: (ctx) => {
      const raise = ctx.raise_progress_dollars ?? 0;
      return `${ctx.next_event_name} is in ${ctx.next_event_days_until} days. Your personalized ticket link went out (or goes out soon) — every ticket sold through your link counts toward your $500 annual raise. Current raise progress: $${raise} of $500. Pushing the link to one new person this week is how the event lands.`;
    },
    rationale: "Signature events live or die on 30-day ramp; ticket-link mechanism is the $500-raise driver.",
  },
  {
    id: 10,
    priority: 70,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["GENERAL"],
    matches: (ctx) => (ctx.hold_the_line_count ?? 0) >= 1,
    render: (ctx) =>
      `General cycle. Your ${ctx.hold_the_line_count} Hold the Line precincts are where the margin lives. Every sleeper Dem who shows up matters. Any turf you can cut — once a week, whatever fits — makes a real difference through November 3.`,
    rationale: "Battleground precincts during general are the reason anything else matters.",
  },
  {
    id: 11,
    priority: 75,
    roles: ["LD_CHAIR", "LD_VC"],
    phases: ["GENERAL"],
    matches: (ctx) =>
      (ctx.wake_the_vote_count ?? 0) >= 1 && (ctx.hold_the_line_count ?? 0) === 0,
    render: (ctx) => {
      const n = ctx.wake_the_vote_count ?? 0;
      return `You have ${n} Wake the Vote precinct${plural(n)} — Dem-leaning voters who skip anything but presidential years. The final 30 days is when they need a door. Even one shift there would help.`;
    },
    rationale: "Activate LDs have a different job than Defend LDs — wake the sleeping voters.",
  },
  {
    id: 12,
    priority: 80,
    roles: ["AT_LARGE"],
    phases: ["PRIMARY", "POST_PRIMARY", "SUMMER", "GENERAL"],
    matches: (ctx) => (ctx.countywide_dark_precinct_count ?? 0) >= 20,
    render: (ctx) =>
      `You serve the county, not one LD. ${ctx.countywide_dark_precinct_count} precincts countywide are currently without an active Precinct Captain. Picking three LDs with the most vacancies and asking those Chairs what you can take on is exactly what At-Large is for.`,
    rationale: "At-Large exists to fill the gaps LDs can't.",
  },
  {
    id: 13,
    priority: 85,
    roles: ["AT_LARGE"],
    phases: ["PRIMARY", "GENERAL"],
    matches: (ctx) => (ctx.priority_mc_overlap?.length ?? 0) > 0 || true, // Always — priority MCs are a countywide fact
    render: (ctx) => {
      const mcs = ctx.priority_mc_overlap?.length ? ctx.priority_mc_overlap : [7, 17, 21];
      return `MC${listJoin(mcs)} are the three priority districts that decide November countywide. Picking one this week — doors, phones, or coordination with the LD Chairs whose LDs overlap — is high-impact At-Large work.`;
    },
    rationale: "Priority MC races benefit from countywide muscle beyond any one LD.",
  },
  {
    id: 14,
    priority: 100,
    roles: ["PRECINCT_CAPTAIN"],
    phases: ["PRIMARY", "PRIMARY_LOCKDOWN", "POST_PRIMARY", "SUMMER", "GENERAL", "GENERAL_LOCKDOWN", "POST_GENERAL"],
    matches: () => true,
    render: (ctx, phase) => {
      const actions: Record<Phase, string> = {
        PRIMARY: "pull your precinct's Dem-strong list and make ten calls — even quick introductions count",
        PRIMARY_LOCKDOWN: "pull your precinct's Dem-strong list and make ten calls — even quick introductions count",
        POST_PRIMARY: "debrief briefly with your LD Chair about what worked and what didn't",
        SUMMER: "find one person in your precinct who'd be open to volunteering in the fall",
        GENERAL: "cover one block on any canvass shift that fits your schedule",
        GENERAL_LOCKDOWN: "cover one block on any canvass shift that fits your schedule",
        POST_GENERAL: "thank the volunteers who showed up in your precinct — a text is enough",
      };
      const strategyLabel = ctx.strategy ? FRIENDLY_STRATEGY[ctx.strategy] : "(strategy not set)";
      const precinctLabel = ctx.precinct_id ?? "(precinct not set)";
      return `Your precinct is ${precinctLabel}, strategy: ${strategyLabel}. This week: ${actions[phase]}. PCs are the field — your work is what turns numbers into voters.`;
    },
    rationale: "PC-role users need a concrete, cycle-specific nudge every visit.",
  },
  // Rule 15 DEFERRED (committee-chair rules, post-June chair transition).
  {
    id: 16,
    priority: 999,
    roles: [
      "OFFICER",
      "LD_CHAIR",
      "LD_VC",
      "AT_LARGE",
      "LYD_PRES",
      "WOMENS_CLUB_PRES",
      "PRECINCT_CAPTAIN",
      "COMMITTEE_CHAIR_ONLY",
    ],
    phases: [
      "PRIMARY",
      "PRIMARY_LOCKDOWN",
      "POST_PRIMARY",
      "SUMMER",
      "GENERAL",
      "GENERAL_LOCKDOWN",
      "POST_GENERAL",
    ],
    matches: () => true,
    render: () =>
      `Stay active. The next LDPEC meeting is a great place to start. Pick one thing from Current Work (Tour Step 5) and plug in.`,
    rationale: "Safety-net fallback.",
  },
];

export function evaluateRules(ctx: UserContext, now: Date = new Date()): Recommendation | null {
  const phase = getCurrentPhase(now);
  // Priority order (lower integer first); first match wins.
  const sorted = [...RULES].sort((a, b) => a.priority - b.priority);
  for (const rule of sorted) {
    if (!rule.roles.includes(ctx.role)) continue;
    if (!rule.phases.includes(phase)) continue;
    if (!rule.matches(ctx)) continue;
    return {
      rule_id: rule.id,
      priority: rule.priority,
      text: rule.render(ctx, phase),
      rationale: rule.rationale,
    };
  }
  return null;
}
