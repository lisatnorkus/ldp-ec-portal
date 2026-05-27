import { ExternalLink, MapPin, Clock } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { getSupabaseServer } from "@/lib/supabase/server";
import { MarkdownBody, markdownToPlain } from "@/lib/markdown";
import { MonthHero } from "@/components/this-month/MonthHero";
import { themeFor } from "@/components/this-month/month-themes";
import { SpecialMeetingBanner } from "@/components/dashboard/SpecialMeetingBanner";
import {
  fetchLdpCalendarEvents,
  eventsInRange,
  groupEventsByMonth,
  cleanDescription,
  extractSignupUrl,
  type LdpEvent,
} from "@/lib/calendar/ldp-calendar";

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

// The KDP statewide CEC meeting is the 3rd Tuesday of every month at
// 7pm ET, hosted by Morgan Eaves. Computes the date in the given
// month/year so the This Month card can surface it (and call it out
// when it's tonight).
function kdpEcMeetingDate(year: number, month: number): Date {
  // First day of the month
  const d = new Date(year, month - 1, 1);
  // Tuesday is dayOfWeek 2
  const firstTuesday = new Date(year, month - 1, 1 + ((2 - d.getDay() + 7) % 7));
  // Third Tuesday = first + 14 days
  return new Date(firstTuesday.getFullYear(), firstTuesday.getMonth(), firstTuesday.getDate() + 14);
}

