"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Layers, MapPin, Trophy, Vote } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import {
  fmtRaceLabel,
  groupRaces,
  rollupTurnout,
  type GroupedRace,
  type ResultRow,
  type TurnoutRow,
} from "@/lib/db/election-results-types";

type Props = {
  ld_number: number;
  ld_results: ResultRow[];
  ld_turnout: TurnoutRow | null;
  all_results: ResultRow[];
  all_turnout: TurnoutRow[];
};

export function PrimaryResults2026Card({
  ld_number,
  ld_results,
  ld_turnout,
  all_results,
  all_turnout,
}: Props) {
  const [view, setView] = useState<"ld" | "county">("ld");
  const { profile, hydrated } = useUserProfile();

  // At-Large members are countywide by mandate; default their view to
  // the whole county. Other roles default to their LD. We only flip
  // ONCE on hydrate so a user who manually toggles can stay there.
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    if (!hydrated || flipped) return;
    if (profile.role === "AT_LARGE") setView("county");
    setFlipped(true);
  }, [hydrated, profile.role, flipped]);

  const ld_races = groupRaces(ld_results);
  const county_races = groupRaces(all_results);
  const county_turnout = all_turnout.length ? rollupTurnout(all_turnout) : null;

  const races = view === "ld" ? ld_races : county_races;
  const turnout = view === "ld" ? ld_turnout : county_turnout;
  const scope_label = view === "ld" ? `LD${ld_number}` : "Jefferson County";

  return (
    <section
      aria-label="2026 Primary Results"
      className="mb-8 overflow-hidden rounded-2xl border-2 border-[var(--color-ldp-navy-700)] bg-white shadow-sm"
    >
      <header className="bg-gradient-to-r from-[var(--color-ldp-navy-900)] to-[var(--color-ldp-navy-700)] px-6 py-5 text-white">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-gold)]">
              May 19, 2026 — Kentucky Primary
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight">
              Primary Results — {scope_label}
            </h2>
          </div>
          <ViewToggle view={view} setView={setView} ld_number={ld_number} />
        </div>
      </header>

      <div className="px-6 py-5">
        {turnout && <TurnoutStrip t={turnout} />}

        {races.length === 0 ? (
          <p className="mt-6 text-sm italic text-[var(--color-ldp-ink-700)]">
            No contested races recorded for {scope_label}.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {races.map((r) => (
              <RaceRow key={r.key} r={r} />
            ))}
          </div>
        )}

        <p className="mt-5 text-[11px] italic text-[var(--color-ldp-ink-700)]">
          Loaded from the Jefferson County clerk&apos;s precinct-level report,
          rolled up by LD letter prefix. This is how fast we can put real
          numbers in front of the EC when the data is structured well.
        </p>
      </div>

      <WhyThisMattersForNovember scope_label={scope_label} />
    </section>
  );
}

