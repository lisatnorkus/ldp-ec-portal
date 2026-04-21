import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import { displayName } from "@/lib/db/members";

export const dynamic = "force-dynamic";
export const metadata = { title: "Events" };

type Event = {
  id: string;
  type: string;
  name: string;
  event_date: string | null;
  event_window_description: string | null;
  venue: string | null;
  drive_folder_url: string | null;
  chair_id: string | null;
  tickets_url: string | null;
  active: boolean;
};

type Chair = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
};

async function fetchEventsPage() {
  const supabase = await getSupabaseServer();
  const [events, committees] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("active", true)
      .order("event_date", { ascending: true, nullsFirst: false }),
    supabase.from("committees").select("code, name, chair_id, drive_folder_url").eq("code", "EVENTS").maybeSingle(),
  ]);
  const chairIds = Array.from(new Set((events.data ?? []).map((e) => e.chair_id).filter(Boolean))) as string[];
  let chairs: Chair[] = [];
  if (chairIds.length) {
    const res = await supabase
      .from("ec_members")
      .select("id, first_name, last_name, preferred_name")
      .in("id", chairIds);
    chairs = (res.data ?? []) as Chair[];
  }
  return {
    events: (events.data ?? []) as Event[],
    eventsCommittee: committees.data as { code: string; name: string; chair_id: string | null; drive_folder_url: string | null } | null,
    chairs,
  };
}

