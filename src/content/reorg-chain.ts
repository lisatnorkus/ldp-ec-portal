// Reorg & Delegate Selection — structured content for Tour Step 6.
// Source: docs/reorg-delegate-selection.md.

export type ReorgStep = {
  num: 1 | 2 | 3 | 4;
  title: string;
  headline: string;
  bodyParagraphs: string[];
};

export const REORG_CHAIN: ReorgStep[] = [
  {
    num: 1,
    title: "Precinct Conventions",
    headline: "Every precinct elects three people.",
    bodyParagraphs: [
      "Every precinct in Jefferson County holds a Precinct Convention. Registered Democrats in the precinct show up and elect three people: one Precinct Captain Man, one Precinct Captain Woman, and one Precinct Captain Youth (age 35 or under).",
      "Basis: KDP Art. III.B (Precinct Committee). These three people are \"the primary Party Officials responsible for organizing and building Democratic power within [the] precinct.\"",
      "In a precinct with no active organizing, Precinct Conventions frequently attract almost no one — and the seats go empty. If that happens, the LDPEC has to fill the vacancy from above within 90 days.",
    ],
  },
  {
    num: 2,
    title: "Legislative District Conventions",
    headline: "Elected PCs elect the new LD officers.",
    bodyParagraphs: [
      "Each of Jefferson County's 18 Legislative Districts holds an LD Convention. The newly-elected Precinct Captains from that LD gather and elect two LD officers: an LD Chair and an LD Vice Chair, of opposite genders (KDP Art. III.C).",
      "Who votes: only the duly elected Precinct Committee members from that LD.",
      "What else: elects delegates from the LD to the Congressional District Convention, elects delegates from the LD to the State Convention, plus any business SCEC assigns in the Call to Convention.",
      "Who runs it: the outgoing LD Chair. If the outgoing Chair is absent, the outgoing LD Vice Chair runs it.",
    ],
  },
  {
    num: 3,
    title: "Joint post-LD election of At-Large members + LDPEC officers",
    headline: "The step most people don't know exists.",
    bodyParagraphs: [
      "At close of the Legislative District Convention, newly elected LD Chairs and Vice Chairs meet to elect eighteen (18) at-large members of the County Executive Committee and Committee officers (KDP Art. II.D).",
      "In plain terms: as soon as the last LD Convention closes, all 36 newly-elected LD officers (18 Chairs + 18 Vice Chairs) convene together as one body. Together they elect the 18 At-Large members, the County Chair, and the County Vice Chair (opposite sex of Chair, must be a newly-elected LD Chair).",
      "When: within 30 days of the Reorganization per LJCDP §4.4. State bylaws say \"at close\" of LD Convention — in practice this likely happens within a short window, not literally the same day.",
    ],
  },
  {
    num: 4,
    title: "State Convention",
    headline: "Two tracks: DNC delegates AND SCEC officers.",
    bodyParagraphs: [
      "Delegates elected by each LD Convention travel to the KDP State Convention. The state convention handles two separate tracks of business:",
      "DNC delegate selection — Kentucky's delegation to the Democratic National Convention is chosen.",
      "SCEC elections — the State Central Executive Committee is seated.",
      "What LD Chairs and VCs do there: vote in both tracks. Being elected LD Chair or LD Vice Chair automatically puts you on SCEC — but you vote for SCEC officers and for DNC delegates at the state convention.",
    ],
  },
];

export type Timeline2028 = {
  label: string;
  description: string;
};

export const TIMELINE_2026_2028: Timeline2028[] = [
  { label: "May 19, 2026", description: "KY primary. Confirm if you're on the ballot." },
  { label: "Nov 3, 2026", description: "General election." },
  { label: "2027", description: "KY governor's race cycle. Reorg prep ramps." },
  { label: "Spring 2028", description: "Quadrennial Reorganization. The whole chain runs — Precinct Conventions, LD Conventions, joint post-LD election, State Convention." },
  { label: "Summer 2028", description: "State Convention — DNC delegate selection + SCEC elections." },
];

export const WHY_2028_MATTERS = {
  paragraph1:
    "Most of the current LDPEC was elected in the 2025 reorg cycle. For almost everyone, this is their first party officer role and their first time hearing the word \"reorg.\" The next reorg is spring 2028, and it's the one this card prepares you for.",
  paragraph2:
    "If you're an LD Chair, LD Vice Chair, At-Large Member, or Precinct Captain, the things that happen during reorg are things you have to do, not things that happen to you.",
  postponementNote:
    "Normally reorg years are 2012, 2016, 2020, 2024, 2028 — aligned with presidential elections. For the last cycle, KDP postponed reorg from 2024 to 2025. That's why most of the current LDPEC was elected in June 2025, not spring 2024. The 2028 cycle is expected to run on the normal presidential-year schedule.",
};