export default async function ThisMonthPage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthStart = new Date(currentYear, currentMonth - 1, 1);
  const monthEnd = new Date(currentYear, currentMonth, 1);
  const yearStart = new Date(currentYear, 0, 1);

  // KDP statewide CEC meeting for this month
  const kdpMeeting = kdpEcMeetingDate(currentYear, currentMonth);
  const isKdpToday =
    kdpMeeting.toDateString() === now.toDateString();
  const isKdpUpcoming = kdpMeeting >= now && kdpMeeting < monthEnd;

  // HQ renovation calendar from the May 27, 2026 Facilities report.
  // Carolyn Benedict (Facilities Chair) needs volunteers on every
  // labelled date except drywall (contractor). Schedule lives here as
  // a static array; flip to a meetings/events table when v2.1 lands
  // the broader facilities surface.
  const HQ_RENO_DATES: Array<{ date: string; label: string; volunteer: boolean; signup_url?: string }> = [
    { date: "2026-06-06", label: "Painting prep", volunteer: true },
    { date: "2026-06-07", label: "Drywall completion", volunteer: false },
    { date: "2026-06-13", label: "Painting + decorating", volunteer: true },
    { date: "2026-06-14", label: "Ceiling grid + furniture move", volunteer: true },
    { date: "2026-06-20", label: "Flooring installation", volunteer: true },
  ];
  const todayISO = now.toISOString().slice(0, 10);
  const nextHqDate = HQ_RENO_DATES.find((d) => d.date >= todayISO);

  const [cards, calendarUrl, voterGuideUrl, calendarEvents] = await Promise.all([
    fetchMonthCards(),
    fetchCalendarUrl(),
    fetchVoterGuideUrl(),
    fetchLdpCalendarEvents().catch((err) => {
      console.error("LDP calendar fetch failed", err);
      return [] as LdpEvent[];
    }),
  ]);
  const current = cards.find((c) => c.month === currentMonth && c.year === currentYear);
  const next = cards.find(
    (c) =>
      (c.year === currentYear && c.month === currentMonth + 1) ||
      (currentMonth === 12 && c.year === currentYear + 1 && c.month === 1)
  );

  // Upcoming events in the current month (today forward).
  const upcomingThisMonth = eventsInRange(calendarEvents, now, monthEnd);

  // Past events this year, grouped by month (Jan through last month).
  const pastThisYear = groupEventsByMonth(
    eventsInRange(calendarEvents, yearStart, monthStart),
    currentYear
  );

  return (
    <HubShell
      eyebrow={`This month · ${MONTH_NAMES[currentMonth]} ${currentYear}`}
      title="What's live right now."
      maxWidthClass="max-w-4xl"
    >
      <SpecialMeetingBanner />

      {nextHqDate && (
        <section className="mb-6 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-gold,#c89a3b)] bg-white shadow-sm">
          <div className="bg-[var(--color-ldp-gold,#c89a3b)] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-900)]">
            HQ renovation · Facilities Committee
          </div>
          <div className="p-5">
            <h2 className="text-base font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
              Carolyn needs volunteers. Every EC member is expected to sign up for at least one date.
            </h2>
            <p className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
              Demolition of the EC room is complete. Major dates scheduled — by the next EC
              meeting the room should be done. New keypad lock approved at the May 27 meeting
              ($2,010 budget). Front three rooms already cleaned + back in working order.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {HQ_RENO_DATES.map((d) => {
                const isPast = d.date < todayISO;
                const isNext = d.date === nextHqDate.date;
                return (
                  <li
                    key={d.date}
                    className={`flex items-baseline gap-3 ${isPast ? "opacity-50" : ""}`}
                  >
                    <span
                      className={`min-w-[120px] text-[11px] font-bold uppercase tracking-widest ${
                        isNext
                          ? "text-[var(--color-ldp-red)]"
                          : "text-[var(--color-ldp-ink-700)]"
                      }`}
                    >
                      {new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {isNext ? " · next" : ""}
                    </span>
                    <span className="flex-1 text-[var(--color-ldp-ink-900)]">{d.label}</span>
                    <span className="shrink-0 text-[10px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                      {d.volunteer ? "Volunteers needed" : "Contractor"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[11px] italic text-[var(--color-ldp-ink-700)]">
              Sign up through the Facilities Committee Sign-up Geniuses (Carolyn Benedict
              distributes the links). Also accepting book donations for the foyer Book Nook:
              Local + Kentucky politics, U.S. politics, local/state/U.S. history, banned books.
            </p>
          </div>
        </section>
      )}

      {(isKdpToday || isKdpUpcoming) && (
        <section
          className={`mb-6 overflow-hidden rounded-xl border-2 shadow-sm ${
            isKdpToday
              ? "border-[var(--color-ldp-red)] bg-white"
              : "border-[var(--color-ldp-navy-700)] bg-white"
          }`}
        >
          <div
            className={`flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white ${
              isKdpToday ? "bg-[var(--color-ldp-red)]" : "bg-[var(--color-ldp-navy-700)]"
            }`}
          >
            {isKdpToday && (
              <span aria-hidden className="flex size-2 animate-pulse rounded-full bg-white" />
            )}
            {isKdpToday ? "Tonight" : "This month"} · KDP statewide CEC meeting
          </div>
          <div className="p-5">
            <h2 className="text-lg font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
              {isKdpToday ? "KDP EC meeting tonight at 7pm ET." : `KDP EC meeting on ${kdpMeeting.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at 7pm ET.`}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">
              Hosted by Morgan Eaves (KDP Executive Director). All LDPEC members welcome — every
              county&apos;s EC in one room. The 3rd Tuesday of every month, 7pm Eastern.
            </p>
            <p className="mt-2 text-[11px] text-[var(--color-ldp-ink-700)]">
              Zoom link + post-meeting decks live in the KDP County Exec Committee Hub on Drive.
            </p>
          </div>
        </section>
      )}

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

      {/* Month playbook card — hero-band design pulls the theme forward
          and replaces what used to be a wall of markdown. */}
      {current ? (
        <MonthHero
          monthName={MONTH_NAMES[currentMonth]}
          year={currentYear}
          themeTag={current.theme_tag}
          contentMd={current.content_md}
        />
      ) : (
        <div className="mb-8 rounded-xl border border-[var(--color-ldp-line)] bg-white p-6 text-sm text-[var(--color-ldp-ink-700)]">
          No month card for {MONTH_NAMES[currentMonth]} {currentYear} yet.
        </div>
      )}

      {/* Live upcoming events from the public LDP Google Calendar. */}
      <section className="mb-10">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Upcoming this month · {MONTH_NAMES[currentMonth]}
          </h2>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Live from louisvilledems.com
          </span>
        </div>
        {upcomingThisMonth.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-white p-5 text-sm text-[var(--color-ldp-ink-700)]">
            No upcoming events left this month on the public calendar.{" "}
            {calendarUrl && (
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-ldp-navy-700)] underline"
              >
                Open the full calendar →
              </a>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {upcomingThisMonth.slice(0, 25).map((e) => (
              <EventRow key={e.uid} event={e} highlight />
            ))}
          </ul>
        )}
      </section>

      {/* Teed-up next-month playbook card. */}
      {next && (
        <div className="mb-10 rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Teed up next · {MONTH_NAMES[next.month]} {next.year}
          </div>
          <MarkdownBody
            text={next.content_md}
            className="space-y-2 text-sm text-[var(--color-ldp-ink-900)]"
            paragraphClass="first:font-semibold first:text-[var(--color-ldp-navy-900)]"
            listClass="ml-5 list-disc space-y-1 text-sm text-[var(--color-ldp-ink-900)] marker:text-[var(--color-ldp-navy-700)]"
          />
        </div>
      )}

      {/* Rock Star Playbook — evergreen year grid. */}
      <section className="mb-10">
        <h2 className="mb-1 text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          The full {currentYear} Rock Star Playbook
        </h2>
        <p className="mb-2 text-xs text-[var(--color-ldp-ink-700)]">
          Every month of the year, live and historical. Click any month to expand the full
          playbook for that window. Past months go gray so the colored ones are the months
          that still matter.
        </p>
        <div className="mb-4 rounded-lg border-l-4 border-[var(--color-ldp-navy-700)] bg-[var(--color-ldp-cream,#fbf8f1)] px-4 py-3 text-xs text-[var(--color-ldp-ink-900)]">
          <strong className="text-[var(--color-ldp-navy-900)]">
            Precinct work is year-round.
          </strong>{" "}
          Doors, voter ID, captain recruiting, neighbor-to-neighbor relationships — all of
          it builds through summer and fall, not just in October. The one thing you can
          never get more of is time. Use it.
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cards
            .filter((c) => c.year === currentYear)
            .map((c) => {
              const isPast = c.month < currentMonth;
              const isCurrent = c.month === currentMonth;
              const theme = themeFor(c.theme_tag);
              const Icon = theme.Icon;
              const preview = markdownToPlain(c.content_md)
                .replace(/^[^—.]*[—.]\s*/, "")
                .slice(0, 140);
              // Past months desaturate: gray icon, gray border accent.
              // Red/theme colors stay reserved for live and upcoming
              // months so the eye lands on what's actionable. The full
              // playbook content stays accessible inside the expand
              // panel for the institutional record.
              const displayAccent = isPast
                ? "var(--color-ldp-ink-400, #7a808b)"
                : theme.accent;
              const displayBg = isPast
                ? "var(--color-ldp-ink-100, #e6e7ea)"
                : theme.accentBg;
              return (
                <details
                  key={`${c.year}-${c.month}`}
                  open={isCurrent}
                  className={`group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow ${
                    isPast ? "opacity-90" : ""
                  }`}
                  style={{
                    borderLeftWidth: 4,
                    borderLeftColor: displayAccent,
                    borderColor: isCurrent ? theme.accent : "var(--color-ldp-line)",
                    borderTopWidth: 1,
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                  }}
                >
                  <summary className="cursor-pointer list-none p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex size-7 items-center justify-center rounded-lg text-white"
                          style={{ backgroundColor: displayAccent }}
                        >
                          <Icon aria-hidden="true" className="size-3.5" />
                        </span>
                        <div className={`text-base font-bold ${isPast ? "text-[var(--color-ldp-ink-700)]" : "text-[var(--color-ldp-navy-900)]"}`}>
                          {MONTH_NAMES[c.month]}
                        </div>
                      </div>
                      {isCurrent ? (
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white"
                          style={{ backgroundColor: theme.accent }}
                        >
                          Now
                        </span>
                      ) : isPast ? (
                        <span className="rounded-full bg-[#FAFAFA] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                          Past
                        </span>
                      ) : (
                        <span
                          className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest"
                          style={{
                            backgroundColor: theme.accentBg,
                            color: theme.accent,
                          }}
                        >
                          Teed up
                        </span>
                      )}
                    </div>
                    <div
                      className="mt-2 text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: displayAccent }}
                    >
                      {theme.label}
                    </div>
                    <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[var(--color-ldp-ink-700)]">
                      {preview}
                      {c.content_md.length > 140 && "…"}
                    </p>
                    <div
                      className="mt-2 text-[10px] font-medium uppercase tracking-widest group-open:hidden"
                      style={{ color: displayAccent }}
                    >
                      Open full playbook →
                    </div>
                  </summary>
                  <div
                    className="border-t p-4"
                    style={{ borderColor: displayAccent, backgroundColor: displayBg }}
                  >
                    <MarkdownBody
                      text={c.content_md}
                      className="space-y-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]"
                      paragraphClass="first:font-semibold first:text-[var(--color-ldp-navy-900)]"
                      listClass="ml-5 list-disc space-y-1 text-sm text-[var(--color-ldp-ink-900)] marker:text-[var(--color-ldp-navy-700)]"
                    />
                  </div>
                </details>
              );
            })}
        </div>
      </section>

      {/* What's happened this year — past months grouped. */}
      {pastThisYear.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
              What&apos;s happened this year
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              {pastThisYear.reduce((n, g) => n + g.events.length, 0)} events
            </span>
          </div>
          <div className="space-y-3">
            {pastThisYear.map((g) => (
              <details
                key={`${g.year}-${g.month}`}
                className="rounded-lg border border-[var(--color-ldp-line)] bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-sm">
                  <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                    {MONTH_NAMES[g.month]} {g.year}
                  </span>
                  <span className="text-xs text-[var(--color-ldp-ink-700)]">
                    {g.events.length} event{g.events.length === 1 ? "" : "s"}
                  </span>
                </summary>
                <ul className="divide-y divide-[var(--color-ldp-line)] border-t border-[var(--color-ldp-line)] bg-[#FAFBFC] px-4">
                  {g.events.map((e) => (
                    <EventRow key={e.uid} event={e} compact />
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </section>
      )}
    </HubShell>
  );
}

function EventRow({
  event,
  highlight = false,
  compact = false,
}: {
  event: LdpEvent;
  highlight?: boolean;
  compact?: boolean;
}) {
  const startDate = event.start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const startTime = event.allDay
    ? "All day"
    : event.start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      });

  const signupUrl = extractSignupUrl(event.description);
  const cleanDesc = cleanDescription(event.description);

  if (compact) {
    return (
      <li className="py-2.5 text-sm">
        <div className="flex items-baseline gap-2">
          <span className="min-w-[64px] text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            {startDate}
          </span>
          <span className="flex-1 text-[var(--color-ldp-ink-900)]">{event.summary}</span>
          {!event.allDay && (
            <span className="text-[11px] text-[var(--color-ldp-ink-700)]">{startTime}</span>
          )}
        </div>
      </li>
    );
  }

  return (
    <li
      className={`rounded-lg border bg-white p-4 transition-colors ${
        highlight
          ? "border-[var(--color-ldp-line)] hover:border-[var(--color-ldp-red)]"
          : "border-[var(--color-ldp-line)]"
      }`}
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="shrink-0 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            {event.start.toLocaleDateString("en-US", { weekday: "short" })}
          </div>
          <div className="text-2xl font-black text-[var(--color-ldp-navy-900)]">
            {event.start.getDate()}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            {event.start.toLocaleDateString("en-US", { month: "short" })}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
            {event.summary}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden="true" className="size-3" />
              {startTime}
            </span>
            {event.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden="true" className="size-3" />
                {event.location}
              </span>
            )}
          </div>
          {cleanDesc && (
            <p className="mt-2 line-clamp-2 text-xs text-[var(--color-ldp-ink-900)]">
              {cleanDesc}
            </p>
          )}
          {signupUrl && (
            <a
              href={signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-ldp-navy-700)] hover:underline"
            >
              Sign up on Mobilize <ExternalLink aria-hidden="true" className="size-3" />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

