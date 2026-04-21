import Link from "next/link";
import { ArrowLeft, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCommittees, fetchAllMembers, displayName } from "@/lib/db/members";

export const dynamic = "force-dynamic";
export const metadata = { title: "Committees" };

export default async function CommitteesIndexPage() {
  const [committees, members] = await Promise.all([fetchCommittees(), fetchAllMembers()]);
  const byId = new Map(members.map((m) => [m.id, m]));

  const standing = committees.filter((c) => c.type === "STANDING");
  const adhoc = committees.filter((c) => c.type === "AD_HOC");

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            LDP Committees
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ldp-ink-700)]">
            {standing.length} standing · {adhoc.length} ad hoc · each chaired by an EC member
          </p>
        </div>

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
      </main>
    </div>
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
  return (
    <Link
      href={`/committees/${committee.code.toLowerCase()}`}
      className={`group flex flex-col rounded-lg border bg-white p-4 transition-colors hover:border-[var(--color-ldp-navy-700)] hover:shadow-sm ${
        adhoc ? "border-[var(--color-ldp-gold)]" : "border-[var(--color-ldp-line)]"
      }`}
    >
      {adhoc && (
        <span className="mb-2 inline-flex w-fit items-center rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ldp-navy-900)]">
          Ad hoc
        </span>
      )}
      <div className="text-base font-semibold text-[var(--color-ldp-navy-900)]">{committee.name}</div>
      <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
        Chair: <span className="font-medium">{chair ? displayName(chair) : "—"}</span>
        {committee.member_codes.length > 0 && (
          <span> · {committee.member_codes.length} member{committee.member_codes.length === 1 ? "" : "s"}</span>
        )}
      </div>
      {committee.adhoc_note && (
        <p className="mt-2 text-xs italic text-[var(--color-ldp-ink-700)]">{committee.adhoc_note}</p>
      )}
      {committee.drive_folder_url && (
        <div className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--color-ldp-navy-700)] group-hover:underline">
          <Folder className="size-3.5" /> View full detail →
        </div>
      )}
    </Link>
  );
}
