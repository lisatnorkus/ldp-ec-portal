import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAllMembers, fetchCommittees } from "@/lib/db/members";
import { DirectoryClient } from "@/components/people/DirectoryClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Directory" };

export default async function PeoplePage() {
  const [members, committees] = await Promise.all([fetchAllMembers(), fetchCommittees()]);

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

        <DirectoryClient
          members={members}
          committees={committees.map((c) => ({ code: c.code, name: c.name }))}
        />
      </main>
    </div>
  );
}
