"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import {
  STATUS_COLOR,
  STATUS_LABEL,
  VOLUNTEER_INTERESTS,
  interestLabel,
  type Volunteer,
  type VolunteerStatus,
} from "@/lib/db/volunteers-types";

function formatLastActive(iso: string | null): string {
  if (!iso) return "Never logged";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

const STATUS_ORDER: VolunteerStatus[] = ["ACTIVE", "LAPSED", "PAUSED", "DO_NOT_CONTACT"];

export function VolunteerRoster({ volunteers }: { volunteers: Volunteer[] }) {
  const [q, setQ] = useState("");
  const [interest, setInterest] = useState<string>("");
  const [status, setStatus] = useState<VolunteerStatus | "">("");
  const [ld, setLd] = useState<string>("");

  // All unique LDs represented, sorted ascending — powers the LD filter dropdown.
  const lds = useMemo(() => {
    const set = new Set<number>();
    for (const v of volunteers) if (v.home_ld != null) set.add(v.home_ld);
    return [...set].sort((a, b) => a - b);
  }, [volunteers]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return volunteers.filter((v) => {
      if (status && v.status !== status) return false;
      if (interest && !v.interest_tags.includes(interest)) return false;
      if (ld && String(v.home_ld ?? "") !== ld) return false;
      if (ql) {
        const name = `${v.first_name} ${v.last_name} ${v.preferred_name ?? ""}`.toLowerCase();
        const contact = `${v.email ?? ""} ${v.phone ?? ""}`.toLowerCase();
        if (!name.includes(ql) && !contact.includes(ql)) return false;
      }
      return true;
    });
  }, [volunteers, q, interest, status, ld]);

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
            placeholder="Search name, email, phone…"
            className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white py-1.5 pl-8 pr-2 text-sm text-[var(--color-ldp-ink-900)] focus:border-[var(--color-ldp-navy-700)] focus:outline-none"
          />
        </div>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-xs text-[var(--color-ldp-ink-900)]"
        >
          <option value="">All interests</option>
          {VOLUNTEER_INTERESTS.map((i) => (
            <option key={i.key} value={i.key}>{i.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as VolunteerStatus | "")}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-xs text-[var(--color-ldp-ink-900)]"
        >
          <option value="">All status</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <select
          value={ld}
          onChange={(e) => setLd(e.target.value)}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-xs text-[var(--color-ldp-ink-900)]"
        >
          <option value="">All LDs</option>
          {lds.map((n) => (
            <option key={n} value={String(n)}>LD{n}</option>
          ))}
          <option value="">Unknown LD</option>
        </select>
        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          <Filter aria-hidden="true" className="size-3" />
          {filtered.length} of {volunteers.length}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-6 text-center text-sm text-[var(--color-ldp-ink-700)]">
          No volunteers match the current filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAFA] text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              <tr>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">LD</th>
                <th className="hidden px-3 py-2 text-left md:table-cell">Interests</th>
                <th className="hidden px-3 py-2 text-left lg:table-cell">Owner</th>
                <th className="px-3 py-2 text-right">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-ldp-line)]">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-[#FAFBFC]">
                  <td className="px-3 py-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white"
                      style={{ backgroundColor: STATUS_COLOR[v.status] }}
                    >
                      {STATUS_LABEL[v.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/volunteers/${v.id}`}
                      className="font-medium text-[var(--color-ldp-navy-900)] hover:underline"
                    >
                      {v.preferred_name?.trim() || v.first_name} {v.last_name}
                    </Link>
                    {v.email && (
                      <div className="text-[11px] text-[var(--color-ldp-ink-700)]">{v.email}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--color-ldp-ink-700)]">
                    {v.home_ld != null ? `LD${v.home_ld}` : "—"}
                  </td>
                  <td className="hidden px-3 py-2 md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {v.interest_tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-1.5 py-0.5 text-[10px] text-[var(--color-ldp-ink-900)]"
                        >
                          {interestLabel(t)}
                        </span>
                      ))}
                      {v.interest_tags.length > 3 && (
                        <span className="text-[10px] text-[var(--color-ldp-ink-700)]">
                          +{v.interest_tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="hidden px-3 py-2 text-xs text-[var(--color-ldp-ink-700)] lg:table-cell">
                    {v.owner_name ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-[var(--color-ldp-ink-700)]">
                    {formatLastActive(v.last_active_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
