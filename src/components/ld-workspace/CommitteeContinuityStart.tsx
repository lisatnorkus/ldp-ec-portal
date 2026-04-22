"use client";

import { useState, useTransition } from "react";
import { FileText } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import { startCommitteePackage } from "./committee-continuity-actions";

export function CommitteeContinuityStart({ committeeCode }: { committeeCode: string }) {
  const { profile, hydrated } = useUserProfile();
  const [cycle, setCycle] = useState("2025-2027");
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canStart = hydrated && !!profile.display_name;

  function begin() {
    setErr(null);
    startTransition(async () => {
      const res = await startCommitteePackage(
        committeeCode,
        cycle.trim() || "current",
        {
          name: profile.display_name ?? "",
          role: profile.role,
          ld: profile.ld_number,
        }
      );
      if (!res.ok) setErr(res.error);
    });
  }

  return (
    <div className="rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-6">
      <div className="flex items-start gap-3">
        <FileText aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-[var(--color-ldp-navy-800)]" />
        <div>
          <h2 className="text-lg font-bold text-[var(--color-ldp-navy-900)]">
            No handoff package started yet
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
            A committee handoff package is the record of your term as chair — state of the
            committee, scope and cadence, who&apos;s bringing what to the group, open-task
            dispositions, and a personal message to your successor. Locks permanently on submit
            so continuity survives every chair rotation.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                Cycle label
              </span>
              <input
                type="text"
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                placeholder="2025-2027"
                className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
              />
            </label>
            <button
              type="button"
              onClick={begin}
              disabled={isPending || !canStart}
              className="rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
            >
              {isPending ? "Starting…" : "Begin handoff package"}
            </button>
          </div>
          {!canStart && (
            <p className="mt-3 text-xs text-[var(--color-ldp-ink-700)]">
              Set your name on the dashboard first so the package can record who authored it.
            </p>
          )}
          {err && <p className="mt-3 text-xs text-[var(--color-ldp-red)]">{err}</p>}
        </div>
      </div>
    </div>
  );
}
