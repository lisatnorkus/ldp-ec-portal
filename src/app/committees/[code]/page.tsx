import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchCommitteeByCode } from "@/lib/db/committees";
import { fetchAllMembers, displayName } from "@/lib/db/members";

export const dynamic = "force-dynamic";

export default async function CommitteeDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const committee = await fetchCommitteeByCode(code);
  if (!committee) notFound();

  const members = await fetchAllMembers();
  const byId = new Map(members.map((m) => [m.id, m]));
  const chair = committee.chair_id ? byId.get(committee.chair_id) : null;

  // Resolve member_codes (names) against ec_members by full name.
  const memberMatches = committee.member_codes.map((fullName) => {
    const match = members.find((m) => displayName(m) === fullName);
    return { fullName, member: match };
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/committees"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft className="size-4" /> All Committees
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6">
          {committee.type === "AD_HOC" && (
            <span className="mb-2 inline-flex items-center rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ldp-navy-900)]">
              Ad hoc
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            {committee.name} Committee
          </h1>
          {chair && (
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
              <span className="font-semibold">Chair:</span>{" "}
              <Link
                href="/people"
                className="text-[var(--color-ldp-navy-700)] hover:underline"
              >
                {displayName(chair)}
              </Link>
              {committee.chair_title_override && (
                <span className="ml-1">({committee.chair_title_override})</span>
              )}
              {chair.email && <span className="ml-2">· <a href={`mailto:${chair.email}`} className="text-[var(--color-ldp-navy-700)] hover:underline">{chair.email}</a></span>}
            </p>
          )}
        </div>

        {committee.adhoc_note && (
          <div className="mb-6 rounded-lg border-l-4 border-[var(--color-ldp-gold)] bg-white p-4 text-sm italic text-[var(--color-ldp-ink-700)]">
            {committee.adhoc_note}
          </div>
        )}

        {committee.description_md && (
          <section className="mb-8">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Responsibilities
            </h2>
            <div className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-5 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
              {committee.description_md}
            </div>
          </section>
        )}

        {committee.workflow.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              How it works
            </h2>
            <ol className="space-y-2 rounded-lg border border-[var(--color-ldp-line)] bg-white p-5">
              {committee.workflow.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-900)] text-[11px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[var(--color-ldp-ink-900)]">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {committee.docs.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Key documents
            </h2>
            <div className="space-y-2">
              {committee.docs.map((d, i) => (
                <a
                  key={i}
                  href={d.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 transition-colors hover:border-[var(--color-ldp-navy-700)]"
                >
                  <ExternalLink className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-navy-700)]" />
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">{d.name}</div>
                    {d.howto && <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">{d.howto}</div>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {memberMatches.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Members · {memberMatches.length}
            </h2>
            <div className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-2">
              <ul className="grid grid-cols-1 gap-1 md:grid-cols-2">
                {memberMatches.map(({ fullName, member }) => (
                  <li key={fullName} className="rounded px-3 py-1.5 text-sm hover:bg-[#FAFBFC]">
                    <span className="font-medium text-[var(--color-ldp-navy-900)]">{fullName}</span>
                    {member?.ld_number && (
                      <span className="ml-1 text-xs text-[var(--color-ldp-ink-700)]">
                        · LD{member.ld_number}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {committee.drive_folder_url && (
          <div className="mt-8 border-t border-[var(--color-ldp-line)] pt-6">
            <Button asChild variant="ldp" size="lg">
              <a
                href={committee.drive_folder_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Folder className="size-4" /> Open committee Drive folder
              </a>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
