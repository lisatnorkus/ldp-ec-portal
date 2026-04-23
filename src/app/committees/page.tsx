import Link from "next/link";
import { HubShell } from "@/components/hub/HubShell";
import { fetchCommittees, fetchAllMembers, displayName } from "@/lib/db/members";
import { CommitteeCard } from "@/components/committees/CommitteeCard";

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
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Standing Committees
          </h2>
          <Link
            href="/governance"
            className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)] hover:underline"
          >
            LJCDP §26.1 →
          </Link>
        </div>
        <p className="mb-4 text-xs text-[var(--color-ldp-ink-700)]">
          Per LJCDP §26.1, the ten standing committees are <strong>Bylaws</strong>,{" "}
          <strong>Facilities</strong>, <strong>Finance</strong>, <strong>Events</strong>,{" "}
          <strong>Volunteering</strong>, <strong>Youth</strong>, <strong>Communication</strong>,{" "}
          <strong>Labor</strong>, <strong>Training</strong>, and{" "}
          <strong>Candidate Recruitment</strong>. Anything else is ad-hoc under §11.6.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {standing.map((c) => {
            const chair = c.chair_id ? byId.get(c.chair_id) : null;
            return (
              <CommitteeCard
                key={c.code}
                code={c.code}
                name={c.name}
                adhoc={false}
                adhocNote={c.adhoc_note}
                chairName={chair ? displayName(chair) : null}
                chairEmail={chair?.email ?? null}
                memberCount={c.member_codes.length}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Ad Hoc Committees
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {adhoc.map((c) => {
            const chair = c.chair_id ? byId.get(c.chair_id) : null;
            return (
              <CommitteeCard
                key={c.code}
                code={c.code}
                name={c.name}
                adhoc={true}
                adhocNote={c.adhoc_note}
                chairName={chair ? displayName(chair) : null}
                chairEmail={chair?.email ?? null}
                memberCount={c.member_codes.length}
              />
            );
          })}
        </div>
      </section>
    </HubShell>
  );
}