const TODAY = new Date();

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const diffMs = d.getTime() - TODAY.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default async function EventsPage() {
  const { events, eventsCommittee, chairs } = await fetchEventsPage();
  const chairById = new Map(chairs.map((c) => [c.id, c]));

  const upcoming = events.filter((e) => {
    const du = daysUntil(e.event_date);
    return du == null || du >= 0;
  });
  const past = events.filter((e) => {
    const du = daysUntil(e.event_date);
    return du != null && du < 0;
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
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

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            Signature Events
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Three events fund the party.
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">
            Celebration of Democracy Dinner, Women Deliver Democracy, and Dems at the Downs together
            raise the vast majority of the LDP&apos;s revenue. Each has a subcommittee under the
            Events Committee; leadership rotates annually.
          </p>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-ldp-ink-700)]">
            Each board member&apos;s <strong className="text-[var(--color-ldp-navy-900)]">$500 annual raise</strong>{" "}
            is driven primarily through personalized ticket-sale links for these events — links go
            out about 30 days before each event.
          </p>
        </div>

        <section id="money-rules" className="mb-10 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
            Money rules — the quick reference
          </div>
          <h2 className="mt-1 text-lg font-bold text-[var(--color-ldp-navy-900)]">
            What the party can and can&apos;t take
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
            Kentucky has tight rules on who can give money to a party committee. Most surprise
            rejections happen when a new member brings in a generous check from the wrong account.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-emerald-800">
                ✓ Can accept
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
                <li>Personal checks from individuals (from a <em>personal</em> account)</li>
                <li>Personal credit/debit cards</li>
                <li>Ticket-sale revenue from signature events</li>
                <li>Contributions from registered PACs, within KREF limits</li>
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--color-ldp-red)]/30 bg-[#FFF5F6] p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
                ✗ Cannot accept — will return
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
                <li><strong>Corporate checks</strong> — including law firms, LLCs, partnerships, S-corps, medical practices</li>
                <li>Union treasury funds (their PAC is fine)</li>
                <li>Anonymous contributions over $100</li>
                <li>Contributions from foreign nationals</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-[var(--color-ldp-gold)] bg-[#EFF6FF] p-4 text-sm">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
              If someone hands you a check from the wrong account
            </div>
            <ol className="mt-2 space-y-1 text-[var(--color-ldp-ink-900)]">
              <li>1. Don&apos;t deposit it. Hold it.</li>
              <li>2. Ask the donor to rewrite it from a personal account.</li>
              <li>3. If they ask why: <em>&ldquo;Kentucky law (KRS 121.150) prohibits corporate money to party committees. Your personal contribution is always welcome.&rdquo;</em></li>
              <li>4. When in doubt, hand it to the LDP Treasurer before it&apos;s deposited.</li>
            </ol>
          </div>
          <p className="mt-3 text-xs text-[var(--color-ldp-ink-700)]">
            Authority: <a href="https://kref.ky.gov" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ldp-navy-700)] underline">Kentucky Registry of Election Finance (KREF)</a>.
            Full statute: <a href="https://apps.legislature.ky.gov/law/statutes/chapter.aspx?id=37247" target="_blank" rel="noopener noreferrer" className="text-[var(--color-ldp-navy-700)] underline">KRS Chapter 121</a>.
          </p>
        </section>

        {upcoming.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Upcoming
            </h2>
            <div className="space-y-4">
              {upcoming.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  chair={e.chair_id ? chairById.get(e.chair_id) : null}
                />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Past
            </h2>
            <div className="space-y-3">
              {past.map((e) => (
                <div
                  key={e.id}
                  className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 text-sm opacity-70"
                >
                  <div className="font-semibold text-[var(--color-ldp-navy-900)]">{e.name}</div>
                  <div className="text-xs text-[var(--color-ldp-ink-700)]">
                    {formatDate(e.event_date)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {eventsCommittee && (
          <section className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Events Committee
            </h3>
            <p className="text-sm text-[var(--color-ldp-ink-900)]">
              Events leadership rotates annually. If you want to lead an event next cycle, talk to
              the current Events Committee Chair.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="ldp" size="sm">
                <Link href="/committees/events">
                  Events Committee page →
                </Link>
              </Button>
              {eventsCommittee.drive_folder_url && (
                <Button asChild variant="outline" size="sm">
                  <a
                    href={eventsCommittee.drive_folder_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1"
                  >
                    <Folder className="size-4" /> Drive folder
                  </a>
                </Button>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function EventCard({ event, chair }: { event: Event; chair: Chair | null | undefined }) {
  const du = daysUntil(event.event_date);
  const withinWindow = du != null && du >= 0 && du <= 30;
  return (
    <article
      className={`rounded-xl border-2 bg-white p-5 ${
        withinWindow ? "border-[var(--color-ldp-red)]" : "border-[var(--color-ldp-line)]"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
            {event.event_window_description}
          </div>
          <h3 className="mt-1 text-xl font-bold text-[var(--color-ldp-navy-900)]">{event.name}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-ldp-ink-900)]">
            <Calendar className="size-4 text-[var(--color-ldp-navy-700)]" />
            {formatDate(event.event_date) ?? (
              <span className="italic text-[var(--color-ldp-ink-700)]">
                Date on the public calendar
              </span>
            )}
          </div>
        </div>
        {du != null && du >= 0 && du <= 60 && (
          <div className="rounded-lg border-2 border-[var(--color-ldp-red)] bg-[#FFF5F6] px-3 py-1.5 text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              In
            </div>
            <div className="text-xl font-bold text-[var(--color-ldp-red)]">{du}</div>
            <div className="text-[10px] uppercase text-[var(--color-ldp-red)]">day{du === 1 ? "" : "s"}</div>
          </div>
        )}
      </div>

      {withinWindow && (
        <div className="mt-4 rounded-lg border border-[var(--color-ldp-gold)] bg-[#EFF6FF] p-3 text-sm">
          <strong className="text-[var(--color-ldp-navy-900)]">Ticket-link window open.</strong>{" "}
          Your personalized ticket link is live — every ticket sold through your link counts toward
          your $500 annual raise.
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {chair && (
          <Link
            href={`/people/${chair.id}`}
            className="rounded-full border border-[var(--color-ldp-line)] bg-[#FAFAFA] px-3 py-1 text-xs text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)]"
          >
            Chair: {displayName(chair)}
          </Link>
        )}
        {event.tickets_url && (
          <Button asChild variant="ldpGold" size="sm">
            <a href={event.tickets_url} target="_blank" rel="noopener noreferrer">
              Tickets & sponsorship <ExternalLink className="ml-1 size-3.5" />
            </a>
          </Button>
        )}
        {event.drive_folder_url && (
          <Button asChild variant="outline" size="sm">
            <a
              href={event.drive_folder_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              <Folder className="size-4" /> Event folder
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}
