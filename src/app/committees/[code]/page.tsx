import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Folder, HeartHandshake, Mail, Users } from "lucide-react";
import { DriveAccessNote } from "@/components/drive/DriveAccessNote";
import { Button } from "@/components/ui/button";
import { HubShell } from "@/components/hub/HubShell";
import { fetchCommitteeByCode } from "@/lib/db/committees";
import { fetchAllMembers, displayName } from "@/lib/db/members";
import {
  fetchCommitteeNotes,
  fetchCommitteeTasks,
} from "@/lib/db/committee-workspace";
import { CommitteeNotes } from "@/components/ld-workspace/CommitteeNotes";
import { CommitteeTasks } from "@/components/ld-workspace/CommitteeTasks";
import type { Assignable } from "@/lib/db/ld-tasks";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const c = await fetchCommitteeByCode(code);
  return { title: c ? `${c.name} Committee` : "Committee not found" };
}

export default async function CommitteeDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const committee = await fetchCommitteeByCode(code);
  if (!committee) notFound();

  const [members, notes, tasks] = await Promise.all([
    fetchAllMembers(),
    fetchCommitteeNotes(committee.code),
    fetchCommitteeTasks(committee.code),
  ]);
  const byId = new Map(members.map((m) => [m.id, m]));
  const chair = committee.chair_id ? byId.get(committee.chair_id) : null;

  // Resolve member_codes (names) against ec_members. Try exact display-name
  // match first, then fall back to first-token + last-token so casual names
  // in member_codes ("Lisa Norkus") still resolve to formal records
  // ("Lisa Tanner Norkus") — avoids losing LD chips on fuzzy matches.
  const memberMatches = committee.member_codes.map((fullName) => {
    const exact = members.find((m) => displayName(m) === fullName);
    if (exact) return { fullName, member: exact };
    const tokens = fullName.trim().split(/\s+/);
    if (tokens.length >= 2) {
      const first = tokens[0].toLowerCase();
      const last = tokens[tokens.length - 1].toLowerCase();
      const fuzzy = members.find((m) => {
        const mFirst = (m.preferred_name || m.first_name).toLowerCase();
        const mLast = m.last_name.toLowerCase();
        return mFirst === first && (mLast === last || mLast.endsWith(" " + last) || mLast.startsWith(last + " "));
      });
      if (fuzzy) return { fullName, member: fuzzy };
    }
    return { fullName, member: undefined };
  });

  // Assignables for committee tasks: resolved members who have emails
  // or known roles; plus the chair at the top with role flagged.
  const assignables: Assignable[] = [];
  if (chair) {
    assignables.push({
      name: displayName(chair),
      role: "Committee Chair",
    });
  }
  for (const { fullName, member } of memberMatches) {
    if (chair && member?.id === chair.id) continue;
    const label = member?.ld_number ? `Member · LD${member.ld_number}` : "Member";
    assignables.push({ name: fullName, role: label });
  }

  // Collect member emails for the "Email all members" mailto. Fall back
  // to unresolved names silently (some member_codes don't match an
  // ec_members row yet).
  const memberEmails = memberMatches
    .map(({ member }) => member?.email)
    .filter((e): e is string => !!e);
  const chairEmail = chair?.email ?? null;
  const allEmails = Array.from(
    new Set([
      ...(chairEmail ? [chairEmail] : []),
      ...memberEmails,
    ])
  );
  const emailAllHref =
    allEmails.length > 0
      ? `mailto:${allEmails.join(",")}?subject=${encodeURIComponent(`[${committee.name} Committee]`)}`
      : null;

  // Activity summary counts
  const openTasks = tasks.filter(
    (t) => t.status !== "DONE" && t.status !== "DEFERRED"
  ).length;

  return (
    <HubShell
      eyebrow={committee.type === "AD_HOC" ? "Ad hoc committee" : "Standing committee"}
      title={`${committee.name} Committee.`}
      maxWidthClass="max-w-4xl"
      actions={
        emailAllHref ? (
          <Button asChild variant="ldp" size="sm" className="border border-white/20 bg-white/10 hover:bg-white/20">
            <a href={emailAllHref}>
              <Mail aria-hidden="true" className="mr-1 size-3.5" />
              Email all members
            </a>
          </Button>
        ) : undefined
      }
    >
        {/* Activity summary — at-a-glance health of the committee */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryTile
            icon={<Users className="size-4" />}
            label="Members"
            value={String(memberMatches.length + (chair ? 1 : 0))}
            color="var(--color-ldp-navy-800)"
          />
          <SummaryTile
            icon={<Mail className="size-4" />}
            label="Contactable"
            value={String(allEmails.length)}
            sub="with email on file"
            color="#0891b2"
          />
          <SummaryTile
            icon={<Folder className="size-4" />}
            label="Open tasks"
            value={String(openTasks)}
            color="var(--color-ldp-red)"
          />
          <SummaryTile
            icon={<ExternalLink className="size-4" />}
            label="Notes"
            value={String(notes.length)}
            color="var(--color-ldp-gold)"
          />
        </div>

        <div className="mb-6">
          {chair && (
            <div className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                Chair
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                <Link
                  href={`/people/${chair.id}`}
                  className="text-base font-bold text-[var(--color-ldp-navy-900)] hover:underline"
                >
                  {displayName(chair)}
                </Link>
                {committee.chair_title_override && (
                  <span className="text-xs text-[var(--color-ldp-ink-700)]">
                    ({committee.chair_title_override})
                  </span>
                )}
                {chair.email && (
                  <a
                    href={`mailto:${chair.email}?subject=${encodeURIComponent(`Interested in ${committee.name} Committee`)}`}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                  >
                    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Email chair
                  </a>
                )}
              </div>
              {chair.email && (
                <div className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">
                  <a href={`mailto:${chair.email}`} className="hover:underline">
                    {chair.email}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {committee.adhoc_note && (
          <div className="mb-6 rounded-lg border-l-4 border-[var(--color-ldp-gold)] bg-white p-4 text-sm italic text-[var(--color-ldp-ink-700)]">
            {committee.adhoc_note}
          </div>
        )}

        {committee.code === "VOLUNTEERING" && (
          <div className="mb-6 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-4">
            <div className="flex items-start gap-3">
              <HeartHandshake
                aria-hidden="true"
                className="mt-0.5 size-5 text-[var(--color-ldp-navy-800)]"
              />
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
                  Volunteer file
                </div>
                <h3 className="mt-0.5 text-base font-bold text-[var(--color-ldp-navy-900)]">
                  Roster, intake, and activity log for everyone who wants to help.
                </h3>
                <p className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">
                  Track interests, availability, and what they&apos;ve actually done. Review new
                  sign-ups, flag people who&apos;ve gone quiet.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/volunteers"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                  >
                    Open volunteer roster →
                  </Link>
                  <Link
                    href="/volunteers/new"
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[#FAFBFC]"
                  >
                    Add a volunteer
                  </Link>
                  <Link
                    href="/volunteers/signup"
                    className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)]"
                  >
                    Public signup form
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <CommitteeTasks committeeCode={committee.code} tasks={tasks} assignables={assignables} />
        <CommitteeNotes committeeCode={committee.code} notes={notes} />

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
                    {member ? (
                      <Link
                        href={`/people/${member.id}`}
                        className="font-medium text-[var(--color-ldp-navy-900)] hover:underline"
                      >
                        {fullName}
                      </Link>
                    ) : (
                      <span className="font-medium text-[var(--color-ldp-navy-900)]">{fullName}</span>
                    )}
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

        <div className="mt-8 border-t border-[var(--color-ldp-line)] pt-6">
          <div className="flex flex-wrap gap-3">
            {committee.drive_folder_url && (
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
            )}
            <Button asChild variant="outline" size="lg">
              <Link
                href={`/committees/${committee.code.toLowerCase()}/continuity`}
                className="inline-flex items-center gap-2"
              >
                Continuity & handoff →
              </Link>
            </Button>
          </div>
          {committee.drive_folder_url && <DriveAccessNote className="mt-3" />}
        </div>
    </HubShell>
  );
}

function SummaryTile({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-lg border bg-white p-3"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div
        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-[var(--color-ldp-navy-900)]">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-[var(--color-ldp-ink-700)]">{sub}</div>}
    </div>
  );
}
