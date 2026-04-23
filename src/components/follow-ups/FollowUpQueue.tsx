"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Filter, Phone, Mail } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import {
  STAGE_COLOR,
  STAGE_LABEL,
  type LdContact,
  type PipelineStage,
} from "@/lib/db/ld-contacts-types";

// Stages that represent a "working relationship" in the DNC layering
// framework. IDENTIFIED = haven't reached out yet, so not a follow-up.
// COLD / PAUSED / NOT_INTERESTED / EC_MEMBER = not currently warming.
const WORKING_STAGES: PipelineStage[] = ["CONTACTED", "WARM", "COMMITTED", "ACTIVE"];

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function formatDaysSince(iso: string | null): string {
  const d = daysSince(iso);
  if (d == null) return "Never contacted";
  if (d === 0) return "Contacted today";
  if (d === 1) return "1 day ago";
  if (d < 30) return `${d} days ago`;
  if (d < 365) return `${Math.round(d / 30)} months ago`;
  return `${Math.round(d / 365)} years ago`;
}

export function FollowUpQueue({ contacts }: { contacts: LdContact[] }) {
  const { profile, hydrated } = useUserProfile();
  const [mineOnly, setMineOnly] = useState(true);
  const [stageFilter, setStageFilter] = useState<PipelineStage | "">("");
  const [ldFilter, setLdFilter] = useState<string>("");
  const [windowDays, setWindowDays] = useState<number>(14);

  const name = profile.display_name?.trim().toLowerCase() ?? "";

  const queue = useMemo(() => {
    return contacts.filter((c) => {
      if (!WORKING_STAGES.includes(c.pipeline_stage)) return false;
      // Needs-next-touch window: never contacted OR >= windowDays ago.
      if (c.last_contacted_at) {
        const d = daysSince(c.last_contacted_at);
        if (d == null || d < windowDays) return false;
      }
      if (stageFilter && c.pipeline_stage !== stageFilter) return false;
      if (ldFilter && String(c.ld_number) !== ldFilter) return false;
      if (mineOnly && name) {
        const authorMatches = c.author_name?.trim().toLowerCase() === name;
        const assignedMatches = c.assigned_to_name?.trim().toLowerCase() === name;
        if (!authorMatches && !assignedMatches) return false;
      }
      return true;
    });
  }, [contacts, stageFilter, ldFilter, mineOnly, name, windowDays]);

  const uniqueLds = useMemo(() => {
    const set = new Set<number>();
    for (const c of contacts) set.add(c.ld_number);
    return [...set].sort((a, b) => a - b);
  }, [contacts]);

  // Working-relationships count (mine, in working stages, regardless of
  // follow-up window) — helps calibrate the "10-20 per captain" heuristic.
  const myWorkingTotal = useMemo(() => {
    if (!mineOnly || !name) return null;
    return contacts.filter(
      (c) =>
        WORKING_STAGES.includes(c.pipeline_stage) &&
        (c.author_name?.trim().toLowerCase() === name ||
          c.assigned_to_name?.trim().toLowerCase() === name)
    ).length;
  }, [contacts, mineOnly, name]);

  return (
    <div>
      {hydrated && !name && (
        <div className="mb-4 rounded-md border border-[var(--color-ldp-gold)] bg-[#FEF9E7] p-3 text-xs text-[var(--color-ldp-ink-900)]">
          Set your name in the portal and &ldquo;mine only&rdquo; will filter to contacts you
          entered or have been assigned.
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        <label className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-line)] bg-white px-2.5 py-1.5">
          <input
            type="checkbox"
            checked={mineOnly}
            onChange={(e) => setMineOnly(e.target.checked)}
            disabled={!name}
          />
          <span className="font-medium text-[var(--color-ldp-navy-900)]">Mine only</span>
          {myWorkingTotal != null && (
            <span className="text-[var(--color-ldp-ink-700)]">· {myWorkingTotal} working</span>
          )}
        </label>
        <select
          value={windowDays}
          onChange={(e) => setWindowDays(Number(e.target.value))}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-xs"
        >
          <option value={7}>No touch in 7+ days</option>
          <option value={14}>No touch in 14+ days</option>
          <option value={30}>No touch in 30+ days</option>
          <option value={60}>No touch in 60+ days</option>
        </select>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as PipelineStage | "")}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-xs"
        >
          <option value="">All working stages</option>
          {WORKING_STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          value={ldFilter}
          onChange={(e) => setLdFilter(e.target.value)}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-xs"
        >
          <option value="">All LDs</option>
          {uniqueLds.map((n) => (
            <option key={n} value={String(n)}>
              LD{n}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          <Filter aria-hidden="true" className="size-3" />
          {queue.length} to touch
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-6 text-center text-sm text-[var(--color-ldp-ink-700)]">
          No follow-ups pending at this window. Either your list is fully layered, or you need
          to log recent interactions so the clock resets.
        </div>
      ) : (
        <ul className="space-y-2">
          {queue.map((c) => {
            const d = daysSince(c.last_contacted_at);
            const overdue = d == null || d >= windowDays * 2;
            return (
              <li
                key={c.id}
                className="flex flex-wrap items-start gap-3 rounded-lg border bg-white p-3"
                style={{
                  borderColor: overdue
                    ? "var(--color-ldp-red)"
                    : "var(--color-ldp-line)",
                }}
              >
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
                  style={{ backgroundColor: STAGE_COLOR[c.pipeline_stage] }}
                >
                  {STAGE_LABEL[c.pipeline_stage]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
                      {c.first_name} {c.last_name}
                    </span>
                    <span className="text-[11px] text-[var(--color-ldp-ink-700)]">
                      LD{c.ld_number}
                    </span>
                    {overdue && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ldp-red)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                        <AlertTriangle aria-hidden="true" className="size-2.5" />
                        Overdue
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">
                    <span>{formatDaysSince(c.last_contacted_at)}</span>
                    {c.assigned_to_name && <span>· Owner: {c.assigned_to_name}</span>}
                    {c.interest_tags.length > 0 && (
                      <span>· {c.interest_tags.slice(0, 2).join(", ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="rounded border border-[var(--color-ldp-line)] bg-white p-1.5 text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
                      aria-label={`Call ${c.first_name}`}
                    >
                      <Phone aria-hidden="true" className="size-3.5" />
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="rounded border border-[var(--color-ldp-line)] bg-white p-1.5 text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
                      aria-label={`Email ${c.first_name}`}
                    >
                      <Mail aria-hidden="true" className="size-3.5" />
                    </a>
                  )}
                  <Link
                    href={`/my-ld/${c.ld_number}/recruiting`}
                    className="rounded bg-[var(--color-ldp-navy-800)] px-2 py-1 text-[11px] font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                  >
                    Log touch →
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
