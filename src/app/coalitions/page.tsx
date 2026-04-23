import Link from "next/link";
import {
  Building2,
  Church,
  GraduationCap,
  HardHat,
  Heart,
  Mic2,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";

export const metadata = { title: "Coalition Organizing" };

// Seeded from dem-organizing skill (louisville-organizing.md). Lisa
// can edit any of this copy directly — these are starter contents,
// not canonical. Partner names are verifiable Louisville orgs; no
// endorsements or coalition agreements implied by presence on this page.

type Coalition = {
  key: string;
  name: string;
  accent: string;
  Icon: LucideIcon;
  neighborhoods: string[];
  bucketNote: string;
  warning?: string;
  partners: { name: string; url?: string; note?: string }[];
  organizingNotes: string[];
};

const COALITIONS: Coalition[] = [
  {
    key: "black",
    name: "Black community",
    accent: "#0E4C9E",
    Icon: Users,
    neighborhoods: [
      "West Louisville (Russell, Shawnee, Portland)",
      "Newburg",
      "Shively",
      "California / Smoketown / Shelby Park",
    ],
    bucketNote: "Concentrated in PRIMARY-bucket precincts; distributed across the county.",
    warning:
      "Don't assume automatic support. The Black community increasingly feels taken for granted. Engage intentionally and early — not just in the final weeks before an election. Trusted messengers matter more than party officials or candidates.",
    partners: [
      { name: "NAACP Louisville Branch" },
      { name: "Louisville Urban League" },
      { name: "Muhammad Ali Center" },
      { name: "Black churches (Baptist and AME networks)", note: "High-multiplier; engage well before a cycle" },
      { name: "Black-owned businesses (Russell / Smoketown)" },
    ],
    organizingNotes: [
      "Show up on community development / gentrification conversations between elections. Credibility compounds.",
      "Faith leader endorsements outperform candidate endorsements in door conversations.",
      "West Louisville events need logistics tailored to the community — time, food, language, childcare.",
    ],
  },
  {
    key: "labor",
    name: "Labor / unions",
    accent: "#C8102E",
    Icon: HardHat,
    neighborhoods: [
      "Teamsters UPS hub (Worldport)",
      "Ford Louisville Assembly + KY Truck Plant",
      "JCPS (JCTA members countywide)",
      "Hospitality corridor (downtown / airport hotels)",
    ],
    bucketNote: "Union households are distributed countywide; heavy in ACTIVATE and DEFEND precincts.",
    partners: [
      { name: "Teamsters Local 89 (UPS)", note: "One of the largest Teamsters locals in the country" },
      { name: "UAW Local 862 (Ford)" },
      { name: "JCTA (Jefferson County Teachers Association / NEA)" },
      { name: "UFCW (grocery, retail)" },
      { name: "UNITE HERE (hospitality)" },
      { name: "Louisville Building Trades" },
    ],
    organizingNotes: [
      "Labor partnership is organizing infrastructure, not just endorsement. Union halls can host events.",
      "Organized union members are natural precinct captains — ask the union's political director who to tap.",
      "KY law prohibits corporate / union-treasury contributions to party committees; their PACs give individually.",
    ],
  },
  {
    key: "lgbtq",
    name: "LGBTQ+",
    accent: "#DB2777",
    Icon: Heart,
    neighborhoods: [
      "Highlands / Bardstown Road corridor",
      "NuLu",
      "Cherokee Triangle",
    ],
    bucketNote: "Concentrated in ACTIVATE-bucket precincts. High volunteer propensity, already politically engaged.",
    partners: [
      { name: "Fairness Campaign", note: "Louisville's primary LGBTQ+ advocacy org" },
      { name: "Louisville Pride Foundation" },
    ],
    organizingNotes: [
      "This community responds to visible, specific action — not just general support.",
      "June (Pride) is a natural high-traffic canvass window in Highlands and NuLu.",
      "Natural captain pool — high engagement, organized networks.",
    ],
  },
  {
    key: "latino",
    name: "Latino / Hispanic",
    accent: "#D97706",
    Icon: Users,
    neighborhoods: ["Newburg", "Parts of the South End"],
    bucketNote: "Growing population. Cultural competency and language access are prerequisites, not add-ons.",
    warning:
      "Don't run Latino outreach through non-Latino staff or volunteers. Partner with trusted community organizations first. Spanish-language materials from the start, not as an afterthought.",
    partners: [
      { name: "La Casita Center" },
      { name: "Los Vecinos de Newburg" },
    ],
    organizingNotes: [
      "Work through established partners with existing trust — don't try to build it in an election year.",
      "Spanish-language canvass scripts and mail pieces are non-optional.",
      "Community events outperform doors as a first touch.",
    ],
  },
  {
    key: "youth",
    name: "Youth / College",
    accent: "#059669",
    Icon: GraduationCap,
    neighborhoods: [
      "University of Louisville (Belknap campus) — ~22,000 students",
      "Bellarmine University (Newburg Rd)",
      "Sullivan, Spalding, JCTC",
    ],
    bucketNote: "Fall-semester registration push is the highest-return window.",
    partners: [
      { name: "U of L College Democrats" },
      { name: "Bellarmine College Democrats" },
      { name: "Young Democrats of Jefferson County (JCYD / LYD)" },
      { name: "JCPS high-school senior outreach (via JCTA channels)" },
    ],
    organizingNotes: [
      "Campus organizing is a fall-semester play. The registration deadline sprint happens on the quad.",
      "Pre-register 17-year-olds who will be 18 by Election Day — high-school senior events.",
      "DNC's 'When We Count' fellowship is a funding + training pipeline worth tapping.",
    ],
  },
  {
    key: "faith",
    name: "Faith communities",
    accent: "#7C3AED",
    Icon: Church,
    neighborhoods: [
      "Black church network (West Louisville and beyond)",
      "Progressive Episcopal / UCC / Presbyterian congregations",
      "Catholic social-ministry networks",
    ],
    bucketNote:
      "Black church network is the most organized and politically significant. Progressive white faith communities are a smaller but active volunteer pool.",
    partners: [
      { name: "West Louisville Baptist and AME church coalition (informal)" },
      { name: "Kentuckiana Interfaith Community" },
      { name: "Catholic Charities of Louisville", note: "Social-justice ministry contacts" },
      { name: "Individual progressive congregations (Episcopal, UCC, Presbyterian)" },
    ],
    organizingNotes: [
      "Faith leader endorsements are trusted-messenger gold. Prioritize relationships before you need them.",
      "Voter registration at Sunday services is legal and high-yield where a congregation welcomes it.",
      "Don't show up only in election years. Issue advocacy between cycles builds the trust that pays off in October.",
    ],
  },
];

export default function CoalitionsPage() {
  return (
    <HubShell
      eyebrow="Coalition Organizing · Louisville"
      title="The six constituencies that power the coalition."
      subtitle="Per the DNC Playbook: Coalition Regions are part of the main organizing team, not siloed. These are Louisville's highest-yield Democratic constituencies, the named partners the skill flags, and the practices that actually build trust."
      maxWidthClass="max-w-5xl"
    >
      <div className="mb-8 rounded-xl border-l-4 border-[var(--color-ldp-red)] bg-white p-4">
        <p className="text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
          <strong className="text-[var(--color-ldp-navy-900)]">
            Coalition work is year-round.
          </strong>{" "}
          The parties that show up only in October don&apos;t build the trust that wins November.
          Everything on this page is a starting point — partner names should be confirmed with
          the current chairs of the Communications, Volunteering, and Candidate Recruitment
          committees before any outreach.
        </p>
      </div>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        {COALITIONS.map((c) => (
          <CoalitionCard key={c.key} coalition={c} />
        ))}
      </section>

      <section className="rounded-xl border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          How this page is used
        </h2>
        <ol className="mt-3 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            1. Assign an EC liaison to each coalition (via the{" "}
            <Link href="/committees" className="text-[var(--color-ldp-navy-700)] underline">
              Communications
            </Link>
            , <Link href="/committees" className="text-[var(--color-ldp-navy-700)] underline">Volunteering</Link>, or a dedicated ad-hoc committee).
          </li>
          <li>
            2. For each partner, build a warm-relationship file in the{" "}
            <Link href="/my-ld" className="text-[var(--color-ldp-navy-700)] underline">
              LD recruiting CRM
            </Link>{" "}
            so handoffs survive leadership changes.
          </li>
          <li>
            3. Surface partner-led events in{" "}
            <Link href="/events" className="text-[var(--color-ldp-navy-700)] underline">
              Events
            </Link>{" "}
            or{" "}
            <Link href="/voter-registration" className="text-[var(--color-ldp-navy-700)] underline">
              Voter Registration
            </Link>{" "}
            so the whole EC can show up.
          </li>
          <li>
            4. Review this page quarterly. What&apos;s stale, who retired, who&apos;s new.
          </li>
        </ol>
      </section>

      <p className="mt-5 text-[11px] italic text-[var(--color-ldp-ink-700)]">
        Seeded from the dem-organizing skill&apos;s Louisville organizing reference. Content is
        editable via pull request (for now); eventually this becomes a Supabase-backed table so
        LD chairs and committee leads can update partner contacts directly.
      </p>
    </HubShell>
  );
}

