// Reorg & Delegate Selection — structured content for Tour Step 6.
// Source: docs/reorg-delegate-selection.md + docs/bylaws/bylaws-reference.md.
//
// Most "to be verified" callouts from Lisa's April 21 red-pen have been
// resolved against KDP + LJCDP primary sources. Remaining hedges point
// at the one question that requires a human (Brook or Logan) rather than
// a bylaws read.

export type VerifyCallout = {
  id: string;
  claim: string;
  source: string;
};

export type ReorgStep = {
  num: 1 | 2 | 3 | 4;
  title: string;
  headline: string;
  bodyParagraphs: string[];
  verifyAgainst?: VerifyCallout[];
};

export const REORG_CHAIN: ReorgStep[] = [
  {
    num: 1,
    title: "Precinct Conventions",
    headline: "Every precinct elects three people.",
    bodyParagraphs: [
      "Every precinct in Jefferson County holds a Precinct Convention. Registered Democrats in the precinct show up and elect three people: one Precinct Captain Man, one Precinct Captain Woman, and one Precinct Captain Youth (age 35 or under).",
      "Basis: KDP Article III, Section B. These three people are \"the primary Party Officials responsible for organizing and building Democratic power within [the] precinct.\"",
      "Who convenes it: the **CEC Chair calls and advertises** the Convention (KDP Art. II.B.f). A Party Officer — in practice, the outgoing LD Chair — **presides as Convention Chair** over their applicable Convention Level (KDP Art. II.B.g). If the LD Chair is unavailable, the County Party Chair appoints a Convention Chair.",
      "Advance notice: not less than 7 and not more than 30 days before the Convention (KDP Art. II.B.f). The CEC must use at least 3 of 6 notification methods — newspaper, radio/TV, social media, website, Mobilize/Facebook Events, or email/US Mail/phone.",
      "In a precinct with no active organizing, Precinct Conventions frequently attract almost no one — and the seats go empty. If that happens, the CEC has 90 days to fill the vacancy from above (KDP Art. III.B).",
      "PC candidates: no prefiling. Precinct Committee members are elected at the Precinct Convention itself; any eligible voter in the precinct can be nominated from the floor.",
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
      "Advance notice: same 7–30 day window as Precinct Conventions (KDP Art. II.B.f).",
      "Who runs it: the outgoing LD Chair presides as Convention Chair. If the outgoing Chair is unavailable, the County Chair appoints (KDP Art. II.B.g).",
      "Candidate filing: LD Chair / LD Vice Chair / LD At-Large members may prefile between October 1 of the year before reorg and 5 p.m. of the candidate-filing deadline in the reorg year (LJCDP §4.2.1). Prefiling is optional — candidates can also be nominated from the floor at the LD Convention.",
    ],
  },
  {
    num: 3,
    title: "Joint post-LD election of At-Large members + LDPEC officers",
    headline: "The step most people don't know exists.",
    bodyParagraphs: [
      "At close of the Legislative District Convention, newly elected LD Chairs and Vice Chairs meet to elect eighteen (18) at-large members of the County Executive Committee and Committee officers (KDP Art. II.D.c).",
      "In plain terms: as soon as the last LD Convention closes, all 36 newly-elected LD officers (18 Chairs + 18 Vice Chairs) convene together as one body. Together they elect the 18 At-Large members, the County Chair, and the County Vice Chair (opposite sex of Chair, must be a newly-elected LD Chair).",
      "**KDP / LJCDP drift:** KDP says this happens \"immediately at close\" of the LD Convention (Art. II.D.c). LJCDP §4.4 says it happens \"within thirty (30) days of the Reorganization.\" Where they conflict, KDP governs (LJCDP §5.3). LJCDP §§4.4, 6.6, and 8 describe the pre-2025 LD-specific At-Large model and need amendment to match current practice.",
    ],
    verifyAgainst: [
      {
        id: "2025-actual-sequence",
        claim: "How the 2025 postponed cycle actually ran this step — did all 36 incoming Chairs + VCs convene as one body per KDP, or per LJCDP §4.4's 30-day window?",
        source: "LDPEC Secretary Brook Benningfield or outgoing Chair — the meeting minutes are authoritative. Bylaws plus v1 content are consistent with the KDP process, but the 2025-in-practice answer needs a human.",
      },
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
  unresolved?: boolean;
};

export const TIMELINE_2026_2028: Timeline2028[] = [
  { label: "May 19, 2026", description: "KY primary. Confirm if you're on the ballot." },
  { label: "Nov 3, 2026", description: "General election." },
  { label: "2027", description: "KY governor's race cycle. Reorg prep ramps." },
  {
    label: "Spring 2028",
    description:
      "Quadrennial Reorganization. Per KDP Art. I.R (which sunset after the 2025 State Convention) and Art. II.A, reorganization is on a presidential-year cycle going forward — 2028, 2032, 2036. Full chain runs: Precinct Conventions, LD Conventions, joint post-LD election, State Convention.",
  },
  {
    label: "Summer 2028",
    description: "State Convention — DNC delegate selection + SCEC elections.",
  },
];

export const WHY_2028_MATTERS = {
  paragraph1:
    "Most of the current LDPEC was elected in the 2025 reorg cycle. For almost everyone, this is their first party officer role and their first time hearing the word \"reorg.\" The next reorg is spring 2028 — and it's the one this card prepares you for.",
  paragraph2:
    "If you're an LD Chair, LD Vice Chair, At-Large Member, or Precinct Captain, the things that happen during reorg are things you have to do, not things that happen to you.",
  postponementNote:
    "Normally reorg years align with presidential elections. The 2024 cycle was formally postponed by KDP Article I Section R — a one-time shift to align Kentucky's party reorganization with presidential election years. That section sunset at the close of the 2025 State Convention. Going forward, per KDP Article II Section A, reorganization happens every four years in presidential election years: 2028, 2032, 2036.",
};

// Items still pending primary-source resolution before production.
// (The four items that WERE here on April 21 have been resolved against
// KDP + LJCDP bylaws and now render as cited facts in the body paragraphs
// above. What remains requires a human to answer — bylaws alone won't.)
export const STEP_6_UNRESOLVED: VerifyCallout[] = [
  {
    id: "ljcdp-amendments-pending",
    claim:
      "LJCDP §§4.4, 6.6, and 8 describe a pre-2025 LD-specific At-Large structure that doesn't match how the 18 countywide At-Large Chairs were elected under KDP Art. II.D.c in 2025. These sections need a Bylaws Committee amendment to reflect current practice.",
    source:
      "Bylaws Committee (Roz Welch, Chair). Flagged for a formal amendment pass. KDP governs today; cleaning up LJCDP removes the ambiguity.",
  },
];
