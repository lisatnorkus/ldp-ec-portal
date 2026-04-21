import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "This Month" };

type MonthCard = {
  month: number;
  year: number;
  content_md: string;
  theme_tag: string | null;
};

async function fetchMonthCards(): Promise<MonthCard[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("month_cards")
    .select("*")
    .eq("published", true)
    .order("year")
    .order("month");
  if (error) throw error;
  return data as MonthCard[];
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

export default async function ThisMonthPage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const cards = await fetchMonthCards();
  const current = cards.find((c) => c.month === currentMonth && c.year === currentYear);
  const next = cards.find(
    (c) =>
      (c.year === currentYear && c.month === currentMonth + 1) ||
      (currentMonth === 12 && c.year === currentYear + 1 && c.month === 1)
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
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

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            <Calendar className="size-3.5" />
            This month · {MONTH_NAMES[currentMonth]} {currentYear}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            What&apos;s live right now
          </h1>
        </div>

        {current ? (
          <article className="mb-8 rounded-xl border-2 border-[var(--color-ldp-navy-900)] bg-white p-6">
            {current.theme_tag && (
              <span className="mb-3 inline-flex items-center rounded-full bg-[var(--color-ldp-gold)] px-2 py-0.5 text-[10px] font-semibold uppercase text-[var(--color-ldp-navy-900)]">
                {current.theme_tag.replace(/_/g, " ").toLowerCase()}
              </span>
            )}
            <p className="text-base leading-relaxed text-[var(--color-ldp-ink-900)] whitespace-pre-wrap">
              {current.content_md}
            </p>
          </article>
        ) : (
          <div className="mb-8 rounded-xl border border-[var(--color-ldp-line)] bg-white p-6 text-sm text-[var(--color-ldp-ink-700)]">
            No month card for {MONTH_NAMES[currentMonth]} {currentYear} yet.
          </div>
        )}

        {next && (
          <div className="mb-10 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Teed up next · {MONTH_NAMES[next.month]} {next.year}
            </div>
            <p className="text-sm text-[var(--color-ldp-ink-900)] whitespace-pre-wrap">{next.content_md}</p>
          </div>
        )}

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Full Rock Star Playbook · {currentYear}
          </h2>
          <div className="grid gap-2 md:grid-cols-2">
            {cards
              .filter((c) => c.year === currentYear)
              .map((c) => (
                <details
                  key={`${c.year}-${c.month}`}
                  className="group rounded-lg border border-[var(--color-ldp-line)] bg-white p-3"
                >
                  <summary className="cursor-pointer text-sm font-semibold text-[var(--color-ldp-navy-900)] list-none">
                    {MONTH_NAMES[c.month]}
                    {c.month === currentMonth && (
                      <span className="ml-2 rounded-full bg-[var(--color-ldp-red)] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white">
                        Now
                      </span>
                    )}
                  </summary>
                  <p className="mt-2 text-xs text-[var(--color-ldp-ink-700)] whitespace-pre-wrap">{c.content_md}</p>
                </details>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
