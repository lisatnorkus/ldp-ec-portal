"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  PRIMARY_ROLE_LABEL,
  OFFICER_ROLE_LABEL,
  OFFICER_ORDER,
  displayName,
  attendancePct,
  attendanceLabel,
  type EcMember,
} from "@/lib/db/members-types";

type Committee = { code: string; name: string };

type Props = {
  members: EcMember[];
  committees: Committee[];
};

export function DirectoryClient({ members, committees }: Props) {
  const [query, setQuery] = useState("");
  const committeeName = useMemo(
    () => new Map(committees.map((c) => [c.code, c.name])),
    [committees]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return members;
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (displayName(m).toLowerCase().includes(q)) return true;
      if ((m.email ?? "").toLowerCase().includes(q)) return true;
      if ((m.phone ?? "").toLowerCase().includes(q)) return true;
      if (PRIMARY_ROLE_LABEL[m.primary_role].toLowerCase().includes(q)) return true;
      if (m.officer_role && OFFICER_ROLE_LABEL[m.officer_role].toLowerCase().includes(q)) return true;
      if (m.ld_number != null && `ld${m.ld_number}`.includes(q.replace(/\s/g, ""))) return true;
      if (m.ld_number != null && String(m.ld_number).includes(q)) return true;
      for (const c of [...m.committee_chair_codes, ...m.committee_member_codes]) {
        if ((committeeName.get(c) ?? c).toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [members, query, committeeName]);

  const officers = filtered
    .filter((m) => m.officer_role != null)
    .sort(
      (a, b) => OFFICER_ORDER.indexOf(a.officer_role!) - OFFICER_ORDER.indexOf(b.officer_role!)
    );
  const nonOfficers = filtered.filter((m) => m.officer_role == null);
  const byRole = groupByRole(nonOfficers);

  return (
    <>
      <div className="relative mb-6">
        <label htmlFor="directory-search" className="sr-only">
          Search the directory
        </label>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-ldp-ink-700)]" />
        <input
          id="directory-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, role, LD, committee, email, or phone…"
          aria-describedby="directory-search-count"
          className="w-full rounded-lg border border-[var(--color-ldp-line)] bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
          autoComplete="off"
        />
        <div id="directory-search-count" aria-live="polite" className="sr-only">
          {query ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}` : ""}
        </div>
        {query && (
          <div className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">
            {filtered.length} match{filtered.length === 1 ? "" : "es"} ·{" "}
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded text-[var(--color-ldp-navy-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
            >
              clear
            </button>
          </div>
        )}
      </div>

      {officers.length > 0 && (
        <OfficersBlock officers={officers} committeeName={committeeName} />
      )}

      <RoleGroup
        title="LD Chairs"
        members={byRole.LD_CHAIR ?? []}
        committeeName={committeeName}
      />
      <RoleGroup
        title="LD Vice Chairs"
        members={byRole.LD_VC ?? []}
        committeeName={committeeName}
      />
      <RoleGroup
        title="At-Large Members"
        members={byRole.AT_LARGE ?? []}
        committeeName={committeeName}
      />
      <RoleGroup
        title="Affiliated voting seats"
        members={[...(byRole.LYD_PRES ?? []), ...(byRole.WOMENS_CLUB_PRES ?? [])]}
        committeeName={committeeName}
      />
      <RoleGroup
        title="Committee Chairs (not on LD leadership)"
        members={byRole.COMMITTEE_CHAIR_ONLY ?? []}
        committeeName={committeeName}
      />

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-10 text-center text-sm text-[var(--color-ldp-ink-700)]">
          No members match &ldquo;{query}&rdquo;.
        </div>
      )}
    </>
  );
}

function groupByRole(
  members: EcMember[]
): Partial<Record<EcMember["primary_role"], EcMember[]>> {
  const out: Partial<Record<EcMember["primary_role"], EcMember[]>> = {};
  for (const m of members) {
    const bucket = out[m.primary_role] ?? (out[m.primary_role] = []);
    bucket.push(m);
  }
  for (const list of Object.values(out)) {
    list?.sort((a, b) => {
      if (a.ld_number && b.ld_number && a.ld_number !== b.ld_number)
        return a.ld_number - b.ld_number;
      return a.last_name.localeCompare(b.last_name);
    });
  }
  return out;
}

function OfficersBlock({
  officers,
  committeeName,
}: {
  officers: EcMember[];
  committeeName: Map<string, string>;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
        Countywide Officers · The four who run day-to-day
      </h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {officers.map((m) => (
          <Link
            key={m.id}
            href={`/people/${m.id}`}
            className="block rounded-lg border-2 border-[var(--color-ldp-navy-800)] bg-white p-4 shadow-sm transition-colors hover:border-[var(--color-ldp-red)]"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ldp-navy-800)]">
              {OFFICER_ROLE_LABEL[m.officer_role!]}
            </div>
            <div className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
              {displayName(m)}
            </div>
            <div className="mt-3 space-y-1 text-xs text-[var(--color-ldp-ink-700)]">
              {m.email && <div className="truncate text-[var(--color-ldp-navy-700)]">{m.email}</div>}
              {m.phone && <div>{m.phone}</div>}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {m.ld_number && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-ldp-navy-900)] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                  LD{m.ld_number}{" "}
                  {m.primary_role === "LD_CHAIR" ? "Chair" : m.primary_role === "LD_VC" ? "VC" : ""}
                </span>
              )}
              {m.committee_chair_codes.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ldp-navy-900)]"
                >
                  {committeeName.get(c) ?? c} Chair
                </span>
              ))}
            </div>
            <div className="mt-3 border-t border-[var(--color-ldp-line)] pt-2 text-[10px] text-[var(--color-ldp-ink-700)]">
              Attendance: {attendanceLabel(m)}
              {attendancePct(m) != null && <> · {attendancePct(m)}%</>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RoleGroup({
  title,
  members,
  committeeName,
}: {
  title: string;
  members: EcMember[];
  committeeName: Map<string, string>;
}) {
  if (members.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        {title} · {members.length}
      </h2>
      <div className="overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
        {/* Desktop table */}
        <table className="hidden w-full text-sm md:table">
          <thead className="bg-[#FAFAFA] text-xs font-semibold uppercase tracking-wider text-[var(--color-ldp-ink-700)]">
            <tr>
              <th className="px-4 py-2.5 text-left">Name</th>
              <th className="px-4 py-2.5 text-left">Role</th>
              <th className="px-4 py-2.5 text-left">Committees</th>
              <th className="px-4 py-2.5 text-left">Contact</th>
              <th className="px-4 py-2.5 text-left">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ldp-line)]">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-[#FAFBFC]">
                <td className="px-4 py-2.5 font-medium text-[var(--color-ldp-navy-900)]">
                  <Link href={`/people/${m.id}`} className="hover:underline">
                    {displayName(m)}
                  </Link>
                </td>
                <td className="px-4 py-2.5 text-[var(--color-ldp-ink-700)]">
                  {PRIMARY_ROLE_LABEL[m.primary_role]}
                  {m.ld_number ? <span className="ml-1 text-xs">· LD{m.ld_number}</span> : null}
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--color-ldp-ink-700)]">
                  {renderCommittees(m, committeeName)}
                </td>
                <td className="px-4 py-2.5 text-xs">
                  <div className="space-y-0.5">
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="block truncate max-w-[200px] text-[var(--color-ldp-navy-700)] hover:underline"
                      >
                        {m.email}
                      </a>
                    )}
                    {m.phone && <div className="text-[var(--color-ldp-ink-700)]">{m.phone}</div>}
                    {!m.email && !m.phone && <span className="text-[var(--color-ldp-ink-700)]">—</span>}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs">
                  <AttendanceCell m={m} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile card list */}
        <ul className="divide-y divide-[var(--color-ldp-line)] md:hidden">
          {members.map((m) => (
            <li key={m.id}>
              <Link
                href={`/people/${m.id}`}
                className="flex items-start justify-between gap-3 p-4 hover:bg-[#FAFBFC]"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-[var(--color-ldp-navy-900)]">{displayName(m)}</div>
                  <div className="text-xs text-[var(--color-ldp-ink-700)]">
                    {PRIMARY_ROLE_LABEL[m.primary_role]}
                    {m.ld_number ? ` · LD${m.ld_number}` : ""}
                  </div>
                  <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
                    {renderCommittees(m, committeeName)}
                  </div>
                </div>
                <AttendanceCell m={m} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AttendanceCell({ m }: { m: EcMember }) {
  const pct = attendancePct(m);
  if (pct == null)
    return (
      <span aria-label="Attendance not available" className="text-[var(--color-ldp-ink-700)]">
        —
      </span>
    );
  const color =
    pct >= 90
      ? "text-emerald-700"
      : pct >= 75
        ? "text-[var(--color-ldp-navy-700)]"
        : pct >= 50
          ? "text-amber-700"
          : "text-[var(--color-ldp-red)]";
  return (
    <div
      className="shrink-0 text-right"
      aria-label={`Attendance ${pct} percent: ${attendanceLabel(m)}`}
    >
      <div className={`font-semibold ${color}`}>{pct}%</div>
      <div className="text-[10px] text-[var(--color-ldp-ink-700)]">{attendanceLabel(m)}</div>
    </div>
  );
}

function renderCommittees(m: EcMember, committeeName: Map<string, string>) {
  const chairs = m.committee_chair_codes.map((c) => committeeName.get(c) ?? c);
  const mems = m.committee_member_codes.map((c) => committeeName.get(c) ?? c);
  const parts: string[] = [];
  if (chairs.length) parts.push(`Chair: ${chairs.join(", ")}`);
  if (mems.length) parts.push(mems.join(", "));
  return parts.length ? parts.join(" · ") : <span>—</span>;
}
