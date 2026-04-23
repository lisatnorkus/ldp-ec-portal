import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  GraduationCap,
  IdCard,
  MapPin,
  Users,
  Vote,
  XCircle,
} from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import {
  daysUntil,
  formatMDY,
  getUpcomingDeadlines,
} from "@/lib/ky-voter-reg-deadlines";
import { fetchUpcomingVoterRegEvents } from "@/lib/db/voter-reg-events";
import { VOTER_REG_TARGETS, targetLabel } from "@/lib/db/voter-reg-events-types";
import { VoterRegEventForm } from "@/components/voter-reg/VoterRegEventForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Voter Registration · Jefferson County KY" };

export default async function VoterRegPage() {
  const d = getUpcomingDeadlines();
  const events = await fetchUpcomingVoterRegEvents();

  // Pick the single most imminent deadline so we have one number to
  // shout at the top. Prioritize: party switch > next VR deadline >
  // next Election Day.
  const imminentCandidates: Array<{ label: string; date: Date; kind: "switch" | "reg" | "vote" }> =
    [
      {
        label: `Party change deadline (to vote in ${d.nextPartySwitchApplies_to_primary_year} primary)`,
        date: d.nextPartySwitchDeadline,
        kind: "switch" as const,
      },
      {
        label: "Voter reg deadline · next KY primary",
        date: d.nextPrimaryVoterRegDeadline,
        kind: "reg" as const,
      },
      {
        label: "Voter reg deadline · next general election",
        date: d.nextGeneralVoterRegDeadline,
        kind: "reg" as const,
      },
    ]
      .filter((c) => daysUntil(c.date) >= 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  const imminent = imminentCandidates[0];

  return (
    <HubShell
      eyebrow="Voter Registration · Jefferson County KY"
      title="Register. Switch. Vote."
      subtitle="Kentucky's voter-reg rules, party-switch deadlines, and the LDPEC's upcoming registration events. Authority for every rule linked — when in doubt, trust the Clerk."
      maxWidthClass="max-w-5xl"
      actions={
        <a
          href="https://vrsws.sos.ky.gov/ovrweb/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
        >
          Register online (govoteky)
          <ExternalLink aria-hidden="true" className="size-3" />
        </a>
      }
    >
      {/* Single-shouting next-deadline banner. */}
      {imminent && <DeadlineBanner label={imminent.label} date={imminent.date} kind={imminent.kind} />}

      {/* All deadlines at a glance. */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          All KY deadlines that matter right now
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <DeadlineCard
            accent="var(--color-ldp-red)"
            icon={<AlertTriangle className="size-4" />}
            kicker={`Party switch · applies to ${d.nextPartySwitchApplies_to_primary_year} primary`}
            headline="December 31 preceding the primary"
            value={formatMDY(d.nextPartySwitchDeadline)}
            body="KY is a closed primary. Registered Independents or Republicans who want to vote in the Democratic primary must change registration by December 31 of the prior year. There is no exception."
            cite="KRS 116.055"
          />
          <DeadlineCard
            accent="var(--color-ldp-navy-800)"
            icon={<Calendar className="size-4" />}
            kicker="Voter registration · next primary"
            headline="29 days before Election Day"
            value={formatMDY(d.nextPrimaryVoterRegDeadline)}
            body={`Primary Election Day: ${formatMDY(d.nextPrimary)}. Registration must be received by the County Clerk or postmarked by this date.`}
            cite="KRS 116.045"
          />
          <DeadlineCard
            accent="var(--color-ldp-navy-800)"
            icon={<Calendar className="size-4" />}
            kicker="Voter registration · next general"
            headline="29 days before Election Day"
            value={formatMDY(d.nextGeneralVoterRegDeadline)}
            body={`General Election Day: ${formatMDY(d.nextGeneral)}.`}
            cite="KRS 116.045"
          />
          <DeadlineCard
            accent="#059669"
            icon={<Clock className="size-4" />}
            kicker="Early voting · next general"
            headline="Thursday – Saturday before Election Day"
            value={`${formatMDY(d.nextGeneralEarlyVote.thursday)} → ${formatMDY(
              d.nextGeneralEarlyVote.saturday
            )}`}
            body="In-person early voting at county-designated locations. Exact times set by the Jefferson County Clerk."
            cite="KRS 117.079"
          />
        </div>
      </section>

      {/* How to register — the three methods. */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          How to register in Jefferson County
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <MethodCard
            accent="#059669"
            label="Online"
            title="govoteky.com"
            body="Secretary of State's online portal. Requires a valid KY driver's license or state ID. Instant confirmation."
            cta={{
              label: "Register online",
              href: "https://vrsws.sos.ky.gov/ovrweb/",
            }}
          />
          <MethodCard
            accent="var(--color-ldp-navy-800)"
            label="In person"
            title="Jefferson County Clerk"
            body="Fisher Building, 531 Court Place, Louisville, KY 40202. Monday–Friday. Photo ID recommended."
            cta={{
              label: "Clerk's office",
              href: "https://www.jeffersoncountyclerk.org/",
            }}
          />
          <MethodCard
            accent="#F59E0B"
            label="By mail"
            title="Download the SBE form"
            body="Print, complete, and mail to Jefferson County Clerk at the address on the form. Must be postmarked by the reg deadline."
            cta={{
              label: "Voter registration form (PDF)",
              href: "https://elect.ky.gov/Resources/Documents/Voter%20Registration%20Card%20ENG-SPN.pdf",
            }}
          />
        </div>
      </section>

      {/* Eligibility + voter ID — the table of rules. */}
      <section className="mb-10 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
        <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          Who can register, and what to bring to vote
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              Eligibility
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
              <RuleLine ok>U.S. citizen</RuleLine>
              <RuleLine ok>Kentucky resident at least 28 days before the election</RuleLine>
              <RuleLine ok>At least 18 years old by Election Day</RuleLine>
              <RuleLine ok>17-year-olds may pre-register if they will turn 18 by Election Day</RuleLine>
              <RuleLine ok={false}>Not currently claiming voting rights in another state</RuleLine>
              <RuleLine ok={false}>Not currently adjudicated mentally incompetent</RuleLine>
            </ul>
            <p className="mt-2 text-[11px] italic text-[var(--color-ldp-ink-700)]">
              Authority: Kentucky Constitution § 145; KRS 116.025.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              Voter ID at the polls
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              Kentucky requires a photo ID to vote (SB 2, 2020 — KRS 117.228). Acceptable:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[var(--color-ldp-ink-900)]">
              <li>• KY driver&apos;s license or state ID</li>
              <li>• U.S. military or federal government ID</li>
              <li>• Kentucky college or public-university ID</li>
              <li>• Kentucky county-issued photo ID</li>
              <li>• Free KY voter ID card (apply at Circuit Clerk)</li>
            </ul>
            <p className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">
              No photo ID? You can still vote by signing a form affirming a reasonable impediment,
              with limited exceptions.
            </p>
          </div>
        </div>
      </section>

      {/* Returning citizens — KY-specific process. */}
      <section className="mb-10 rounded-xl border-2 border-[var(--color-ldp-gold)] bg-[#FEF9E7] p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          <IdCard aria-hidden="true" className="size-4" />
          Returning citizens · post-felony voter restoration
        </div>
        <h3 className="mt-1 text-base font-bold text-[var(--color-ldp-navy-900)]">
          Kentucky is one of the most restrictive states — but many are eligible.
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-ldp-ink-900)]">
          <li>
            <strong>Non-violent felonies:</strong> Governor Beshear&apos;s Executive Order 2019-003
            restores voting rights automatically after completion of sentence, including parole and
            probation. No application required.
          </li>
          <li>
            <strong>Violent felonies, Class C/D where excluded, or federal offenses:</strong>{" "}
            Require an individual pardon or restoration by the Governor. Apply through the
            Department of Corrections / Governor&apos;s Office.
          </li>
          <li>
            <strong>Pending charges:</strong> You retain the right to vote until convicted.
          </li>
        </ul>
        <p className="mt-3 text-xs text-[var(--color-ldp-ink-700)]">
          If unsure:{" "}
          <a
            href="https://corrections.ky.gov/Community/Pages/Voting-Rights.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ldp-navy-700)] underline"
          >
            KY Department of Corrections · voting-rights page
          </a>{" "}
          or{" "}
          <a
            href="https://www.kentucky.gov/Pages/Activity-stream.aspx?n=Governor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ldp-navy-700)] underline"
          >
            Governor&apos;s restoration application
          </a>
          .
        </p>
      </section>

      {/* Target populations. */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          Who the party prioritizes for registration
        </h2>
        <div className="mb-4 rounded-md border-l-4 border-[var(--color-ldp-red)] bg-[#FFF5F6] p-3">
          <p className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            Voter registration is a year-round program — not a deadline sprint.
          </p>
          <p className="mt-1 text-xs text-[var(--color-ldp-ink-900)]">
            The parties that wait until October register fewer people per dollar than the parties
            that show up at community events every month. Start now. Every month between primary
            and general is recruitable if we&apos;re in the room.
          </p>
        </div>
        <p className="mb-4 text-xs text-[var(--color-ldp-ink-700)]">
          These are the populations the skill flags as highest-yield in Jefferson County.
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {VOTER_REG_TARGETS.map((t) => (
            <TargetCard key={t.key} label={t.label} hint={t.hint} />
          ))}
        </div>
      </section>

      {/* Upcoming LDPEC voter reg events. */}
      <section className="mb-10">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Upcoming LDPEC voter registration events
          </h2>
          <VoterRegEventForm />
        </div>
        {events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-5 text-sm text-[var(--color-ldp-ink-700)]">
            No events scheduled. When the Volunteering or Events Committee schedules a voter reg
            drive, it appears here automatically.
          </div>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => (
              <li
                key={e.id}
                className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
                      {new Date(e.starts_at).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {e.ends_at && (
                        <>
                          {" → "}
                          {new Date(e.ends_at).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </>
                      )}
                    </div>
                    <div className="mt-0.5 text-base font-bold text-[var(--color-ldp-navy-900)]">
                      {e.name}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--color-ldp-ink-700)]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin aria-hidden="true" className="size-3" />
                        {e.location}
                        {e.address && <span className="text-[var(--color-ldp-ink-700)]"> · {e.address}</span>}
                      </span>
                      {e.ld_number != null && <span>LD{e.ld_number}</span>}
                      {e.organizer_committee && (
                        <span className="rounded-full bg-[#FAFAFA] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest">
                          {e.organizer_committee.replace(/_/g, " ").toLowerCase()}
                        </span>
                      )}
                    </div>
                    {e.target_populations.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {e.target_populations.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-[var(--color-ldp-navy-800)] bg-white px-2 py-0.5 text-[10px] text-[var(--color-ldp-navy-900)]"
                          >
                            {targetLabel(t)}
                          </span>
                        ))}
                      </div>
                    )}
                    {e.description && (
                      <p className="mt-2 text-xs text-[var(--color-ldp-ink-900)]">{e.description}</p>
                    )}
                  </div>
                  {e.signup_url && (
                    <a
                      href={e.signup_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                    >
                      Sign up <ExternalLink aria-hidden="true" className="size-3" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Authority + official sources. */}
      <section className="rounded-xl border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          Official sources · trust these over us
        </h2>
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <AuthorityLink
            href="https://elect.ky.gov/"
            label="KY State Board of Elections"
            body="Statewide rules, sample ballots, precinct lookup."
          />
          <AuthorityLink
            href="https://www.jeffersoncountyclerk.org/"
            label="Jefferson County Clerk"
            body="Local registration, early voting locations, ballot tracking."
          />
          <AuthorityLink
            href="https://www.sos.ky.gov/Pages/default.aspx"
            label="KY Secretary of State"
            body="Online registration portal, election calendar."
          />
          <AuthorityLink
            href="https://apps.legislature.ky.gov/law/statutes/chapter.aspx?id=37232"
            label="KRS Chapter 116"
            body="Voter registration statutes (eligibility, deadlines, party change)."
          />
          <AuthorityLink
            href="https://apps.legislature.ky.gov/law/statutes/chapter.aspx?id=37233"
            label="KRS Chapter 117"
            body="Election administration (early voting, voter ID, polling places)."
          />
          <AuthorityLink
            href="https://corrections.ky.gov/Community/Pages/Voting-Rights.aspx"
            label="Voting rights restoration (DOC)"
            body="Post-felony restoration process and eligibility."
          />
        </div>
      </section>
    </HubShell>
  );
}

function DeadlineBanner({
  label,
  date,
  kind,
}: {
  label: string;
  date: Date;
  kind: "switch" | "reg" | "vote";
}) {
  const days = daysUntil(date);
  const urgent = days <= 14;
  const accent = kind === "switch" ? "var(--color-ldp-red)" : "var(--color-ldp-navy-800)";
  return (
    <section className="mb-8 overflow-hidden rounded-xl border-2 bg-white shadow-sm" style={{ borderColor: accent }}>
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background: urgent
            ? "linear-gradient(90deg, var(--color-ldp-red) 0%, var(--color-ldp-gold) 100%)"
            : accent,
        }}
      />
      <div className="flex flex-wrap items-center gap-4 p-5">
        <div className="shrink-0 rounded-lg px-4 py-2 text-center text-white" style={{ backgroundColor: accent }}>
          <div className="text-[10px] font-bold uppercase tracking-widest">In</div>
          <div className="text-3xl font-black leading-none">{Math.max(days, 0)}</div>
          <div className="text-[10px] font-semibold uppercase tracking-widest">
            day{days === 1 ? "" : "s"}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            Next deadline
          </div>
          <div className="mt-1 text-xl font-bold text-[var(--color-ldp-navy-900)]">{label}</div>
          <div className="text-sm text-[var(--color-ldp-ink-900)]">{formatMDY(date)}</div>
        </div>
      </div>
    </section>
  );
}

function DeadlineCard({
  accent,
  icon,
  kicker,
  headline,
  value,
  body,
  cite,
}: {
  accent: string;
  icon: React.ReactNode;
  kicker: string;
  headline: string;
  value: string;
  body: string;
  cite: string;
}) {
  return (
    <article
      className="rounded-xl border bg-white p-4"
      style={{ borderLeftWidth: 4, borderLeftColor: accent }}
    >
      <div
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {icon}
        {kicker}
      </div>
      <h3 className="mt-1 text-sm font-bold text-[var(--color-ldp-navy-900)]">{headline}</h3>
      <div className="mt-1 text-base font-bold" style={{ color: accent }}>
        {value}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-[var(--color-ldp-ink-900)]">{body}</p>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {cite}
      </p>
    </article>
  );
}

function MethodCard({
  accent,
  label,
  title,
  body,
  cta,
}: {
  accent: string;
  label: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm" style={{ borderLeftWidth: 4, borderLeftColor: accent }}>
      <div
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: accent }}
      >
        {label}
      </div>
      <h3 className="mt-1 text-base font-bold text-[var(--color-ldp-navy-900)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">{body}</p>
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
        style={{ color: accent }}
      >
        {cta.label} <ExternalLink aria-hidden="true" className="size-3" />
      </a>
    </article>
  );
}

function RuleLine({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      {ok ? (
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
      ) : (
        <XCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-red)]" />
      )}
      <span>{children}</span>
    </li>
  );
}

function TargetCard({ label, hint }: { label: string; hint: string }) {
  // Match icons by known keys, fallback to a generic people icon.
  const icon =
    label.startsWith("College") ? (
      <GraduationCap className="size-4" />
    ) : label.startsWith("Returning") ? (
      <FileCheck className="size-4" />
    ) : label.startsWith("Party") ? (
      <Vote className="size-4" />
    ) : (
      <Users className="size-4" />
    );
  return (
    <article className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
        {icon}
        {label}
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ldp-ink-900)]">{hint}</p>
    </article>
  );
}

function AuthorityLink({
  href,
  label,
  body,
}: {
  href: string;
  label: string;
  body: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-2 rounded-md border border-[var(--color-ldp-line)] bg-white p-3 hover:border-[var(--color-ldp-navy-700)]"
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">{label}</div>
        <div className="text-xs text-[var(--color-ldp-ink-700)]">{body}</div>
      </div>
      <ExternalLink
        aria-hidden="true"
        className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ldp-ink-700)] group-hover:text-[var(--color-ldp-navy-900)]"
      />
    </a>
  );
}

