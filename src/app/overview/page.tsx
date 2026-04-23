import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileCheck,
  Gavel,
  HandHeart,
  HeartHandshake,
  Home,
  LayoutDashboard,
  ListChecks,
  Repeat,
  Share2,
  Target,
  UserPlus,
  Vote,
} from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";

export const metadata = { title: "What this portal does" };

// One-page overview for Lisa to present to the EC. Grouped by role
// so people see themselves in one section instead of scrolling a
// full feature list. No public-facing block intentionally — the
// public surfaces (volunteer signup, voter reg form, ballot lookup)
// exist but don't need to be announced in the rollout conversation.

type Tile = {
  href: string;
  label: string;
  body: string;
  Icon: LucideIcon;
};

const EVERYONE: Tile[] = [
  {
    href: "/dashboard",
    label: "Your Week",
    body: "Every task anyone has assigned you across every LD and committee — overdue, due this week, waiting on your accept.",
    Icon: LayoutDashboard,
  },
  {
    href: "/voter-registration",
    label: "Voter guide + ballot lookup",
    body: "Official LDP 2026 voter guide, ballot tool, and KY/Jefferson County voter-reg rules.",
    Icon: Vote,
  },
  {
    href: "/amplify",
    label: "Amplify — one-click share",
    body: "When Comms publishes a post for the board to push, it lands here pre-filled for Facebook, X, Threads, Bluesky, LinkedIn, email, texts — tap once.",
    Icon: Share2,
  },
];

const LD: Tile[] = [
  {
    href: "/my-ld",
    label: "My LD workspace",
    body: "Your district's live work surface: notes, tasks, attendance, precinct-level targeting.",
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
    body: "Who you've talked to but haven't touched in 14+ days. The DNC Playbook 'layering' idea, made actionable.",
    Icon: Repeat,
  },
  {
    href: "/captains",
    label: "Captain Coverage",
    body: "How close we are to a captain in every ACTIVATE and DEFEND precinct, with a punch list of uncovered precincts.",
    Icon: Target,
  },
  {
    href: "/transitions",
    label: "Continuity + handoff",
    body: "The 7-section package every outgoing chair writes so the next person hits the ground running.",
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
    body: "Jessica's working file — intake, interests, activity log, new-signup review queue.",
    Icon: HeartHandshake,
  },
  {
    href: "/events",
    label: "Events + $620 math",
    body: "Three signature fundraisers with per-member ticket-link tracking toward the annual raise target.",
    Icon: CalendarCheck,
  },
  {
    href: "/coalitions",
    label: "Coalition partners",
    body: "Six Louisville constituencies with named partners and year-round engagement notes.",
    Icon: HandHeart,
  },
];

const OFFICER: Tile[] = [
  {
    href: "/governance",
    label: "Governance reference",
    body: "Quorum, proxies, finance tiers ($500 / $501–999 / $1000+), vacancy rules, KREF 2026 dates, the primary-endorsement bylaw.",
    Icon: Gavel,
  },
  {
    href: "/transitions",
    label: "Transitions & vacancies",
    body: "Every announced change and open seat with the 30/90-day fill rules surfaced.",
    Icon: ListChecks,
  },
  {
    href: "/endorsement",
    label: "Endorsement process",
    body: "Mayor / Metro Council timelines, 60% threshold, and the KDP rule that keeps state-leg primaries open.",
    Icon: FileCheck,
  },
];

export default function OverviewPage() {
  return (
    <HubShell
      eyebrow="What this portal does"
      title="One place the EC runs its work."
      subtitle="Your week, your committee, your LD, your governance obligations — all here. Grouped by how you actually use it, not by every feature. Pick the section that sounds like you and click through."
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
        body="Three surfaces everyone uses — whether you're an LD chair, a committee member, or a county officer."
        accent="var(--color-ldp-navy-800)"
        tiles={EVERYONE}
      />

      <Section
        eyebrow="LD Chairs & Vice Chairs"
        title="Your district, your pipeline, your coverage."
        body="Everything an LD leader needs to run a ground game — plus the continuity tools that make sure your work survives when your seat changes hands."
        accent="var(--color-ldp-red)"
        tiles={LD}
      />

      <Section
        eyebrow="Committee Chairs"
        title="Same tools, scoped to your committee."
        body="The LD workspace pattern mirrored onto committees — notes, tasks, member communication, handoff packages. Plus the surfaces specific to certain committees (Volunteering, Events, Communications)."
        accent="#0891b2"
        tiles={COMMITTEE}
      />

      <Section
        eyebrow="County Officers"
        title="Governance + oversight."
        body="The rules of the road for the whole party and the cross-LD visibility that only officers need."
        accent="#0E4C9E"
        tiles={OFFICER}
      />

      <section className="mt-12 rounded-xl border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          How it connects to the rest of our work
        </h2>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            <strong>KYPolitics data</strong> — all 629 Jefferson County precincts scored into four
            strategies (Power Base · Hold the Line · Wake the Vote · Plant the Flag).
          </li>
          <li>
            <strong>Google Drive</strong> — every committee folder, event folder, canvass guide,
            and training doc linked directly from the portal.
          </li>
          <li>
            <strong>louisvilledems.com</strong> — the public voter guide, ballot lookup, and
            precinct-leader app live there; the portal is the working backstage.
          </li>
          <li>
            <strong>VoteBuilder</strong> — the recruiting CRM exports in VoteBuilder-friendly CSV
            so you can pull cuts without retyping.
          </li>
        </ul>
      </section>

      <section className="mt-8 rounded-xl border-l-4 border-[var(--color-ldp-gold)] bg-white p-4 text-sm text-[var(--color-ldp-ink-900)]">
        <strong className="text-[var(--color-ldp-navy-900)]">New to this?</strong> Start with the
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
              className="group flex flex-col rounded-xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
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
