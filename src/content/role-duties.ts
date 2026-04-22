// "Always" duties for the dashboard Working Set.
//
// These are what the LDPEC owes the county — phrased as standing
// obligations of the committee, not initiatives of any one person.
// Every line is bylaw-cited so the list reads as "your role has
// always asked this" rather than "someone's strategic plan says X."
//
// The matching "right now" specifics come from highest-leverage-rules.ts
// (cycle + role + LD aware). Same seven duties; different verbs per
// cycle phase.

export type Duty = {
  id:
    | "organize-precincts"
    | "recruit-candidates"
    | "voter-contact"
    | "fundraise"
    | "train"
    | "board-of-elections"
    | "amplify";
  label: string;
  shortBody: string;
  cite: string;
};

export const ALWAYS_DUTIES: Duty[] = [
  {
    id: "organize-precincts",
    label: "Organize your precincts",
    shortBody:
      "Keep Precinct Captains filled and active. Fill PC vacancies within 90 days of notification.",
    cite: "KDP Art. III.B · LJCDP §7",
  },
  {
    id: "recruit-candidates",
    label: "Recruit & support candidates",
    shortBody:
      "Every winnable seat needs a credible Democrat on the ballot. Endorsed candidates need your personal lift.",
    cite: "Candidate Recruitment committee · LDPEC §26",
  },
  {
    id: "voter-contact",
    label: "Run voter contact",
    shortBody:
      "Canvass, phonebank, GOTV at scale — in both primaries and November.",
    cite: "LDPEC election-year plan",
  },
  {
    id: "fundraise",
    label: "Fundraise locally",
    shortBody:
      "KDP + DNC cover less than a fifth of operating costs. The rest is raised in-county.",
    cite: "$120 Club · signature-event ticket sales",
  },
  {
    id: "train",
    label: "Train the next generation",
    shortBody:
      "LD Chairs, PCs, canvassers, and candidates all need onboarding — not assumed competence.",
    cite: "Training Committee",
  },
  {
    id: "board-of-elections",
    label: "Staff the Board of Elections",
    shortBody:
      "LDPEC nominates one Jefferson County voter to the Secretary of State; Governor appoints. Four-year term.",
    cite: "KRS 117.035",
  },
  {
    id: "amplify",
    label: "Amplify the party's voice",
    shortBody:
      "One reshare = free reach. When 50 board members reshare a post, organic reach 5–10x overnight.",
    cite: "Communications Committee",
  },
];
