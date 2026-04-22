import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { fetchCommitteeByCode } from "@/lib/db/committees";
import { fetchAllMembers, displayName } from "@/lib/db/members";
import { fetchCommitteeTasks } from "@/lib/db/committee-workspace";
import {
  fetchActiveCommitteePackage,
  fetchPastCommitteePackages,
} from "@/lib/db/committee-continuity";
import { CommitteeContinuityBuilder } from "@/components/ld-workspace/CommitteeContinuityBuilder";
import { CommitteeContinuityStart } from "@/components/ld-workspace/CommitteeContinuityStart";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const c = await fetchCommitteeByCode(code);
  return { title: c ? `${c.name} · Continuity` : "Committee not found" };
}

export default async function CommitteeContinuityPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const committee = await fetchCommitteeByCode(code);
  if (!committee) notFound();

  const [members, tasks, pkg, pastPackages] = await Promise.all([
    fetchAllMembers(),
    fetchCommitteeTasks(committee.code),
    fetchActiveCommitteePackage(committee.code),
    fetchPastCommitteePackages(committee.code),
  ]);

  const byId = new Map(members.map((m) => [m.id, m]));
  const chair = committee.chair_id ? byId.get(committee.chair_id) : null;

  // Resolve members for the builder (Chair + every resolved member).
  const memberRows: { name: string; role: string }[] = [];
  if (chair) memberRows.push({ name: displayName(chair), role: "Committee Chair" });
  for (const fullName of committee.member_codes) {
    const exact = members.find((m) => displayName(m) === fullName);
    let resolved = exact;
    if (!resolved) {
      const tokens = fullName.trim().split(/\s+/);
      if (tokens.length >= 2) {
        const first = tokens[0].toLowerCase();
        const last = tokens[tokens.length - 1].toLowerCase();
        resolved = members.find((m) => {
          const mFirst = (m.preferred_name || m.first_name).toLowerCase();
          const mLast = m.last_name.toLowerCase();
          return (
            mFirst === first &&
            (mLast === last || mLast.endsWith(" " + last) || mLast.startsWith(last + " "))
          );
        });
      }
    }
    if (resolved && chair && resolved.id === chair.id) continue;
    const roleLabel = resolved?.ld_number ? `Member · LD${resolved.ld_number}` : "Member";
    memberRows.push({ name: fullName, role: roleLabel });
  }

  const openTasks = tasks.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS");

  return (
    <HubShell
      eyebrow={`${committee.name} Committee · Continuity`}
      title="Handoff package."
      subtitle="The record this committee carries forward. Everything you write here survives your term."
      maxWidthClass="max-w-4xl"
    >
      <div className="mb-5">
        <Link
          href={`/committees/${committee.code.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" /> Back to {committee.name} Committee
        </Link>
      </div>

      {pkg ? (
        <CommitteeContinuityBuilder
          committeeCode={committee.code}
          pkg={pkg}
          openTasks={openTasks}
          members={memberRows}
        />
      ) : (
        <CommitteeContinuityStart committeeCode={committee.code} />
      )}

      {pastPackages.length > 0 && (
        <section className="mt-12 border-t border-[var(--color-ldp-line)] pt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Past handoff packages
          </h2>
          <ul className="space-y-2">
            {pastPackages.map((p) => (
              <li
                key={p.id}
                className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm"
              >
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
