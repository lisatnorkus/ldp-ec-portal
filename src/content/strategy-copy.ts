import type { Strategy } from "@/lib/db/precincts-types";

// Canonical cycle phases (match month_cards.theme_tag).
export type CyclePhase =
  | "OFF_CYCLE"
  | "PRIMARY_WINDOW"
  | "POST_PRIMARY"
  | "SUMMER"
  | "GENERAL"
  | "ELECTION_WEEK"
  | "POST_GENERAL";

export const PHASE_LABEL: Record<CyclePhase, string> = {
  OFF_CYCLE: "Off-cycle",
  PRIMARY_WINDOW: "Primary window",
  POST_PRIMARY: "Post-primary",
  SUMMER: "Summer build",
  GENERAL: "General cadence",
  ELECTION_WEEK: "Election week",
  POST_GENERAL: "Post-general",
};

export type StrategyEvergreen = {
  what: string;
  who: string;
  yourJob: string;
};

// Evergreen definitions — always true, independent of phase. These
// are the "what is this bucket" answer for a new EC member.
export const STRATEGY_EVERGREEN: Record<Strategy, StrategyEvergreen> = {
  PRIMARY: {
    what: "Neighborhoods where Democrats win by 20+ points. The party's floor and power base.",
    who: "Registered Dems who vote in most primaries and generals. Our most reliable voters.",
    yourJob:
      "Don't persuade — turn out. Power Base is also the richest recruiting ground in the county: volunteers, precinct captains, future candidates all live here.",
  },
  DEFEND: {
    what: "Toss-up precincts — margin under 5 points. Every individual contact is a margin vote.",
    who: "Mix of Dem, Independent, and soft-R voters. The deciders who pick November.",
    yourJob:
      "Persuasion AND turnout, both. Best canvass ROI in the county. Every door knocked here is worth three in a safe precinct.",
  },
  ACTIVATE: {
    what: "Dem-leaning precincts (average D+12) where many registered Dems skip primaries.",
    who: "The 'sleeper Dem' universe — registered Democrats who show up in generals but not May primaries. Huge turnout upside.",
    yourJob:
      "Activate. Wake them up before primary day. Every inconsistent primary voter you convert into a reliable one is a 2x vote — they'll show in the general too.",
  },
  GROW: {
    what: "R-leaning precincts. The party is underwater here, but Democrats exist.",
    who: "A minority of registered Dems plus hidden Dem-leaning independents. Identification, not persuasion, is the first move.",
    yourJob:
      "Long-term investment. Find the hidden Dems, register new ones, build a bench. This is 2028 work, not May 2026 work.",
  },
};