function CoalitionCard({ coalition }: { coalition: Coalition }) {
  const { name, accent, Icon, neighborhoods, bucketNote, warning, partners, organizingNotes } =
    coalition;
  return (
    <article
      className="overflow-hidden rounded-xl border-2 bg-white shadow-sm"
      style={{ borderColor: accent }}
    >
      <div
        className="flex items-center gap-3 px-5 py-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)`,
        }}
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-white/20 ring-1 ring-white/25">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight">{name}</h3>
          <p className="mt-0.5 text-xs text-white/85">{bucketNote}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            Where they are in Louisville
          </div>
          <ul className="mt-1 space-y-0.5 text-xs text-[var(--color-ldp-ink-900)]">
            {neighborhoods.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        </div>

        {warning && (
          <div className="rounded border-l-2 border-[var(--color-ldp-red)] bg-[#FFF5F6] p-2 text-xs text-[var(--color-ldp-ink-900)]">
            <strong>Careful:</strong> {warning}
          </div>
        )}

        <div>
          <div
            className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            <Building2 aria-hidden="true" className="size-3" />
            Partners
          </div>
          <ul className="space-y-0.5 text-xs text-[var(--color-ldp-ink-900)]">
            {partners.map((p) => (
              <li key={p.name}>
                •{" "}
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-ldp-navy-700)] underline"
                  >
                    {p.name}
                  </a>
                ) : (
                  <span className="font-medium">{p.name}</span>
                )}
                {p.note && (
                  <span className="italic text-[var(--color-ldp-ink-700)]"> — {p.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div
            className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            <Mic2 aria-hidden="true" className="size-3" />
            How to actually engage
          </div>
          <ul className="space-y-0.5 text-xs text-[var(--color-ldp-ink-900)]">
            {organizingNotes.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
