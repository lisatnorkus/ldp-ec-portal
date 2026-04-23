// KDP's monthly county-party call. Scheduled by KDP (Morgan Eaves hosts);
// KDP treats Jefferson County LD Chairs and VCs as county chairs and
// includes them on this call. The call runs every third Tuesday at 7pm ET.
//
// We compute the next occurrence at render time so the date auto-rolls
// each month — no manual maintenance. Zoom URL + IDs live in the
// `settings` table so Morgan rotating the link is a data update, not
// a deploy (see fetchKdpCallMeta in this file). The hardcoded values
// are the fallback if the settings rows are missing.

export const KDP_CALL_DEFAULTS = {
  zoomUrl: "https://us02web.zoom.us/j/84094120630?pwd=SXv4Da1uPCsDl7Fb18l35IW4LC6D3I.1",
  meetingId: "840 9412 0630",
  passcode: "645896",
  startLocalLabel: "7:00pm ET",
  cadenceLabel: "3rd Tue monthly",
  host: "Morgan Eaves (KDP)",
} as const;

export type KdpCallMeta = typeof KDP_CALL_DEFAULTS;

export type KdpCallDate = {
  iso: string;
  label: string;
  isToday: boolean;
  daysUntil: number;
};

function thirdTuesdayCalendarDate(year: number, monthIdx: number): Date {
  const first = new Date(year, monthIdx, 1);
  const offsetToFirstTuesday = (2 - first.getDay() + 7) % 7;
  return new Date(year, monthIdx, 1 + offsetToFirstTuesday + 14);
}

export function getNextKdpCall(now: Date = new Date()): KdpCallDate {
  // Pin "today" to America/New_York so servers running in UTC still
  // compute the correct calendar day.
  const etNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const thisMonthsCall = thirdTuesdayCalendarDate(etNow.getFullYear(), etNow.getMonth());
  const todayDateOnly = new Date(etNow.getFullYear(), etNow.getMonth(), etNow.getDate());

  let target = thisMonthsCall;
  if (todayDateOnly.getTime() > thisMonthsCall.getTime()) {
    const nextMonthIdx = etNow.getMonth() === 11 ? 0 : etNow.getMonth() + 1;
    const nextYear = etNow.getMonth() === 11 ? etNow.getFullYear() + 1 : etNow.getFullYear();
    target = thirdTuesdayCalendarDate(nextYear, nextMonthIdx);
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntil = Math.round((target.getTime() - todayDateOnly.getTime()) / msPerDay);

  const iso = [
    target.getFullYear(),
    String(target.getMonth() + 1).padStart(2, "0"),
    String(target.getDate()).padStart(2, "0"),
  ].join("-");

  const label = target.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return { iso, label, isToday: daysUntil === 0, daysUntil };
}
