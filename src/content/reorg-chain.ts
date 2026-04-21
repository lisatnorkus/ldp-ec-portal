// Reorg & Delegate Selection — structured content for Tour Step 6.
// Source: docs/reorg-delegate-selection.md.
//
// Per Lisa's April 21, 2026 direction:
// Specifics that require primary-source verification (day counts, 2028
// dates, how the 2025 cycle actually ran) are rendered as VISIBLE "needs
// verification" callouts, not hedged prose. Transparency beats cautious-
// guess polish for a reference document first-term EC members will rely on.
//
// When a verifyAgainst entry is resolved against the primary source, move
// the verified fact into a bodyParagraph and drop the callout entry.

export type VerifyCallout = {
  id: string;
  claim: string;      // short plain-language version of what needs confirming
  source: string;     // where someone goes to verify
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
      "Basis: KDP Art. III.B (Precinct Committee). These three people are \"the primary Party Officials responsible for organizing and building Democratic power within [the] precinct.\"",
      "Who convenes it: in practice, the outgoing LD Chair calls, advertises, and chairs the Precinct Conventions in their LD. KDP typically issues a countywide notice setting the window and procedural requirements; LD Chairs execute within that framework.",
      "In a precinct with no active organizing, Precinct Conventions frequently attract almost no one — and the seats go empty. If that happens, the LDPEC has to fill the vacancy from above within 90 days.",
    ],
    verifyAgainst: [
      {
        id: "precinct-convention-notice",
        claim: "Exact advance-notice requirements for Precinct Conventions (number of days, posting locations).",
        source: "KDP Bylaws — search for \"notice,\" \"days,\" \"advance,\" \"call.\" Day counts intentionally not quoted here until verified.",
      },
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
    verifyAgainst: [
      {
        id: "ld-convention-notice",
        claim: "Advance-notice requirements for LD Conventions (KDP may differ from Precinct-Convention timing).",
        source: "KDP Bylaws.",
      },
      {
        id: "jeffco-pc-filing",
        claim: "JeffCo-specific filing window for PC candidates ahead of their Precinct Convention.",
        source: "LJCDP Bylaws at louisvilledems.com/ljcdp-bylaws — may layer requirements on top of KDP.",
      },
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
      "This is the process the state bylaws require. LJCDP §4.4 and §6.6 still describe the older process (election by LD Chairs alone); state bylaws govern when they conflict.",
    ],
    verifyAgainst: [
      {
        id: "2025-actual-sequence",
        claim: "How the 2025 postponed cycle actually ran this step — did all 36 incoming Chairs + VCs convene as one body, or did it happen some other way?",
        source: "LDPEC Secretary Brook Benningfield or outgoing Chair — the meeting minutes are authoritative.",
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

// Top-level unresolved items rendered as a consolidated callout block at the
// end of Tour Step 6. These are the items that are not tied to a single step
// of the chain — they're general content-level TODOs.
export const STEP_6_UNRESOLVED: VerifyCallout[] = [
  {
    id: "2028-cycle-confirmation",
    claim: "Whether KDP has formally set 2028 as the next reorganization year (restoring normal presidential-year alignment after the postponed 2025 cycle).",
    source: "Current KDP Bylaws — search for \"reorganization,\" \"four-year,\" \"cycle,\" \"2028.\" Do not quote specific 2028 dates anywhere in the portal until this is confirmed.",
  },
  {
    id: "ljcdp-section-8-vs-9",
    claim: "Whether LJCDP §8 (Legislative District At-Large) or §9 (Non-Legislative District At-Large) governs the current At-Large class elected under the 2025-reorg countywide mechanism.",
    source: "LJCDP Bylaws §§7–10 read as a block. Likely a pre-2025 artifact that needs amendment alongside §4.4/§6.6.",
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
    label: "Spring 2028?",
    description: "Next quadrennial Reorganization, assumed to follow the postponed 2025 cycle on a presidential-year schedule. Full chain runs — Precinct Conventions, LD Conventions, joint post-LD election, State Convention.",
    unresolved: true,
  },
  {
    label: "Summer 2028?",
    description: "State Convention — DNC delegate selection + SCEC elections.",
    unresolved: true,
  },
];

export const WHY_2028_MATTERS = {
  paragraph1:
    "Most of the current LDPEC was elected in the 2025 reorg cycle. For almost everyone, this is their first party officer role and their first time hearing the word \"reorg.\" The next reorg — expected in 2028 — is the one this card prepares you for.",
  paragraph2:
    "If you're an LD Chair, LD Vice Chair, At-Large Member, or Precinct Captain, the things that happen during reorg are things you have to do, not things that happen to you.",
  postponementNote:
    "Normally reorg years align with presidential elections — 2012, 2016, 2020, and would have been 2024. For the last cycle, KDP postponed reorg from 2024 to 2025. That's why most of the current LDPEC was elected in June 2025, not spring 2024. The next cycle is expected to restore the normal presidential-year alignment, which would put it in 2028 — but confirm the exact timing against current KDP bylaws before planning dates.",
};
