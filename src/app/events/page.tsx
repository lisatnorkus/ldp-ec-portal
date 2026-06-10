import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Folder,
  Link2,
  MapPin,
  Megaphone,
  Send,
  Target,
  Ticket,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";
import { displayName, fetchAllMembers } from "@/lib/db/members";
import { DriveAccessNote } from "@/components/drive/DriveAccessNote";

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
  date_is_approximate: boolean;
};

type Chair = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
};

// Per-signature-event visual identity. Chosen so each card reads
// distinctly: COD = deep red/spring gala, WDD = gold/women-focused
// summer, DatD = emerald/horse-race post-election close.
const EVENT_THEME: Record<
  string,
  {
    accent: string;
    bgTint: string;
    tagline: string;
    pitch: string;
  }
> = {
  CELEBRATION_OF_DEMOCRACY: {
    accent: "#C8102E",
    bgTint: "#FFF5F6",
    tagline: "Spring flagship · Celebration of Democracy",
    pitch:
      "Our biggest dinner of the year. Sells out every time. Tickets are $125 a person — 4 tickets through your link covers your full $500 raise. A table of 10 is $1,250, 2½× your goal.",
  },
  WOMEN_DELIVER_DEMOCRACY: {
    accent: "#D4A017",
    bgTint: "#FEF9E7",
    tagline: "Summer fundraiser · Spotlights Dem women",
    pitch:
      "Centers women Democratic leaders, candidates, and organizers. Natural invite for any woman in your network who cares about Louisville.",
  },
  DEMS_AT_THE_DOWNS: {
    accent: "#059669",
    bgTint: "#ECFDF5",
    tagline: "Post-election close · Horse-race themed",
    pitch:
      "The post-election celebration — cycle closeout, thank-you party, and donor moment all in one. Louisville's signature cultural event energy.",
  },
};

const DEFAULT_THEME = {
  accent: "var(--color-ldp-navy-800)",
  bgTint: "#FAFBFC",
  tagline: "Signature LDP event",
  pitch: "Fundraise through your personalized ticket link.",
};

async function fetchEventsPage() {
  const supabase = await getSupabaseServer();
  const [events, committees] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("active", true)
      .order("event_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("committees")
      .select("code, name, chair_id, drive_folder_url")
      .eq("code", "EVENTS")
      .maybeSingle(),
  ]);
  const chairIds = Array.from(
    new Set((events.data ?? []).map((e) => e.chair_id).filter(Boolean))
  ) as string[];
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
    eventsCommittee: committees.data as {
      code: string;
      name: string;
      chair_id: string | null;
      drive_folder_url: string | null;
    } | null,
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
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function themeFor(type: string) {
  return EVENT_THEME[type] ?? DEFAULT_THEME;
}

