import { HubShell } from "@/components/hub/HubShell";
import { fetchAllMembers, fetchCommittees } from "@/lib/db/members";
import { DirectoryClient } from "@/components/people/DirectoryClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Directory" };

export default async function PeoplePage() {
  const [members, committees] = await Promise.all([fetchAllMembers(), fetchCommittees()]);

  return (
    <HubShell
      eyebrow="Directory"
      title="LDPEC Directory."
      subtitle={`${members.length} active members · ${committees.length} committees · attendance tracked across ${members[0]?.attendance_eligible ?? 10} meetings since the June 2025 reorg.`}
    >
      <DirectoryClient
        members={members}
        committees={committees.map((c) => ({ code: c.code, name: c.name }))}
      />
    </HubShell>
  );
}
