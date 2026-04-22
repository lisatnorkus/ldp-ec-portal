import { HubShell } from "@/components/hub/HubShell";
import { fetchAllMembers } from "@/lib/db/members";
import { fetchEngagement, type EngagementRow } from "@/lib/db/engagement";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Engagement" };

function relativeTime(iso: string | null): string {
  if (!iso) return "never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

const BUCKET_STYLE: Record<EngagementRow["bucket"], { label: string; bg: string; text: string }> = {
  active: { label: "Active", bg: "bg-emerald-600", text: "text-white" },
  warm: { label: "Warm", bg: "bg-[var(--color-ldp-navy-700)]", text: "text-white" },
  cool: { label: "Cool", bg: "bg-amber-400", text: "text-[var(--color-ldp-navy-900)]" },
  dark: { label: "Dark", bg: "bg-[var(--color-ldp-red)]", text: "text-white" },
};

export default async function AdminEngagementPage() {
  const members = await fetchAllMembers();
  const { rows, summary } = await fetchEngagement(members);

  return (
    <HubShell
      eyebrow="Admin · Engagement"
      title="Who's actually using the portal."
      subtitle="Contributions only — notes written, tasks taken on, interactions logged, continuity work. Not page views, not surveillance. Dark members are first — those are the conversations you'll want to have."
      maxWidthClass="max-w-6xl"
    >
      <div className="mb-4 rounded-md border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-3 text-[11px] text-[var(--color-ldp-ink-700)]">
        <strong className="text-[var(--color-ldp-navy-900)]">Preview-mode admin view.</strong>{" "}
        Gated by a token cookie. When EC-wide magic-link auth lands, access switches to role-based
        (you + designated officers). Until then this URL stays private — rotate the token in
        Vercel anytime to invalidate.
      </div>

      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <SummaryTile label="Tracked" value={summary.total} color="var(--color-ldp-navy-900)" />
        <SummaryTile label="Active · 7d" value={summary.active} color="#059669" />
        <SummaryTile label="Warm · ≤30d" value={summary.warm} color="var(--color-ldp-navy-700)" />
        <SummaryTile label="Cool · ≤60d" value={summary.cool} color="#F59E0B" />
        <SummaryTile label="Dark · 60d+" value={summary.dark} color="var(--color-ldp-red)" />
      </section>

      <section className="overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#FAFAFA] text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            <tr>
              <th className="px-3 py-2 text-left">Bucket</th>
              <th className="px-3 py-2 text-left">Member</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Last active</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="hidden px-3 py-2 text-right md:table-cell">Notes</th>
              <th className="hidden px-3 py-2 text-right md:table-cell">Tasks made</th>
              <th className="hidden px-3 py-2 text-right md:table-cell">Tasks accepted</th>
              <th className="hidden px-3 py-2 text-right lg:table-cell">Interactions</th>
              <th className="hidden px-3 py-2 text-right lg:table-cell">Continuity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ldp-line)]">
            {rows.map((r) => {
              const s = BUCKET_STYLE[r.bucket];
              return (
                <tr key={r.id} className="hover:bg-[#FAFBFC]">
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${s.bg} ${s.text}`}
                    >
                      {s.label}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-[var(--color-ldp-navy-900)]">
                    {r.name}
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--color-ldp-ink-700)]">
                    {r.role.replace(/_/g, " ").toLowerCase()}
                    {r.ld_number != null && <span> · LD{r.ld_number}</span>}
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--color-ldp-ink-700)]">
                    {relativeTime(r.last_active_at)}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-[var(--color-ldp-navy-900)]">
                    {r.total_actions}
                  </td>
                  <td className="hidden px-3 py-2 text-right text-[var(--color-ldp-ink-700)] md:table-cell">
                    {r.notes || "—"}
                  </td>
                  <td className="hidden px-3 py-2 text-right text-[var(--color-ldp-ink-700)] md:table-cell">
                    {r.tasks_created || "—"}
                  </td>
                  <td className="hidden px-3 py-2 text-right text-[var(--color-ldp-ink-700)] md:table-cell">
                    {r.tasks_accepted || "—"}
                  </td>
                  <td className="hidden px-3 py-2 text-right text-[var(--color-ldp-ink-700)] lg:table-cell">
                    {r.interactions || "—"}
                  </td>
                  <td className="hidden px-3 py-2 text-right text-[var(--color-ldp-ink-700)] lg:table-cell">
                    {r.continuity_actions || "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <p className="mt-4 text-[11px] italic text-[var(--color-ldp-ink-700)]">
        This view aggregates contributions only — things people wrote, tasks they took on,
        interactions they logged. It does not track page views. That&apos;s deliberate: the portal
        is a work surface, not a surveillance tool.
      </p>
    </HubShell>
  );
}

function SummaryTile({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="rounded-lg border bg-white p-3"
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-widest"
        style={{ color }}
      >
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold text-[var(--color-ldp-navy-900)]">{value}</div>
    </div>
  );
}
