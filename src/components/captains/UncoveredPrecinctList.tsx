"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search, UserPlus } from "lucide-react";
import { STRATEGY_COLOR_VAR, STRATEGY_FRIENDLY, type Strategy } from "@/lib/db/precincts-types";

type UncoveredRow = {
  precinctFull: string;
  precinctCode: string | null;
  ldNumber: number | null;
  strategy: Strategy | null;
  dem_gotv_targets: number | null;
  d_margin_pct: number | null;
};

const STRATEGY_ORDER: Strategy[] = ["ACTIVATE", "DEFEND", "PRIMARY", "GROW"];

export function UncoveredPrecinctList({ rows }: { rows: UncoveredRow[] }) {
  const [strat, setStrat] = useState<Strategy | "">("ACTIVATE");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (strat && r.strategy !== strat) return false;
      if (ql) {
        const name = `${r.precinctFull} ${r.precinctCode ?? ""}`.toLowerCase();
        if (!name.includes(ql)) return false;
      }
      return true;
    });
  }, [rows, strat, q]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[var(--color-ldp-ink-700)]"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search precinct code or LD…"
            className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white py-1.5 pl-8 pr-2 text-sm"
          />
        </div>
        <select
          value={strat}
          onChange={(e) => setStrat(e.target.value as Strategy | "")}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-xs"
        >
          <option value="">All strategies</option>
          {STRATEGY_ORDER.map((s) => (
            <option key={s} value={s}>
              {STRATEGY_FRIENDLY[s]}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          <Filter aria-hidden="true" className="size-3" />
          {filtered.length} of {rows.length} uncovered
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-6 text-center text-sm text-[var(--color-ldp-ink-700)]">
          No uncovered precincts match the current filters. (If you just filtered to ACTIVATE and
          see this, that&apos;s the win state.)
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-ldp-line)] overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
          {filtered.slice(0, 120).map((r) => {
            const accent = r.strategy ? STRATEGY_COLOR_VAR[r.strategy] : "var(--color-ldp-ink-700)";
            return (
              <li
                key={r.precinctFull}
                className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#FAFBFC]"
              >
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
                  style={{ backgroundColor: accent }}
                >
                  {r.strategy ? STRATEGY_FRIENDLY[r.strategy] : "—"}
                </span>
                <span className="min-w-[72px] font-mono text-xs font-semibold text-[var(--color-ldp-navy-900)]">
                  {r.precinctCode ?? "—"}
                </span>
                <span className="text-xs text-[var(--color-ldp-ink-700)]">
                  {r.ldNumber != null ? `LD${r.ldNumber}` : "—"}
                </span>
                <span className="hidden text-xs text-[var(--color-ldp-ink-700)] md:inline">
                  {r.dem_gotv_targets != null && `${r.dem_gotv_targets} GOTV`}
                  {r.d_margin_pct != null && (
                    <span className="ml-2">
                      D{r.d_margin_pct >= 0 ? "+" : ""}
                      {r.d_margin_pct.toFixed(1)}
                    </span>
                  )}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  {r.precinctCode && (
                    <Link
                      href={`/precincts/${r.precinctCode}`}
                      className="text-xs text-[var(--color-ldp-navy-700)] hover:underline"
                    >
                      Open precinct →
                    </Link>
                  )}
                  {r.ldNumber != null && (
                    <Link
                      href={`/my-ld/${r.ldNumber}/recruiting`}
                      className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-2 py-1 text-[10px] font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                    >
                      <UserPlus aria-hidden="true" className="size-3" />
                      Recruit
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
          {filtered.length > 120 && (
            <li className="px-4 py-2 text-center text-xs italic text-[var(--color-ldp-ink-700)]">
              +{filtered.length - 120} more — narrow the filter to see them.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
