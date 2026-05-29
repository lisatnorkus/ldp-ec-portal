import { HubShell } from "@/components/hub/HubShell";
import { fetchAllMembers } from "@/lib/db/members";
import { fetchEngagement, type EngagementRow } from "@/lib/db/engagement";
import {
  fetchAuthBuckets,
  fetchTourFunnel,
  fetchChatUsage,
  type AuthBuckets,
  type TourFunnel,
  type ChatUsage,
} from "@/lib/db/portal-usage";

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
  const [members, auth, tour, chat] = await Promise.all([
    fetchAllMembers(),
    fetchAuthBuckets(),
    fetchTourFunnel(),
    fetchChatUsage(),
  ]);
  const { rows, summary } = await fetchEngagement(members);

  return (
    <HubShell
      eyebrow="Admin · Engagement"
      title="Who's actually using the portal."
      subtitle="Three signals: presence (sign-ins), onboarding (tour funnel), and contributions (work done). No page-view tracking — the portal is a work surface, not surveillance. Dark members are first — those are the conversations you'll want to have."
      maxWidthClass="max-w-6xl"
    >
      <div className="mb-4 rounded-md border border-[var(--color-ldp-line)] bg-[#FAFBFC] p-3 text-[11px] text-[var(--color-ldp-ink-700)]">
        <strong className="text-[var(--color-ldp-navy-900)]">Preview-mode admin view.</strong>{" "}
        Gated by a token cookie. When EC-wide magic-link auth lands, access switches to role-based
        (you + designated officers). Until then this URL stays private — rotate the token in
        Vercel anytime to invalidate.{" "}
        <strong className="text-[var(--color-ldp-navy-900)]">Phase 1 note:</strong> sign-ins and
        compliance-chat queries log anonymously during the passphrase era — the per-person view
        lights up when Google OAuth is added in Phase 2.
      </div>

      <PresenceCard auth={auth} />
      <TourFunnelCard tour={tour} totalMembers={members.length} />
      <ChatUsageCard chat={chat} />

      <SectionHeading
        title="Contributions"
        subtitle="What people have actually built in the portal — notes, tasks, interactions, continuity work. The work signal."
      />

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

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3 mt-2">
      <h2 className="text-base font-bold text-[var(--color-ldp-navy-900)]">{title}</h2>
      <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-ldp-ink-700)]">{subtitle}</p>
    </div>
  );
}

function PresenceCard({ auth }: { auth: AuthBuckets }) {
  return (
    <section className="mb-8">
      <SectionHeading
        title="Presence — sign-ins"
        subtitle="Did people open the portal at all? Anonymous aggregate during Phase 1 — once OAuth is on, each row attaches to a member."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <SummaryTile label="Sign-ins · 24h" value={auth.last_24h} color="#059669" />
        <SummaryTile label="Sign-ins · 7d" value={auth.last_7d} color="var(--color-ldp-navy-700)" />
        <SummaryTile label="Sign-ins · 30d" value={auth.last_30d} color="var(--color-ldp-navy-900)" />
        <SummaryTile label="Devices · 7d" value={auth.distinct_devices_7d} color="#0891b2" />
        <SummaryTile label="Total ever" value={auth.total} color="#7c3aed" />
      </div>
      <p className="mt-2 text-[11px] italic text-[var(--color-ldp-ink-700)]">
        Distinct devices is a rough lower bound on distinct people during Phase 1. Once Google
        OAuth lands, this becomes a real per-person view.
      </p>
    </section>
  );
}

function TourFunnelCard({
  tour,
  totalMembers,
}: {
  tour: TourFunnel;
  totalMembers: number;
}) {
  const notStarted = Math.max(0, totalMembers - tour.started);
  return (
    <section className="mb-8">
      <SectionHeading
        title="Onboarding — Tour funnel"
        subtitle="Where first-term members land in the six-step tour. Step-3 drop-off is the canary that the applied-education layer needs work."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryTile label="Members" value={totalMembers} color="var(--color-ldp-navy-900)" />
        <SummaryTile label="Started" value={tour.started} color="var(--color-ldp-navy-700)" />
        <SummaryTile label="Completed" value={tour.completed} color="#059669" />
        <SummaryTile label="Not started" value={notStarted} color="var(--color-ldp-red)" />
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#FAFAFA] text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            <tr>
              <th className="px-3 py-2 text-left">Step</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-right">Currently here</th>
              <th className="px-3 py-2 text-left">Bar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-ldp-line)]">
            {tour.current_distribution.map((row) => (
              <tr key={row.step}>
                <td className="px-3 py-2 font-semibold text-[var(--color-ldp-navy-900)]">
                  Step {row.step}
                </td>
                <td className="px-3 py-2 text-xs text-[var(--color-ldp-ink-700)]">
                  {STEP_TITLES[row.step - 1]}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-[var(--color-ldp-navy-900)]">
                  {row.count}
                </td>
                <td className="px-3 py-2">
                  <div
                    className="h-2 rounded-full bg-[var(--color-ldp-navy-700)]"
                    style={{
                      width: tour.started > 0
                        ? `${Math.round((row.count / Math.max(tour.started, 1)) * 100)}%`
                        : "0%",
                      minWidth: row.count > 0 ? "2px" : "0",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ChatUsageCard({ chat }: { chat: ChatUsage }) {
  return (
    <section className="mb-8">
      <SectionHeading
        title="Compliance chat — usage"
        subtitle="Counts and topic tags only. The question text is NEVER stored. Tells you whether the chat is being used and which body of law is on people's minds."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryTile label="Queries · 24h" value={chat.last_24h} color="#059669" />
        <SummaryTile label="Queries · 7d" value={chat.last_7d} color="var(--color-ldp-navy-700)" />
        <SummaryTile label="Total ever" value={chat.total} color="var(--color-ldp-navy-900)" />
        <SummaryTile
          label="Avg length · 7d"
          value={chat.recent_7d_avg_length ?? 0}
          color="#0891b2"
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryTile label="Finance" value={chat.by_topic.finance} color="var(--color-ldp-red)" />
        <SummaryTile label="Bylaws" value={chat.by_topic.bylaws} color="var(--color-ldp-navy-700)" />
        <SummaryTile label="Both" value={chat.by_topic.both} color="#7c3aed" />
        <SummaryTile label="Other" value={chat.by_topic.other} color="var(--color-ldp-ink-700)" />
      </div>
    </section>
  );
}

const STEP_TITLES = [
  "Orientation",
  "Your Role",
  "Your District",
  "How We Meet",
  "Current Work",
  "The 2028 Cycle",
];
