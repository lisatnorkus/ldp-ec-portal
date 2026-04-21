import { PageMasthead } from "@/components/nav/PageMasthead";
import { fetchAllMembers, fetchCommittees } from "@/lib/db/members";
import { DirectoryClient } from "@/components/people/DirectoryClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Directory" };

export default async function PeoplePage() {
  const [members, committees] = await Promise.all([fetchAllMembers(), fetchCommittees()]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageMasthead
        eyebrow="Directory"
        title="LDPEC Directory."
        subtitle={`${members.length} active members · ${committees.length} committees · attendance tracked across ${members[0]?.attendance_eligible ?? 10} meetings since the June 2025 reorg.`}
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <DirectoryClient
          members={members}
          committees={committees.map((c) => ({ code: c.code, name: c.name }))}
        />
      </main>
    </div>
  );
}
