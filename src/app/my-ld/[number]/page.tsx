import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Globe, MapPin, Target, Users, Mail, Phone, Star } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { PrecinctPlaybookTable } from "@/components/precincts/PrecinctPlaybookTable";
import { LdNotes } from "@/components/ld-workspace/LdNotes";
import { LdTasks } from "@/components/ld-workspace/LdTasks";
import { fetchNotesByLd } from "@/lib/db/ld-notes";
import { fetchTasksByLd, fetchAssignablesForLd } from "@/lib/db/ld-tasks";
import {
  fetchContactsByLd,
  countStaleContacts,
} from "@/lib/db/ld-contacts";
import {
  fetchPcsForLd,
  groupPcsByPrecinct,
  pcDisplayName,
  type PrecinctCaptain,
} from "@/lib/db/precinct-captains";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  fetchPrecinctsByLd,
  countByStrategy,
  STRATEGY_FRIENDLY,
  STRATEGY_ONELINE,
  STRATEGY_COLOR_VAR,
  type Precinct,
  type Strategy,
} from "@/lib/db/precincts";
import { evaluateRules, getCurrentPhase, type UserContext } from "@/content/highest-leverage-rules";
import {
  fetchPrimaryResults2026ByLd,
  fetchPrimaryResults2026All,
  fetchTurnout2026ByLd,
  fetchTurnout2026All,
} from "@/lib/db/election-results";
import { fetchTakeaways } from "@/lib/db/election-takeaways";
import { PrimaryResults2026Card } from "@/components/election-results/PrimaryResults2026Card";
import { ElectionTakeaways } from "@/components/election-results/ElectionTakeaways";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  return { title: `LD${number}` };
}

type LdRow = {
  number: number;
  chair_id: string | null;
  vc_id: string | null;
  state_senate_overlap: number[];
  metro_council_overlap: number[];
  us_house_overlap: number[];
};

async function fetchLd(num: number): Promise<LdRow | null> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("legislative_districts")
    .select("*")
    .eq("number", num)
    .maybeSingle();
  return data as LdRow | null;
}

async function fetchMemberById(id: string | null) {
  if (!id) return null;
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("ec_members")
    .select("id, first_name, last_name, preferred_name, email, phone, primary_role, officer_role")
    .eq("id", id)
    .maybeSingle();
  return data;
}

async function fetchNextEvent() {
  const supabase = await getSupabaseServer();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("events")
    .select("name, event_date")
    .eq("active", true)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data as { name: string; event_date: string } | null;
}

type EvLocationLite = {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  hours_note: string | null;
  date_window: string | null;
};

async function fetchEvLocationsForLd(ld_number: number): Promise<EvLocationLite[]> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("early_voting_locations")
    .select("id, name, address, neighborhood, hours_note, date_window, ld_numbers")
    .eq("active", true)
    .eq("election_type", "PRIMARY")
    .eq("cycle_year", 2026)
    .contains("ld_numbers", [ld_number])
    .order("display_order", { ascending: true });
  return (data ?? []) as EvLocationLite[];
}

async function fetchCandidates(ld_number: number, mcs: number[]) {
  const supabase = await getSupabaseServer();
  // State House races = the LD number itself
  const [hd, mc] = await Promise.all([
    supabase
      .from("candidates")
      .select("*")
      .eq("office_type", "STATE_HOUSE")
      .eq("district_number", ld_number)
      .eq("cycle_year", 2026)
      .order("is_incumbent", { ascending: false })
      .order("is_endorsed", { ascending: false }),
    mcs.length
      ? supabase
          .from("candidates")
          .select("*")
          .eq("office_type", "METRO_COUNCIL")
          .in("district_number", mcs)
          .eq("cycle_year", 2026)
          .order("district_number")
      : Promise.resolve({ data: [] }),
  ]);
  return { hd: hd.data ?? [], mc: mc.data ?? [] };
}

