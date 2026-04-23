import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarCheck,
  ClipboardList,
  Compass,
  FileCheck,
  Gavel,
  HandHeart,
  HeartHandshake,
  HelpCircle,
  Home,
  IdCard,
  LayoutDashboard,
  ListChecks,
  Repeat,
  Share2,
  Target,
  Ticket,
  UserPlus,
  Vote,
} from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";

export const metadata = { title: "What this portal does" };

type Tile = {
  href: string;
  label: string;
  body: string;
  Icon: LucideIcon;
};

const EVERYONE: Tile[] = [
  {
    href: "/dashboard",
    label: "Dashboard — state of the party",
    body: "Six KPIs at the top, a 'needs attention' queue, your personal task list, cycle phase, and a live activity feed. One glance = what's urgent.",
    Icon: LayoutDashboard,
  },
  {
    href: "/voter-registration",
    label: "Voter guide + ballot lookup",
    body: "Official LDP 2026 voter guide, ballot tool, KY/Jefferson County voter-reg rules, and the party-switch deadline countdown.",
    Icon: Vote,
  },
  {
    href: "/amplify",
    label: "Amplify — one-click share",
    body: "When Comms publishes a post for the board to push, it lands here. One tap = pre-filled Facebook, X, Threads, Bluesky, LinkedIn, email, or texts. Clipboard copy for Instagram + TikTok.",
    Icon: Share2,
  },
  {
    href: "/events",
    label: "Events + the $620 math",
    body: "Three signature fundraisers with per-member ticket-link tracking. Push your link, get credit, hit your $500 raise target.",
    Icon: Ticket,
  },
  {
    href: "/this-month",
    label: "This Month",
    body: "What's live right now. Theme-coded monthly playbook tied to the cycle phase, plus the full 12-month Rock Star Playbook grid.",
    Icon: CalendarCheck,
  },
];

const LD: Tile[] = [
  {
    href: "/my-ld",
    label: "My LD workspace",
    body: "Your district's live work surface: notes, tasks, attendance, precinct-level targeting. When your profile is set, clicking 'My LD' in the sidebar jumps straight here.",
    Icon: Home,
  },
  {
    href: "/my-ld",
    label: "Recruiting CRM",
    body: "Structured pipeline — Identified → Contacted → Warm → Committed → Active — with an interaction log and VoteBuilder-ready export.",
    Icon: UserPlus,
  },
  {
    href: "/follow-ups",
    label: "Follow-Ups queue",
    body: "Who you've talked to but haven't touched in 14+ days. The DNC Playbook 'layering' idea, made actionable. 'Mine only' filter shows your 10-20 working relationships.",
    Icon: Repeat,
  },
  {
    href: "/captains",
    label: "Captain Coverage",
    body: "How close we are to a captain in every ACTIVATE and DEFEND precinct. Countywide tile plus per-bucket cards plus a punch list of uncovered precincts with one-click Recruit.",
    Icon: Target,
  },
  {
    href: "/targeting",
    label: "Targeting Explained",
    body: "Power Base / Hold the Line / Wake the Vote / Plant the Flag — what each bucket is, who's in it, your standing job, and why this matters in THIS phase of the cycle.",
    Icon: Compass,
  },
  {
    href: "/transitions",
    label: "Continuity + handoff",
    body: "The 7-section package every outgoing LD chair writes so the next person hits the ground running. Mirrored for committee chairs too.",
    Icon: ClipboardList,
  },
];

const COMMITTEE: Tile[] = [
  {
    href: "/committees",
    label: "Committee workspace",
    body: "Same notes / tasks / email-all / continuity tools as My LD, scoped to your committee.",
    Icon: Building2,
  },
  {
    href: "/volunteers",
    label: "Volunteers roster",
    body: "Jessica's working file — intake, interests (what they like to do), activity log, new-signup review queue, and a 'gone quiet' list for retention.",
    Icon: HeartHandshake,
  },
  {
    href: "/coalitions",
    label: "Coalition partners",
    body: "Six Louisville constituencies (Black, labor, LGBTQ+, Latino, youth, faith) with named partners and year-round engagement notes.",
    Icon: HandHeart,
  },
  {
    href: "/voter-registration",
    label: "VR drive events",
    body: "When Events or Volunteering schedules a voter-registration drive, it appears on the Voter Registration page with target populations tagged.",
    Icon: IdCard,
  },
];

const OFFICER: Tile[] = [
  {
    href: "/governance",
    label: "Governance reference",
    body: "Quorum, proxies, finance tiers ($500 / $501–999 / $1000+), vacancy rules, KREF 2026 dates, the primary-endorsement bylaw — every claim cited.",
    Icon: Gavel,
  },
  {
    href: "/transitions",
    label: "Transitions & vacancies",
    body: "Every announced change and open seat with the 30/90-day fill rules surfaced. Distinguishes announced-but-not-departed from currently vacant.",
    Icon: ListChecks,
  },
  {
    href: "/endorsement",
    label: "Endorsement process",
    body: "Mayor / Metro Council timelines, 60% secret-ballot threshold, and the KDP rule that keeps state-leg Democratic primaries prohibited from party endorsement.",
    Icon: FileCheck,
  },
];

