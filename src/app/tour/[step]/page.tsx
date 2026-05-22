import Link from "next/link";
import { notFound } from "next/navigation";
import { getStep } from "@/lib/tour/steps";
import { TourShell } from "@/components/tour/TourShell";
import { ROLE_ONE_PAGERS, type RoleOnePager } from "@/content/role-one-pagers";
import {
  REORG_CHAIN,
  TIMELINE_2026_2028,
  WHY_2028_MATTERS,
  STEP_6_UNRESOLVED,
  HOW_2025_ACTUALLY_RAN,
  type VerifyCallout as VerifyCalloutData,
} from "@/content/reorg-chain";
import { Step3DistrictLink } from "@/components/tour/Step3DistrictLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepParam } = await params;
  const s = getStep(Number(stepParam));
  return { title: s ? `Tour — ${s.title}` : "Tour" };
}

export default async function TourStepPage({
  params,
  searchParams,
}: {
  params: Promise<{ step: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { step: stepParam } = await params;
  const { role: roleParam } = await searchParams;
  const stepNum = Number(stepParam);
  const step = getStep(stepNum);
  if (!step) notFound();

  return (
    <TourShell step={step}>
      <StepBody stepNum={step.num} roleParam={roleParam} />
    </TourShell>
  );
}

function StepBody({ stepNum, roleParam }: { stepNum: number; roleParam?: string }) {
  switch (stepNum) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 roleParam={roleParam} />;
    case 3:
      return <Step3 />;
    case 4:
      return <Step4 />;
    case 5:
      return <Step5 />;
    case 6:
      return <Step6 />;
    default:
      return null;
  }
}

function Step1() {
  return (
    <>
      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-bold text-white">Where this party sits</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          The{" "}
          <a
            href="https://democrats.org/playbook/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
          >
            Democratic National Committee
          </a>{" "}
          sets national strategy and funds key priorities. The{" "}
          <a
            href="https://www.kydemocrats.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
          >
            Kentucky Democratic Party
          </a>{" "}
          runs statewide elections and provides the playbooks, tools, and legal infrastructure
          counties operate within. The Louisville Democratic Party is the county-level Executive
          Committee — we&apos;re the ones who actually organize the 629 precincts in Jefferson
          County, recruit and endorse local candidates, and deliver turnout in the only place where
          Kentucky Democrats consistently win.
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          With thanks to our partners at KDP
        </div>
        <h2 className="mt-1 text-lg font-bold text-white">
          Kentucky Democratic Party leadership
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          The LDPEC operates inside a framework KDP builds and maintains. When the state party
          does its job well, our job gets easier. Know who&apos;s there:
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
              Chair
            </div>
            <div className="mt-0.5 text-base font-semibold text-white">Colmon Elridge</div>
            <div className="mt-1 text-xs text-white/60">
              Elected party leader; represents KDP publicly and chairs SCEC.
            </div>
          </div>
          <div className="rounded border border-white/10 bg-white/5 p-4">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
              Executive Director
            </div>
            <div className="mt-0.5 text-base font-semibold text-white">Morgan Eaves</div>
            <div className="mt-1 text-xs text-white/60">
              Senior staff; runs day-to-day operations, coordinates with county parties.
            </div>
          </div>
        </div>

        <div className="mt-4 rounded border border-dashed border-white/15 bg-white/5 p-4 text-xs text-white/65">
          <div className="font-semibold text-white/80">Contact KDP directly:</div>
          <ul className="mt-1.5 space-y-0.5">
            <li>
              General:{" "}
              <a href="mailto:info@kydemocrats.org" className="text-[var(--color-ldp-gold-tint)] underline decoration-dotted underline-offset-2">
                info@kydemocrats.org
              </a>
            </li>
            <li>
              Press:{" "}
              <a href="mailto:press@kydemocrats.org" className="text-[var(--color-ldp-gold-tint)] underline decoration-dotted underline-offset-2">
                press@kydemocrats.org
              </a>
            </li>
            <li>
              Office: (502) 695-4828 ·{" "}
              <a href="https://www.kydemocrats.org" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ldp-gold-tint)] underline decoration-dotted underline-offset-2">
                kydemocrats.org
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-4 rounded border border-white/10 bg-white/5 p-4 text-xs text-white/70">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
            State Central Executive Committee
          </div>
          <p className="mt-1.5 leading-relaxed">
            SCEC is the statewide body that governs KDP between state conventions. The full roster
            isn&apos;t published on kydemocrats.org — KDP maintains it internally. To see the
            current SCEC roster or who from Jefferson County holds an SCEC seat, email{" "}
            <a href="mailto:info@kydemocrats.org" className="text-[var(--color-ldp-gold-tint)] underline decoration-dotted underline-offset-2">
              info@kydemocrats.org
            </a>{" "}
            or ask the LDP Chair.
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-bold text-white">
          Six things every Executive Committee owes its county
        </h2>
        <ol className="mt-2 space-y-2 text-sm text-white/85">
          <li>
            <strong>1. Organize precincts.</strong> Keep Precinct Captains filled and active across
            all 629 precincts.
          </li>
          <li>
            <strong>2. Recruit and endorse candidates.</strong> Every winnable seat needs a credible
            Democrat on the ballot.
          </li>
          <li>
            <strong>3. Run voter contact.</strong> Canvass, phonebank, and GOTV at scale — both in
            primaries and November.
          </li>
          <li>
            <strong>4. Fundraise locally.</strong> KDP and the DNC together cover less than a fifth
            of party operating costs. The rest is raised in-county.
          </li>
          <li>
            <strong>5. Train the next generation.</strong> LD Chairs, Precinct Captains, canvassers,
            and candidates all need onboarding — not assumed competence.
          </li>
          <li>
            <strong>6. Staff the County Board of Elections.</strong> Kentucky statute (KRS 117.035)
            requires each county Board of Elections to include one member nominated by the county
            Democratic Executive Committee. The LDPEC recommends one Jefferson County voter to the
            Secretary of State for that seat; the Governor makes the appointment. It&apos;s a
            four-year term that oversees how elections are physically run in our county.
          </li>
        </ol>
      </section>

      <details className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-white/80 hover:text-white">
          Why you&apos;ll see three names — LDP, LJCDP, JCDP →
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
          Before 2003, Jefferson County and the City of Louisville had separate governments, and the
          local Democratic Party was the <strong className="text-white">Jefferson County Democratic Party (JCDP)</strong>.
          In 2003 the governments merged into Louisville Metro, and the party&apos;s formal name
          became the <strong className="text-white">Louisville-Jefferson County Democratic Party (LJCDP)</strong>.
          Today it&apos;s commonly known as the <strong className="text-white">Louisville Democratic Party (LDP)</strong> —
          the public brand. You&apos;ll see all three in older docs. They all mean the same party.
          Bylaws citations keep the formal name; day-to-day copy uses LDP.
        </p>
      </details>

      <section className="rounded-lg border border-[var(--color-ldp-gold)] bg-white/5 p-5">
        <h2 className="text-lg font-bold text-white">What this portal is (and isn&apos;t)</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          <strong className="text-white">Is:</strong> the internal playbook for LDPEC members. A
          companion to Google Drive (where working docs live) and{" "}
          <a
            href="https://www.louisvilledems.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
          >
            louisvilledems.com
          </a>{" "}
          (where the party talks to voters). Source of truth for roster, monthly work, and
          what&apos;s live this cycle.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          <strong className="text-white">Isn&apos;t:</strong> the public-facing website.
          That&apos;s{" "}
          <a
            href="https://www.louisvilledems.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
          >
            louisvilledems.com
          </a>{" "}
          — different audience, different management, owned by the Communications Committee. If you
          need something published to voters, route through Comms.
        </p>
      </section>
    </>
  );
}