export default async function LdDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number: numberParam } = await params;
  const ld_number = Number(numberParam);
  if (Number.isNaN(ld_number)) notFound();

  const ld = await fetchLd(ld_number);
  if (!ld) notFound();

  const [
    chair,
    vc,
    precincts,
    nextEvent,
    pcs,
    evLocations,
    notes,
    tasks,
    contacts,
    assignables,
    primary_ld_results,
    primary_all_results,
    primary_ld_turnout,
    primary_all_turnout,
    primary_takeaways,
  ] = await Promise.all([
    fetchMemberById(ld.chair_id),
    fetchMemberById(ld.vc_id),
    fetchPrecinctsByLd(ld_number),
    fetchNextEvent(),
    fetchPcsForLd(ld_number),
    fetchEvLocationsForLd(ld_number),
    fetchNotesByLd(ld_number),
    fetchTasksByLd(ld_number),
    fetchContactsByLd(ld_number),
    fetchAssignablesForLd(ld_number),
    fetchPrimaryResults2026ByLd(ld_number),
    fetchPrimaryResults2026All(),
    fetchTurnout2026ByLd(ld_number),
    fetchTurnout2026All(),
    fetchTakeaways(ld_number, "2026_primary"),
  ]);
  const staleCount = countStaleContacts(contacts, 60);

  const candidates = await fetchCandidates(ld_number, ld.metro_council_overlap ?? []);
  const counts = countByStrategy(precincts);
  const byStrategy = groupByStrategy(precincts);

  // Evaluate the highest-leverage-move rules engine.
  // v1 assumption: /my-ld/[n] viewer is the LD Chair (or a surrogate viewing their district).
  // Counts derived from live precinct data; priority-MC overlap from LD row.
  // Has-contested-primary: the LD's State House race has 2+ D primary candidates.
  const dPrimaryCandidates = candidates.hd.filter(
    (c) => c.party === "D" && c.on_primary_ballot
  );
  const PRIORITY_MCS = [7, 17, 21];
  const priorityMcOverlap = (ld.metro_council_overlap ?? []).filter((mc) =>
    PRIORITY_MCS.includes(mc)
  );
  const ruleCtx: UserContext = {
    role: "LD_CHAIR",
    ld_number,
    hold_the_line_count: counts.DEFEND,
    power_base_count: counts.PRIMARY,
    wake_the_vote_count: counts.ACTIVATE,
    // PC vacancy data not yet in the portal — stubbed at 0 so Rules 4 & 7 don't misfire.
    pc_vacancy_count: 0,
    pc_vacancy_count_in_hold_the_line: 0,
    priority_mc_overlap: priorityMcOverlap,
    has_contested_primary: dPrimaryCandidates.length >= 2,
    countywide_dark_precinct_count: 0,
    next_event_days_until: nextEvent?.event_date
      ? Math.round(
          (new Date(nextEvent.event_date).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : undefined,
    next_event_name: nextEvent?.name,
    // raise_progress_dollars: ticket-link tracking integration pending. Stubbed at 0.
    raise_progress_dollars: 0,
  };
  const recommendation = evaluateRules(ruleCtx);
  const currentPhase = getCurrentPhase();

  return (
    <HubShell
      eyebrow="Legislative District"
      title={`LD${ld_number}.`}
      maxWidthClass="max-w-5xl"
    >
        <div className="mb-8">
          <p className="text-sm text-[var(--color-ldp-ink-700)]">
            {precincts.length} precincts · {counts.sleeper_dems.toLocaleString()} sleeper Dems in LD{ld_number}
            {ld.state_senate_overlap?.length > 0 && (
              <span> · SD overlap: {ld.state_senate_overlap.join(", ")}</span>
            )}
            {ld.metro_council_overlap?.length > 0 && (
              <span> · MC overlap: {ld.metro_council_overlap.join(", ")}</span>
            )}
          </p>
        </div>

        {/* 2026 Primary results — institutional memory. Race-by-race
            detail collapses by default so the LD workspace below stays
            close to the top of the page. */}
        <PrimaryResults2026Card
          ld_number={ld_number}
          ld_results={primary_ld_results}
          ld_turnout={primary_ld_turnout}
          all_results={primary_all_results}
          all_turnout={primary_all_turnout}
        />

        {/* Tasks go at the top — this is what the chair looks at first */}
        <LdTasks ldNumber={ld_number} tasks={tasks} assignables={assignables} />

        {/* Highest-leverage move this week */}
        {recommendation && (
          <section className="mb-8 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Target className="mt-1 size-5 shrink-0 text-[var(--color-ldp-red)]" />
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
                  Your highest-leverage move this week
                </div>
                <p className="mt-2 text-base leading-relaxed text-[var(--color-ldp-ink-900)]">
                  {recommendation.text}
                </p>
                <div className="mt-3 text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  Current cycle phase: {currentPhase.replace(/_/g, " ").toLowerCase()} · rule #{recommendation.rule_id}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Leadership */}
        <section className="mb-8 grid gap-3 md:grid-cols-2">
          <LeadershipCard role="Chair" member={chair} />
          <LeadershipCard role="Vice Chair" member={vc} />
        </section>

        <LdNotes ldNumber={ld_number} notes={notes} />

        {/* Election takeaways live near the bottom of the LD page —
            they're long-term memory, not daily-use. The user adds them
            as institutional knowledge for future LD officers. */}
        <ElectionTakeaways
          ld_number={ld_number}
          election_key="2026_primary"
          election_label="2026 Primary"
          takeaways={primary_takeaways}
        />

        {staleCount > 0 && (
          <Link
            href={`/my-ld/${ld_number}/recruiting`}
            className="mb-8 flex items-center justify-between gap-3 rounded-xl border-2 border-amber-500 bg-amber-50 px-5 py-3 transition-colors hover:bg-amber-100"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                Recruiting staleness
              </div>
              <div className="mt-0.5 text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                {staleCount} prospect{staleCount === 1 ? "" : "s"} haven&apos;t been contacted in 60+ days
              </div>
            </div>
            <span className="shrink-0 text-xs font-semibold text-amber-700">
              Open pipeline →
            </span>
          </Link>
        )}

        {/* Early voting in this LD — time-sensitive during primary window */}
        <EvSection ld={ld_number} locations={evLocations} />

        {/* Precinct captains on file */}
        <PcSection ld={ld_number} precinctCount={precincts.length} pcs={pcs} />

        {/* Strategy mix summary */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Strategy mix · {precincts.length} precincts
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {(["PRIMARY", "DEFEND", "ACTIVATE", "GROW"] as Strategy[]).map((s) => (
              <div
                key={s}
                className="rounded-lg border-l-4 bg-white p-4"
                style={{ borderLeftColor: STRATEGY_COLOR_VAR[s] }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  {STRATEGY_FRIENDLY[s]}
                </div>
                <div className="text-3xl font-bold text-[var(--color-ldp-navy-900)]">
                  {counts[s]}
                </div>
                <div className="mt-1 text-[11px] leading-snug text-[var(--color-ldp-ink-700)]">
                  {STRATEGY_ONELINE[s]}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Races on the ballot */}
        {(candidates.hd.length > 0 || candidates.mc.length > 0) && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Races on the 2026 ballot that your LD&apos;s work moves
            </h2>
            {candidates.hd.length > 0 && (
              <RaceBlock
                title={`State House District ${ld_number}`}
                subtitle="Your LD seat"
                officeType="STATE_HOUSE"
                candidates={candidates.hd}
              />
            )}
            {candidates.mc.length > 0 && (
              <>
                {ld.metro_council_overlap.map((mc) => {
                  const mcCandidates = candidates.mc.filter((c) => c.district_number === mc);
                  if (mcCandidates.length === 0) return null;
                  return (
                    <RaceBlock
                      key={mc}
                      title={`Metro Council ${mc}`}
                      subtitle="Overlaps your LD"
                      officeType="METRO_COUNCIL"
                      candidates={mcCandidates}
                    />
                  );
                })}
              </>
            )}
          </section>
        )}

        {/* Precinct playbook — all buckets collapsed by default so the
            page doesn't become a wall on LDs with 40+ precincts */}
        <section className="mb-8">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Precinct playbook
          </h2>
          <p className="mb-3 text-xs text-[var(--color-ldp-ink-700)]">
            Click any strategy bucket to see the precincts inside it with voter counts, D margin, and sleeper-Dem totals.
          </p>
          {(["DEFEND", "PRIMARY", "ACTIVATE", "GROW"] as Strategy[]).map((s) => {
            const group = byStrategy[s] ?? [];
            if (group.length === 0) return null;
            return (
              <details
                key={s}
                className="mb-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-4"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex h-2 w-2 rounded-full"
                      style={{ backgroundColor: STRATEGY_COLOR_VAR[s] }}
                    />
                    <span className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                      {STRATEGY_FRIENDLY[s]} · {group.length} precinct{group.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </summary>
                <PrecinctPlaybookTable precincts={group} />
              </details>
            );
          })}
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="ldp" size="lg">
            <a
              href={`https://26ldp-strategy-map.vercel.app/?ld=${ld_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <MapPin className="size-4" /> Open LD{ld_number} on the Strategy Map
            </a>
          </Button>
          <Link
            href="/early-voting"
            className="inline-flex items-center gap-1.5 rounded-md border-2 border-[var(--color-ldp-red)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] transition-colors hover:bg-[#FFF5F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-red)] focus-visible:ring-offset-2"
          >
            <MapPin aria-hidden="true" className="size-4 text-[var(--color-ldp-red)]" />
            All 24 early voting locations →
          </Link>
          <Link
            href="/candidates"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] transition-colors hover:bg-[var(--color-ldp-navy-900)] hover:text-white"
          >
            Full 2026 ballot →
          </Link>
          <Link
            href={`/my-ld/${ld_number}/recruiting`}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-[var(--color-ldp-navy-900)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ldp-navy-800)]"
          >
            Prospect pipeline →
          </Link>
          <Link
            href={`/my-ld/${ld_number}/continuity`}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#64748b] bg-white px-4 py-2 text-sm font-semibold text-[#64748b] transition-colors hover:bg-[#64748b] hover:text-white"
          >
            Continuity & handoff →
          </Link>
        </div>
    </HubShell>
  );
}

function EvSection({ ld, locations }: { ld: number; locations: EvLocationLite[] }) {
  const dateWindow = locations[0]?.date_window ?? "May 14 – 16, 2026";
  const hours = locations[0]?.hours_note ?? "8:00 am – 6:00 pm";

  return (
    <section className="mb-8 rounded-xl border-2 border-[var(--color-ldp-red)] bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
        Early voting inside LD{ld}
      </div>
      <h2 className="mt-0.5 text-base font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
        {locations.length === 0
          ? `No early voting locations physically inside LD${ld}.`
          : locations.length === 1
            ? "One early voting location in your district."
            : `${locations.length} early voting locations in your district.`}
      </h2>
      <p className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
        {dateWindow} · {hours}. Jefferson County voters can use <strong>any of the 24 locations</strong> countywide —
        these are just the ones inside LD{ld}&apos;s boundaries. Assignments are approximate (by street address +
        neighborhood); confirm with the Clerk if precise.
      </p>

      {locations.length > 0 && (
        <ul className="mt-4 divide-y divide-[var(--color-ldp-line)]">
          {locations.map((l) => {
            const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}`;
            return (
              <li key={l.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-red)]" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                      {l.name}
                    </div>
                    {l.neighborhood && (
                      <div className="text-[11px] font-medium uppercase tracking-widest text-[var(--color-ldp-navy-700)]">
                        {l.neighborhood}
                      </div>
                    )}
                    <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
                      {l.address}
                    </div>
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
                    >
                      Open in Maps <ExternalLink aria-hidden="true" className="size-3" />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {locations.length === 0 && (
        <p className="mt-3 text-sm text-[var(--color-ldp-ink-900)]">
          Point your voters at the nearest location in an adjacent LD —{" "}
          <Link href="/early-voting" className="text-[var(--color-ldp-navy-700)] underline">
            see all 24 →
          </Link>
        </p>
      )}
    </section>
  );
}

type Member = {
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  email: string | null;
  phone: string | null;
  primary_role?: string;
  officer_role?: string | null;
} | null;

function LeadershipCard({ role, member }: { role: string; member: Member }) {
  if (!member) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-ldp-red)] bg-white p-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          {role} · Vacant
        </div>
        <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
          This seat is open. CEC has 90 days from notification to fill per state bylaws.
        </p>
      </div>
    );
  }
  const name = (member.preferred_name ?? member.first_name) + " " + member.last_name;
  return (
    <div className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {role}
        {member.officer_role && (
          <span className="ml-2 rounded bg-[var(--color-ldp-gold)] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-[var(--color-ldp-navy-900)]">
            Also LDP {member.officer_role.replace("_", " ")}
          </span>
        )}
      </div>
      <div className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">{name}</div>
      <div className="mt-2 space-y-1 text-xs text-[var(--color-ldp-ink-700)]">
        {member.email && (
          <a href={`mailto:${member.email}`} className="block text-[var(--color-ldp-navy-700)] hover:underline">
            {member.email}
          </a>
        )}
        {member.phone && <div>{member.phone}</div>}
      </div>
    </div>
  );
}

type Candidate = {
  id: string;
  full_name: string;
  party: string;
  is_incumbent: boolean;
  is_endorsed: boolean;
  on_primary_ballot: boolean;
  notes: string | null;
  website_url: string | null;
  email: string | null;
};

function RaceBlock({
  title,
  subtitle,
  officeType,
  candidates,
}: {
  title: string;
  subtitle?: string;
  officeType: "STATE_HOUSE" | "METRO_COUNCIL";
  candidates: Candidate[];
}) {
  const dems = candidates.filter((c) => c.party === "D");
  const others = candidates.filter((c) => c.party !== "D");
  const hasEndorsed = dems.some((d) => d.is_endorsed);
  // Metro Council endorsements require a 60% LDPEC vote. When an MC
  // race has multiple D candidates but no endorsement, call that out
  // explicitly so the absence isn't mistaken for us forgetting.
  const mcNoEndorsement =
    officeType === "METRO_COUNCIL" && dems.length >= 2 && !hasEndorsed;

  const accent = officeType === "STATE_HOUSE" ? "var(--color-ldp-navy-800)" : "#db2777";

  return (
    <article
      className="mb-4 overflow-hidden rounded-xl border bg-white shadow-sm"
      style={{ borderColor: hasEndorsed ? "#059669" : accent, borderWidth: hasEndorsed ? 2 : 1 }}
    >
      {/* Colored header strip */}
      <div
        className="flex items-center justify-between px-5 py-2"
        style={{
          background: hasEndorsed ? "#059669" : accent,
          color: "white",
        }}
      >
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">
            {subtitle ?? (officeType === "STATE_HOUSE" ? "State House" : "Metro Council")}
          </div>
          <div className="text-sm font-bold tracking-tight">{title}</div>
        </div>
        {hasEndorsed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
            <Star aria-hidden="true" className="size-3 fill-emerald-700" /> LDP Endorsed
          </span>
        )}
      </div>

      <div className="p-5">
        {mcNoEndorsement && (
          <div className="mb-3 rounded-lg border border-[var(--color-ldp-gold)] bg-[#EFF6FF] p-3 text-xs text-[var(--color-ldp-ink-900)]">
            <strong className="text-[var(--color-ldp-navy-800)]">
              No LDP endorsement made in this race.
            </strong>{" "}
            All {dems.length} Democratic candidates applied for endorsement, but no one cleared
            the LDPEC&apos;s 60% threshold at the Endorsement Process Committee vote. Candidates
            below are listed for your awareness — no committee position.
          </div>
        )}

        {others.length > 0 && (
          <div className="mb-3 text-xs text-[var(--color-ldp-ink-700)]">
            <span className="font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              R side:
            </span>{" "}
            {others
              .map((o) => `${o.full_name}${o.is_incumbent ? " (incumbent)" : ""}`)
              .join(", ")}
          </div>
        )}

        <ul className="space-y-2">
          {dems.map((d) => {
            const cleanNotes = stripDuplicateIncumbent(d.notes, d.is_incumbent);
            return (
              <li key={d.id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span
                  className={
                    d.is_endorsed
                      ? "text-base font-bold text-[var(--color-ldp-navy-900)]"
                      : "font-medium text-[var(--color-ldp-navy-900)]"
                  }
                >
                  {d.full_name}
                </span>
                {d.is_endorsed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                    <Star aria-hidden="true" className="size-3 fill-white" /> Endorsed
                  </span>
                )}
                {d.is_incumbent && (
                  <span className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                    Incumbent
                  </span>
                )}
                {cleanNotes && (
                  <span className="text-xs text-[var(--color-ldp-ink-700)]">{cleanNotes}</span>
                )}
                {d.website_url && (
                  <a
                    href={d.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ldp-line)] bg-white px-2 py-0.5 text-[10px] text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
                  >
                    <Globe aria-hidden="true" className="size-3" />
                    Website
                  </a>
                )}
                {d.email && (
                  <a
                    href={`mailto:${d.email}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ldp-line)] bg-white px-2 py-0.5 text-[10px] text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
                  >
                    <Mail aria-hidden="true" className="size-3" />
                    {d.email}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

function stripDuplicateIncumbent(notes: string | null, isIncumbent: boolean): string | null {
  if (!notes) return null;
  if (!isIncumbent) return notes.startsWith("— ") ? notes : `— ${notes}`;
  // When the incumbent chip is already rendered, strip any leading
  // "Incumbent · " / "Incumbent" from the notes so we don't read the
  // word twice.
  const stripped = notes.replace(/^Incumbent\s*[·:.-]?\s*/i, "").trim();
  if (!stripped) return null;
  return `— ${stripped}`;
}

function groupByStrategy(precincts: Precinct[]): Partial<Record<Strategy, Precinct[]>> {
  const out: Partial<Record<Strategy, Precinct[]>> = {};
  for (const p of precincts) {
    if (!p.strategy) continue;
    const bucket = out[p.strategy] ?? (out[p.strategy] = []);
    bucket.push(p);
  }
  return out;
}

function PcSection({
  ld,
  precinctCount,
  pcs,
}: {
  ld: number;
  precinctCount: number;
  pcs: PrecinctCaptain[];
}) {
  const precinctsWithAnyPc = new Set(pcs.map((p) => p.precinct_code)).size;
  const darkPrecincts = Math.max(0, precinctCount - precinctsWithAnyPc);
  const pcsWithRole = pcs.filter((p) => p.role != null).length;
  const pcsWithoutRole = pcs.length - pcsWithRole;
  const coveragePct = precinctCount > 0 ? Math.round((precinctsWithAnyPc / precinctCount) * 100) : 0;
  const grouped = groupPcsByPrecinct(pcs);
  const sortedPrecincts = Array.from(grouped.keys()).sort();

  return (
    <section className="mb-8 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white">
      <div className="flex items-center gap-2 bg-[var(--color-ldp-navy-800)] px-5 py-2">
        <Users aria-hidden="true" className="size-4 text-white" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          Precinct Captains · LD{ld}
        </h2>
      </div>

      <div className="p-5">
        <p className="text-sm text-[var(--color-ldp-ink-700)]">
          Credentialed at the May 17, 2025 County Convention. Each precinct has three PC seats
          (Man / Woman / Youth). Many PCs on this list don&apos;t have a specific role recorded
          yet — they&apos;re counted as &ldquo;on file&rdquo; without being pinned to a seat. Send
          corrections to{" "}
          <a href="mailto:communications@louisvilledems.com" className="text-[var(--color-ldp-navy-700)] underline">
            communications@louisvilledems.com
          </a>
          .
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile
            label="Precincts with a PC"
            value={`${precinctsWithAnyPc}`}
            suffix={`/ ${precinctCount}`}
            sub={`${coveragePct}% coverage`}
            tone="emerald"
          />
          <StatTile
            label="Dark precincts"
            value={`${darkPrecincts}`}
            sub="No PC on file"
            tone="red"
          />
          <StatTile
            label="People named"
            value={`${pcs.length}`}
            sub={`${pcsWithRole} with role · ${pcsWithoutRole} without`}
            tone="navy"
          />
          <StatTile
            label="Total PC seats possible"
            value={`${precinctCount * 3}`}
            sub={`${precinctCount} precincts × 3`}
            tone="muted"
          />
        </div>

        {pcs.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-[var(--color-ldp-red)] bg-[#FFF5F6] p-4 text-sm text-[var(--color-ldp-ink-900)]">
            <strong className="text-[var(--color-ldp-red)]">No PCs on file for LD{ld}.</strong>{" "}
            If your LD elected Precinct Captains at the 2025 Convention, send the roster (names,
            precincts, roles, emails, phones) to{" "}
            <a href="mailto:communications@louisvilledems.com" className="text-[var(--color-ldp-navy-700)] underline">
              communications@louisvilledems.com
            </a>
            .
          </div>
        ) : (
          <details className="mt-4 rounded-lg border border-[var(--color-ldp-line)] bg-white">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[var(--color-ldp-navy-900)]">
              Show all {pcs.length} PCs by precinct →
            </summary>
            <div className="divide-y divide-[var(--color-ldp-line)]">
              {sortedPrecincts.map((precinct) => {
                const list = grouped.get(precinct) ?? [];
                return (
                  <div key={precinct} className="px-4 py-3">
                    <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)]">
                      Precinct {precinct} · {list.length} PC{list.length === 1 ? "" : "s"}
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {list.map((pc) => (
                        <li key={pc.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                          <span className="font-medium text-[var(--color-ldp-navy-900)]">
                            {pcDisplayName(pc)}
                          </span>
                          {pc.role && <PcRolePill role={pc.role} />}
                          {pc.email && (
                            <a
                              href={`mailto:${pc.email}`}
                              className="inline-flex items-center gap-1 text-xs text-[var(--color-ldp-navy-700)] hover:underline"
                            >
                              <Mail aria-hidden="true" className="size-3" />
                              {pc.email}
                            </a>
                          )}
                          {pc.phone && (
                            <a
                              href={`tel:${pc.phone.replace(/\D/g, "")}`}
                              className="inline-flex items-center gap-1 text-xs text-[var(--color-ldp-ink-700)] hover:underline"
                            >
                              <Phone aria-hidden="true" className="size-3" />
                              {pc.phone}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </details>
        )}
      </div>
    </section>
  );
}

function StatTile({
  label,
  value,
  suffix,
  sub,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  sub: string;
  tone: "emerald" | "red" | "navy" | "muted";
}) {
  const toneClasses: Record<typeof tone, { bg: string; border: string; valueColor: string }> = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      valueColor: "text-emerald-700",
    },
    red: {
      bg: "bg-[#FFF5F6]",
      border: "border-[var(--color-ldp-red)]/30",
      valueColor: "text-[var(--color-ldp-red)]",
    },
    navy: {
      bg: "bg-[#EFF6FF]",
      border: "border-[var(--color-ldp-navy-700)]/30",
      valueColor: "text-[var(--color-ldp-navy-900)]",
    },
    muted: {
      bg: "bg-[#FAFAFA]",
      border: "border-[var(--color-ldp-line)]",
      valueColor: "text-[var(--color-ldp-ink-900)]",
    },
  };
  const c = toneClasses[tone];
  return (
    <div className={`rounded-lg border ${c.border} ${c.bg} p-3`}>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${c.valueColor}`}>{value}</span>
        {suffix && (
          <span className="text-sm font-medium text-[var(--color-ldp-ink-700)]">{suffix}</span>
        )}
      </div>
      <div className="mt-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">{sub}</div>
    </div>
  );
}

function PcRolePill({ role }: { role: "MAN" | "WOMAN" | "YOUTH" }) {
  const styles: Record<typeof role, string> = {
    MAN: "bg-[var(--color-ldp-navy-800)] text-white",
    WOMAN: "bg-[var(--color-ldp-red)] text-white",
    YOUTH: "bg-[var(--color-ldp-gold)] text-[var(--color-ldp-navy-900)]",
  };
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${styles[role]}`}>
      {role}
    </span>
  );
}
