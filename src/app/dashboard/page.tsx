import Link from "next/link";
import { SectionNav } from "@/components/nav/SectionNav";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import { fetchAllMembers } from "@/lib/db/members";
import { CycleTimeline } from "@/components/cycle/CycleTimeline";
import { PlanCards } from "@/components/cycle/PlanCards";
import { WorkingSet } from "@/components/dashboard/WorkingSet";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

type Transition = {
  seat_code: string;
  previous_holder_name: string | null;
  successor_name: string | null;
  status: "VACANT" | "FILLED";
  departed_date: string | null;
  recommended_action: string | null;
};

type StructuralRow = {
  level: string;
  seat: string;
  structural_count: number | null;
  currently_filled: number | null;
  gap: number | null;
  display_order: number;
};

async function fetchDashboardData() {
  const supabase = await getSupabaseServer();
  const today = new Date().toISOString().slice(0, 10);
  const [transitions, structural, monthCard, contentCards, nextEvent] = await Promise.all([
    supabase.from("transitions").select("*").order("departed_date", { ascending: false, nullsFirst: false }),
    supabase.from("structural_template").select("*").order("display_order"),
    supabase
      .from("month_cards")
      .select("*")
      .eq("year", new Date().getFullYear())
      .eq("month", new Date().getMonth() + 1)
      .eq("published", true)
      .maybeSingle(),
    supabase.from("content_cards").select("*").eq("slug", "120-club").maybeSingle(),
    supabase
      .from("events")
      .select("id, name, event_date, event_window_description")
      .eq("active", true)
      .gte("event_date", today)
      .order("event_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    transitions: (transitions.data ?? []) as Transition[],
    structural: (structural.data ?? []) as StructuralRow[],
    monthCard: monthCard.data as { month: number; content_md: string; theme_tag: string | null } | null,
    club120: contentCards.data as { title: string; body_md: string } | null,
    nextEvent: nextEvent.data as { id: string; name: string; event_date: string; event_window_description: string | null } | null,
  };
}

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function DashboardPage() {
  const [data, members] = await Promise.all([fetchDashboardData(), fetchAllMembers()]);
  const { transitions, structural, monthCard, club120, nextEvent } = data;

  const vacancies = transitions.filter((t) => t.status === "VACANT");
  const recentChanges = transitions.filter((t) => t.status === "FILLED").slice(0, 3);
  const currentMonth = new Date().getMonth() + 1;
  const eventDaysUntil = nextEvent?.event_date
    ? Math.max(
        0,
        Math.round(
          (new Date(nextEvent.event_date + "T00:00:00").getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Navy masthead with subtle diagonal pattern + red accent strip */}
      <header className="relative overflow-hidden bg-[var(--color-ldp-navy-900)] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.9) 0 1px, transparent 1px 14px)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 85% -20%, rgba(96,165,250,0.25), transparent 55%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-1 w-10 overflow-hidden rounded-full">
              <div className="flex-1 bg-[var(--color-ldp-navy-700)]" />
              <div className="flex-1 bg-white/80" />
              <div className="flex-1 bg-[var(--color-ldp-red)]" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-ldp-red-bright)]">
              LDPEC Portal
            </div>
          </div>
          <nav className="flex items-center gap-4 text-xs">
            <Link
              href="/tour/1"
              className="rounded text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ldp-navy-900)]"
            >
              Revisit the tour
            </Link>
            <Button asChild variant="ldp" size="sm" className="border border-white/20 bg-white/10 hover:bg-white/20">
              <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
                Join EC Meeting
              </a>
            </Button>
          </nav>
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pt-6 pb-10">
          <h1 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm font-medium text-white/60">{todayLabel}</p>
        </div>
        {/* Red bottom bar */}
        <div className="relative h-1.5 w-full bg-[var(--color-ldp-red)]" />
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* 1. Role-first Working Set — your seat's standing duties,
            the amplifier work that's always live, and the right-now
            specifics. Cycle context is demoted below. */}
        <WorkingSet />

        {/* 2. Cycle timeline — demoted to a thin reference strip. */}
        <CycleTimeline />

        {/* 3. The plans — full-arc reference material. */}
        <PlanCards />

        {/* 4. At-a-glance operational blocks. */}
        <section className="mb-8 grid gap-4 lg:grid-cols-3">
          <Link
            href="/this-month"
            className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5 transition-colors hover:border-[var(--color-ldp-navy-700)]"
          >
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              This month · {MONTH_NAMES[currentMonth]}
            </div>
            <p className="mt-2 line-clamp-5 text-sm text-[var(--color-ldp-ink-900)]">
              {monthCard?.content_md ?? "No card this month."}
            </p>
            <div className="mt-3 text-xs font-medium text-[var(--color-ldp-navy-700)]">Full playbook →</div>
          </Link>

          {nextEvent && eventDaysUntil != null ? (
            <Link
              href="/events"
              className={`rounded-xl border p-5 transition-colors hover:shadow-sm ${
                eventDaysUntil <= 30
                  ? "border-[var(--color-ldp-red)] bg-white"
                  : "border-[var(--color-ldp-line)] bg-white hover:border-[var(--color-ldp-navy-700)]"
              }`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
                Next signature event
              </div>
              <div className="mt-1 text-base font-bold text-[var(--color-ldp-navy-900)]">
                {nextEvent.name}
              </div>
              <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
                {nextEvent.event_window_description}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div
                  className={`text-3xl font-bold ${
                    eventDaysUntil <= 30 ? "text-[var(--color-ldp-red)]" : "text-[var(--color-ldp-navy-900)]"
                  }`}
                >
                  {eventDaysUntil}
                </div>
                <div className="text-xs text-[var(--color-ldp-ink-700)]">
                  day{eventDaysUntil === 1 ? "" : "s"} out
                </div>
              </div>
              {eventDaysUntil <= 30 && (
                <div className="mt-2 text-xs font-semibold text-[var(--color-ldp-red)]">
                  Your ticket link is live → push it.
                </div>
              )}
            </Link>
          ) : (
            <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
                Next signature event
              </div>
              <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
                No upcoming event on the calendar. See the{" "}
                <Link href="/events" className="text-[var(--color-ldp-navy-700)] hover:underline">
                  events page
                </Link>
                .
              </p>
            </div>
          )}

          <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
              Board commitments
            </div>
            <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
              {club120?.title ?? "The $120 Club"}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
              $120/year personal give + $500/year raised via ticket links = $620 per member.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#FAFAFA] p-2 text-center">
              <div>
                <div className="text-[10px] text-[var(--color-ldp-ink-700)]">Members</div>
                <div className="text-base font-bold text-[var(--color-ldp-navy-900)]">{members.length}</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--color-ldp-ink-700)]">Per member</div>
                <div className="text-base font-bold text-[var(--color-ldp-navy-900)]">$620</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--color-ldp-ink-700)]">Floor/yr</div>
                <div className="text-base font-bold text-emerald-700">
                  ${(members.length * 620).toLocaleString()}
                </div>
              </div>
            </div>
            <Link
              href="/events#money-rules"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-ldp-navy-700)] hover:underline"
            >
              Money rules — what the party can and can&apos;t take →
            </Link>
          </div>
        </section>

        {/* 5. Transitions + structural gaps — "where the board stands" below the fold. */}
        {(vacancies.length > 0 || recentChanges.length > 0) && (
          <section className="mb-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                Transitions · seat changes since June 2025 reorg
              </h2>
              <Link href="/transitions" className="text-xs font-medium text-[var(--color-ldp-navy-700)] hover:underline">
                Full list →
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {vacancies.length > 0 && (
                <div className="rounded-xl border border-[var(--color-ldp-red)] bg-white p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
                    Vacant · {vacancies.length}
                  </div>
                  <ul className="space-y-3">
                    {vacancies.slice(0, 5).map((v) => (
                      <li key={v.seat_code} className="border-l-2 border-[var(--color-ldp-red)] pl-3 text-sm">
                        <div className="font-medium text-[var(--color-ldp-navy-900)]">
                          {formatSeat(v.seat_code)}
                        </div>
                        {v.previous_holder_name && (
                          <div className="text-xs text-[var(--color-ldp-ink-700)]">
                            Previously: {v.previous_holder_name}
                          </div>
                        )}
                        {v.recommended_action && (
                          <div className="mt-1 text-xs italic text-[var(--color-ldp-ink-700)]">
                            → {v.recommended_action}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {recentChanges.length > 0 && (
                <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                    Recently filled
                  </div>
                  <ul className="space-y-3">
                    {recentChanges.map((t) => (
                      <li key={t.seat_code} className="border-l-2 border-emerald-500 pl-3 text-sm">
                        <div className="font-medium text-[var(--color-ldp-navy-900)]">
                          {formatSeat(t.seat_code)}
                        </div>
                        <div className="text-xs text-[var(--color-ldp-ink-700)]">
                          {t.previous_holder_name} → <strong>{t.successor_name}</strong>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {structural.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Seat coverage · structural vs filled
            </h2>
            <div className="overflow-hidden rounded-lg border border-[var(--color-ldp-line)] bg-white">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAFA] text-xs font-semibold uppercase tracking-wider text-[var(--color-ldp-ink-700)]">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Level / seat</th>
                    <th className="px-4 py-2.5 text-right">Ideal</th>
                    <th className="px-4 py-2.5 text-right">Filled</th>
                    <th className="px-4 py-2.5 text-right">Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-ldp-line)]">
                  {structural.map((r) => (
                    <tr key={`${r.level}-${r.seat}`}>
                      <td className="px-4 py-2 text-[var(--color-ldp-ink-900)]">
                        <span className="text-xs text-[var(--color-ldp-ink-700)]">{r.level} · </span>
                        {r.seat}
                      </td>
                      <td className="px-4 py-2 text-right text-[var(--color-ldp-ink-700)]">
                        {r.structural_count ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-[var(--color-ldp-navy-900)]">
                        {r.currently_filled ?? "—"}
                      </td>
                      <td
                        className={`px-4 py-2 text-right font-semibold ${
                          (r.gap ?? 0) > 0 ? "text-[var(--color-ldp-red)]" : "text-emerald-700"
                        }`}
                      >
                        {r.gap ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 6. Section nav at the bottom — still accessible, not dominant. */}
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            All sections
          </h2>
          <SectionNav />
        </section>
      </main>
    </div>
  );
}

function formatSeat(code: string): string {
  return code
    .replace(/_GAP$/, "")
    .replace(/_/g, " ")
    .replace(/\bVC\b/, "Vice Chair")
    .replace(/\bLD(\d+)\b/, "LD$1")
    .replace(/\bCHAIR\b/i, "Chair")
    .replace(/\bPRES\b/i, "President");
}
