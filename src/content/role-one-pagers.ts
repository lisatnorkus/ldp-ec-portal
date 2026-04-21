// Role one-pagers — structured from docs/role_one_pagers_v2.2.md.
// Source of truth for Tour Step 2.
// Any edit here must stay synced with the markdown file.

export type RoleKey = "LD_CHAIR" | "LD_VC" | "AT_LARGE" | "PRECINCT_CAPTAIN" | "COMMITTEE";

export type RoleOnePager = {
  key: RoleKey;
  title: string;
  whoYouAre: string;
  whatTheRoleDoes: string[];
  alsoNote?: string; // for SCEC seat reminder on LD_CHAIR / LD_VC
  startHere: string[];
  responsibility2028: string;
};

export const ROLE_ONE_PAGERS: RoleOnePager[] = [
  {
    key: "LD_CHAIR",
    title: "LD Chair",
    whoYouAre:
      "The elected Chair of one of Jefferson County's 18 Legislative Districts. With your LD Vice Chair, you're a two-person LD Committee representing your state House District on the County Executive Committee. State bylaws (Art. III.C) say the two of you are responsible for organizing and building Democratic support in your LD.",
    whatTheRoleDoes: [
      "Votes on every CEC matter, not just LD-specific ones",
      "Runs organizing inside your LD — voter contact, volunteer recruitment, phonebanks, canvasses, LD meetings",
      "Works with the Precinct Captains in your LD. They're your field operation. If you ignore them, you don't have one.",
      "Fills PC vacancies in your LD when they come up (state bylaws require CEC to fill within 90 days)",
      "Elects delegates from your LD to Congressional District and State Conventions during reorg cycles",
      "Supports countywide CEC goals inside your LD",
      "Signs an NDA at the start of your term (LJCDP §2.2) — you have a fiduciary relationship with the EC",
    ],
    alsoNote:
      "**Also: your SCEC seat.** Being elected LD Chair automatically puts you on the State Central Executive Committee — the statewide body that governs the KDP between state conventions. Everyone calls it SCEC. Meetings are quarterly in Frankfort, plus any called meetings to vote on something urgent. The vibe is more formal than CEC meetings. Your practice there is to show up, vote, and represent Jefferson County.",
    startHere: [
      "Read the LJCDP bylaws and the KDP state bylaws. Your authority and your limits both live there.",
      "See Tour Step 3 for your LD — precinct list, who's active, who's dark.",
      "Meet with your LD VC. You're co-equal partners, not principal and deputy. Divide the work.",
      "Put one date on the calendar for your next LD meeting. Any date. LDs that don't meet don't organize.",
      "See Tour Step 5 for current LDPEC initiatives and pick the one your LD will plug into next.",
    ],
    responsibility2028:
      "You preside as Convention Chair over your LD's Precinct Conventions in spring 2028 — the CEC Chair is the one who formally calls and advertises them (KDP Art. II.B.f/g), but you're the Party Officer running each one. You run the LD Convention that elects your successor and your VC's successor. Right after the LD Convention closes, you join the incoming Chairs + VCs to jointly elect the 18 At-Large CEC members and county officers (KDP Art. II.D.c). At the state convention that follows, you vote in both tracks — DNC delegate selection AND SCEC elections. (See Tour Step 6: Reorg & Delegate Selection reference card.)",
  },
  {
    key: "LD_VC",
    title: "LD Vice Chair",
    whoYouAre:
      "The elected Vice Chair of one of Jefferson County's 18 Legislative Districts, of the opposite gender from the LD Chair. Together you form a two-person LD Committee.\n\nYou're a full LD officer. You have your own CEC vote. You're ready to step up any time the Chair is absent, inactive, or needs backup. LJCDP §7.3 reads narrowly — \"assist under the direction of the LD Chair\" — but state bylaws and practice frame the LD Committee as co-equal. The LJCDP language is the floor. Practice is the ceiling.",
    whatTheRoleDoes: [
      "Carries LD work alongside the Chair — voter contact, recruitment, precinct organizing, LD meetings",
      "Votes on the CEC independently. You're not the Chair's proxy.",
      "Steps up to run the LD when the Chair is unavailable or inactive, without waiting for permission",
      "Is the second set of eyes on PC vacancies, precinct health, and candidate recruitment",
      "Supports countywide CEC goals inside the LD",
      "Signs an NDA at the start of your term (LJCDP §2.2) — you have a fiduciary relationship with the EC",
    ],
    alsoNote:
      "**Also: your SCEC seat.** Being elected LD Vice Chair automatically puts you on the State Central Executive Committee — same body as your LD Chair. Quarterly meetings in Frankfort, plus called meetings to vote. More formal than CEC meetings. Your vote there is independent of your Chair's.",
    startHere: [
      "Read the LJCDP bylaws and the KDP state bylaws. You're named in both.",
      "Talk to your LD Chair. Ask what they most want help on — or what they're not doing that you can pick up.",
      "Show up to the CEC. Your vote counts whether or not the Chair is there.",
      "If your LD Chair is inactive, don't sit on your hands. Start running the LD. You have the authority.",
      "See Tour Step 5 for current LDPEC initiatives and pick one to own inside your LD.",
    ],
    responsibility2028:
      "You co-preside over your LD's Precinct Conventions and LD Convention in spring 2028 with the Chair (per KDP Art. II.B.g — as Party Officers, LD officers preside over their Convention Level). If the Chair is unavailable, the County Chair appoints a Convention Chair; in practice, that's usually you. You vote jointly with incoming Chairs + VCs to elect the 18 At-Large CEC members and county officers right after the LD Convention closes (KDP Art. II.D.c). (See Tour Step 6: Reorg & Delegate Selection reference card.)",
  },
  {
    key: "AT_LARGE",
    title: "At-Large CEC Member",
    whoYouAre:
      "One of 18 At-Large members of the Louisville-Jefferson County Democratic Executive Committee. You were elected jointly by the incoming LD Chairs and Vice Chairs immediately after the LD Convention closed — not by a single LD, and not by precinct men, women, or youth. Per state bylaws Art. II.D.c, the 18 of you serve the whole county.\n\nThe 2025 reorg cycle changed the election mechanism. LJCDP bylaws §4.4 and §6.6 still reflect the old process — those sections need amendment to match state bylaws.",
    whatTheRoleDoes: [
      "Votes on every CEC matter",
      "Thinks and acts countywide — you don't represent one LD",
      "Fills standing committee seats and special assignments. The §26 committees rely on At-Large members showing up to do the work",
      "Brings a network or a skill the LD officers couldn't cover alone — that's why the At-Large slots exist",
      "Shows up. Quorum math depends on it — 40% of LD Chairs + VCs + LD At-Large, in person or by proxy (LJCDP §22.1)",
      "Signs an NDA at the start of your term (LJCDP §2.2) — you have a fiduciary relationship with the EC",
    ],
    startHere: [
      "Read the LJCDP bylaws and KDP state bylaws. Art. II.D.c is where your seat is defined.",
      "Come to the next CEC meeting. If you've missed a few, reintroduce yourself.",
      "Pick a standing committee that matches what you have time and skill for. Ask the chair to bring you on.",
      "Find out which LD you live in, and reach out to the LD Chair + VC. You don't report to them — but you should know each other.",
      "See Tour Step 5 for current LDPEC initiatives and plug in.",
    ],
    responsibility2028:
      "Your At-Large seat resets at the 2028 reorg. You don't continue automatically — you have to be re-elected by the incoming LD Chairs + VCs at the joint post-LD meeting in spring 2028. If you want to stay on, make yourself valuable enough that the incoming class knows your name. (See Tour Step 6: Reorg & Delegate Selection reference card.)",
  },
  {
    key: "PRECINCT_CAPTAIN",
    title: "Precinct Captain",
    whoYouAre:
      "One of three elected officials in your precinct — two adults of different genders plus one youth (age 35 or under). State bylaws (Art. III.B) call the three of you the \"primary Party Officials responsible for organizing and building Democratic power\" inside your precinct. State bylaws call the role \"Precinct Committee member.\" Jefferson County uses \"Precinct Captain\" — PC for short.",
    whatTheRoleDoes: [
      "Knows your precinct — who the Democrats are, who's active, who moved",
      "Runs voter contact inside the precinct: doors, phones, texts, lit when called for",
      "Recruits volunteers from your precinct for broader campaigns",
      "Hosts organizing events when asked — phonebanks, canvass launches, meet-and-greets",
      "Votes as a delegate at your LD Convention during reorg. That's how the next LD Chair and VC get elected.",
      "Keeps the precinct from going dark. If there's no active PC, nothing at the precinct level is happening.",
    ],
    alsoNote:
      "**The tool you get:** As a Precinct Captain in Jefferson County, you are an ADMIN on the LJCDP VoteBuilder account. That means you can see everything — your precinct, your LD, the whole county — at any time, without asking permission. Use it. It's the single most powerful thing in the job.",
    startHere: [
      "Read the LJCDP bylaws so you know the structure you're part of.",
      "Log into VoteBuilder. You already have admin access. Pull a cut of the active Democrats in your precinct — that's your starting list.",
      "Know who your LD Chair and LD VC are. They are your direct connection up the chain — if they haven't reached out, reach up to them.",
      "Pick one organizing activity this quarter and do it — a phonebank shift, a canvass block, a lit drop. Don't wait to be asked.",
      "Show up to your next LD meeting. You're part of the team.",
    ],
    responsibility2028:
      "You vote at your precinct's Precinct Convention in spring 2028. That's when the next PC slate (Man, Woman, Youth) is elected for the 2028–2032 term. If nobody runs in your precinct, it goes empty and the CEC has to fill it from above. Make sure candidates show up — including yourself, if you want to continue. (See Tour Step 6: Reorg & Delegate Selection reference card.)",
  },
  {
    key: "COMMITTEE",
    title: "Committee Chair + Committee Member",
    whoYouAre:
      "Covers both standing and ad hoc committees — same role structure, different lifespan. Chair and Member packaged together because they're tightly paired.\n\nLJCDP runs 11 committees — **8 standing** (Bylaws, Candidate Recruitment, Communications, Events, Facilities, Finance, Training, Volunteer) and **3 ad hoc** (Branding, Endorsement Process, Platform). Per LJCDP §26.1.1, what each committee does is set by the County Chair and that committee's own Chair. Committee scope is owned by the chair.\n\n**Who chairs / who serves:** Committee chairs have to be on the committee they chair — you can't chair from the outside. But not every CEC member has to sit on a committee. Committee service is voluntary: At-Large members often do, LD officers may or may not depending on bandwidth. Committees recruit members; members aren't auto-assigned.\n\n**Bylaws flag:** §26 lists 10 standing committees — practice has dropped Youth and Labor, added three ad hoc, and name-drifted \"Volunteering\" → Volunteer and \"Communication\" → Communications. §26 needs an amendment to match what's actually running.",
    whatTheRoleDoes: [
      "**Chair:** Decides the committee's work — agenda, priorities, scope — in coordination with the County Chair",
      "**Chair:** Calls meetings and sets frequency. There's no meeting if you don't call one.",
      "**Chair:** Recruits and keeps committee members engaged",
      "**Chair:** Reports back to the full CEC on what the committee is doing",
      "**Chair:** Coordinates with other committee chairs so work doesn't double up",
      "**Chair:** Ad hoc chairs specifically — close the committee out when the task is done rather than letting it linger",
      "**Member:** Follows the chair's lead — show up, take on what they ask you to take on, contribute inside that scope. There are no formal bylaw-level requirements on committee members.",
    ],
    startHere: [
      "**Chair:** Read §26 in the LJCDP bylaws. If you chair Finance, also read §26.2 and §26.3 — those are your non-negotiables (fiscal policy + purchase approval chain).",
      "**Chair:** Pull your committee roster. Do you have members, or just a title?",
      "**Chair:** Decide the one thing your committee should ship this quarter. If you can't name it, neither can the committee.",
      "**Chair:** Schedule a meeting this month. Even thirty minutes.",
      "**Chair:** Bring a short report to the next CEC meeting. \"We restarted\" is a valid report.",
      "**Member:** Read §26 in the LJCDP bylaws so you know which committee(s) you're on and what they're for.",
      "**Member:** Ask the chair \"what can I take on?\" If they don't have an answer ready, offer one.",
      "**Member:** If you've been on the roster but haven't been active, just show up again. Don't make it awkward.",
    ],
    responsibility2028:
      "Committee chairs reset at reorg — the incoming County Chair appoints new ones. Committee WORK doesn't stop during reorg, though. Voter contact, fundraising, events, comms, training all have to keep moving through spring 2028. Document what your committee does so a successor could pick it up. Committee seats reset at reorg too — if you want to continue, the incoming CEC has to name you again. Being active now is the best advocacy for being named later. (See Tour Step 6: Reorg & Delegate Selection reference card.)",
  },
];

export function getRoleOnePager(key: RoleKey): RoleOnePager | undefined {
  return ROLE_ONE_PAGERS.find((r) => r.key === key);
}