const REFERENCE: Tile[] = [
  {
    href: "/glossary",
    label: "Glossary",
    body: "Every bit of lingo defined — Power Base, sleeper Dems, GOTV, D-margin, layering, pipeline, KREF, JCDEC, and more. Terms stay in the portal copy; definitions are one click away.",
    Icon: BookOpen,
  },
  {
    href: "/targeting",
    label: "Targeting Explained",
    body: "The strategy-bucket reference. Visible from this page AND from inside Plan & Map, Captains, and My LD headers.",
    Icon: Compass,
  },
  {
    href: "/tour/1",
    label: "Welcome Tour",
    body: "Six steps, ~3 minutes. Walks new members through the rhythm of how the portal fits into how the EC already works.",
    Icon: Compass,
  },
  {
    href: "/help",
    label: "Help & FAQ",
    body: "Getting-started answers plus every question preview reviewers have asked. Help button in the bottom-right of every page creates a GitHub issue for bugs and requests.",
    Icon: HelpCircle,
  },
];

export default function OverviewPage() {
  return (
    <HubShell
      eyebrow="What this portal does"
      title="One place the EC runs its work."
      subtitle="Your week, your LD, your committee, your governance obligations — all here. Grouped by how you actually use it, not by every feature. Pick the section that sounds like you and click through."
      maxWidthClass="max-w-5xl"
      actions={
        <Link
          href="/tour/1"
          className="rounded border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
        >
          Take the welcome tour →
        </Link>
      }
    >
      <Section
        eyebrow="Every EC member"
        title="What you open first."
        body="Five surfaces everyone uses — whether you're an LD chair, a committee member, or a county officer. They live at the always-open top of the sidebar."
        accent="var(--color-ldp-navy-800)"
        tiles={EVERYONE}
      />

      <Section
        eyebrow="LD Chairs & Vice Chairs"
        title="Your district, your pipeline, your coverage."
        body="Everything an LD leader needs to run a ground game — recruiting CRM, precinct captain coverage, layering queue, strategy reference — plus the continuity tools that keep your work intact when your seat changes hands."
        accent="var(--color-ldp-red)"
        tiles={LD}
      />

      <Section
        eyebrow="Committee Chairs"
        title="Same tools, scoped to your committee."
        body="The LD workspace pattern mirrored onto committees — notes, tasks, email-all, handoff packages. Plus surfaces specific to the committees doing heavy people work (Volunteering, Events, Comms, Candidate Recruitment)."
        accent="#0891b2"
        tiles={COMMITTEE}
      />

      <Section
        eyebrow="County Officers"
        title="Governance + oversight."
        body="The rules of the road for the whole party and the cross-LD visibility that only officers need. Every load-bearing bylaw surfaced with citations, so no one has to hunt the PDF."
        accent="#0E4C9E"
        tiles={OFFICER}
      />

      <Section
        eyebrow="Reference & learning"
        title="Look it up without asking."
        body="Targeting, lingo, and help — all in one place, so new members learn the vocabulary at their own pace instead of having to ask every time."
        accent="#b45309"
        tiles={REFERENCE}
      />

      <section className="mt-12 rounded-xl border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          How it connects to the rest of our work
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            <strong>KYPolitics data</strong> — all 629 Jefferson County precincts scored into four
            strategies (Power Base · Hold the Line · Wake the Vote · Plant the Flag), with
            sleeper-Dem counts, D-margins, and priority rankings live in every LD view.
          </li>
          <li>
            <strong>Google Drive</strong> — every committee folder, event folder, canvass guide,
            and training doc linked directly. Sign-in-to-your-LDP-Google banner restored so
            permission walls don&apos;t ambush anyone.
          </li>
          <li>
            <strong>louisvilledems.com</strong> — public voter guide, ballot lookup, and
            precinct-leader application all live there. The portal is the working backstage; the
            public site is the storefront.
          </li>
          <li>
            <strong>VoteBuilder</strong> — recruiting CRM exports in VoteBuilder-friendly CSV so
            you can pull cuts without retyping.
          </li>
          <li>
            <strong>KDP monthly call</strong> — 3rd Tuesday at 7pm ET auto-appears on the
            dashboard with the Zoom link (Morgan Eaves hosts LD chairs + VCs as county chairs).
          </li>
        </ul>
      </section>

      <section className="mt-8 rounded-xl border-l-4 border-[var(--color-ldp-gold)] bg-white p-4 text-sm text-[var(--color-ldp-ink-900)]">
        <strong className="text-[var(--color-ldp-navy-900)]">New to this?</strong> Take the
        welcome tour — six steps, about three minutes, shows you the rhythm of how the portal
        fits into how the EC already works.
        <span className="ml-2">
          <Link
            href="/tour/1"
            className="inline-flex items-center gap-1 text-[var(--color-ldp-navy-700)] underline"
          >
            Take the tour <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </span>
      </section>
    </HubShell>
  );
}

function Section({
  eyebrow,
  title,
  body,
  accent,
  tiles,
}: {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  tiles: Tile[];
}) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-4">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {eyebrow}
        </div>
        <h2 className="mt-1 text-2xl font-black tracking-[-0.02em] text-[var(--color-ldp-navy-900)]">
          {title}
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">{body}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => {
          const Icon = t.Icon;
          return (
            <Link
              key={`${t.href}-${t.label}`}
              href={t.href}
              className="group flex flex-col rounded-xl border bg-white p-4 transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-sm"
              style={{ borderLeftWidth: 4, borderLeftColor: accent }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: accent }}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">{t.label}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-ldp-ink-900)]">
                {t.body}
              </p>
              <div
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest group-hover:underline"
                style={{ color: accent }}
              >
                Open <ArrowRight aria-hidden="true" className="size-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
