import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Compass,
  Info,
  ListChecks,
  Target,
  TrendingUp,
} from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import {
  BATTLEGROUND_HDS,
  ENDORSED_SLATE,
  GENERAL_PLAN_UNIVERSES,
  GENERAL_PLAN_ZONES,
  GP_D1,
  GP_D5,
  GP_D7,
  GP_D9,
  GP_D11,
  GP_D17,
  GP_D21,
  ISSUE_LEADS,
  PHASE_2_DOOR_SCRIPT,
  PHASE_2_KPIS,
  PHASE_2_PLAYBOOK_STEPS,
  PRIORITY_MC_RACES,
  RESOURCING_TIERS,
  TOP_OF_TICKET_BOOKER,
  TOP_OF_TICKET_MAYOR,
  type GeneralPlanRace,
} from "@/content/general-plan-2026";

export const dynamic = "force-static";
export const metadata = { title: "2026 General Strategic Plan" };

export default function GeneralPlanPage() {
  return (
    <HubShell
      eyebrow="Phase 2 · General coordinated campaign"
      title="2026 General Strategic Plan."
      subtitle="The primary canvass is done. The data is in. Every door we knock and every voter we reach from June through November runs on what we learned in May."
      maxWidthClass="max-w-5xl"
    >
      {/* Top-of-page jump nav */}
      <nav
        aria-label="Plan sections"
        className="mb-8 flex flex-wrap gap-2 rounded-xl border border-[var(--color-ldp-line)] bg-white p-3 text-xs"
      >
        {[
          { href: "#landscape", label: "Landscape" },
          { href: "#zones", label: "Strategy zones" },
          { href: "#universes", label: "Who we're talking to" },
          { href: "#slate", label: "Endorsed slate" },
          { href: "#top", label: "Top of ticket" },
          { href: "#priority", label: "Priority MC races" },
          { href: "#battleground", label: "Battleground HDs" },
          { href: "#phase-2", label: "Phase 2" },
          { href: "#phase-3", label: "GOTV sprint" },
          { href: "#resourcing", label: "What the party can do" },
          { href: "#kpis", label: "How we measure" },
          { href: "#playbook", label: "LD chair playbook" },
        ].map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="rounded-md border border-transparent px-2 py-1 font-semibold text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)] hover:bg-[var(--color-ldp-cream,#fbf8f1)]"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <Callout kind="warn" label="What's different about nonpartisan ballot work">
        <p>
          In partisan races, &ldquo;vote for the Democrat&rdquo; is a complete message. In
          nonpartisan races (Mayor, every Metro Council seat) it&apos;s not — there&apos;s no
          D next to a name. Phase 2 voter contact has to NAME the LDP-endorsed candidate at
          every door. Sample ballot lit pieces are the most important deliverable for this.
          Order them early.
        </p>
      </Callout>

      <SectionHeader anchor="landscape" eyebrow="The landscape">
        What the primary showed us
      </SectionHeader>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        The May 19 primary was the first real test of the universe we built in March. The
        headline numbers held. Some assumptions came back stronger than expected. The plan&apos;s
        targeting model can be trusted going into Phase 2.
      </p>

      <SubHeader>Primary turnout in context</SubHeader>
      <Table
        headers={["Metric", "2022 Primary", "2026 Primary", "Change"]}
        rows={[
          ["US Senate votes (JeffCo, apples-to-apples)", "123,614", "140,428", "+13.6%"],
          ["Total ballots cast", "—", "151,288", "—"],
          ["Democratic ballots", "—", "99,515 (32.9%)", "—"],
          ["Republican ballots", "—", "44,118 (14.6%)", "—"],
          ["Nonpartisan-only ballots", "0 (didn't exist)", "7,655 (5.1%)", "NEW"],
        ]}
      />
      <Callout kind="info" label="Read the turnout numbers carefully">
        <p>
          Apples-to-apples primary turnout growth was <strong>+13.6%</strong> in US Senate
          votes. The total-ballot number looks bigger only because the new nonpartisan-only
          ballot didn&apos;t exist in 2022. Plan from the +13.6% baseline. Applying 2022&apos;s
          primary-to-general expansion ratio of 2.25× gives a projected JeffCo general turnout
          of <strong>295,000–330,000</strong> — meaningfully bigger than 2022&apos;s 277,772
          but not transformative.
        </p>
      </Callout>

      <SubHeader>Registration has grown</SubHeader>
      <Table
        headers={["Category", "March 2026 Plan", "May 2026 Actual", "Change"]}
        rows={[
          ["Total Registered", "535,207", "~585,000", "+50,000"],
          ["Democrats", "293,164", "~330,000", "+37,000"],
          ["Republicans", "174,389", "~160,000", "−14,000"],
          ["Independent/Other", "67,654", "~95,000", "+27,000"],
        ]}
      />
      <Callout kind="info" label="The number that matters most">
        <p>
          Independent registration jumped 40%. That&apos;s <strong>27,000 new voters</strong>{" "}
          who weren&apos;t on the radar in March. They couldn&apos;t vote in the Democratic
          primary. They can vote in November. Many will vote nonpartisan Metro Council and
          Mayor for the first time — and they have no party-label cue to guide them. The
          Independent universe is now the largest unconvinced bloc in JeffCo.
        </p>
      </Callout>

      <SectionHeader anchor="zones" eyebrow="Strategy zones — updated for Phase 2">
        Same zones, sharper resource allocation
      </SectionHeader>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        The four strategy zones haven&apos;t changed. What changes for the general is where
        we spend resources inside each zone. The primary canvass collected data everywhere.
        Phase 2 spends resources where the math says they matter.
      </p>
      <Table
        headers={[
          "Zone",
          "What it means",
          "Precincts",
          "Voters",
          "Primary focus",
          "General focus",
        ]}
        rows={GENERAL_PLAN_ZONES.map((z) => [
          z.zone,
          z.what,
          z.precincts.toLocaleString(),
          z.voters.toLocaleString(),
          z.primary_focus,
          z.general_focus,
        ])}
      />
      <Callout kind="warn" label="Key shift from primary to general">
        <p>
          During the primary, every zone got canvassed. In the general,{" "}
          <strong>DEFEND and ACTIVATE</strong> zones get the heaviest investment. The primary
          data tells us exactly where to double down. PRIMARY and GROW zones get lighter
          touches — base maintenance and long-term relationship work.
        </p>
      </Callout>

      <SectionHeader anchor="universes" eyebrow="Who we're talking to now">
        Three universes that decide every competitive race
      </SectionHeader>
      <Table
        headers={["Universe", "Size", "What they are", "Phase 2 job"]}
        rows={GENERAL_PLAN_UNIVERSES.map((u) => [u.name, u.size_label, u.what, u.phase_2_job])}
      />
      <Callout kind="info" label="Where the margin of victory lives">
        <p>
          Sleeper Dems (~87,000) and persuadable Independents (~95,000) are the two universes
          that decide every competitive race in JeffCo. The primary canvass identified subsets
          of both. Phase 2 work is concentrated contact with those identified voters, plus
          expansion into the unidentified portion.
        </p>
      </Callout>

      <SectionHeader anchor="slate" eyebrow="The updated endorsed slate">
        What carries, what&apos;s pending DEC action
      </SectionHeader>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        Endorsements from the primary carry forward to the general for nonpartisan races
        (Mayor + Metro Council) where the LDP-endorsed candidate advanced. Four Metro Council
        races need new general endorsements: <strong>D1, D3, D5, D9</strong>.
      </p>
      <div className="mb-4 overflow-hidden rounded-lg border border-[var(--color-ldp-line)]">
        <table className="w-full text-xs">
          <thead className="bg-[var(--color-ldp-navy-900)] text-white">
            <tr>
              <th className="px-3 py-2 text-left">Race</th>
              <th className="px-3 py-2 text-left">Endorsed (primary)</th>
              <th className="px-3 py-2 text-left">General status</th>
            </tr>
          </thead>
          <tbody>
            {ENDORSED_SLATE.map((r, i) => (
              <tr
                key={r.race}
                className={
                  r.pending
                    ? "bg-amber-50"
                    : i % 2 === 0
                      ? "bg-white"
                      : "bg-[#FAFBFC]"
                }
              >
                <td className="px-3 py-2 font-semibold text-[var(--color-ldp-navy-900)]">
                  {r.race}
                </td>
                <td className="px-3 py-2 text-[var(--color-ldp-ink-900)]">{r.endorsed}</td>
                <td className="px-3 py-2 text-[var(--color-ldp-ink-700)]">
                  {r.pending ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-amber-600" />
                      <strong>{r.status}</strong>
                    </span>
                  ) : (
                    r.status
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout kind="warn" label="DEC action needed before Phase 2 kicks off">
        <p>
          Four general endorsements (<strong>D1, D3, D5, D9</strong>) must be on the next DEC
          agenda. The Phase 2 program plan can&apos;t fully lock until these are decided.
          D5 and D9 should be paired with candidate vetting on the advancing candidates so
          the committee has the information to vote.
        </p>
      </Callout>

      <SectionHeader anchor="top" eyebrow="Top of ticket">
        U.S. Senate &amp; Mayor
      </SectionHeader>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        The 2026 cycle has two top-of-ticket races in JeffCo: the U.S. Senate (statewide,
        partisan) and the Louisville Mayoral race (nonpartisan, contested between two
        Democrats). Both demand party attention — for different reasons.
      </p>
      <RaceBlock race={TOP_OF_TICKET_BOOKER} />
      <RaceBlock race={TOP_OF_TICKET_MAYOR} />

      <SectionHeader anchor="priority" eyebrow="The seven priority races">
        Priority Metro Council races
      </SectionHeader>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        Seven Metro Council races are priority districts for Phase 2. Three were primary
        priorities continuing (D7, D17, D21 — GOP-targeted). One is the new offensive flip
        (D11). Three are new priorities the primary surfaced (D9 — competitive defense; D1,
        D5 — nonpartisan defense in Dem-majority districts).
      </p>
      {PRIORITY_MC_RACES.map((r) => (
        <RaceBlock key={r.id} race={r} />
      ))}

      <SectionHeader anchor="battleground" eyebrow="Battleground House districts">
        Five HDs where state legislative control could shift
      </SectionHeader>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        These five HDs contain <strong>155 precincts</strong> and{" "}
        <strong>145,655 voters</strong> with <strong>24,298 sleeper Democrats</strong>.
        HD 48 is elevated to offensive priority — Suhas Kulkarni won the Democratic primary
        at 72.88% and faces a 3-term Republican incumbent.
      </p>
      <Table
        headers={["HD", "Dem margin", "Precincts", "Voters", "Sleeper Dems", "2026 D nominee / notes"]}
        rows={BATTLEGROUND_HDS.map((b) => [
          `HD ${b.hd}`,
          b.dem_margin,
          String(b.precincts),
          b.voters.toLocaleString(),
          b.sleeper_dems.toLocaleString(),
          b.note,
        ])}
        boldFirst
      />
      <Callout kind="info" label="Overlap is the opportunity">
        <p>
          Several battleground House Districts overlap with priority Metro Council districts.
          Volunteers in those areas work both races simultaneously — one canvass, two
          conversations, maximum impact. HD 48 overlap with Metro Council D17 and D11 is
          the most strategically valuable combined territory.
        </p>
      </Callout>

      <SectionHeader anchor="phase-2" eyebrow="Phase 2 · June – October">
        General coordinated campaign
      </SectionHeader>
      <QuoteBanner>
        This is where the primary data pays off. We stop guessing and start spending
        resources where the math says they matter.
      </QuoteBanner>
      <SubHeader>The Phase 2 mission</SubHeader>
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-[var(--color-ldp-ink-900)] marker:font-bold marker:text-[var(--color-ldp-navy-700)]">
        <li>
          <strong>Persuade undecided voters</strong> using the issue data we collected at every
          door in the primary.
        </li>
        <li>
          <strong>Mobilize Sleeper Democrats</strong> — registered Ds who vote in November but
          skipped May.
        </li>
        <li>
          <strong>Win the seven priority Metro Council races</strong> — D11 offense; D7, D9, D17,
          D21 R-defense; D1, D5 nonpartisan defense.
        </li>
        <li>
          <strong>Win HD 48</strong> (Kulkarni offensive flip) — and hold the four other
          battleground state House seats.
        </li>
        <li>
          <strong>Deliver Booker 60%+ in JeffCo</strong> so the statewide US Senate math works.
        </li>
      </ol>

      <SubHeader>What changes after the primary</SubHeader>
      <ul className="mb-6 space-y-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        {[
          ["Targeting shifts to strategy zones", "DEFEND precincts (margin <5 pts) and ACTIVATE precincts (5–20 pts) get the heaviest contact. PRIMARY and GROW zones get lighter touches."],
          ["Issue-based messaging replaces generic outreach", "The Q1/Q2 issue data from the primary canvass tells us exactly what to say in each district."],
          ["Persuasion replaces education", "The primary was about informing. The general is about convincing. We know who's persuadable (Q3) and what they care about (Q1/Q2)."],
          ["Metro Council defense is integrated", "Priority MC districts are woven into the coordinated campaign, not siloed. Volunteers work the MC race and the state legislative race simultaneously."],
          ["The volunteer operation scales", "Every primary signup (Q6) gets activated. Yard sign list (Q5) is deployed. Event contacts (Q4) get invited to canvass launches, phone banks, and rallies."],
        ].map(([head, body]) => (
          <li key={head} className="flex gap-2">
            <ChevronRight aria-hidden className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-navy-700)]" />
            <span>
              <strong className="text-[var(--color-ldp-navy-900)]">{head}.</strong>{" "}
              {body}
            </span>
          </li>
        ))}
      </ul>

      <SubHeader>What we say at every door</SubHeader>
      <div className="mb-4 rounded-lg border border-[var(--color-ldp-line)] border-l-4 border-l-[var(--color-ldp-navy-700)] bg-[#FAFBFC] p-5">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-700)]">
          Phase 2 door script
        </div>
        <p className="whitespace-pre-wrap font-serif text-sm italic leading-relaxed text-[var(--color-ldp-ink-900)]">
          {PHASE_2_DOOR_SCRIPT}
        </p>
      </div>

      <SubHeader>The six issues driving Phase 2 messaging</SubHeader>
      <p className="mb-3 text-sm text-[var(--color-ldp-ink-900)]">
        Q1 = top issue, Q2 = second issue. Codes: Cost of Living, Healthcare, Public Safety,
        Education, Reproductive Rights, Jobs/Economy, Infrastructure.
      </p>
      <Table
        headers={["District", "Lead issue (Q1)", "Phase 2 mail / digital lead"]}
        rows={ISSUE_LEADS.map((r) => [r.district, r.lead_issue, r.mail_lead])}
      />

      <SectionHeader anchor="phase-3" eyebrow="Phase 3 · Final 2 weeks">
        GOTV sprint
      </SectionHeader>
      <QuoteBanner>No more persuasion. No more education. Just turnout.</QuoteBanner>
      <ul className="mb-6 space-y-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        {[
          "Sleeper Dems contacted in primary get priority GOTV — they've already talked to us, the ask is simple: go vote.",
          "Yard sign locations become staging points for visibility and last-mile canvassing.",
          "Issue data powers the final message — the closing argument is tailored to what voters told us matters most.",
          "Priority Metro Council districts get daily contact targets — D11, D7, D17, D21 plus D9, D1, D5.",
          "Battleground HD volunteers work both the MC and HD race simultaneously — one canvass, two conversations.",
          "Election Day coverage — full LD chair presence, election protection volunteers, party hub for volunteer dispatch.",
        ].map((line) => (
          <li key={line} className="flex gap-2">
            <ChevronRight aria-hidden className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-navy-700)]" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <SectionHeader anchor="resourcing" eyebrow="What the party can do">
        Resourcing tiers
      </SectionHeader>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        The party is not a candidate campaign. It doesn&apos;t raise money to spend on one
        race. Phase 2 runs on what the Executive Committee chooses to invest in coordinated
        work. Each tier builds on the one below. Nothing below baseline is presumed.
        Nothing above the funded layer is promised.
      </p>
      <div className="mb-4 space-y-3">
        {RESOURCING_TIERS.map((tier, idx) => (
          <div
            key={tier.id}
            className={`rounded-lg border-l-4 p-4 ${
              idx === 0
                ? "border-l-[var(--color-ldp-navy-700)] bg-white"
                : idx === 1
                  ? "border-l-[var(--color-ldp-gold,#c89a3b)] bg-[var(--color-ldp-cream,#fbf8f1)]"
                  : idx === 2
                    ? "border-l-emerald-600 bg-emerald-50/50"
                    : "border-l-[var(--color-ldp-red)] bg-[#FFF5F6]"
            } border border-[var(--color-ldp-line)]`}
          >
            <h4 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
              {tier.label}
            </h4>
            <p className="mt-1 text-xs italic text-[var(--color-ldp-ink-700)]">
              {tier.description}
            </p>
            <ul className="mt-2 space-y-1">
              {tier.bullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-2 text-xs leading-relaxed text-[var(--color-ldp-ink-900)]"
                >
                  <span aria-hidden className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--color-ldp-navy-700)]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SectionHeader anchor="kpis" eyebrow="How we measure">
        Phase 2 KPIs
      </SectionHeader>
      <Table
        headers={["KPI", "Target", "Why it matters"]}
        rows={PHASE_2_KPIS.map((k) => [k.kpi, k.target, k.why])}
      />

      <SectionHeader anchor="playbook" eyebrow="LD chair playbook">
        12 steps for every LD chair
      </SectionHeader>
      <p className="mb-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        Every LD chair runs Phase 2 in their territory. The same VoteBuilder structure that
        powered the primary canvass is used for Phase 2 — refreshed saved searches and lists,
        English and Spanish scripts. See the LD Chair VoteBuilder Operations Guide for
        step-by-step screenshots.
      </p>
      <ol className="mb-6 space-y-2 text-sm text-[var(--color-ldp-ink-900)]">
        {PHASE_2_PLAYBOOK_STEPS.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-700)] text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start gap-2">
          <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-700" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              The bottom line
            </div>
            <p className="mt-1 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
              By the time we get to November 3, the party will have knocked thousands of
              doors, built a voter intelligence file covering every Legislative District,
              identified and activated Sleeper Democrats in every battleground, and fielded a
              coordinated campaign powered by real data instead of assumptions. The primary
              canvass was Phase 1. Phase 2 is the general coordinated campaign. Phase 3 is
              the GOTV sprint. They are one operation, and we have what we need to run it.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-10 border-t border-[var(--color-ldp-line)] pt-6 text-center text-xs italic text-[var(--color-ldp-ink-700)]">
        <strong className="not-italic text-[var(--color-ldp-navy-900)]">
          Louisville Democratic Party · Jefferson County Democratic Executive Committee
        </strong>
        <br />
        Prepared by Lisa Norkus, 41st LD Vice Chair · May 2026
        <br />
        For VoteBuilder access or questions:{" "}
        <a href="mailto:info@louisvilledems.com" className="underline">
          info@louisvilledems.com
        </a>
      </footer>
    </HubShell>
  );
}

