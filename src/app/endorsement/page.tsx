import Link from "next/link";
import { Calendar, CheckCircle2, XCircle, AlertTriangle, Vote } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";

export const metadata = { title: "Endorsement Process" };

type TimelineStep = {
  date: string;
  label: string;
  detail: string;
  kind: "OPEN" | "DUE" | "INTERVIEW" | "MATERIALS" | "VOTE";
};

const MAYOR_TIMELINE: TimelineStep[] = [
  { date: "January 9", label: "Applications open", detail: "Candidates invited to file for LDP endorsement consideration.", kind: "OPEN" },
  { date: "January 14", label: "Applications due", detail: "Completed applications must be received by the Endorsement Process Committee.", kind: "DUE" },
  { date: "January 17", label: "Candidate interviews", detail: "Endorsement Process Committee interviews each applicant.", kind: "INTERVIEW" },
  { date: "January 21", label: "Materials distributed", detail: "Interview notes, applications, and recommendations sent to the full LDPEC for review.", kind: "MATERIALS" },
  { date: "January 28", label: "EC meeting vote", detail: "Full LDPEC votes by secret ballot (ElectionRunner). 60% threshold. No proxies.", kind: "VOTE" },
];

const METRO_COUNCIL_TIMELINE: TimelineStep[] = [
  { date: "January 16", label: "Applications open", detail: "Candidates invited to file for LDP endorsement in their Metro Council race.", kind: "OPEN" },
  { date: "January 31", label: "Applications due", detail: "Completed applications must be received by the Endorsement Process Committee.", kind: "DUE" },
  { date: "February 7 – 8", label: "Candidate interviews", detail: "Endorsement Process Committee interviews each Metro Council applicant over two days.", kind: "INTERVIEW" },
  { date: "February 15", label: "Materials distributed", detail: "Interview notes, applications, and recommendations sent to the full LDPEC for review.", kind: "MATERIALS" },
  { date: "February 25", label: "EC meeting vote", detail: "Full LDPEC votes by secret ballot (ElectionRunner). 60% threshold. No proxies.", kind: "VOTE" },
];

const KIND_META: Record<TimelineStep["kind"], { color: string; Icon: React.ComponentType<{ className?: string }> }> = {
  OPEN: { color: "var(--color-ldp-navy-700)", Icon: Calendar },
  DUE: { color: "var(--color-ldp-red)", Icon: AlertTriangle },
  INTERVIEW: { color: "var(--color-ldp-navy-800)", Icon: CheckCircle2 },
  MATERIALS: { color: "var(--color-ldp-navy-800)", Icon: Calendar },
  VOTE: { color: "var(--color-ldp-red)", Icon: Vote },
};

