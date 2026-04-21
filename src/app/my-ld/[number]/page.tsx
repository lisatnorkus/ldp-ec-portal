import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, MapPin, Target } from "lucide-react";
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

export const dynamic = "force-dynamic";

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

  const [chair, vc, precincts] = await Promise.all([
    fetchMemberById(ld.chair_id),
    fetchMemberById(ld.vc_id),
    fetchPrecinctsByLd(ld_number),
  ]);

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
    // Next event + raise progress: future wiring; stubbed so Rule 9 won't fire without real data.
    next_event_days_until: undefined,
    next_event_name: undefined,
    raise_progress_dollars: 0,
  };
  const recommendation = evaluateRules(ruleCtx);
  const currentPhase = getCurrentPhase();

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/my-ld"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft className="size-4" /> All LDs
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            Legislative District
          </div>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            LD{ld_number}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ldp-ink-700)]">
            {precincts.length} precincts · {counts.sleeper_dems.toLocaleString()} sleeper Dems countywide
            {ld.state_senate_overlap?.length > 0 && (
              <span> · SD overlap: {ld.state_senate_overlap.join(", ")}</span>
            )}
            {ld.metro_council_overlap?.length > 0 && (
              <span> · MC overlap: {ld.metro_council_overlap.join(", ")}</span>
            )}
          </p>
        </div>

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
                title={`State House District ${ld_number} · Your LD seat`}
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
                      candidates={mcCandidates}
                    />
                  );
                })}
              </>
            )}
          </section>
        )}

        {/* Precinct playbook */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Precinct playbook
          </h2>
          {(["DEFEND", "PRIMARY", "ACTIVATE", "GROW"] as Strategy[]).map((s) => {
            const group = byStrategy[s] ?? [];
            if (group.length === 0) return null;
            return (
              <details
                key={s}
                open={s === "DEFEND"}
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
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ldp-ink-700)]">
                      <tr>
                        <th className="px-2 py-1.5 text-left">Precinct</th>
                        <th className="px-2 py-1.5 text-left">MC</th>
                        <th className="px-2 py-1.5 text-right">Voters</th>
                        <th className="px-2 py-1.5 text-right">D</th>
                        <th className="px-2 py-1.5 text-right">R</th>
                        <th className="px-2 py-1.5 text-right">Ind</th>
                        <th className="px-2 py-1.5 text-right">Sleeper D</th>
                        <th className="px-2 py-1.5 text-right">D margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-ldp-line)]">
                      {group.map((p) => (
                        <tr key={p.precinct} className="hover:bg-[#FAFBFC]">
                          <td className="px-2 py-1.5 font-medium text-[var(--color-ldp-navy-900)]">
                            <a
                              href={`https://26ldp-strategy-map.vercel.app/?precinct=${encodeURIComponent(p.precinct)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 hover:underline"
                            >
                              {p.precinct} <ExternalLink className="size-3" />
                            </a>
                          </td>
                          <td className="px-2 py-1.5 text-[var(--color-ldp-ink-700)]">{p.metro_council ?? "—"}</td>
                          <td className="px-2 py-1.5 text-right">{p.total_voters?.toLocaleString() ?? "—"}</td>
                          <td className="px-2 py-1.5 text-right text-emerald-700">{p.dem_total?.toLocaleString() ?? "—"}</td>
                          <td className="px-2 py-1.5 text-right text-[var(--color-ldp-red)]">{p.rep_total?.toLocaleString() ?? "—"}</td>
                          <td className="px-2 py-1.5 text-right text-[var(--color-ldp-ink-700)]">{p.ind_total?.toLocaleString() ?? "—"}</td>
                          <td className="px-2 py-1.5 text-right font-semibold">{p.dem_gen_not_pri?.toLocaleString() ?? "—"}</td>
                          <td className="px-2 py-1.5 text-right font-semibold" style={{ color: (p.d_margin_pct ?? 0) >= 0 ? "var(--color-strategy-power-base)" : "#7a5a1f" }}>
                            {p.d_margin_pct != null ? `${p.d_margin_pct > 0 ? "+" : ""}${p.d_margin_pct}%` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}
        </section>

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
      </main>
    </div>
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
};

function RaceBlock({ title, candidates }: { title: string; candidates: Candidate[] }) {
  const dems = candidates.filter((c) => c.party === "D");
  const others = candidates.filter((c) => c.party !== "D");
  return (
    <div className="mb-4 rounded-lg border border-[var(--color-ldp-line)] bg-white p-5">
      <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">{title}</div>
      {others.length > 0 && (
        <div className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">
          {others.map((o) => (
            <span key={o.id} className="mr-2">
              {o.full_name} ({o.party}) {o.is_incumbent && "· incumbent"}
            </span>
          ))}
        </div>
      )}
      <ul className="mt-3 space-y-1.5">
        {dems.map((d) => (
          <li key={d.id} className="flex items-start gap-2 text-sm">
            {d.is_endorsed && (
              <span className="mt-0.5 rounded-full bg-[var(--color-ldp-gold)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--color-ldp-navy-900)]">
                LDP
              </span>
            )}
            <span className={d.is_endorsed ? "font-semibold text-[var(--color-ldp-navy-900)]" : "text-[var(--color-ldp-ink-900)]"}>
              {d.full_name}
              {d.is_incumbent && <span className="ml-1 text-xs text-[var(--color-ldp-ink-700)]">· incumbent</span>}
            </span>
            {d.notes && <span className="text-xs text-[var(--color-ldp-ink-700)]">— {d.notes}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
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
