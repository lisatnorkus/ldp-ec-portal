import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import {
  fetchActivePackage,
  fetchPastPackages,
} from "@/lib/db/ld-continuity";
import { fetchTasksByLd } from "@/lib/db/ld-tasks";
import { fetchContactsByLd } from "@/lib/db/ld-contacts";
import { fetchPrecinctsByLd } from "@/lib/db/precincts";
import { fetchPcsForLd } from "@/lib/db/precinct-captains";
import { ContinuityBuilder } from "@/components/ld-workspace/ContinuityBuilder";
import { ContinuityStart } from "@/components/ld-workspace/ContinuityStart";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  return { title: `LD${number} · Continuity` };
}

export default async function ContinuityPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number: numberParam } = await params;
  const ld_number = Number(numberParam);
  if (Number.isNaN(ld_number)) notFound();

  const [pkg, pastPackages, openTasks, contacts, precincts, pcs] = await Promise.all([
    fetchActivePackage(ld_number),
    fetchPastPackages(ld_number),
    fetchTasksByLd(ld_number),
    fetchContactsByLd(ld_number),
    fetchPrecinctsByLd(ld_number),
    fetchPcsForLd(ld_number),
  ]);

  const pcsByPrecinct = new Map<string, number>();
  for (const pc of pcs) {
    pcsByPrecinct.set(pc.precinct_code, (pcsByPrecinct.get(pc.precinct_code) ?? 0) + 1);
  }
  const precinctsForBuilder = precincts.map((p) => {
    const code = p.precinct.match(/\bL\d+\s*$/i)?.[0]?.toUpperCase() ?? p.precinct;
    return {
      precinct: p.precinct,
      strategy: p.strategy,
      total_voters: p.total_voters,
      d_margin_pct: p.d_margin_pct,
      pcCount: pcsByPrecinct.get(code) ?? 0,
    };
  });
  const openTasksOnly = openTasks.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");

  return (
    <HubShell
      eyebrow={`LD${ld_number} · Continuity`}
      title="Handoff package."
      subtitle="The record this LD carries forward. Everything you write here survives your term."
      maxWidthClass="max-w-4xl"
    >
      <div className="mb-5">
        <Link
          href={`/my-ld/${ld_number}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to LD{ld_number}
        </Link>
      </div>

      {pkg ? (
        <ContinuityBuilder
          ldNumber={ld_number}
          pkg={pkg}
          openTasks={openTasksOnly}
          contacts={contacts}
          precincts={precinctsForBuilder}
        />
      ) : (
        <ContinuityStart ldNumber={ld_number} />
      )}

      {pastPackages.length > 0 && (
        <section className="mt-12 border-t border-[var(--color-ldp-line)] pt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Past handoff packages
          </h2>
          <ul className="space-y-2">
            {pastPackages.map((p) => (
              <li key={p.id} className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm">
                <div className="font-semibold text-[var(--color-ldp-navy-900)]">
                  Cycle {p.cycle}
                </div>
                <div className="text-xs text-[var(--color-ldp-ink-700)]">
                  Outgoing: {p.outgoing_chair_name ?? "—"}
                  {p.locked_at && ` · locked ${new Date(p.locked_at).toLocaleDateString()}`}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </HubShell>
  );
}
