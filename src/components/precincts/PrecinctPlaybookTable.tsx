"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Precinct } from "@/lib/db/precincts";

type SortKey =
  | "precinct"
  | "metro_council"
  | "total_voters"
  | "dem_total"
  | "rep_total"
  | "ind_total"
  | "dem_gen_not_pri"
  | "d_margin_pct";

type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

const COLUMNS: {
  key: SortKey;
  label: string;
  align: "left" | "right";
}[] = [
  { key: "precinct", label: "Precinct", align: "left" },
  { key: "metro_council", label: "MC", align: "left" },
  { key: "total_voters", label: "Voters", align: "right" },
  { key: "dem_total", label: "D", align: "right" },
  { key: "rep_total", label: "R", align: "right" },
  { key: "ind_total", label: "Ind", align: "right" },
  { key: "dem_gen_not_pri", label: "Sleeper D", align: "right" },
  { key: "d_margin_pct", label: "D margin", align: "right" },
];

function precinctSortValue(p: Precinct): number {
  // Lead digit prefix if present, e.g. "175 41 District" → 175.
  const m = p.precinct.match(/^\d+/);
  return m ? Number(m[0]) : Number.MAX_SAFE_INTEGER;
}

function getSortValue(p: Precinct, key: SortKey): number | string | null {
  if (key === "precinct") return precinctSortValue(p);
  if (key === "metro_council") {
    if (p.metro_council == null) return null;
    const n = Number(p.metro_council);
    return Number.isNaN(n) ? p.metro_council : n;
  }
  return p[key];
}

function compare(a: Precinct, b: Precinct, state: SortState): number {
  if (!state) return 0;
  const av = getSortValue(a, state.key);
  const bv = getSortValue(b, state.key);
  // Nulls always sort last regardless of direction.
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  let cmp: number;
  if (typeof av === "number" && typeof bv === "number") {
    cmp = av - bv;
  } else {
    cmp = String(av).localeCompare(String(bv));
  }
  return state.dir === "asc" ? cmp : -cmp;
}

export function PrecinctPlaybookTable({ precincts }: { precincts: Precinct[] }) {
  const [sort, setSort] = useState<SortState>(null);

  const sorted = useMemo(() => {
    if (!sort) return precincts;
    return [...precincts].sort((a, b) => compare(a, b, sort));
  }, [precincts, sort]);

  function handleSort(key: SortKey) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "desc" };
      if (prev.dir === "desc") return { key, dir: "asc" };
      return null; // third click clears
    });
  }

  return (
    <>
      {/* Desktop table */}
      <div className="mt-3 hidden overflow-x-auto md:block">
        <table className="w-full text-xs">
          <thead className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ldp-ink-700)]">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-2 py-1.5 ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  <SortButton
                    label={col.label}
                    align={col.align}
                    active={sort?.key === col.key}
                    dir={sort?.key === col.key ? sort.dir : null}
                    onClick={() => handleSort(col.key)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ldp-line)]">
            {sorted.map((p) => (
              <tr key={p.precinct} className="hover:bg-[#FAFBFC]">
                <td className="px-2 py-1.5 font-medium text-[var(--color-ldp-navy-900)]">
                  <PrecinctLink precinct={p.precinct} />
                </td>
                <td className="px-2 py-1.5 text-[var(--color-ldp-ink-700)]">
                  {p.metro_council ?? "—"}
                </td>
                <td className="px-2 py-1.5 text-right">
                  {p.total_voters?.toLocaleString() ?? "—"}
                </td>
                <td className="px-2 py-1.5 text-right text-emerald-700">
                  {p.dem_total?.toLocaleString() ?? "—"}
                </td>
                <td className="px-2 py-1.5 text-right text-[var(--color-ldp-red)]">
                  {p.rep_total?.toLocaleString() ?? "—"}
                </td>
                <td className="px-2 py-1.5 text-right text-[var(--color-ldp-ink-700)]">
                  {p.ind_total?.toLocaleString() ?? "—"}
                </td>
                <td className="px-2 py-1.5 text-right font-semibold">
                  {p.dem_gen_not_pri?.toLocaleString() ?? "—"}
                </td>
                <td
                  className="px-2 py-1.5 text-right font-semibold"
                  style={{
                    color:
                      (p.d_margin_pct ?? 0) >= 0
                        ? "var(--color-strategy-power-base)"
                        : "#7a5a1f",
                  }}
                >
                  {p.d_margin_pct != null
                    ? `${p.d_margin_pct > 0 ? "+" : ""}${p.d_margin_pct}%`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards — sorted by the same state */}
      <div className="mt-3 space-y-2 md:hidden">
        {sorted.map((p) => (
          <Link
            key={p.precinct}
            href={precinctHref(p.precinct)}
            className="block rounded border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-semibold text-[var(--color-ldp-navy-900)]">
                Precinct {p.precinct}
                {p.metro_council && (
                  <span className="ml-1 text-[10px] text-[var(--color-ldp-ink-700)]">
                    · MC{p.metro_council}
                  </span>
                )}
              </div>
              <div
                className="text-xs font-semibold"
                style={{
                  color:
                    (p.d_margin_pct ?? 0) >= 0
                      ? "var(--color-strategy-power-base)"
                      : "#7a5a1f",
                }}
              >
                {p.d_margin_pct != null
                  ? `${p.d_margin_pct > 0 ? "+" : ""}${p.d_margin_pct}%`
                  : "—"}
              </div>
            </div>
            <div className="mt-1 grid grid-cols-4 gap-1 text-[10px] text-[var(--color-ldp-ink-700)]">
              <div>
                <div>Voters</div>
                <div className="font-semibold text-[var(--color-ldp-ink-900)]">
                  {p.total_voters?.toLocaleString() ?? "—"}
                </div>
              </div>
              <div>
                <div>D</div>
                <div className="font-semibold text-emerald-700">
                  {p.dem_total?.toLocaleString() ?? "—"}
                </div>
              </div>
              <div>
                <div>R</div>
                <div className="font-semibold text-[var(--color-ldp-red)]">
                  {p.rep_total?.toLocaleString() ?? "—"}
                </div>
              </div>
              <div>
                <div>Sleeper D</div>
                <div className="font-semibold text-[var(--color-ldp-ink-900)]">
                  {p.dem_gen_not_pri?.toLocaleString() ?? "—"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function precinctHref(precinct: string): string {
  const m = precinct.match(/\b(L\d+)\s*$/i);
  return m ? `/precincts/${m[1].toUpperCase()}` : `/my-ld`;
}

function PrecinctLink({ precinct }: { precinct: string }) {
  const href = precinctHref(precinct);
  return (
    <Link href={href} className="inline-flex items-center gap-1 hover:underline">
      {precinct}
    </Link>
  );
}

function SortButton({
  label,
  align,
  active,
  dir,
  onClick,
}: {
  label: string;
  align: "left" | "right";
  active: boolean;
  dir: "asc" | "desc" | null;
  onClick: () => void;
}) {
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded ${
        align === "right" ? "flex-row-reverse" : ""
      } ${active ? "text-[var(--color-ldp-navy-900)]" : "text-[var(--color-ldp-ink-700)]"} hover:text-[var(--color-ldp-navy-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2`}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <span>{label}</span>
      <Icon aria-hidden="true" className={`size-3 ${active ? "" : "opacity-40"}`} />
    </button>
  );
}
