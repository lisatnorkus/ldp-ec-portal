import Link from "next/link";
import { UserPlus, ClipboardCheck, AlertCircle } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { fetchAllVolunteers, filterLapsedRisk } from "@/lib/db/volunteers";
import { VolunteerRoster } from "@/components/volunteers/VolunteerRoster";

export const dynamic = "force-dynamic";
export const metadata = { title: "Volunteers" };

export default async function VolunteersPage() {
  const volunteers = await fetchAllVolunteers();

  const summary = {
    total: volunteers.length,
    active: volunteers.filter((v) => v.status === "ACTIVE").length,
    lapsed: volunteers.filter((v) => v.status === "LAPSED").length,
    paused: volunteers.filter((v) => v.status === "PAUSED").length,
    doNotContact: volunteers.filter((v) => v.status === "DO_NOT_CONTACT").length,
    newSignups: volunteers.filter(
      (v) => v.source === "SIGNUP_FORM" && v.last_active_at == null
    ).length,
  };

  const lapsedRisk = filterLapsedRisk(volunteers, 60);

  return (
    <HubShell
      eyebrow="Volunteers · Jessica's file"
      title="Who wants to help."
      subtitle="The Volunteering Committee's roster. Track what each person likes to do, what they've actually done, and who's gone quiet. Sign-up-form entries land here for Jessica to review."
      maxWidthClass="max-w-6xl"
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/volunteers/signup"
            className="rounded border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
          >
            Public signup link
          </Link>
          <Link
            href="/volunteers/new"
            className="inline-flex items-center gap-1.5 rounded bg-[var(--color-ldp-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:brightness-110"
          >
            <UserPlus aria-hidden="true" className="size-3.5" />
            Add volunteer
          </Link>
        </div>
      }
    >
      {/* Summary tiles */}
      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Tile label="Total" value={summary.total} color="var(--color-ldp-navy-900)" />
        <Tile label="Active" value={summary.active} color="#059669" />
        <Tile label="Lapsed" value={summary.lapsed} color="#F59E0B" />
        <Tile label="Paused" value={summary.paused} color="#94a3b8" />
        <Tile label="DNC" value={summary.doNotContact} color="var(--color-ldp-red)" />
      </section>

      {/* New signups queue */}
      {summary.newSignups > 0 && (
        <section className="mb-6 rounded-xl border-2 border-[var(--color-ldp-gold)] bg-[#FEF9E7] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            <ClipboardCheck aria-hidden="true" className="size-4" />
            New signups to review · {summary.newSignups}
          </div>
          <p className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">
            These people signed themselves up and haven&apos;t been contacted yet. Filter by
            &ldquo;Never logged&rdquo; in the roster to find them.
          </p>
        </section>
      )}

      {/* Lapsed risk queue */}
      {lapsedRisk.length > 0 && (
        <section className="mb-6 rounded-xl border border-[var(--color-ldp-line)] bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              <AlertCircle aria-hidden="true" className="size-4 text-[var(--color-ldp-gold)]" />
              Haven&apos;t heard from them · 60d+ quiet · {lapsedRisk.length}
            </div>
          </div>
          <ul className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {lapsedRisk.slice(0, 9).map((v) => (
              <li key={v.id}>
                <Link
                  href={`/volunteers/${v.id}`}
                  className="flex items-center justify-between gap-2 rounded border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-2 text-sm hover:border-[var(--color-ldp-navy-700)]"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-medium text-[var(--color-ldp-navy-900)]">
                      {v.preferred_name?.trim() || v.first_name} {v.last_name}
                    </span>
                    {v.home_ld != null && (
                      <span className="ml-1 text-[10px] text-[var(--color-ldp-ink-700)]">
                        LD{v.home_ld}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-[10px] text-[var(--color-ldp-ink-700)]">
                    {v.last_active_at
                      ? relativeDays(v.last_active_at)
                      : "never"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {lapsedRisk.length > 9 && (
            <div className="mt-2 text-[11px] text-[var(--color-ldp-ink-700)]">
              +{lapsedRisk.length - 9} more — filter the roster by status &ldquo;Active&rdquo; and sort by last-active.
            </div>
          )}
        </section>
      )}

      {/* Full roster */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Full roster
        </h2>
        <VolunteerRoster volunteers={volunteers} />
      </section>

      <p className="mt-6 text-[11px] italic text-[var(--color-ldp-ink-700)]">
        Privacy: Volunteering Committee members and county officers see full contact info. LD
        chairs and vice chairs see their LD&apos;s volunteers with contact info. Other EC members
        see aggregate counts only. (Enforced when magic-link auth lands; preview-mode grants full
        access behind the passphrase.)
      </p>
    </HubShell>
  );
}

function relativeDays(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}

function Tile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-lg border bg-white p-3"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-[var(--color-ldp-navy-900)]">{value}</div>
    </div>
  );
}
