import Link from "next/link";
import { AlertTriangle, DollarSign, FileText, Scale, Users, XCircle } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";

export const metadata = { title: "Governance" };

// This page consolidates the LDPEC's governing rules into one place so
// that officers can answer procedural questions without digging through
// KDP and LJCDP bylaws PDFs. Every claim here cites the controlling
// section so a reader can verify against the source.
//
// Sources: KDP Bylaws (ratified 6/26/2021, last amended 3/1/2025) and
// LJCDP Bylaws (louisvilledems.com). When those change, update this page.

export default function GovernancePage() {
  return (
    <HubShell
      eyebrow="Governance · Rules of the road"
      title="How the LDPEC actually operates."
      subtitle="Quorum, proxies, spending limits, vacancies, filings — the load-bearing rules, each pointing back to the bylaw section that governs it. If you're ever unsure whether something is allowed, start here."
      maxWidthClass="max-w-5xl"
    >
      {/* Primary endorsement rule — the most important single fact on this page. */}
      <section className="mb-10 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          <Scale aria-hidden="true" className="size-4" />
          The hard rule · Primary endorsements
        </div>
        <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
          No JCDEC endorsement in any Democratic primary.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
          <strong>KDP Article I, Section I:</strong>{" "}
          <em>
            &ldquo;No Democrat Committee governed by these By-Laws, or any Democratic Party Officer
            acting in their official capacity, shall endorse or support one Democratic candidate
            over another Democratic candidate in a Democratic Primary Election.&rdquo;
          </em>
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            <strong>Applies to:</strong> State House, State Senate, federal races — anything run
            as a partisan Democratic primary.
          </li>
          <li>
            <strong>Does not apply to:</strong> Louisville Mayor and Metro Council. KRS now makes
            those races nonpartisan, so there is no &ldquo;Democratic primary&rdquo; for the rule
            to govern. 2026 is the first cycle under this statute, which is why the LDPEC
            endorses in those two contests.
          </li>
          <li>
            <strong>One narrow exception:</strong> the SCEC (not JCDEC) by a 3/4 vote may endorse
            an incumbent Statewide Constitutional Officer for reelection.
          </li>
        </ul>
        <p className="mt-3 text-xs italic text-[var(--color-ldp-ink-700)]">
          Officers acting in a <em>personal</em> capacity (not on party letterhead, not at party
          expense, not using the party title) may support who they choose. The rule governs
          official acts, not private ones.
        </p>
        <div className="mt-4">
          <Link
            href="/endorsement"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-red)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-red)] hover:bg-[#FFF5F6]"
          >
            See the endorsement process page →
          </Link>
        </div>
      </section>

      {/* Meeting mechanics — quorum, proxies, new business. */}
      <section className="mb-10">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
          Meeting mechanics
        </div>
        <h2 className="mb-4 text-xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          Quorum, proxies, and what can be voted on same-day.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <RuleCard
            icon={<Users aria-hidden="true" className="size-4" />}
            title="Quorum · 40% of LD bloc"
            citation="LJCDP §22 · KDP Art. III §D(k)"
            body={
              <>
                40% of the combined total of LD Chairs + LD Vice Chairs + LD At-Large members,
                present in person or by proxy. Proxies <strong>do</strong> count for normal
                quorum, but <strong>do not</strong> count for elections or dismissals.
              </>
            }
          />
          <RuleCard
            icon={<FileText aria-hidden="true" className="size-4" />}
            title="Proxies"
            citation="LJCDP §23"
            body={
              <>
                LD Chairs, LD VCs, and LD At-Large members may assign a proxy — in writing or
                electronically — to another CEC member for a specific meeting. Proxy must be at
                LDP HQ before the meeting starts. LYD president and JCDWC rep may not assign
                proxies. Proxies are <strong>not allowed</strong> on elections, dismissals, or
                endorsement votes.
              </>
            }
          />
          <RuleCard
            icon={<AlertTriangle aria-hidden="true" className="size-4" />}
            title="New business · 2/3 same-meeting"
            citation="LJCDP §25"
            body={
              <>
                Default: new business introduced at one meeting is acted on at the{" "}
                <strong>next</strong> meeting. To introduce <strong>and</strong> vote at the same
                meeting requires a <strong>2/3</strong> supermajority of the LD bloc just to
                allow the vote. Plan ahead.
              </>
            }
          />
        </div>
      </section>

      {/* Finance authorization tiers. */}
      <section className="mb-10 rounded-xl border-2 border-emerald-600 bg-white p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-700">
          <DollarSign aria-hidden="true" className="size-4" />
          Finance authorization tiers · LJCDP §26.3
        </div>
        <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
          Who has to sign off on a party expenditure.
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-emerald-200">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-[10px] font-semibold uppercase tracking-widest text-emerald-900">
              <tr>
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">Authorization required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100">
              <tr>
                <td className="px-3 py-2 font-semibold text-[var(--color-ldp-navy-900)]">$500 or less</td>
                <td className="px-3 py-2 text-[var(--color-ldp-ink-900)]">County Chair only</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold text-[var(--color-ldp-navy-900)]">$501 – $999</td>
                <td className="px-3 py-2 text-[var(--color-ldp-ink-900)]">
                  County Chair <strong>+</strong> Treasurer <strong>+</strong> Finance Committee Chair
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold text-[var(--color-ldp-navy-900)]">$1,000 or more</td>
                <td className="px-3 py-2 text-[var(--color-ldp-ink-900)]">
                  Finance Committee <strong>+</strong> majority vote of all voting CEC members
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ldp-ink-700)]">
          Finance Committee also oversees fundraising (§26.1) and must adopt and annually review
          a Fiscal Policy (§26.2).
        </p>
      </section>

      {/* Vacancies + removal. */}
      <section className="mb-10">
        <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
          Vacancies & removal
        </div>
        <h2 className="mb-4 text-xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          How seats open up, and how they get filled.
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <RuleCard
            title="Vacancy fill · 30 days (CEC), 90 days (SCEC)"
            citation="LJCDP §21 · KDP Art. III §D(h)"
            body={
              <>
                Vacancies in County Chair, County VC, LD Chair, LD VC, or At-Large are filled by
                majority vote of CEC voting members within <strong>30 days</strong>. If the CEC
                doesn&apos;t fill within <strong>90 days</strong>, the SCEC Chair fills the seat.
              </>
            }
          />
          <RuleCard
            title="Automatic vacancy · attendance"
            citation="LJCDP §20"
            body={
              <>
                Missing <strong>2 successive meetings</strong> OR <strong>50% of annual</strong>{" "}
                meetings (in person or by proxy) automatically declares the office vacant. Don&apos;t
                go MIA; assign a proxy if you can&apos;t be there.
              </>
            }
          />
          <RuleCard
            title="Removal · County Chair / VC"
            citation="LJCDP §§16, 18"
            body={
              <>
                Removed without cause by majority vote of CEC voting members. No hearing required
                for no-cause removal at this level.
              </>
            }
          />
          <RuleCard
            title="Removal · other officers / CEC members"
            citation="LJCDP §15 · KDP Art. III §D(f)(ii)"
            body={
              <>
                For-cause removal (fraud, misappropriation, criminal acts, hostile environment,
                failure to support party nominees, disavowal of party allegiance) after a hearing,
                by majority vote.
              </>
            }
          />
        </div>
      </section>

      {/* KREF + FEC filings. */}
      <section className="mb-10 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          <FileText aria-hidden="true" className="size-4" />
          Filings · KREF + FEC
        </div>
        <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
          The Treasurer files; Finance Committee watches.
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
          JCDEC is registered with KREF as an Executive Committee. The Treasurer holds primary
          filing responsibility (LJCDP §14.3; KDP Art. III §D(e)(iii)). All executive committees{" "}
          <strong>must</strong> file even with zero activity.
        </p>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          2026 KREF reporting dates
        </h3>
        <div className="mt-2 overflow-hidden rounded-lg border border-[var(--color-ldp-line)]">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAFA] text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              <tr>
                <th className="px-3 py-2 text-left">Report</th>
                <th className="px-3 py-2 text-left">Period ends</th>
                <th className="px-3 py-2 text-left">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-ldp-line)]">
              <tr>
                <td className="px-3 py-2">2025 2nd Semi-Annual</td>
                <td className="px-3 py-2 text-[var(--color-ldp-ink-700)]">12/31/2025</td>
                <td className="px-3 py-2 font-semibold text-[var(--color-ldp-navy-900)]">2/2/2026</td>
              </tr>
              <tr>
                <td className="px-3 py-2">2026 1st Semi-Annual</td>
                <td className="px-3 py-2 text-[var(--color-ldp-ink-700)]">6/30/2026</td>
                <td className="px-3 py-2 font-semibold text-[var(--color-ldp-navy-900)]">7/31/2026</td>
              </tr>
              <tr>
                <td className="px-3 py-2">2026 2nd Semi-Annual</td>
                <td className="px-3 py-2 text-[var(--color-ldp-ink-700)]">12/31/2026</td>
                <td className="px-3 py-2 font-semibold text-[var(--color-ldp-navy-900)]">2/1/2027</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          <XCircle aria-hidden="true" className="mr-1 inline size-3.5" />
          Sources KREF prohibits
        </h3>
        <ul className="mt-2 space-y-1 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            <strong>Corporations, LLCs, LLPs, partnerships</strong> — all prohibited (KRS
            121.035). Partners may give individually up to the $5,000/year limit.
          </li>
          <li>
            <strong>Cash over $100 per election</strong>, and anonymous contributions over $100
            ($2,000 aggregate per election).
          </li>
          <li>
            Individual / PAC / contributing-org / caucus committee contributions: <strong>$5,000/year</strong>.
            Transfers from another executive committee: unlimited.
          </li>
        </ul>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          FEC — when it matters
        </h3>
        <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
          JCDEC doesn&apos;t automatically register with the FEC. Registration kicks in if we
          raise or spend <strong>$1,000+ in connection with a federal election</strong>, or run
          coordinated Federal Election Activity (voter registration, GOTV, voter ID, federal
          public comms). <strong>Before</strong> running any field program that could touch
          federal races, clear it with the Treasurer and party counsel.
        </p>

        <p className="mt-4 text-xs text-[var(--color-ldp-ink-700)]">
          Authority:{" "}
          <a
            href="https://kref.ky.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ldp-navy-700)] underline"
          >
            kref.ky.gov
          </a>{" "}
          · Delinquent filers list is public — political exposure, don&apos;t land on it.
        </p>
      </section>

      {/* Bylaw amendments + appeals. */}
      <section className="mb-10 grid gap-4 md:grid-cols-2">
        <RuleCard
          title="Bylaw amendments"
          citation="LJCDP §29"
          body={
            <>
              Quorum + majority vote, PLUS either (a) written notice mailed to all CEC members at
              least <strong>2 weeks</strong> prior, OR (b) the action was introduced at a previous
              meeting.
            </>
          }
        />
        <RuleCard
          title="Appeals · hierarchy"
          citation="KDP Article V"
          body={
            <>
              Precinct convention → CEC hears within 3 days → SCEC within 5. LD/County convention
              → SCEC Chair within 7 days. CEC decision → 5 days to appeal to CEC, 7 to SCEC. All
              legal action must exhaust party appeals first (venue: Franklin County Circuit Court).
            </>
          }
        />
      </section>

      {/* Hierarchy + standing committees. */}
      <section className="mb-10 rounded-xl border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          Hierarchy of authority
        </h3>
        <ol className="mt-2 space-y-1 text-sm text-[var(--color-ldp-ink-900)]">
          <li>1. DNC Charter and Bylaws (supersedes all)</li>
          <li>2. KDP Bylaws (supersedes state/county committees)</li>
          <li>3. LJCDP Bylaws (supersedes CEC committee decisions)</li>
          <li>4. CEC committee decisions (Roberts Rules for anything else)</li>
        </ol>

        <h3 className="mt-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          Standing committees · LJCDP §26.1
        </h3>
        <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
          Bylaws, Facilities, Finance, Events, Volunteering, Youth, Communication, Labor,
          Training, Candidate Recruitment.
        </p>
        <p className="mt-2 text-xs italic text-[var(--color-ldp-ink-700)]">
          The Endorsement Process Committee is an <strong>ad-hoc</strong> committee seated by the
          County Chair under §11.6 — not one of the standing committees listed above. It
          reconvenes after the 2026 primary to refine the process for the next cycle.
        </p>
      </section>

      {/* Top-of-stack reference. The DNC Charter is what KDP and LJCDP
          bylaws inherit from. Surfaced here so anyone digging into rule
          drift has the federal source-of-truth one click away. */}
      <section className="mb-8 rounded-xl border-2 border-[var(--color-ldp-navy-700)] bg-white p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)]">
          <Scale aria-hidden="true" className="size-4" />
          Top of the stack
        </div>
        <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
          DNC Charter &amp; Bylaws — what KDP + LJCDP inherit from.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
          Everything on this page sits below the{" "}
          <a
            href="https://www.documentcloud.org/documents/24416228-dnc-charter-bylaws/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-ldp-navy-700)] underline decoration-dotted underline-offset-2 hover:decoration-solid"
          >
            DNC Charter &amp; Bylaws
          </a>{" "}
          (last amended <strong>March 12, 2022</strong> by the Democratic National Committee).
          State parties must file their rules and any amendments with the DNC within{" "}
          <strong>30 days</strong> of adoption (Art. 10 §4). When LJCDP bylaws drift, the fix
          has to roll up through KDP&apos;s filings.
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            <strong>Art. 8 §2 — Non-discrimination floor.</strong> Sex, race, age (of voting age),
            color, creed, national origin, religion, economic status, sexual orientation, gender
            identity, ethnic identity, disability. Binds LDP at every level.
          </li>
          <li>
            <strong>Art. 9 §16 — Gender equal division.</strong> All committee positions, state
            central committees included, &ldquo;shall be as equally divided as practicable&rdquo;
            (variance ≤ 1). LJCDP §6.6 woman-exception paperwork is the local compliance mechanism.
          </li>
          <li>
            <strong>Art. 9 §11 — Proxy voting.</strong> Not permitted at National Convention; allowed
            elsewhere &ldquo;as provided in the Bylaws of the Democratic Party.&rdquo; LJCDP §23
            applies the local exclusion for officer elections, removal, and endorsement votes.
          </li>
          <li>
            <strong>Art. 9 §12 — Open meetings, no secret ballot, no unit rule.</strong> Worth knowing
            when reviewing the LDPEC 60% secret-ballot endorsement process — the DNC rule applies
            primarily to convention/delegate bodies, not county endorsement votes.
          </li>
          <li>
            <strong>Art. 9 §14 — Robert&apos;s Rules</strong> govern all meetings &ldquo;in the absence
            of other provisions.&rdquo; LJCDP §28 inherits this.
          </li>
        </ul>
        <a
          href="https://www.documentcloud.org/documents/24416228-dnc-charter-bylaws/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-700)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
        >
          Read the full DNC Charter →
        </a>
      </section>

      <p className="text-[11px] italic text-[var(--color-ldp-ink-700)]">
        If a rule here looks wrong or stale, tell Lisa. Sources: DNC Charter &amp; Bylaws
        (amended 3/12/2022), KDP Bylaws (ratified 6/26/2021, last amended 3/1/2025), and LJCDP
        Bylaws (louisvilledems.com). This page should be updated whenever any of them is amended.
      </p>
    </HubShell>
  );
}

function RuleCard({
  icon,
  title,
  citation,
  body,
}: {
  icon?: React.ReactNode;
  title: string;
  citation: string;
  body: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
      <div className="flex items-center gap-2 text-[var(--color-ldp-navy-800)]">
        {icon}
        <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">{title}</h3>
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {citation}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">{body}</p>
    </article>
  );
}
