import Link from "next/link";
import { ArrowLeft, AlertTriangle, ExternalLink, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Filling Legislative Vacancies" };

export default function LegislativeVacanciesPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/transitions"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft className="size-4" /> Transitions
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            <Scale className="size-3.5" />
            Filling Legislative Vacancies
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            When a State House or State Senate Democrat vacates mid-term.
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">
            If a Kentucky General Assembly Democrat resigns, dies, moves up to higher office, or
            otherwise vacates their seat between general elections, the Governor calls a special
            election. Each party nominates its candidate — and for Democrats, there&apos;s a specific
            party process governed by <strong>KDP Bylaws Article VI</strong>. The LDPEC is the body
            that runs that process for Louisville seats.
          </p>
        </div>

        <div className="mb-8 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700" />
            <div>
              <strong className="text-[var(--color-ldp-navy-900)]">Rare but high-stakes.</strong>{" "}
              Vacancies don&apos;t come up often, but when they do the timelines are fast and the
              rules are specific. This page is a reference — don&apos;t work off memory.
            </div>
          </div>
        </div>

        {/* STATE HOUSE */}
        <section className="mb-10">
          <h2 className="mb-2 text-xl font-bold text-[var(--color-ldp-navy-900)]">
            State House vacancy (seat wholly in Jefferson County)
          </h2>
          <div className="text-xs font-medium uppercase tracking-widest text-[var(--color-ldp-gold)]">
            Governed by KDP Bylaws Article VI.C.b
          </div>

          <div className="mt-4 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              Who votes
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              <strong>Precinct Committee members residing in the vacated LD.</strong> Not LD Chairs,
              not At-Large, not the CEC as a whole — the Precinct Captains themselves. Only PC
              members serving <em>at the time the vacancy occurs</em> can vote.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Weighted vote
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              Each PC member&apos;s vote equals <strong>the total number of registered Democrats in the precinct they represent</strong>.
              A precinct with 400 Dems carries 400 votes; a precinct with 80 Dems carries 80.
              This mirrors actual party strength across the LD.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Who chairs the Nominating Committee
            </h3>
            <ol className="mt-2 space-y-1 text-sm text-[var(--color-ldp-ink-900)]">
              <li>1. The <strong>LD Chair</strong> of the vacated LD.</li>
              <li>2. If the LD Chair is absent, the <strong>LD Vice Chair</strong>.</li>
              <li>3. If both absent, the <strong>At-Large member residing in the LD with the longest EC tenure</strong>.</li>
            </ol>
          </div>

          <div className="mt-4 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              The process, in order
            </h3>
            <ol className="mt-3 space-y-3 text-sm text-[var(--color-ldp-ink-900)]">
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-900)] text-[11px] font-semibold text-white">
                  1
                </span>
                <span>
                  <strong>Vacancy occurs.</strong> Governor will call a special election per KRS.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-900)] text-[11px] font-semibold text-white">
                  2
                </span>
                <span>
                  <strong>LD Chair convenes an organizing committee.</strong> CEC members residing
                  in the affected LD (LD Chair, LD VC, At-Large member(s), any LDPEC officer living
                  there) meet to determine <em>date, time, location, and nomination process</em> for
                  the Nominating Committee meeting.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-900)] text-[11px] font-semibold text-white">
                  3
                </span>
                <span>
                  <strong>LD Chair notifies PC members.</strong> Date, time, location, and the
                  guidelines the organizing committee set for how the nomination will run.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-900)] text-[11px] font-semibold text-white">
                  4
                </span>
                <span>
                  <strong>Nominating Committee meets.</strong> PC members attend, nominations are
                  taken, weighted vote is cast.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-900)] text-[11px] font-semibold text-white">
                  5
                </span>
                <span>
                  <strong>Tie-breaker:</strong> County Chair breaks any tie.
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* STATE SENATE */}
        <section className="mb-10">
          <h2 className="mb-2 text-xl font-bold text-[var(--color-ldp-navy-900)]">
            State Senate vacancy (seat wholly in Jefferson County)
          </h2>
          <div className="text-xs font-medium uppercase tracking-widest text-[var(--color-ldp-gold)]">
            Governed by KDP Bylaws Article VI.C.a
          </div>

          <div className="mt-4 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              Who votes
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              <strong>The Chairs of every LD wholly or partially within the vacated Senate district.</strong>{" "}
              Not PC members — LD Chairs only. Only LD Chairs serving <em>at the time the vacancy
              occurs</em> can vote.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Weighted vote
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              Each LD Chair casts a vote equal to <strong>the number of registered Democrats in their LD who reside within the Senate district</strong>.
              Per Article VI.D example: an LD Chair representing 12,000 Dems inside the Senate
              district carries 12,000 votes.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Who chairs the Nominating Committee
            </h3>
            <ol className="mt-2 space-y-1 text-sm text-[var(--color-ldp-ink-900)]">
              <li>1. The <strong>County (LDPEC) Chair</strong>.</li>
              <li>2. If the County Chair is absent, the <strong>County Vice Chair</strong>.</li>
              <li>3. If both absent, the <strong>LD Chair whose LD cast the largest Democratic vote at the preceding Presidential election</strong>.</li>
            </ol>
            <p className="mt-3 text-xs italic text-[var(--color-ldp-ink-700)]">
              The presiding officer doesn&apos;t vote unless they&apos;re also an LD Chair whose LD
              is in the Senate district.
            </p>
          </div>
        </section>

        {/* MULTI-COUNTY */}
        <section className="mb-10">
          <h2 className="mb-2 text-xl font-bold text-[var(--color-ldp-navy-900)]">
            Multi-county vacancy (seat spans Jefferson + another county)
          </h2>
          <div className="text-xs font-medium uppercase tracking-widest text-[var(--color-ldp-gold)]">
            Governed by KDP Bylaws Article VI.B
          </div>

          <div className="mt-4 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Who votes
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              <strong>Voting EC members of each affected county who reside within the district.</strong>{" "}
              If fewer than two EC members of an affected county reside within the district, the
              precincts inside the district are represented instead by their{" "}
              <strong>Precinct Committee Members</strong>.
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Who chairs
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              <strong>The Chair of the county that cast the largest Democratic vote in precincts within the district at the preceding Presidential election.</strong>{" "}
              If absent, the next-largest-Dem-vote county&apos;s Chair acts.
            </p>
          </div>
        </section>

        {/* Governing authority + inclusion */}
        <section className="mb-8 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Governing authority — KDP Art. VI.F
          </h2>
          <p className="text-sm text-[var(--color-ldp-ink-900)]">
            The Nominating Committee is the governing authority for how nominations within its
            district happen, including declaring nominees not inconsistent with party or public law.
            By majority vote, a Nominating Committee can include other Democratic Party Officials as
            voting members — e.g. a Committee of LD Chairs can vote to add Precinct Committee
            Officers from the affected district as voters.
          </p>
        </section>

        {/* Full source + related */}
        <section className="rounded-xl border border-[var(--color-ldp-navy-800)] bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            Sources
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <strong className="text-[var(--color-ldp-navy-900)]">Full Article VI (in this repo):</strong>{" "}
              <span className="font-mono text-xs text-[var(--color-ldp-ink-700)]">
                docs/bylaws/kdp-bylaws-2025-article-vi.md
              </span>
            </li>
            <li>
              <strong className="text-[var(--color-ldp-navy-900)]">Bylaws navigation reference:</strong>{" "}
              <span className="font-mono text-xs text-[var(--color-ldp-ink-700)]">
                docs/bylaws/bylaws-reference.md
              </span>
            </li>
            <li>
              <a
                href="https://www.kydemocrats.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-ldp-navy-700)] hover:underline"
              >
                KDP Bylaws on kydemocrats.org <ExternalLink className="size-3" />
              </a>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/transitions">All transitions →</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/tour/4">Meetings & voting procedures →</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