function Step2({ roleParam }: { roleParam?: string }) {
  const selected = ROLE_ONE_PAGERS.find(
    (r) => r.key.toLowerCase() === (roleParam ?? "").toLowerCase()
  );

  if (!selected) {
    return (
      <>
        <p className="mb-6 text-sm text-white/85">
          Pick the role that matches your seat. You&apos;ll see the one-pager for that role —
          what you&apos;re supposed to do, how to start if you haven&apos;t, and what spring 2028
          will ask of you.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {ROLE_ONE_PAGERS.map((r) => (
            <Link
              key={r.key}
              href={`/tour/2?role=${r.key.toLowerCase()}`}
              className="group rounded-lg border border-white/15 bg-white/5 p-5 transition-colors hover:border-[var(--color-ldp-gold)]"
            >
              <div className="text-base font-semibold text-white">{r.title}</div>
              <p className="mt-2 text-xs text-white/70 line-clamp-3">{r.whoYouAre}</p>
              <div className="mt-3 text-xs font-medium text-[var(--color-ldp-gold-tint)]">Open →</div>
            </Link>
          ))}
        </div>
      </>
    );
  }

  return <RoleOnePagerView r={selected} />;
}

function RoleOnePagerView({ r }: { r: RoleOnePager }) {
  return (
    <article>
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-2xl font-bold text-white">{r.title}</h2>
        <Link
          href="/tour/2"
          className="rounded text-xs text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ldp-navy-900)]"
        >
          change role
        </Link>
      </div>

      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          Who you are
        </h3>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">{r.whoYouAre}</div>
      </section>

      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          What this role actually does
        </h3>
        <ul className="space-y-2 text-sm text-white/90">
          {r.whatTheRoleDoes.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 text-[var(--color-ldp-gold-tint)]">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatMd(d) }} />
            </li>
          ))}
        </ul>
      </section>

      {r.alsoNote && (
        <section className="mb-6 rounded-lg border-l-4 border-[var(--color-ldp-gold)] bg-white/5 p-4">
          <p
            className="text-sm leading-relaxed text-white/90"
            dangerouslySetInnerHTML={{ __html: formatMd(r.alsoNote) }}
          />
        </section>
      )}

      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          If you haven&apos;t been doing it, start here
        </h3>
        <ol className="space-y-2 text-sm text-white/90">
          {r.startHere.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-gold)] text-[10px] font-bold text-[var(--color-ldp-navy-900)]">
                {i + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: formatMd(s) }} />
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border-2 border-[var(--color-ldp-gold)] bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          Your 2028 responsibility
        </h3>
        <p className="text-sm leading-relaxed text-white/90">{r.responsibility2028}</p>
      </section>
    </article>
  );
}

