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
          The Democratic National Committee sets national strategy and funds key priorities. The
          Kentucky Democratic Party runs statewide elections and provides the playbooks, tools, and
          legal infrastructure counties operate within. The Louisville Democratic Party is the
          county-level Executive Committee — we&apos;re the ones who actually organize the 629
          precincts in Jefferson County, recruit and endorse local candidates, and deliver turnout in
          the only place where Kentucky Democrats consistently win.
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-bold text-white">
          Five things every Executive Committee owes its county
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
        </ol>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-bold text-white">A short history of three names</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          Before 2003, Jefferson County and the City of Louisville had separate governments, and the
          local Democratic Party was the <strong className="text-white">Jefferson County Democratic Party (JCDP)</strong>.
          In 2003 the governments merged into Louisville Metro, and the party&apos;s formal name
          became the <strong className="text-white">Louisville-Jefferson County Democratic Party (LJCDP)</strong>.
          Today it&apos;s commonly known as the <strong className="text-white">Louisville Democratic Party (LDP)</strong> —
          the public brand. You&apos;ll see all three in older docs. They all mean the same party.
          Bylaws citations keep the formal name; day-to-day copy uses LDP.
        </p>
      </section>

      <section className="rounded-lg border border-[var(--color-ldp-gold)] bg-white/5 p-5">
        <h2 className="text-lg font-bold text-white">What this portal is (and isn&apos;t)</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          <strong className="text-white">Is:</strong> the internal playbook for LDPEC members. A
          companion to Google Drive (where working docs live) and louisvilledems.com (where the party
          talks to voters). Source of truth for roster, monthly work, and what&apos;s live this cycle.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          <strong className="text-white">Isn&apos;t:</strong> the public-facing website.
          That&apos;s louisvilledems.com — different audience, different management, owned by the
          Communications Committee. If you need something published to voters, route through Comms.
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
              <div className="mt-3 text-xs font-medium text-[var(--color-ldp-gold)]">Open →</div>
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
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-white">{r.title}</h2>
        <Link
          href="/tour/2"
          className="text-xs text-white/60 hover:text-white"
        >
          · change role
        </Link>
      </div>

      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
          Who you are
        </h3>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/90">{r.whoYouAre}</div>
      </section>

      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
          What this role actually does
        </h3>
        <ul className="space-y-2 text-sm text-white/90">
          {r.whatTheRoleDoes.map((d, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 text-[var(--color-ldp-gold)]">•</span>
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
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
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
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
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
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
          The Zoom link
        </h3>
        <p className="text-sm text-white/85">
          <a
            href="https://us02web.zoom.us/j/89692618777"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[var(--color-ldp-gold)] hover:underline"
          >
            us02web.zoom.us/j/89692618777
          </a>
          <br />
          <span className="text-xs text-white/60">Meeting ID: 896 9261 8777. Permanent link. Bookmark it.</span>
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
          If you can&apos;t make it: proxy
        </h3>
        <p className="text-sm text-white/85">
          Fill out the{" "}
          <a
            href="https://forms.gle/dac7EBMbZXMMdMs59"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ldp-gold)] hover:underline"
          >
            proxy form
          </a>{" "}
          before the meeting. Per LJCDP §23: proxies count for general voting quorum but NOT for
          officer elections, officer removal, or endorsement votes. Your proxy must be another
          LDPEC member and has to be physically present at HQ at the start of the meeting.
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
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
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
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
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
          Quarterly LD reports (LD officers only)
        </h3>
        <p className="text-sm text-white/85">
          LD Chairs and VCs file a quarterly report summarizing LD activity — meetings held,
          volunteers recruited, canvasses run, PCs active. Template lives in the Comms Drive folder;
          Brook Benningfield (Secretary) collects them.
        </p>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/5 p-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
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
          className="mt-3 inline-flex text-xs font-semibold text-[var(--color-ldp-gold)] hover:underline"
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
      <div className="grid gap-3 md:grid-cols-2">
        <Link
          href="/this-month"
          className="rounded-lg border border-[var(--color-ldp-gold)] bg-white/5 p-5 transition-colors hover:bg-white/10"
        >
          <div className="text-sm font-semibold text-white">This Month →</div>
          <div className="mt-1 text-xs text-white/70">
            The current month from the Rock Star Playbook plus what&apos;s teed up next. Updated monthly.
          </div>
        </Link>
        <Link
          href="/events"
          className="rounded-lg border border-[var(--color-ldp-gold)] bg-white/5 p-5 transition-colors hover:bg-white/10"
        >
          <div className="text-sm font-semibold text-white">Events →</div>
          <div className="mt-1 text-xs text-white/70">
            Celebration of Democracy Dinner, Women Deliver Democracy, Dems at the Downs — the three
            events that fund the party. Your $500 annual raise runs through their ticket links.
          </div>
        </Link>
        <Link
          href="/canvass-tools"
          className="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-[var(--color-ldp-gold)]"
        >
          <div className="text-sm font-semibold text-white">Canvass Tools →</div>
          <div className="mt-1 text-xs text-white/70">
            Priority MC districts (17, 7, 21), volunteer pipeline, canvass guides, VoteBuilder.
          </div>
        </Link>
        <Link
          href="/committees"
          className="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-[var(--color-ldp-gold)]"
        >
          <div className="text-sm font-semibold text-white">Committees →</div>
          <div className="mt-1 text-xs text-white/70">
            All 11 committees (8 standing + 3 ad hoc) with responsibilities, workflow, members, and
            Drive folders. Pick one and ask the chair what you can take on.
          </div>
        </Link>
        <Link
          href="/people"
          className="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-[var(--color-ldp-gold)]"
        >
          <div className="text-sm font-semibold text-white">People →</div>
          <div className="mt-1 text-xs text-white/70">
            Full LDPEC directory: countywide officers at top, then LD Chairs, VCs, At-Large, affiliated
            seats. Search works across name, role, LD, committee, email, phone.
          </div>
        </Link>
        <Link
          href="/transitions"
          className="rounded-lg border border-white/10 bg-white/5 p-5 transition-colors hover:border-[var(--color-ldp-gold)]"
        >
          <div className="text-sm font-semibold text-white">Transitions →</div>
          <div className="mt-1 text-xs text-white/70">
            Vacant seats (with recommended actions) + recent fills. Where the LDPEC stands right now.
          </div>
        </Link>
      </div>
    </>
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
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
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
              <div className="mt-2 text-sm font-medium text-[var(--color-ldp-gold)]">{s.headline}</div>
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

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold text-white">Timeline 2026 → 2028</h2>
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
                  t.unresolved ? "text-amber-400" : "text-[var(--color-ldp-gold)]"
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
      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
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