// Phase-aware "why now" copy. One sentence per strategy × phase. The
// page shows the CURRENT phase front-and-center and collapses the rest.
export const STRATEGY_WHY_NOW: Record<Strategy, Record<CyclePhase, string>> = {
  PRIMARY: {
    OFF_CYCLE:
      "Build the bench. Power Base precincts are where new captains, PCs, and candidates come from. Recruit while the pressure is off.",
    PRIMARY_WINDOW:
      "Primary turnout is everything. Every sleeper Dem here who skips May is a missed 2-point swing countywide. Canvass, call, text.",
    POST_PRIMARY:
      "Recruit every volunteer who showed up in May into sustained precinct work. Highest-yield captain pool of the cycle.",
    SUMMER:
      "Keep the network warm with low-stakes relationship events — block parties, dinners, Know-Your-Neighbors cookouts. Don't let May energy fade.",
    GENERAL:
      "Base turnout, not persuasion. GOTV contact — reminders, ride offers, voting-plan conversations.",
    ELECTION_WEEK:
      "Max cadence GOTV. Power Base precincts turning out at 65% vs 75% is the whole margin. Layer contacts.",
    POST_GENERAL:
      "Thank every volunteer by name. Retention matters more in Power Base than anywhere else — these people are your 2028 bench.",
  },
  DEFEND: {
    OFF_CYCLE:
      "Captain coverage is urgent. Every DEFEND precinct needs eyes before the next cycle ramps. Uncovered DEFEND = vote left on the table.",
    PRIMARY_WINDOW:
      "Secondary priority right now. Reliable Dems in DEFEND will show; focus May energy on Power Base + Wake the Vote.",
    POST_PRIMARY:
      "Start planning fall canvass waves. DEFEND is where the November general gets decided — begin turf design now.",
    SUMMER:
      "Community events + voter reg drives. Show up for non-political things so when the ads start flying, you already have trust built.",
    GENERAL:
      "THE priority bucket. Weekly canvass cadence. Every voter gets a face-to-face touch before the general. Layer with mail, text, call.",
    ELECTION_WEEK:
      "Layered contact — voters who heard from us once need a second touch this week. Final persuasion + GOTV simultaneously.",
    POST_GENERAL:
      "Debrief hard. Which DEFEND precincts moved, which didn't, why. This is where the strategy gets written for the next cycle.",
  },
  ACTIVATE: {
    OFF_CYCLE:
      "Captain recruitment is the unlock. You can't activate precincts you don't have eyes in — recruit first, program second.",
    PRIMARY_WINDOW:
      "TOP PRIORITY right now. Sleeper Dems are the highest-yield target of any bucket in the county. Every wake-up = a 2x vote through November.",
    POST_PRIMARY:
      "Analyze turnout. Who moved from sleeper to reliable? Bank those names — they're your general canvass list.",
    SUMMER:
      "Keep the pipeline warm. Your May activators are your fall canvass team — stay in touch so they don't lapse between cycles.",
    GENERAL:
      "Continue layering contact. Sleepers who voted in May need another nudge for November or they slide back into inconsistent.",
    ELECTION_WEEK:
      "GOTV contact is decisive here. These voters vote when asked and stay home when not. Ask them.",
    POST_GENERAL:
      "Track which activated precincts turned out at general pace. That's your 2028 playbook — what you did here is replicable.",
  },
  GROW: {
    OFF_CYCLE:
      "One captain per precinct is a win. You're planting a flag, not running a program. Identification over mobilization.",
    PRIMARY_WINDOW:
      "Skip it. Every hour spent in GROW during the primary window is an hour stolen from Power Base or Wake the Vote. Come back in June.",
    POST_PRIMARY:
      "Voter registration drives, not persuasion. Find the hidden Dems — new movers, young voters, returning citizens.",
    SUMMER:
      "Long-game community presence. Show up to festivals, parades, church events. Don't pitch candidates — just be visible as Democrats.",
    GENERAL:
      "Don't spend canvass labor here. If you have leftover volunteers, send them to DEFEND. GROW precincts won't move this cycle.",
    ELECTION_WEEK:
      "Ignore. Every resource goes to DEFEND and ACTIVATE. GROW is a 2028 investment, not a 2026 contact plan.",
    POST_GENERAL:
      "Track registration shifts. Are we building Dem base here, or losing ground to R consolidation? That tells us if the investment is working.",
  },
};

// Given today's date, figure out which phase we're in. Simple month-
// lookup for now — matches the month_cards seed that the rest of the
// portal already uses, so phases are consistent across /this-month,
// /targeting, and any future phase-aware surfaces.
export function currentPhaseForDate(d: Date = new Date()): CyclePhase {
  const month = d.getMonth() + 1; // 1-12
  const isEvenYear = d.getFullYear() % 2 === 0;

  // Even-year federal/state cycle
  if (isEvenYear) {
    if (month === 1) return "OFF_CYCLE";
    if (month >= 2 && month <= 4) return "PRIMARY_WINDOW";
    if (month === 5) return "PRIMARY_WINDOW"; // election week handled separately if within 7 days
    if (month === 6) return "POST_PRIMARY";
    if (month >= 7 && month <= 8) return "SUMMER";
    if (month >= 9 && month <= 10) return "GENERAL";
    if (month === 11) return "ELECTION_WEEK";
    if (month === 12) return "POST_GENERAL";
  }

  // Odd year
  if (month >= 1 && month <= 3) return "OFF_CYCLE";
  if (month >= 4 && month <= 6) return "SUMMER";
  if (month >= 7 && month <= 10) return "SUMMER";
  if (month === 11) return "POST_GENERAL";
  return "OFF_CYCLE";
}