export default function EndorsementProcessPage() {
  return (
    <HubShell
      eyebrow="Endorsement Process"
      title="How the LDP endorses."
      subtitle="Under KRS changes now in effect, Louisville Mayor and Metro Council races are nonpartisan — no Democratic primary, no general. 2026 is the first cycle run this way, which is why the LDPEC endorses in those two races. Democratic primaries for state legislature remain true Democratic primaries; KDP bylaws prohibit endorsing in those (see below). Endorsement cycles have a structured timeline, a formal interview process, and a high bar (60%) to prevent narrow-majority endorsements that don't represent the committee's consensus."
      maxWidthClass="max-w-5xl"
    >
        {/* Who does this */}
        <section className="mb-10 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            Who runs the endorsement process
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
            The <strong>Endorsement Process Committee</strong> (ad-hoc committee seated by the
            County Chair under LJCDP §11.6; reconvenes after the 2026 primary to refine the
            process) owns the intake form, interviews, and materials packet. The{" "}
            <strong>full LDPEC</strong> casts the final secret ballot at a regular EC meeting. The
            committee <em>recommends</em>; the EC <em>decides</em>.
          </p>
          <p className="mt-3 text-sm text-[var(--color-ldp-ink-700)]">
            LDWC and LYD have voting representatives on the LDPEC and vote alongside Chairs, Vice
            Chairs, and At-Large members on endorsements.
          </p>
        </section>

        {/* Vote mechanics */}
        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border-2 border-[var(--color-ldp-gold)] bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              Vote mechanics
            </div>
            <h3 className="mt-1 text-base font-bold text-[var(--color-ldp-navy-900)]">
              60% secret ballot · ElectionRunner
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-ldp-ink-900)]">
              <li className="flex gap-2">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>60% threshold</strong> to endorse. A simple majority is not enough.
                </span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>Secret ballot via ElectionRunner.</strong> Ballots are cast on phones/laptops
                  during the meeting; results tally instantly.
                </span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                <span>
                  <strong>Two-ballot runoff structure.</strong> If no candidate clears 60% on ballot
                  one, a top-two final ballot follows.
                </span>
              </li>
              <li className="flex gap-2">
                <XCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-red)]" />
                <span>
                  <strong>No proxies allowed on endorsement votes.</strong> You must be present in
                  person or remote-real-time to cast. (LJCDP §23: proxies count for general voting
                  quorum but NOT for endorsement votes.)
                </span>
              </li>
            </ul>
          </article>

          <article className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Who votes
            </div>
            <h3 className="mt-1 text-base font-bold text-[var(--color-ldp-navy-900)]">
              The full LDPEC — 56+ voters
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
              <li>• 18 LD Chairs</li>
              <li>• 18 LD Vice Chairs</li>
              <li>• 18 At-Large Members</li>
              <li>• 4 county Officers (Chair / VC / Secretary / Treasurer)</li>
              <li>• Affiliated-org voting reps: LYD President, JCDWC President</li>
            </ul>
            <p className="mt-3 rounded border-l-2 border-[var(--color-ldp-red)] pl-3 text-xs italic text-[var(--color-ldp-ink-700)]">
              If you&apos;re on the LDPEC and the endorsement vote is on the agenda, plan to be at
              HQ in person. Your absence is a no-vote, and endorsements hinge on showing up.
            </p>
          </article>
        </section>

        <h2 className="mb-3 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          2026 timelines, by office
        </h2>
        <p className="mb-5 max-w-3xl text-xs text-[var(--color-ldp-ink-700)]">
          Two tracks run in January and February of the primary year. Dates below reflect the
          cycle that seated the 2026 primary endorsements.
        </p>

        <div className="grid gap-4 lg:grid-cols-2">
          <TimelineBlock
            title="Mayor · 2026 primary"
            total="5 steps · Jan 9 → 28"
            steps={MAYOR_TIMELINE}
            accent="var(--color-ldp-red)"
          />
          <TimelineBlock
            title="Metro Council · 2026 primary"
            total="5 steps · Jan 16 → Feb 25"
            steps={METRO_COUNCIL_TIMELINE}
            accent="var(--color-ldp-navy-800)"
          />
        </div>

        {/* Why not legislature — this one is bylaw, not practice. */}
        <section className="mt-10 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            Why not State House / State Senate primaries
          </div>
          <h3 className="mt-1 text-base font-bold text-[var(--color-ldp-navy-900)]">
            KDP bylaws prohibit it.
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
            <strong>KDP Article I, Section I:</strong> <em>&ldquo;No Democrat Committee governed
            by these By-Laws, or any Democratic Party Officer acting in their official capacity,
            shall endorse or support one Democratic candidate over another Democratic candidate
            in a Democratic Primary Election.&rdquo;</em>
          </p>
          <p className="mt-3 text-sm text-[var(--color-ldp-ink-900)]">
            State House and State Senate races are partisan — they have Democratic primaries —
            so the prohibition applies. The LDPEC cannot endorse one Democrat over another in
            those contests. The only bylaw-recognized exception is the <strong>SCEC</strong> (not
            JCDEC) by a <strong>3/4 vote</strong> endorsing an incumbent Statewide Constitutional
            Officer for reelection.
          </p>
          <p className="mt-3 text-xs text-[var(--color-ldp-ink-700)]">
            Mayor and Metro Council are different: KRS now makes them nonpartisan races, so there
            is no &ldquo;Democratic primary&rdquo; for the bylaw to govern. That&apos;s the narrow
            window in which LDPEC endorsements are legitimate.
          </p>
        </section>

        {/* Links */}
        <section className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/candidates"
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ldp-navy-900)]"
          >
            See who&apos;s endorsed this cycle →
          </Link>
          <Link
            href="/committees/ENDORSEMENT_PROCESS"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] transition-colors hover:bg-[var(--color-ldp-navy-900)] hover:text-white"
          >
            Endorsement Process Committee page →
          </Link>
          <Link
            href="/governance"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-ink-900)] transition-colors hover:border-[var(--color-ldp-navy-700)]"
          >
            Governance reference →
          </Link>
        </section>
    </HubShell>
  );
}

function TimelineBlock({
  title,
  total,
  steps,
  accent,
}: {
  title: string;
  total: string;
  steps: TimelineStep[];
  accent: string;
}) {
  return (
    <article className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5" style={{ borderLeftWidth: 4, borderLeftColor: accent }}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-base font-bold text-[var(--color-ldp-navy-900)]">{title}</h3>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          {total}
        </div>
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => {
          const meta = KIND_META[s.kind];
          const Icon = meta.Icon;
          return (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: meta.color }}>
                <Icon aria-hidden="true" className="size-3.5" />
              </span>
              <div className="flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: meta.color }}>
                  {s.date}
                </div>
                <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                  {s.label}
                </div>
                <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">{s.detail}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
