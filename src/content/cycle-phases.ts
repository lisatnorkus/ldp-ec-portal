// 2026 cycle phases — the horizontal timeline shown on the dashboard
// and as a thin bar on every section-page header.
//
// Source of truth for phase dates lives here. Keep in sync with
// src/content/highest-leverage-rules.ts (getCurrentPhase) if rule
// windows shift.

export type CyclePhase = {
  id: string;
  label: string;
  shortLabel: string; // for the thin bar
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  anchor?: string; // single date (election day) for countdown context
  phase: "PRIMARY" | "POST_PRIMARY" | "SUMMER" | "GENERAL" | "POST_GENERAL" | "2027" | "2028";
  description: string;
};

export const CYCLE_PHASES: CyclePhase[] = [
  {
    id: "primary-2026",
    label: "Primary Campaign",
    shortLabel: "Primary",
    start: "2026-04-21",
    end: "2026-05-19",
    anchor: "2026-05-19",
    phase: "PRIMARY",
    description: "Contested Democratic primaries, canvass, doors, endorsement turnout. Primary Day is May 19.",
  },
  {
    id: "post-primary-2026",
    label: "Post-Primary",
    shortLabel: "Post-Primary",
    start: "2026-05-20",
    end: "2026-06-30",
    phase: "POST_PRIMARY",
    description: "Debrief, committee plug-ins, recovery. Committee chairs transition end of June.",
  },
  {
    id: "summer-2026",
    label: "Summer Engagement",
    shortLabel: "Summer",
    start: "2026-07-01",
    end: "2026-08-31",
    phase: "SUMMER",
    description: "Voter registration, PC recruiting for 2028, Women Deliver Democracy event in August.",
  },
  {
    id: "general-2026",
    label: "General Election",
    shortLabel: "General",
    start: "2026-09-01",
    end: "2026-11-03",
    anchor: "2026-11-03",
    phase: "GENERAL",
    description: "GOTV for the Nov 3 general. Hold-the-Line precincts are the entire game. Early voting starts Oct 29.",
  },
  {
    id: "post-general-2026",
    label: "Post-General",
    shortLabel: "Wind-down",
    start: "2026-11-04",
    end: "2026-12-31",
    phase: "POST_GENERAL",
    description: "Dems at the Downs, close-out, annual LD reports, 2027 prep.",
  },
  {
    id: "2027",
    label: "2027 Governor Cycle",
    shortLabel: "2027 Gov",
    start: "2027-01-01",
    end: "2027-12-31",
    phase: "2027",
    description: "Kentucky governor's race. Reorg prep ramps through the year.",
  },
  {
    id: "2028",
    label: "Quadrennial Reorganization",
    shortLabel: "2028 Reorg",
    start: "2028-01-01",
    end: "2028-12-31",
    phase: "2028",
    description: "Expected to restore normal presidential-year alignment. Precinct Conventions → LD Conventions → joint post-LD election → State Convention. See Tour Step 6.",
  },
];

export function getCurrentCyclePhase(now: Date = new Date()): CyclePhase {
  const ymd = now.toISOString().slice(0, 10);
  for (const phase of CYCLE_PHASES) {
    if (ymd >= phase.start && ymd <= phase.end) return phase;
  }
  return CYCLE_PHASES[0];
}

export function daysUntil(dateStr: string, now: Date = new Date()): number {
  const d = new Date(dateStr + "T00:00:00");
  const diffMs = d.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

// Plan cards shown beneath the timeline. Each links out to the real doc folder
// so first-term members land on the actual LDP primary / general plans, not
// on content repeated inside the portal.

export type PlanCard = {
  id: string;
  status: "LIVE" | "TEED_UP" | "HORIZON";
  title: string;
  eyebrow: string;
  body: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryLinks?: { label: string; href: string }[];
};

export const PLAN_CARDS: PlanCard[] = [
  {
    id: "primary",
    status: "LIVE",
    title: "The Primary Plan",
    eyebrow: "Live right now · May 19 primary",
    body:
      "Contested D primaries in several LDs (HD29, HD33, HD43, HD44, HD48) and all 10 on-ballot Metro Council districts. The priority MC 7/17/21 turf decides November countywide. The plan details — targeting, canvass cadence, endorsements, volunteer math — live in the Election Year Plan folder.",
    primaryCtaLabel: "Open the Primary Plan folder →",
    primaryCtaHref: "https://drive.google.com/drive/folders/1wNc9Ea5K-xIvuWPftgSQiqMqYiB5gscx",
    secondaryLinks: [
      {
        label: "LD Chair VoteBuilder Guide",
        href: "https://drive.google.com/file/d/1rjSsSO8b84-Gw3BhPW1A_diMNGTgY5Xo/view",
      },
      {
        label: "Canvassing Guide (packet)",
        href: "https://drive.google.com/file/d/1tId_OBvdwa5TGME7LMIX26idTZ8iG_Dj/view",
      },
      { label: "Canvass Tools in the portal", href: "/canvass-tools" },
    ],
  },
  {
    id: "general-gotv",
    status: "TEED_UP",
    title: "General + GOTV Plan",
    eyebrow: "Teed up · Nov 3 general",
    body:
      "Post-primary, the plan flips to general-election GOTV: Hold-the-Line precincts first, Wake-the-Vote precincts in the final 30 days, Sleeper Dems as the margin. Same Election Year Plan folder — the general + GOTV sections sit alongside the primary plan there.",
    primaryCtaLabel: "Open the General + GOTV sections →",
    primaryCtaHref: "https://drive.google.com/drive/folders/1wNc9Ea5K-xIvuWPftgSQiqMqYiB5gscx",
    secondaryLinks: [
      {
        label: "Mobilize (volunteer events)",
        href: "https://www.mobilize.us/louisvilledemocrats/",
      },
      {
        label: "Volunteer FB group",
        href: "https://www.facebook.com/groups/LouisvilleDemsVolunteers",
      },
    ],
  },
  {
    id: "long-horizon",
    status: "HORIZON",
    title: "2027 Governor · 2028 Reorg",
    eyebrow: "On the horizon",
    body:
      "After November 3, LDP shifts to the Kentucky governor's race and reorg prep. Spring 2028 is the quadrennial reorganization — every seat resets. Step 6 of the tour walks through what that looks like for your role.",
    primaryCtaLabel: "Tour Step 6: Reorg & Delegate Selection →",
    primaryCtaHref: "/tour/6",
  },
];
