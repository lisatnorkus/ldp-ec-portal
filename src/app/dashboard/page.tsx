import Link from "next/link";
import { SectionNav } from "@/components/nav/SectionNav";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import { fetchAllMembers } from "@/lib/db/members";

export const dynamic = "force-dynamic";

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
  const [transitions, structural, monthCard, contentCards] = await Promise.all([
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
  ]);
  return {
    transitions: (transitions.data ?? []) as Transition[],
    structural: (structural.data ?? []) as StructuralRow[],
    monthCard: monthCard.data as { month: number; content_md: string; theme_tag: string | null } | null,
    club120: contentCards.data as { title: string; body_md: string } | null,
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
  const { transitions, structural, monthCard, club120 } = data;

  const vacancies = transitions.filter((t) => t.status === "VACANT");
  const recentChanges = transitions.filter((t) => t.status === "FILLED").slice(0, 3);

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              LDPEC Portal
            </div>
            <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">Dashboard</div>
          </div>
          <nav className="flex items-center gap-4 text-xs">
            <Link href="/tour/1" className="text-[var(--color-ldp-navy-700)] hover:underline">
              Revisit the tour
            </Link>
            <Button asChild variant="ldp" size="sm">
              <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
                Join EC Meeting
              </a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 grid gap-4 lg:grid-cols-3">
          {/* This Month */}
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
            <div className="mt-3 text-xs font-medium text-[var(--color-ldp-navy-700)]">See full playbook →</div>
          </Link>

          {/* $120 Club */}
          <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5 lg:col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
              Board commitments
            </div>
            <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
              {club120?.title ?? "The $120 Club"}
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ldp-ink-700)]">
              {club120?.body_md ?? ""}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3 rounded-lg bg-[#FAFAFA] p-3 text-center">
              <div>
                <div className="text-xs text-[var(--color-ldp-ink-700)]">Active members</div>
                <div className="text-xl font-bold text-[var(--color-ldp-navy-900)]">{members.length}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--color-ldp-ink-700)]">Floor/member</div>
                <div className="text-xl font-bold text-[var(--color-ldp-navy-900)]">$620</div>
              </div>
              <div>
                <div className="text-xs text-[var(--color-ldp-ink-700)]">Annual floor</div>
                <div className="text-xl font-bold text-emerald-700">${(members.length * 620).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Transitions / Vacancies */}
        {(vacancies.length > 0 || recentChanges.length > 0) && (
          <section className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Transitions · seat changes since June 2025 reorg
            </h2>
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

        {/* Structural template */}
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
                      <td className="px-4 py-2 text-right text-[var(--color-ldp-ink-700)]">{r.structural_count ?? "—"}</td>
                      <td className="px-4 py-2 text-right font-semibold text-[var(--color-ldp-navy-900)]">{r.currently_filled ?? "—"}</td>
                      <td className={`px-4 py-2 text-right font-semibold ${(r.gap ?? 0) > 0 ? "text-[var(--color-ldp-red)]" : "text-emerald-700"}`}>
                        {r.gap ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Sections
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
