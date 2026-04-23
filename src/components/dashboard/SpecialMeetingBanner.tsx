import { AlertOctagon, Calendar, Vote } from "lucide-react";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";

// Loud banner for when a special meeting is called. Special meetings
// are rare — LJCDP normally runs on the fourth-Tuesday regular
// schedule — so when one is called, the whole board needs to see it.
// Pulled from the `settings` table so rotating it to the next special
// meeting is a data update, not a deploy. Self-hides once the meeting
// date is in the past.

type SpecialMeeting = {
  date: string;
  title: string;
  body: string;
};

async function fetchSpecialMeeting(): Promise<SpecialMeeting | null> {
  try {
    const supabase = await getSupabaseServer();
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [
        "special_meeting_date",
        "special_meeting_title",
        "special_meeting_body",
      ]);
    const map = new Map(((data ?? []) as { key: string; value: string }[]).map((r) => [r.key, r.value]));
    const date = map.get("special_meeting_date");
    const title = map.get("special_meeting_title");
    const body = map.get("special_meeting_body");
    if (!date || !title || !body) return null;
    // Hide once the meeting is past.
    if (new Date(date + "T23:59:59").getTime() < Date.now()) return null;
    return { date, title, body };
  } catch (err) {
    console.error("[SpecialMeetingBanner] fetch failed", err);
    return null;
  }
}

function daysUntil(iso: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const today = new Date();
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(iso + "T00:00:00");
  const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.max(0, Math.round((targetDate.getTime() - todayDate.getTime()) / msPerDay));
}

function formatMeetingDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function SpecialMeetingBanner() {
  const meeting = await fetchSpecialMeeting();
  if (!meeting) return null;

  const days = daysUntil(meeting.date);
  const urgent = days <= 14;

  return (
    <section className="mb-8 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-red)] bg-white shadow-lg">
      <div
        aria-hidden="true"
        className="h-2 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-red) 0%, var(--color-ldp-gold) 50%, var(--color-ldp-navy-700) 100%)",
        }}
      />
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-6">
        <div
          className="flex shrink-0 items-center justify-center rounded-xl px-5 py-4 text-white md:w-32"
          style={{
            background:
              "linear-gradient(135deg, var(--color-ldp-red) 0%, #8A0B20 100%)",
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em]">
              <AlertOctagon aria-hidden="true" className="size-3" />
              In
            </div>
            <div className="mt-1 text-4xl font-black leading-none">{days}</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-widest">
              day{days === 1 ? "" : "s"}
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-ldp-red)]">
            <AlertOctagon aria-hidden="true" className="size-3.5" />
            Special meeting called · rare
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.02em] text-[var(--color-ldp-navy-900)]">
            {meeting.title}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--color-ldp-navy-800)]">
            <Calendar aria-hidden="true" className="size-4" />
            {formatMeetingDate(meeting.date)}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
            {meeting.body}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/transitions"
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-red)] px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
            >
              <Vote aria-hidden="true" className="size-3.5" />
              See the transition detail →
            </Link>
            <Link
              href="/governance"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-800)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-navy-800)] hover:text-white"
            >
              Meeting rules + quorum
            </Link>
          </div>
          {urgent && (
            <div className="mt-3 rounded-md border-l-4 border-[var(--color-ldp-red)] bg-[#FFF5F6] p-2 text-xs font-bold text-[var(--color-ldp-red)]">
              ⚠ Under two weeks. Confirm you&apos;re voting in person — NO PROXIES
              on this ballot.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