function Step3() {
  return (
    <>
      <p className="mb-6 text-sm text-white/85">
        This step is the applied-education layer — your district&apos;s precincts, voter math, and
        the one move that matters this week. If you&apos;ve told the dashboard which LD you&apos;re
        in, this step jumps you straight there.
      </p>
      <Step3DistrictLink />
    </>
  );
}

function formatMd(s: string): string {
  // Minimal markdown: **bold** → <strong>, backticks → <code>
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-white/10 px-1 py-0.5 text-xs">$1</code>');
}

function Step4() {
  return (
    <>
      <p className="mb-6 text-sm text-white/85">
        LDPEC meets quarterly at minimum (per LJCDP §11.2). In practice, Logan calls meetings
        monthly. Here&apos;s what you need to know to participate.
      </p>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          The Zoom link
        </h3>
        <p className="text-sm text-white/85">
          <a
            href="https://us02web.zoom.us/j/89692618777"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[var(--color-ldp-gold-tint)] hover:underline"
          >
            us02web.zoom.us/j/89692618777
          </a>
          <br />
          <span className="text-xs text-white/60">Meeting ID: 896 9261 8777. Permanent link. Bookmark it.</span>
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          If you can&apos;t make it: proxy
        </h3>
        <p className="text-sm text-white/85">
          Fill out the{" "}
          <a
            href="https://forms.gle/dac7EBMbZXMMdMs59"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ldp-gold-tint)] hover:underline"
          >
            proxy form
          </a>{" "}
          before the meeting. Per LJCDP §23: proxies count for general voting quorum but NOT for
          officer elections, officer removal, or endorsement votes. Your proxy must be another
          LDPEC member and has to be physically present at HQ at the start of the meeting.
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          Robert&apos;s Rules — the five things to know
        </h3>
        <ol className="space-y-2 text-sm text-white/85">
          <li><strong className="text-white">1. Motion.</strong> Someone proposes an action. &ldquo;I move that we...&rdquo;</li>
          <li><strong className="text-white">2. Second.</strong> Someone else confirms it&apos;s worth discussing. Without a second, the motion dies.</li>
          <li><strong className="text-white">3. Discussion.</strong> The chair recognizes speakers. Keep it focused on the motion.</li>
          <li><strong className="text-white">4. Vote.</strong> Chair calls it. Majority carries (except endorsements — see below).</li>
          <li><strong className="text-white">5. Amendment.</strong> Anyone can propose changing the motion mid-discussion; amendment itself needs a second and vote before the main motion can proceed.</li>
        </ol>
        <p className="mt-3 text-xs text-white/60">LJCDP §28 says Robert&apos;s Rules applies to anything bylaws don&apos;t cover.</p>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          Voting types
        </h3>
        <ul className="space-y-2 text-sm text-white/85">
          <li>
            <strong className="text-white">Standard motions:</strong> majority of voting members present.
            Proxies count.
          </li>
          <li>
            <strong className="text-white">Endorsement votes:</strong> 60% threshold, via ElectionRunner,
            secret ballot. Proxies do NOT count — each member votes themselves.
          </li>
          <li>
            <strong className="text-white">Officer election / removal:</strong> majority, no proxies
            (LJCDP §22.1.1 and §23.1).
          </li>
        </ul>
      </section>

      <section className="mb-6 rounded-lg border border-[var(--color-ldp-gold)] bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          Quarterly LD reports (LD officers only)
        </h3>
        <p className="text-sm text-white/85">
          LD Chairs and VCs file a quarterly report summarizing LD activity — meetings held,
          volunteers recruited, canvasses run, PCs active. Template lives in the Comms Drive folder;
          Brook Benningfield (Secretary) collects them.
        </p>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          Rare but high-stakes: filling legislative vacancies
        </h3>
        <p className="text-sm text-white/85">
          If a Kentucky State House or State Senate Democrat vacates mid-term, the LDPEC selects
          the Democratic nominee for the special election — through a Nominating Committee per{" "}
          <strong className="text-white">KDP Bylaws Article VI</strong>. For a State House seat in
          Jefferson County, the voters are the <strong className="text-white">Precinct Committee members</strong>{" "}
          in the vacated LD (weighted by Dem registration per precinct). For a State Senate seat,
          the voters are the <strong className="text-white">LD Chairs whose LDs are in the Senate district</strong>.
          The process, chairs, tie-breakers, and multi-county scenarios are documented in the portal.
        </p>
        <Link
          href="/vacancies/legislative"
          className="mt-3 inline-flex text-xs font-semibold text-[var(--color-ldp-gold-tint)] hover:underline"
        >
          Read the full process →
        </Link>
      </section>
    </>
  );
}

