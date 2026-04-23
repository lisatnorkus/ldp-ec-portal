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
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Standing Committees
        </h2>
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
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
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
