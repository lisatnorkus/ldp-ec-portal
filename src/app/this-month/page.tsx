import { ExternalLink } from "lucide-react";
import { PageMasthead } from "@/components/nav/PageMasthead";
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

async function fetchCalendarUrl(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "public_calendar_url")
    .maybeSingle();
  return (data?.value as string | undefined) ?? null;
}

async function fetchVoterGuideUrl(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "voter_guide_url")
    .maybeSingle();
  return (data?.value as string | undefined) ?? null;
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

  const [cards, calendarUrl, voterGuideUrl] = await Promise.all([
    fetchMonthCards(),
    fetchCalendarUrl(),
    fetchVoterGuideUrl(),
  ]);
  const current = cards.find((c) => c.month === currentMonth && c.year === currentYear);
  const next = cards.find(
    (c) =>
      (c.year === currentYear && c.month === currentMonth + 1) ||
      (currentMonth === 12 && c.year === currentYear + 1 && c.month === 1)
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageMasthead
        eyebrow={`This month · ${MONTH_NAMES[currentMonth]} ${currentYear}`}
        title="What's live right now."
        maxWidthClass="max-w-4xl"
      />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
            {voterGuideUrl && (
              <a
                href={voterGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-3 py-1.5 text-white transition-colors hover:bg-[var(--color-ldp-red)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-red)] focus-visible:ring-offset-2"
              >
                2026 Voter Guide <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
            )}
            {calendarUrl && (
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded text-[var(--color-ldp-navy-700)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-navy-700)] focus-visible:ring-offset-2"
              >
                Public party calendar <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
            )}
          </div>
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
          <h2 className="mb-1 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            The full {currentYear} Rock Star Playbook
          </h2>
          <p className="mb-4 text-xs text-[var(--color-ldp-ink-700)]">
            Every month of the year, live and historical. Click any month to expand the full playbook for that window. Past months stay here so you can look back at what was live.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {cards
              .filter((c) => c.year === currentYear)
              .map((c) => {
                const isPast = c.month < currentMonth;
                const isCurrent = c.month === currentMonth;
                const preview = c.content_md
                  .replace(/^\*\*[^*]+\*\*\s*/, "") // strip the leading "**Month — headline.**" bold
                  .replace(/\s+/g, " ")
                  .slice(0, 140);
                return (
                  <details
                    key={`${c.year}-${c.month}`}
                    open={isCurrent}
                    className={`group overflow-hidden rounded-lg border bg-white transition-colors ${
                      isCurrent
                        ? "border-[var(--color-ldp-red)] shadow-sm"
                        : isPast
                          ? "border-[var(--color-ldp-line)] opacity-75"
                          : "border-[var(--color-ldp-line)]"
                    }`}
                  >
                    <summary className="cursor-pointer list-none p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-base font-bold text-[var(--color-ldp-navy-900)]">
                          {MONTH_NAMES[c.month]}
                        </div>
                        {isCurrent ? (
                          <span className="rounded-full bg-[var(--color-ldp-red)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                            Now
                          </span>
                        ) : isPast ? (
                          <span className="rounded-full bg-[#FAFAFA] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                            Past
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)]">
                            Teed up
                          </span>
                        )}
                      </div>
                      {c.theme_tag && (
                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)]">
                          {c.theme_tag.replace(/_/g, " ").toLowerCase()}
                        </div>
                      )}
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--color-ldp-ink-700)]">
                        {preview}
                        {c.content_md.length > 140 && "…"}
                      </p>
                      <div className="mt-2 text-[10px] font-medium uppercase tracking-widest text-[var(--color-ldp-navy-700)] group-open:hidden">
                        Open full playbook →
                      </div>
                    </summary>
                    <div className="border-t border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4 text-sm leading-relaxed text-[var(--color-ldp-ink-900)] whitespace-pre-wrap">
                      {c.content_md}
                    </div>
                  </details>
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
}