function Step5() {
  return (
    <>
      <p className="mb-6 text-sm text-white/85">
        What&apos;s live in the portal right now:
      </p>

      {/* Workspace callout — the core ask: portal protects continuity. */}
      <section className="mb-6 rounded-lg border-2 border-[var(--color-ldp-gold)] bg-white/5 p-5">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          Your workspace
        </div>
        <h3 className="mt-1 text-lg font-bold text-white">
          Every LD and every committee has a workspace.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          Notes, tasks (with assignment + accept/decline), a recruiting pipeline, and a handoff
          continuity package. Data belongs to the LD or committee — not the chair — so when
          leadership rotates, the new chair walks in on day one with everything the outgoing
          chair left behind.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/my-ld"
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-gold)] px-3 py-1.5 text-xs font-bold text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-gold)]/90"
          >
            LD workspaces →
          </Link>
          <Link
            href="/committees"
            className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
          >
            Committee workspaces →
          </Link>
        </div>
      </section>

      {/* Dashboard redesign callout — it's the first thing anyone sees,
          so worth teaching explicitly on the tour. */}
      <section className="mb-6 rounded-lg border-2 border-white/20 bg-white/5 p-5">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          What the dashboard does
        </div>
        <h3 className="mt-1 text-lg font-bold text-white">
          State of the party, one glance.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          6 KPIs at the top (days to the next election, captain coverage %, active volunteers,
          tasks overdue, EC attendance rate, annual raise floor) + a &ldquo;needs attention&rdquo;
          action queue + your personal tasks + cycle phase + the KDP monthly call + a live
          activity feed. Every number, every action, every person — one surface.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
          >
            Open the dashboard →
          </Link>
          <Link
            href="/overview"
            className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
          >
            Full surface list →
          </Link>
        </div>
      </section>

      <div className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
        Campaign &amp; field
      </div>
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <TourTile
          href="/my-ld"
          title="My LD"
          body="Your district's precincts, PCs on file, races on the ballot, highest-leverage move this week. Auto-routes to your LD once your profile is set."
          primary
        />
        <TourTile
          href="/plan-map"
          title="Plan & Map"
          body="Jefferson County's 629 precincts scored into four strategies with a countywide interactive map."
          primary
        />
        <TourTile
          href="/captains"
          title="Captain Coverage"
          body="Countywide + per-bucket coverage stats. Uncovered ACTIVATE + DEFEND precincts with a one-click Recruit button per row. The skill's top-priority dashboard."
          primary
        />
        <TourTile
          href="/follow-ups"
          title="Follow-Ups"
          body="Working-stage contacts you haven't touched in 14+ days. DNC Playbook 'layering' made actionable. 'Mine only' filter = your 10–20 working relationships."
        />
        <TourTile
          href="/targeting"
          title="Targeting Explained"
          body="Power Base, Hold the Line, Wake the Vote, Plant the Flag — what each bucket is, who's in it, your standing job, and what matters this phase."
        />
        <TourTile
          href="/canvass-tools"
          title="Canvass Tools"
          body="Priority MC districts, volunteer pipeline, canvass guides, VoteBuilder."
        />
        <TourTile
          href="/candidates"
          title="2026 Primary Ballot"
          body="Candidates across mayor, council, state house, state senate, US senate, and county offices with endorsement status."
        />
        <TourTile
          href="/voter-registration"
          title="Voter Registration"
          body="KY rules, deadlines (voter reg, party switch, early voting), Jefferson County Clerk links, returning-citizens path, and scheduled VR drives."
        />
        <TourTile
          href="/early-voting"
          title="Early Voting"
          body="Jefferson County early-voting locations for the 2026 primary, mapped by LD."
        />
        <TourTile
          href="/this-month"
          title="This Month"
          body="The current month's themed playbook plus live events from the louisvilledems.com calendar."
        />
      </div>

      <div className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
        People &amp; governance
      </div>
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <TourTile
          href="/people"
          title="Directory"
          body="Countywide officers, LD Chairs, VCs, At-Large, affiliated seats. Searchable by name, role, LD, committee, email, phone."
        />
        <TourTile
          href="/committees"
          title="Committees"
          body="Standing + ad hoc committees with responsibilities, workflow, members, Drive folders, workspace tools, continuity packages, and Email-chair buttons."
        />
        <TourTile
          href="/volunteers"
          title="Volunteers"
          body="Jessica's roster — intake, interests, availability, activity log. New-signup review queue + 60-day 'gone quiet' retention list."
        />
        <TourTile
          href="/coalitions"
          title="Coalitions"
          body="Six Louisville constituencies (Black, labor, LGBTQ+, Latino, youth, faith) with named partners and year-round engagement notes."
        />
        <TourTile
          href="/partners"
          title="Partners"
          body="Labor, advocacy orgs, Democratic clubs, faith partners, training programs — everyone we work alongside."
        />
        <TourTile
          href="/governance"
          title="Governance Reference"
          body="Quorum, proxies, finance tiers ($500 / $501–999 / $1000+), vacancy rules, KREF 2026 filing dates, the primary-endorsement bylaw. Every rule cited."
        />
        <TourTile
          href="/transitions"
          title="Transitions"
          body="Announced changes (Logan → Roz June 10), currently-vacant seats with 30/90-day fill rules, and recent fills."
        />
        <TourTile
          href="/endorsement"
          title="Endorsement Process"
          body="60% threshold, secret ballot, Jan–Feb timelines, who votes. Now classified as ad-hoc under LJCDP §11.6."
        />
      </div>

      <div className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
        Comms, money &amp; amplify
      </div>
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <TourTile
          href="/amplify"
          title="Amplify"
          body="When Comms publishes a post for the board to push, it lands here pre-filled for Facebook, X, Threads, Bluesky, LinkedIn, email, and texts. One-click share per platform."
          primary
        />
        <TourTile
          href="/events"
          title="Signature Events"
          body="Celebration of Democracy, Women Deliver Democracy, Dems at the Downs — the three events that fund the party. Your $500 annual raise runs through their ticket links."
          primary
        />
        <TourTile
          href="/comms"
          title="Communications"
          body="How the party gets heard — brand strip, seven social handles in brand colors, intake form, ad program."
        />
      </div>

      <div className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
        Reference &amp; learning
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <TourTile
          href="/overview"
          title="What this portal does"
          body="Role-grouped surface list — every EC member, LD chairs + VCs, committee chairs, county officers, reference. Rollout tool for new members."
        />
        <TourTile
          href="/glossary"
          title="Glossary"
          body="30+ terms — Power Base, sleeper Dems, GOTV, D-margin, layering, pipeline, JCDEC, KREF. Operatives' vocabulary, translated for newcomers."
        />
        <TourTile
          href="/drive"
          title="Drive shortcuts"
          body="Every committee's working folder plus the party's top-traffic forms. Sign-in-to-LDP-Google banner so permission walls don't ambush you."
        />
        <TourTile
          href="/help"
          title="Help & FAQ"
          body="How the portal works, section by section. Troubleshooting for the common snags. Help button in the bottom-right of every page."
        />
      </div>
    </>
  );
}