function SectionHeader({
  anchor,
  eyebrow,
  children,
}: {
  anchor: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <header id={anchor} className="mt-12 mb-4 scroll-mt-24">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
        {eyebrow}
      </div>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
        {children}
      </h2>
      <div className="mt-2 h-0.5 w-12 bg-[var(--color-ldp-red)]" />
    </header>
  );
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
      {children}
    </h3>
  );
}

function Callout({
  kind,
  label,
  children,
}: {
  kind: "priority" | "warn" | "info" | "bottom";
  label: string;
  children: React.ReactNode;
}) {
  const meta: Record<
    typeof kind,
    { bg: string; border: string; color: string; Icon: React.ComponentType<{ className?: string }> }
  > = {
    priority: {
      bg: "bg-[#FFF5F6]",
      border: "border-[var(--color-ldp-red)]/30",
      color: "text-[var(--color-ldp-red)]",
      Icon: AlertTriangle,
    },
    warn: {
      bg: "bg-amber-50",
      border: "border-amber-300/60",
      color: "text-amber-700",
      Icon: AlertTriangle,
    },
    info: {
      bg: "bg-[#E8F0FB]",
      border: "border-[var(--color-ldp-navy-700)]/30",
      color: "text-[var(--color-ldp-navy-700)]",
      Icon: Info,
    },
    bottom: {
      bg: "bg-emerald-50",
      border: "border-emerald-300/60",
      color: "text-emerald-700",
      Icon: CheckCircle2,
    },
  };
  const m = meta[kind];
  return (
    <div className={`mb-4 rounded-lg border p-4 ${m.bg} ${m.border}`}>
      <div className={`mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] ${m.color}`}>
        <m.Icon aria-hidden className="size-3.5" />
        {label}
      </div>
      <div className="text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        {children}
      </div>
    </div>
  );
}

function QuoteBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-lg bg-[var(--color-ldp-navy-900)] px-6 py-4 text-center font-serif text-base italic text-white">
      {children}
    </div>
  );
}

function Table({
  headers,
  rows,
  boldFirst = false,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  boldFirst?: boolean;
}) {
  return (
    <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--color-ldp-line)]">
      <table className="w-full text-xs">
        <thead className="bg-[var(--color-ldp-navy-900)] text-white">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFBFC]"}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 align-top ${
                    boldFirst && j === 0
                      ? "font-bold text-[var(--color-ldp-navy-900)]"
                      : "text-[var(--color-ldp-ink-900)]"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RaceBlock({ race }: { race: GeneralPlanRace }) {
  return (
    <article
      id={race.id}
      className="mb-6 scroll-mt-24 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5 shadow-sm"
    >
      <header className="mb-3 border-l-4 border-l-[var(--color-ldp-navy-700)] bg-[#E8F0FB]/60 px-4 py-2">
        <h3 className="text-base font-bold text-[var(--color-ldp-navy-900)]">{race.title}</h3>
      </header>
      <Callout kind={race.callout_kind} label={race.callout_label}>
        <p>{race.callout_body}</p>
      </Callout>
      <SubHeader>By the numbers</SubHeader>
      <Table headers={["Metric", "Value"]} rows={race.metrics.map((m) => [m.metric, m.value])} />
      <SubHeader>Phase strategy</SubHeader>
      <Table headers={["Phase", "Strategy"]} rows={race.phases.map((p) => [p.phase, p.strategy])} />
    </article>
  );
}
