import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchAllMembers,
  fetchCommittees,
  PRIMARY_ROLE_LABEL,
  OFFICER_ROLE_LABEL,
  OFFICER_ORDER,
  displayName,
  attendancePct,
  attendanceLabel,
  type EcMember,
} from "@/lib/db/members";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const [members, committees] = await Promise.all([fetchAllMembers(), fetchCommittees()]);
  const committeeName = new Map(committees.map((c) => [c.code, c.name]));

  const officers = members
    .filter((m) => m.officer_role != null)
    .sort(
      (a, b) =>
        OFFICER_ORDER.indexOf(a.officer_role!) - OFFICER_ORDER.indexOf(b.officer_role!)
    );
  // Exclude officers from LD Chair / LD VC groupings so they don't double-render.
  const nonOfficerMembers = members.filter((m) => m.officer_role == null);
  const byRole = groupByRole(nonOfficerMembers);

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
            {members.length} active members · {committees.length} committees · attendance tracked
            across {members[0]?.attendance_eligible ?? 10} meetings since June 2025 reorg
          </p>
        </div>

        <OfficersBlock officers={officers} committeeName={committeeName} />

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
      </main>
    </div>
  );
}

function OfficersBlock({
  officers,
  committeeName,
}: {
  officers: EcMember[];
  committeeName: Map<string, string>;
}) {
  if (officers.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
        Countywide Officers · The four who run day-to-day
      </h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {officers.map((m) => (
          <div
            key={m.id}
            className="rounded-lg border-2 border-[var(--color-ldp-navy-800)] bg-white p-4 shadow-sm"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ldp-navy-800)]">
              {OFFICER_ROLE_LABEL[m.officer_role!]}
            </div>
            <div className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
              {displayName(m)}
            </div>
            <div className="mt-3 space-y-1 text-xs text-[var(--color-ldp-ink-700)]">
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="block text-[var(--color-ldp-navy-700)] hover:underline"
                >
                  {m.email}
                </a>
              )}
              {m.phone && <div>{m.phone}</div>}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {m.ld_number && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-ldp-navy-900)] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                  LD{m.ld_number} {m.primary_role === "LD_CHAIR" ? "Chair" : m.primary_role === "LD_VC" ? "VC" : ""}
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
          </div>
        ))}
      </div>
    </section>
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
              <th className="px-4 py-2.5 text-left">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ldp-line)]">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-[#FAFBFC]">
                <td className="px-4 py-2.5 font-medium text-[var(--color-ldp-navy-900)]">
                  {displayName(m)}
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
                    {m.email ? (
                      <a
                        href={`mailto:${m.email}`}
                        className="block text-[var(--color-ldp-navy-700)] hover:underline"
                      >
                        {m.email}
                      </a>
                    ) : null}
                    {m.phone ? <div className="text-[var(--color-ldp-ink-700)]">{m.phone}</div> : null}
                    {!m.email && !m.phone ? (
                      <span className="text-[var(--color-ldp-ink-700)]">—</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs">
                  <AttendanceCell m={m} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AttendanceCell({ m }: { m: EcMember }) {
  const pct = attendancePct(m);
  if (pct == null) return <span className="text-[var(--color-ldp-ink-700)]">—</span>;
  const color =
    pct >= 90
      ? "text-emerald-700"
      : pct >= 75
        ? "text-[var(--color-ldp-navy-700)]"
        : pct >= 50
          ? "text-amber-700"
          : "text-[var(--color-ldp-red)]";
  return (
    <div>
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