function TourTile({
  href,
  title,
  body,
  primary = false,
}: {
  href: string;
  title: string;
  body: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg border bg-white/5 p-5 transition-colors hover:bg-white/10 ${
        primary ? "border-[var(--color-ldp-gold)]" : "border-white/10 hover:border-[var(--color-ldp-gold)]"
      }`}
    >
      <div className="text-sm font-semibold text-white">{title} →</div>
      <div className="mt-1 text-xs text-white/70">{body}</div>
    </Link>
  );
}

function Step6() {
  return (
    <>
      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          Why you&apos;re reading this
        </h3>
        <p className="text-sm leading-relaxed text-white/85">{WHY_2028_MATTERS.paragraph1}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/85">{WHY_2028_MATTERS.paragraph2}</p>
      </section>

      <section className="mb-6 rounded-lg border border-[var(--color-ldp-gold)] bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
          Why the 2025 cycle felt off
        </h3>
        <p className="text-sm leading-relaxed text-white/85">{WHY_2028_MATTERS.postponementNote}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-white">The reorg chain, in order</h2>
        <div className="space-y-4">
          {REORG_CHAIN.map((s) => (
            <article
              key={s.num}
              className="rounded-lg border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-baseline gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-gold)] text-xs font-bold text-[var(--color-ldp-navy-900)]">
                  {s.num}
                </span>
                <div className="text-base font-semibold text-white">{s.title}</div>
              </div>
              <div className="mt-2 text-sm font-medium text-[var(--color-ldp-gold-tint)]">{s.headline}</div>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-white/85">
                {s.bodyParagraphs.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: formatMd(p) }} />
                ))}
              </div>
              {s.verifyAgainst?.map((v) => (
                <VerifyCallout key={v.id} callout={v} />
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-bold text-white">
          How 2025 actually ran — the concrete example
        </h2>
        <p className="mb-3 text-xs text-white/60">
          Reconstructed from LDPEC minutes Dec 2024 – Mar 2025. Most of the current committee lived
          through this one; this is the shape 2028 will take if it runs to schedule.
        </p>
        <ol className="space-y-2">
          {HOW_2025_ACTUALLY_RAN.map((r, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <div className="w-44 shrink-0 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
                {r.when}
              </div>
              <div className="flex-1 text-sm text-white/85">{r.what}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-bold text-white">Timeline 2026 → 2028</h2>
        <p className="mb-3 text-xs text-white/60">
          Items marked <span className="font-semibold text-amber-300">Unconfirmed</span> depend on
          KDP setting the 2028 reorg calendar in fall 2027. Dates could also shift by a year if KDP
          postpones, as they did before 2025.
        </p>
        <ol className="space-y-2">
          {TIMELINE_2026_2028.map((t, i) => (
            <li
              key={i}
              className={`flex gap-4 rounded-lg border bg-white/5 p-4 ${
                t.unresolved
                  ? "border-amber-500/40"
                  : "border-white/10"
              }`}
            >
              <div
                className={`w-28 shrink-0 text-xs font-semibold uppercase tracking-widest ${
                  t.unresolved ? "text-amber-400" : "text-[var(--color-ldp-gold-tint)]"
                }`}
              >
                {t.label}
              </div>
              <div className="flex-1 text-sm text-white/85">
                {t.description}
                {t.unresolved && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-200">
                    Unconfirmed
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {STEP_6_UNRESOLVED.length > 0 && (
        <section className="mb-6 rounded-lg border-2 border-amber-500/60 bg-amber-500/10 p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-300">
            ⚠ To be verified before the 2028 cycle runs
          </h3>
          <p className="mb-3 text-sm text-white/85">
            This card is drafted to be correct-as-rule where it cites state or county bylaws. These
            specific items require primary-source confirmation before anyone plans real dates or
            procedures off them:
          </p>
          <ul className="space-y-3">
            {STEP_6_UNRESOLVED.map((v) => (
              <li key={v.id} className="rounded border-l-2 border-amber-400 bg-white/5 p-3">
                <div className="text-sm text-white/90">{v.claim}</div>
                <div className="mt-1 text-xs italic text-amber-200/80">
                  <strong>Verify against:</strong> {v.source}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border-2 border-[var(--color-ldp-red)] bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          Write it down now
        </h3>
        <p className="text-sm leading-relaxed text-white/85">
          Whatever role you hold, the next reorg will reset it. The best thing you can do right now is{" "}
          <strong className="text-white">document what you do</strong> — your LD&apos;s canvass
          rhythms, your committee&apos;s recurring work, your contacts, your templates. If you want
          to continue, your successor (or you after re-election) needs that doc. If you don&apos;t
          continue, it&apos;s what keeps the work alive.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          The portal&apos;s <strong className="text-white">continuity package</strong> is built for
          exactly this. Every LD page has one; every committee page has one. Draft while you&apos;re
          in the seat; submit and lock when you&apos;re ready. The next chair inherits it
          automatically — state of the district, key contacts, open-task dispositions, pipeline
          snapshot, and a personal note to your successor. That&apos;s the muscle memory of the
          party, preserved in writing.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/my-ld"
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-red)] px-3 py-1.5 text-xs font-bold text-white hover:bg-[var(--color-ldp-red)]/90"
          >
            Start my LD&apos;s continuity package →
          </Link>
          <Link
            href="/committees"
            className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
          >
            Committee continuity →
          </Link>
        </div>
      </section>
    </>
  );
}

function VerifyCallout({ callout }: { callout: VerifyCalloutData }) {
  return (
    <div className="mt-4 rounded border-l-4 border-amber-400 bg-amber-500/10 p-3">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-amber-300">
        <span aria-hidden="true">⚠</span>
        To be verified
      </div>
      <div className="mt-1 text-sm text-white/90">{callout.claim}</div>
      <div className="mt-1 text-xs italic text-amber-200/80">
        <strong>Source to check:</strong> {callout.source}
      </div>
    </div>
  );
}

function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold-tint)]">
        Placeholder
      </div>
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{note}</p>
    </div>
  );
}

export async function generateStaticParams() {
  return [1, 2, 3, 4, 5, 6].map((n) => ({ step: String(n) }));
}
