import Link from "next/link";
import { Folder, Mail } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { fetchCommittees, fetchAllMembers, displayName } from "@/lib/db/members";

export const dynamic = "force-dynamic";
export const metadata = { title: "Committees" };

export default async function CommitteesIndexPage() {
  const [committees, members] = await Promise.all([fetchCommittees(), fetchAllMembers()]);
  const byId = new Map(members.map((m) => [m.id, m]));

  const standing = committees.filter((c) => c.type === "STANDING");
  const adhoc = committees.filter((c) => c.type === "AD_HOC");

  return (
    <HubShell
      eyebrow="Committees"
      title="LDP Committees."
      subtitle={`${standing.length} standing · ${adhoc.length} ad hoc · each chaired by an EC member.`}
    >
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Standing Committees
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {standing.map((c) => (
              <CommitteeCard key={c.code} committee={c} chair={c.chair_id ? byId.get(c.chair_id) : null} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
            Ad Hoc Committees
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {adhoc.map((c) => (
              <CommitteeCard
                key={c.code}
                committee={c}
                chair={c.chair_id ? byId.get(c.chair_id) : null}
                adhoc
              />
            ))}
          </div>
        </section>
    </HubShell>
  );
}

function CommitteeCard({
  committee,
  chair,
  adhoc = false,
}: {
  committee: Awaited<ReturnType<typeof fetchCommittees>>[number];
  chair: Awaited<ReturnType<typeof fetchAllMembers>>[number] | null | undefined;
  adhoc?: boolean;
}) {
  const chairName = chair ? displayName(chair) : null;
  const memberCount = committee.member_codes.length;
  return (
    // Whole card links to detail via the absolute-inset anchor. Inline
    // mailto anchor sits above it (relative z-10) so clicking 'Email
    // chair' triggers the mailto, not the detail navigation.
    <div
      className={`group relative flex flex-col rounded-lg border bg-white p-4 transition-colors hover:border-[var(--color-ldp-navy-700)] hover:shadow-sm ${
        adhoc ? "border-[var(--color-ldp-gold)]" : "border-[var(--color-ldp-line)]"
      }`}
    >
      <Link
        href={`/committees/${committee.code.toLowerCase()}`}
        className="absolute inset-0 z-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)]"
        aria-label={`Open ${committee.name} committee detail`}
      />
      <div className="relative z-10 pointer-events-none">
        {adhoc && (
          <span className="mb-2 inline-flex w-fit items-center rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ldp-navy-900)]">
            Ad hoc
          </span>
        )}
        <div className="text-base font-semibold text-[var(--color-ldp-navy-900)]">
          {committee.name}
        </div>
        <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
          Chair: <span className="font-medium">{chairName ?? "—"}</span>
          {memberCount > 0 && (
            <span>
              {" "}
              · {memberCount} member{memberCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        {committee.adhoc_note && (
          <p className="mt-2 text-xs italic text-[var(--color-ldp-ink-700)]">
            {committee.adhoc_note}
          </p>
        )}
      </div>
      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-3 text-xs">
        {chair?.email && (
          <a
            href={`mailto:${chair.email}?subject=${encodeURIComponent(`Interested in ${committee.name} Committee`)}`}
            className="inline-flex items-center gap-1 rounded border border-[var(--color-ldp-line)] bg-white px-2 py-1 font-medium text-[var(--color-ldp-navy-700)] hover:border-[var(--color-ldp-navy-700)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail aria-hidden="true" className="size-3" />
            Email chair
          </a>
        )}
        <span className="inline-flex items-center gap-1 text-[var(--color-ldp-navy-700)] group-hover:underline">
          <Folder className="size-3.5" /> View detail →
        </span>
      </div>
    </div>
  );
}
