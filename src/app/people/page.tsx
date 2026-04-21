import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchAllMembers,
  fetchCommittees,
  ROLE_LABEL,
  displayName,
  type EcMember,
} from "@/lib/db/members";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const [members, committees] = await Promise.all([fetchAllMembers(), fetchCommittees()]);
  const committeeName = new Map(committees.map((c) => [c.code, c.name]));

  const byRole = groupByRole(members);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            LDPEC Directory
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ldp-ink-700)]">
            {members.length} active members · {committees.length} committees
          </p>
        </div>

        <RoleGroup title="Officers" members={byRole.OFFICER ?? []} committeeName={committeeName} />
        <RoleGroup title="Affiliated voting seats" members={[...(byRole.LYD_PRES ?? []), ...(byRole.WOMENS_CLUB_PRES ?? [])]} committeeName={committeeName} />
        <RoleGroup title="LD Chairs" members={byRole.LD_CHAIR ?? []} committeeName={committeeName} />
        <RoleGroup title="LD Vice Chairs" members={byRole.LD_VC ?? []} committeeName={committeeName} />
        <RoleGroup title="At-Large Members" members={byRole.AT_LARGE ?? []} committeeName={committeeName} />
        <RoleGroup title="Committee Chairs (not on LD leadership)" members={byRole.COMMITTEE_CHAIR_ONLY ?? []} committeeName={committeeName} />
      </main>
    </div>
  );
}

function groupByRole(members: EcMember[]): Partial<Record<EcMember["primary_role"], EcMember[]>> {
  const out: Partial<Record<EcMember["primary_role"], EcMember[]>> = {};
  for (const m of members) {
    const bucket = out[m.primary_role] ?? (out[m.primary_role] = []);
    bucket.push(m);
  }
  for (const list of Object.values(out)) {
    list?.sort((a, b) => {
      if (a.ld_number && b.ld_number && a.ld_number !== b.ld_number) return a.ld_number - b.ld_number;
      return a.last_name.localeCompare(b.last_name);
    });
  }
  return out;
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
        <table className="w-full text-sm">
          <thead className="bg-[#FAFAFA] text-xs font-semibold uppercase tracking-wider text-[var(--color-ldp-ink-700)]">
            <tr>
              <th className="px-4 py-2.5 text-left">Name</th>
              <th className="px-4 py-2.5 text-left">Role</th>
              <th className="px-4 py-2.5 text-left">Committees</th>
              <th className="px-4 py-2.5 text-left">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ldp-line)]">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-[#FAFBFC]">
                <td className="px-4 py-2.5 font-medium text-[var(--color-ldp-navy-900)]">
                  {displayName(m)}
                </td>
                <td className="px-4 py-2.5 text-[var(--color-ldp-ink-700)]">
                  {ROLE_LABEL[m.primary_role]}
                  {m.ld_number ? <span className="ml-1 text-xs">· LD{m.ld_number}</span> : null}
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--color-ldp-ink-700)]">
                  {renderCommittees(m, committeeName)}
                </td>
                <td className="px-4 py-2.5 text-xs">
                  {m.email ? (
                    <a href={`mailto:${m.email}`} className="text-[var(--color-ldp-navy-700)] hover:underline">
                      {m.email}
                    </a>
                  ) : (
                    <span className="text-[var(--color-ldp-ink-700)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function renderCommittees(m: EcMember, committeeName: Map<string, string>) {
  const chairs = m.committee_chair_codes.map((c) => committeeName.get(c) ?? c);
  const members = m.committee_member_codes.map((c) => committeeName.get(c) ?? c);
  const parts: string[] = [];
  if (chairs.length) parts.push(`Chair: ${chairs.join(", ")}`);
  if (members.length) parts.push(members.join(", "));
  return parts.length ? parts.join(" · ") : <span>—</span>;
}