export default async function EventsPage() {
  const [{ events, eventsCommittee, chairs }, members] = await Promise.all([
    fetchEventsPage(),
    fetchAllMembers(),
  ]);
  const chairById = new Map(chairs.map((c) => [c.id, c]));

  const upcoming = events.filter((e) => {
    const du = daysUntil(e.event_date);
    return du == null || du >= 0;
  });
  const past = events.filter((e) => {
    const du = daysUntil(e.event_date);
    return du != null && du < 0;
  });

  const memberCount = members.length;
  const annualFloor = memberCount * 620;

  return (
    <HubShell
      eyebrow="Signature Events · Fundraising"
      title="This is how the party funds itself."
      subtitle="Three events raise the vast majority of LDP's revenue. Every board member gets a personalized ticket-sale link for each one — push your link, get credit, hit your $500. That's how HQ stays open, canvass printers keep running, and paid digital goes on the air."
      maxWidthClass="max-w-5xl"
      actions={
        <Button asChild variant="ldp" size="sm" className="border border-white/20 bg-white/10 hover:bg-white/20">
          <a
            href="https://loukydemparty.fillout.com/eventrequest"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Megaphone aria-hidden="true" className="mr-1 size-3.5" />
            Need your link? Ask Comms
          </a>
        </Button>
      }
    >
      {/* Raise math — the $620 per board member target. */}
      <section className="mb-10 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-red)] bg-white shadow-sm">
        <div
          aria-hidden="true"
          className="h-1.5 w-full"
          style={{
            background:
              "linear-gradient(90deg, var(--color-ldp-red) 0%, var(--color-ldp-gold) 50%, #059669 100%)",
          }}
        />
        <div className="p-6">
          <div className="flex items-center gap-2">
            <Target aria-hidden="true" className="size-4 text-[var(--color-ldp-red)]" />
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
              Every board member · Annual floor
            </div>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ldp-navy-900)] md:text-3xl">
            $620 per board member. {memberCount} of you. That&apos;s ${annualFloor.toLocaleString()}{" "}
            we can count on — minimum.
          </h2>
          <div className="mt-5 grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <MathTile
              icon={<DollarSign aria-hidden="true" className="size-4" />}
              value="$120"
              label="$10/month personal"
              sub="The $120 Club — auto-pay dues"
              accent="var(--color-ldp-navy-800)"
            />
            <Operator sign="+" color="var(--color-ldp-red)" />
            <MathTile
              icon={<Link2 aria-hidden="true" className="size-4" />}
              value="$500"
              label="Raised via your links"
              sub="Your ticket-link sales across all 3 events"
              accent="var(--color-ldp-red)"
              highlight
            />
            <Operator sign="=" color="#059669" />
            <MathTile
              icon={<TrendingUp aria-hidden="true" className="size-4" />}
              value="$620"
              label="Per member, per year"
              sub={`× ${memberCount} = $${annualFloor.toLocaleString()} floor`}
              accent="#059669"
            />
          </div>
          <p className="mt-5 text-sm text-[var(--color-ldp-ink-900)]">
            That floor is before any ticket beyond your personal network, any corporate sponsor
            you bring in, any major donor we close at a house party.{" "}
            <strong className="text-[var(--color-ldp-navy-900)]">
              $620 is the minimum the party needs from every person on this board
            </strong>
            {" "}to run the 2026 cycle the way Louisville deserves.
          </p>
        </div>
      </section>

      {/* How the personal-link system works — the flywheel. */}
      <section className="mb-10">
        <div className="mb-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-gold)]">
            How it works · The personal-link system
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            Your link. Your credit. Zero spreadsheets.
          </h2>
        </div>
        <ol className="grid gap-3 md:grid-cols-4">
          <FlywheelStep
            n={1}
            icon={<Send aria-hidden="true" className="size-4" />}
            title="Your link arrives"
            body="~30 days before each event, Comms emails you a unique URL. One link per event, per member."
          />
          <FlywheelStep
            n={2}
            icon={<Megaphone aria-hidden="true" className="size-4" />}
            title="You push it everywhere"
            body="Text friends, post to social, email your list, hand it out at the bar. Every share = more chances to close."
          />
          <FlywheelStep
            n={3}
            icon={<Ticket aria-hidden="true" className="size-4" />}
            title="They buy, you get credit"
            body="Every ticket sold through your link is tagged to you automatically. No reports to file, no spreadsheets."
          />
          <FlywheelStep
            n={4}
            icon={<CheckCircle2 aria-hidden="true" className="size-4" />}
            title="You hit $500"
            body="Three events, $500 raised. That plus your $120 = party funded. Canvass printing, HQ rent, ads — all of it."
            emphasis
          />
        </ol>
        <div className="mt-5 rounded-lg border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] p-4">
          <div className="flex items-start gap-3">
            <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--color-ldp-navy-700)]" />
            <div className="flex-1">
              <div className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
                Watch your email ~30 days before each event.
              </div>
              <p className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">
                Links go out automatically from Communications — no action needed on your end
                until one lands. The earlier you have your link, the longer you have to share it.
                Once it&apos;s live, every ticket sold through it counts toward your $500 raise.
              </p>
              <p className="mt-2 rounded-md bg-[var(--color-ldp-gold)]/10 px-3 py-2 text-xs font-medium text-[var(--color-ldp-ink-900)]">
                <strong className="text-[var(--color-ldp-navy-900)]">Not wired up yet:</strong>{" "}
                the per-link ticket tracking isn&apos;t connected to live sales data at this stage.
                The $500 shown here is the target, not a running tally — your actual raise isn&apos;t
                yet displayed on this page.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <a
                    href="https://loukydemparty.fillout.com/eventrequest"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Comms intake form
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming events — the big three. */}
      {upcoming.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
              The three events
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              {upcoming.length} upcoming
            </span>
          </div>
          <div className="space-y-5">
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

      {/* Past events — compact. */}
      {past.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Past events
          </h2>
          <ul className="space-y-2">
            {past.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 text-sm opacity-70"
              >
                <div>
                  <div className="font-semibold text-[var(--color-ldp-navy-900)]">{e.name}</div>
                  <div className="text-xs text-[var(--color-ldp-ink-700)]">
                    {formatDate(e.event_date)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Money rules — kept, moved down since it's reference. */}
      <section
        id="money-rules"
        className="mb-10 rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-5"
      >
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-800)]">
          Money rules · Quick reference
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
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-800">
              <CheckCircle2 aria-hidden="true" className="size-3.5" /> Can accept
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
              <li>Personal checks from individuals (from a <em>personal</em> account)</li>
              <li>Personal credit/debit cards</li>
              <li>Ticket-sale revenue from signature events</li>
              <li>Contributions from registered PACs, within KREF limits</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[var(--color-ldp-red)]/30 bg-[#FFF5F6] p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              <XCircle aria-hidden="true" className="size-3.5" /> Cannot accept · Will return
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-ldp-ink-900)]">
              <li>
                <strong>Corporate checks</strong> — including law firms, LLCs, partnerships,
                S-corps, medical practices
              </li>
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
            <li>
              3. If they ask why:{" "}
              <em>
                &ldquo;Kentucky law (KRS 121.150) prohibits corporate money to party committees.
                Your personal contribution is always welcome.&rdquo;
              </em>
            </li>
            <li>4. When in doubt, hand it to the LDP Treasurer before it&apos;s deposited.</li>
          </ol>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ldp-ink-700)]">
          Authority:{" "}
          <a
            href="https://kref.ky.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ldp-navy-700)] underline"
          >
            Kentucky Registry of Election Finance (KREF)
          </a>
          . Full statute:{" "}
          <a
            href="https://apps.legislature.ky.gov/law/statutes/chapter.aspx?id=37247"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-ldp-navy-700)] underline"
          >
            KRS Chapter 121
          </a>
          .
        </p>
      </section>

      {/* Events committee */}
      {eventsCommittee && (
        <section className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-5">
          <div className="flex items-center gap-2">
            <Users aria-hidden="true" className="size-4 text-[var(--color-ldp-navy-700)]" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Events Committee
            </h3>
          </div>
          <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
            Events leadership rotates annually. If you want to lead an event next cycle, talk to
            the current Events Committee Chair.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild variant="ldp" size="sm">
              <Link href="/committees/EVENTS">Events Committee page →</Link>
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
          {eventsCommittee.drive_folder_url && <DriveAccessNote className="mt-3" />}
        </section>
      )}
    </HubShell>
  );
}