// The post-primary frame: the numbers above are not the ending — they
// tell us where the November fight actually lives. Surfaces three
// pointers the LD chair should take with them: who advances, which
// precincts moved (turnout = November ceiling), and where the soft
// support sits (margin of advancement = persuasion exposure).
function WhyThisMattersForNovember({
  scope_label,
}: {
  scope_label: string;
}) {
  return (
    <div className="border-t border-[var(--color-ldp-line)] bg-[var(--color-ldp-cream,#fbf8f1)] px-6 py-5">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-[var(--color-ldp-gold,#c89a3b)] p-1.5 text-white">
          <ArrowRight className="size-4" aria-hidden />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
            Why this matters for November
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
            The names above are now the names on the November ballot. The
            precincts that turned out big for them are your <strong>November
            ceiling</strong>. The races that finished tight tell you where
            persuasion still matters in the fall — and where the LDP
            endorsement carries weight. Use {scope_label}&apos;s primary
            turnout as your baseline; the general election goal is to beat it.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href="/ballot"
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-700)] px-3 py-1.5 font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
            >
              See the November ballot
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
            <Link
              href="/candidates"
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-navy-700)] bg-white px-3 py-1.5 font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-navy-100,#eef0f4)]"
            >
              Open full primary results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({
  view,
  setView,
  ld_number,
}: {
  view: "ld" | "county";
  setView: (v: "ld" | "county") => void;
  ld_number: number;
}) {
  const cls = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "bg-white text-[var(--color-ldp-navy-900)]"
        : "bg-white/10 text-white/80 hover:bg-white/20"
    }`;
  return (
    <div className="inline-flex rounded-lg bg-white/10 p-1" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={view === "ld"}
        className={cls(view === "ld")}
        onClick={() => setView("ld")}
      >
        LD{ld_number} breakdown
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === "county"}
        className={cls(view === "county")}
        onClick={() => setView("county")}
      >
        All of Jefferson County
      </button>
    </div>
  );
}

function TurnoutStrip({ t }: { t: TurnoutRow }) {
  const dem_pct = t.total_ballots ? (t.dem_ballots / t.total_ballots) * 100 : 0;
  const rep_pct = t.total_ballots ? (t.rep_ballots / t.total_ballots) * 100 : 0;
  const np_pct = t.total_ballots ? (t.np_ballots / t.total_ballots) * 100 : 0;
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat icon={Vote} label="Total ballots" value={t.total_ballots.toLocaleString()} />
        <Stat
          icon={Layers}
          label="Precincts"
          value={t.precincts.toLocaleString()}
        />
        <Stat
          icon={MapPin}
          label="Election Day"
          value={t.total_eday.toLocaleString()}
          sub={
            t.total_ballots
              ? `${Math.round((t.total_eday / t.total_ballots) * 100)}% of ballots`
              : null
          }
        />
        <Stat
          icon={BarChart3}
          label="Early + mail"
          value={(t.total_mail + t.total_early_3day).toLocaleString()}
          sub={`mail ${t.total_mail.toLocaleString()} · early ${t.total_early_3day.toLocaleString()}`}
        />
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          <span>Ballots by party</span>
          <span>
            D {t.dem_ballots.toLocaleString()} · R {t.rep_ballots.toLocaleString()} · NP {t.np_ballots.toLocaleString()}
          </span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--color-ldp-ink-100,#e6e7ea)]">
          <div
            className="h-full bg-[#0E4C9E]"
            style={{ width: `${dem_pct}%` }}
            title={`Dem ${dem_pct.toFixed(1)}%`}
          />
          <div
            className="h-full bg-[var(--color-ldp-red)]"
            style={{ width: `${rep_pct}%` }}
            title={`Rep ${rep_pct.toFixed(1)}%`}
          />
          <div
            className="h-full bg-[var(--color-ldp-ink-300,#9aa0aa)]"
            style={{ width: `${np_pct}%` }}
            title={`NP ${np_pct.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  value: string;
  sub?: string | null;
}) {
  return (
    <div className="rounded-lg border bg-[var(--color-ldp-cream,#fbf8f1)] p-3">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        <Icon className="size-3.5" aria-hidden />
        {label}
      </div>
      <div className="mt-1 text-lg font-bold tabular-nums text-[var(--color-ldp-navy-900)]">
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">{sub}</div>
      )}
    </div>
  );
}

function RaceRow({ r }: { r: GroupedRace }) {
  const winner = r.candidates[0];
  const isContested = r.candidates.filter((c) => c.votes > 0).length > 1;
  const partyBadge =
    r.party === "DEM"
      ? "bg-[#0E4C9E] text-white"
      : r.party === "REP"
        ? "bg-[var(--color-ldp-red)] text-white"
        : "bg-[var(--color-ldp-ink-200,#d8dbe1)] text-[var(--color-ldp-navy-900)]";

  return (
    <article className="rounded-xl border bg-white p-4">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${partyBadge}`}
          >
            {r.party || "Nonpartisan"}
          </span>
          <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
            {fmtRaceLabel(r).replace(/^(DEM|REP) — /, "")}
          </h3>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          {r.total_votes.toLocaleString()} votes · {r.precincts_reporting} precincts
        </div>
      </header>

      <ol className="space-y-1.5">
        {r.candidates.map((c, idx) => {
          const is_winner = idx === 0 && c.votes > 0 && isContested;
          return (
            <li key={c.name}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex min-w-0 items-baseline gap-2">
                  {is_winner && (
                    <Trophy
                      className="size-3.5 shrink-0 text-[var(--color-ldp-gold,#c89a3b)]"
                      aria-label="Leading candidate"
                    />
                  )}
                  <span
                    className={`truncate text-sm ${
                      is_winner
                        ? "font-bold text-[var(--color-ldp-navy-900)]"
                        : "text-[var(--color-ldp-ink-900)]"
                    }`}
                  >
                    {c.name}
                  </span>
                </div>
                <div className="shrink-0 tabular-nums text-xs text-[var(--color-ldp-ink-700)]">
                  {c.votes.toLocaleString()} ·{" "}
                  <span
                    className={
                      is_winner ? "font-bold text-[var(--color-ldp-navy-900)]" : ""
                    }
                  >
                    {c.pct.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-ldp-ink-100,#e6e7ea)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, c.pct)}%`,
                    backgroundColor: is_winner
                      ? "var(--color-ldp-navy-700)"
                      : "var(--color-ldp-ink-400,#7a808b)",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
