import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import {
  fetchCommittees,
  PRIMARY_ROLE_LABEL,
  OFFICER_ROLE_LABEL,
  displayName,
  attendancePct,
  attendanceLabel,
  type EcMember,
} from "@/lib/db/members";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await fetchMember(id);
  return { title: member ? displayName(member) : "Member not found" };
}

async function fetchMember(id: string): Promise<EcMember | null> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ec_members")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return null;
  return data as EcMember | null;
}

async function fetchLdForMember(ld_number: number | null) {
  if (ld_number == null) return null;
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("legislative_districts")
    .select("number, metro_council_overlap, state_senate_overlap, us_house_overlap")
    .eq("number", ld_number)
    .maybeSingle();
  return data as {
    number: number;
    metro_council_overlap: number[];
    state_senate_overlap: number[];
    us_house_overlap: number[];
  } | null;
}

async function fetchTransitionsFor(id: string, name: string) {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("transitions")
    .select("*")
    .or(`successor_id.eq.${id},previous_holder_name.eq.${name.replace(/'/g, "''")}`)
    .order("departed_date", { ascending: false });
  return data as Array<{
    seat_code: string;
    previous_holder_name: string | null;
    successor_name: string | null;
    status: string;
    departed_date: string | null;
    elected_date: string | null;
  }> | null;
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await fetchMember(id);
  if (!member) notFound();

  const [committees, ld, transitions] = await Promise.all([
    fetchCommittees(),
    fetchLdForMember(member.ld_number),
    fetchTransitionsFor(id, displayName(member)),
  ]);
  const committeeName = new Map(committees.map((c) => [c.code, c.name]));

  const chairs = member.committee_chair_codes.map((c) => ({
    code: c,
    name: committeeName.get(c) ?? c,
  }));
  const members = member.committee_member_codes.map((c) => ({
    code: c,
    name: committeeName.get(c) ?? c,
  }));
  const attPct = attendancePct(member);

  return (
    <HubShell
      eyebrow={PRIMARY_ROLE_LABEL[member.primary_role]}
      title={`${displayName(member)}.`}
      maxWidthClass="max-w-4xl"
    >
        <div className="mb-8 rounded-xl border border-[var(--color-ldp-line)] bg-white p-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[var(--color-ldp-navy-900)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
                  {PRIMARY_ROLE_LABEL[member.primary_role]}
                </span>
                {member.officer_role && (
                  <span className="inline-flex items-center rounded-full bg-[var(--color-ldp-gold)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-ldp-navy-900)]">
                    {OFFICER_ROLE_LABEL[member.officer_role]}
                  </span>
                )}
                {member.ld_number && (
                  <Link
                    href={`/my-ld/${member.ld_number}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--color-ldp-navy-700)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-ldp-navy-700)] hover:bg-[var(--color-ldp-navy-700)] hover:text-white"
                  >
                    <MapPin className="size-3" /> LD{member.ld_number}
                  </Link>
                )}
              </div>
            </div>
            {attPct != null && (
              <div className="shrink-0 rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFAFA] p-3 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  Attendance
                </div>
                <div
                  className={`text-2xl font-bold ${
                    attPct >= 90
                      ? "text-emerald-700"
                      : attPct >= 75
                        ? "text-[var(--color-ldp-navy-700)]"
                        : attPct >= 50
                          ? "text-amber-700"
                          : "text-[var(--color-ldp-red)]"
                  }`}
                >
                  {attPct}%
                </div>
                <div className="text-[10px] text-[var(--color-ldp-ink-700)]">
                  {attendanceLabel(member)} meetings
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-1.5 text-sm">
            {member.email && (
              <div className="flex items-center gap-2 text-[var(--color-ldp-ink-900)]">
                <Mail className="size-4 text-[var(--color-ldp-navy-700)]" />
                <a href={`mailto:${member.email}`} className="hover:underline text-[var(--color-ldp-navy-700)]">
                  {member.email}
                </a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2 text-[var(--color-ldp-ink-900)]">
                <Phone className="size-4 text-[var(--color-ldp-navy-700)]" />
                <a href={`tel:${member.phone.replace(/\D/g, "")}`} className="hover:underline text-[var(--color-ldp-navy-700)]">
                  {member.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {ld && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Legislative District {ld.number}
            </h2>
            <div className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 text-sm">
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-[var(--color-ldp-ink-900)]">
                {ld.state_senate_overlap.length > 0 && (
                  <div>
                    <span className="text-xs text-[var(--color-ldp-ink-700)]">State Senate: </span>
                    {ld.state_senate_overlap.join(", ")}
                  </div>
                )}
                {ld.metro_council_overlap.length > 0 && (
                  <div>
                    <span className="text-xs text-[var(--color-ldp-ink-700)]">Metro Council: </span>
                    {ld.metro_council_overlap.join(", ")}
                  </div>
                )}
                {ld.us_house_overlap.length > 0 && (
                  <div>
                    <span className="text-xs text-[var(--color-ldp-ink-700)]">US House: </span>
                    {ld.us_house_overlap.join(", ")}
                  </div>
                )}
              </div>
              <Link
                href={`/my-ld/${ld.number}`}
                className="mt-3 inline-flex text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline"
              >
                Full LD page →
              </Link>
            </div>
          </section>
        )}

        {(chairs.length > 0 || members.length > 0) && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Committee work
            </h2>
            <div className="space-y-2">
              {chairs.map((c) => (
                <Link
                  key={`chair-${c.code}`}
                  href={`/committees/${c.code.toLowerCase()}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm transition-colors hover:border-[var(--color-ldp-navy-700)]"
                >
                  <span className="text-[var(--color-ldp-navy-900)]">{c.name}</span>
                  <span className="rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ldp-navy-900)]">
                    Chair
                  </span>
                </Link>
              ))}
              {members.map((c) => (
                <Link
                  key={`member-${c.code}`}
                  href={`/committees/${c.code.toLowerCase()}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-sm transition-colors hover:border-[var(--color-ldp-navy-700)]"
                >
                  <span className="text-[var(--color-ldp-navy-900)]">{c.name}</span>
                  <span className="text-xs text-[var(--color-ldp-ink-700)]">Member</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {transitions && transitions.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Transitions
            </h2>
            <ul className="space-y-2 text-sm">
              {transitions.map((t, i) => (
                <li key={i} className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3">
                  <div className="font-medium text-[var(--color-ldp-navy-900)]">
                    {formatSeat(t.seat_code)}
                  </div>
                  <div className="text-xs text-[var(--color-ldp-ink-700)]">
                    {t.previous_holder_name === displayName(member)
                      ? `You held this seat; departed ${t.departed_date ?? "(date unknown)"}`
                      : t.successor_name === displayName(member)
                        ? `You filled this seat after ${t.previous_holder_name ?? "the prior holder"}${t.elected_date ? ` — elected ${t.elected_date}` : ""}`
                        : `${t.previous_holder_name ?? "?"} → ${t.successor_name ?? "VACANT"}`}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
    </HubShell>
  );
}

function formatSeat(code: string): string {
  return code
    .replace(/_GAP$/, "")
    .replace(/_/g, " ")
    .replace(/\bVC\b/, "Vice Chair")
    .replace(/\bPRES\b/i, "President")
    .replace(/\bCHAIR\b/i, "Chair");
}