function MathTile({
  icon,
  value,
  label,
  sub,
  accent,
  highlight = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub: string;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border bg-white p-4 ${highlight ? "ring-2 ring-offset-2" : ""}`}
      style={{
        borderColor: accent,
        borderWidth: highlight ? 2 : 1,
        ...(highlight ? { boxShadow: `0 0 0 3px ${accent}22` } : {}),
      }}
    >
      <div
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: accent }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-2 text-4xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
        {value}
      </div>
      <div className="mt-1 text-[11px] leading-snug text-[var(--color-ldp-ink-700)]">{sub}</div>
    </div>
  );
}

function Operator({ sign, color }: { sign: "+" | "="; color: string }) {
  return (
    <div className="flex items-center justify-center py-2 md:py-0">
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-full text-4xl font-black leading-none text-white shadow-md md:size-16 md:text-5xl"
        style={{ backgroundColor: color }}
      >
        {sign}
      </span>
    </div>
  );
}

function FlywheelStep({
  n,
  icon,
  title,
  body,
  emphasis = false,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
  emphasis?: boolean;
}) {
  return (
    <li
      className={`relative rounded-xl border bg-white p-4 ${
        emphasis
          ? "border-emerald-500 bg-emerald-50/50"
          : "border-[var(--color-ldp-line)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`flex size-7 items-center justify-center rounded-full text-xs font-bold text-white shadow ${
            emphasis ? "bg-emerald-600" : "bg-[var(--color-ldp-navy-800)]"
          }`}
        >
          {n}
        </span>
        <span
          className={
            emphasis
              ? "text-emerald-700"
              : "text-[var(--color-ldp-navy-700)]"
          }
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 text-sm font-bold text-[var(--color-ldp-navy-900)]">{title}</div>
      <p className="mt-1 text-xs leading-relaxed text-[var(--color-ldp-ink-700)]">{body}</p>
    </li>
  );
}

function EventCard({ event, chair }: { event: Event; chair: Chair | null | undefined }) {
  const theme = themeFor(event.type);
  const du = daysUntil(event.event_date);
  const linkOpen = du != null && du >= 0 && du <= 30;
  const teedUp = du != null && du > 30 && du <= 90;
  const distant = du != null && du > 90;
  const dateKnown = du != null;

  return (
    <article
      className="overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all"
      style={{ borderColor: linkOpen ? theme.accent : "var(--color-ldp-line)" }}
    >
      {/* Signature color stripe */}
      <div
        aria-hidden="true"
        className="h-2 w-full"
        style={{ backgroundColor: theme.accent }}
      />

      <div className="p-5" style={{ backgroundColor: linkOpen ? theme.bgTint : undefined }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: theme.accent }}
            >
              {theme.tagline}
            </div>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              {event.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-ldp-ink-900)]">
              <span className="inline-flex items-center gap-1.5">
                <Calendar aria-hidden="true" className="size-4 text-[var(--color-ldp-navy-700)]" />
                {event.date_is_approximate ? (
                  <span className="italic text-[var(--color-ldp-ink-700)]">
                    {event.event_window_description ?? "Date TBD"}
                    <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
                      · date TBD
                    </span>
                  </span>
                ) : (
                  formatDate(event.event_date) ?? (
                    <span className="italic text-[var(--color-ldp-ink-700)]">
                      {event.event_window_description ?? "Date on the public calendar"}
                    </span>
                  )
                )}
              </span>
              {event.venue && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-4 text-[var(--color-ldp-navy-700)]" />
                  {event.venue}
                </span>
              )}
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
              {theme.pitch}
            </p>
          </div>

          {/* Countdown box */}
          {dateKnown && du != null && du >= 0 && (
            <div
              className="shrink-0 rounded-lg border-2 px-4 py-2 text-center"
              style={{
                borderColor: theme.accent,
                backgroundColor: "white",
              }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: theme.accent }}
              >
                In
              </div>
              <div
                className="text-3xl font-black leading-none"
                style={{ color: theme.accent }}
              >
                {du}
              </div>
              <div
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: theme.accent }}
              >
                day{du === 1 ? "" : "s"}
              </div>
            </div>
          )}
        </div>

        {/* Link-status banner */}
        {linkOpen && (
          <div
            className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border-2 p-4"
            style={{ borderColor: theme.accent, backgroundColor: "white" }}
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: theme.accent }}
            >
              <Link2 aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: theme.accent }}
              >
                Ticket-link window is OPEN
              </div>
              <div className="mt-0.5 text-sm font-bold text-[var(--color-ldp-navy-900)]">
                Your personalized ticket link is live. Every ticket sold through your link counts
                toward your $500 raise.
              </div>
              <div className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">
                Check your email from Comms. Can&apos;t find it?{" "}
                <a
                  href="mailto:lisatnorkus@gmail.com?subject=LDPEC%20ticket%20link%20missing"
                  className="text-[var(--color-ldp-navy-700)] underline"
                >
                  Email Lisa
                </a>
                .
              </div>
            </div>
          </div>
        )}

        {teedUp && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-[var(--color-ldp-gold)] bg-[#FEF9E7] p-3 text-xs">
            <AlertCircle aria-hidden="true" className="size-4 text-[var(--color-ldp-gold)]" />
            <span className="text-[var(--color-ldp-ink-900)]">
              <strong>Ticket-link window opens ~30 days out.</strong> Start building your guest
              list now — who are you inviting? Who are you asking to host a table?
            </span>
          </div>
        )}

        {distant && (
          <div className="mt-5 flex items-center gap-2 text-xs text-[var(--color-ldp-ink-700)]">
            <Calendar aria-hidden="true" className="size-3.5" />
            <span>
              Long runway. Start prospecting — who would you want to see at this event?
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          {event.tickets_url ? (
            <Button
              asChild
              size="sm"
              variant="ldp"
              className="font-bold"
              style={{ backgroundColor: theme.accent }}
            >
              <a
                href={event.tickets_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                <Ticket aria-hidden="true" className="size-4" />
                Tickets & sponsorship
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </a>
            </Button>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-1.5 text-xs text-[var(--color-ldp-ink-700)]">
              <Link2 aria-hidden="true" className="size-3.5" />
              Your personal link will appear here once Comms generates it (~30 days before the event).
            </div>
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
          {chair && (
            <Link
              href={`/people/${chair.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-ldp-ink-900)] transition-colors hover:border-[var(--color-ldp-navy-700)]"
            >
              <Users aria-hidden="true" className="size-3.5" />
              Chair: {displayName(chair)}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
