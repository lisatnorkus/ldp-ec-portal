import "server-only";

// Fetches the Louisville Democratic Party public Google Calendar
// via iCal and returns typed events. No API key — the calendar is
// public. Cached 1 hour per Next.js fetch revalidate so we don't
// hammer the feed on every page load.
//
// Feed URL pattern:
//   https://calendar.google.com/calendar/ical/<urlencoded-email>/public/basic.ics

const LDP_CALENDAR_ICAL_URL =
  "https://calendar.google.com/calendar/ical/info%40louisvilledems.com/public/basic.ics";

export type LdpEvent = {
  uid: string;
  summary: string;
  description: string;
  location: string;
  start: Date;
  end: Date | null;
  allDay: boolean;
  organizer: string | null;
  // Link back to the public calendar. Google doesn't include htmlLink
  // in iCal, so we leave it null and let the UI surface "Details in
  // description" or a generic calendar link.
};

export type MonthGroup = {
  year: number;
  month: number; // 1-12
  events: LdpEvent[];
};

// Spam patterns — Google Calendar spam invitations that show up on
// public calendars. Keep this list tight; false negatives are cheaper
// than hiding real events.
const SPAM_PATTERNS: RegExp[] = [
  /mcafee/i,
  /mc[aáà][^a-z]?fee/i,
  /norton/i,
  /subscription\s+will\s+be\s+renewed/i,
  /your\s+service\s+information\s+has\s+been\s+updated/i,
  /invoice\s+receipt/i,
  /payment\s+confirmation/i,
  /geek\s*squad/i,
  /paypal.*charged/i,
  /antivirus/i,
];

function isSpam(summary: string, description: string): boolean {
  const text = `${summary} ${description}`;
  return SPAM_PATTERNS.some((p) => p.test(text));
}

export async function fetchLdpCalendarEvents(): Promise<LdpEvent[]> {
  const res = await fetch(LDP_CALENDAR_ICAL_URL, {
    next: { revalidate: 3600 }, // 1 hour
  });
  if (!res.ok) {
    throw new Error(`LDP calendar fetch failed: ${res.status}`);
  }
  const ics = await res.text();
  return parseIcs(ics);
}

// Bucket events by year+month for past-events display. Drops events
// whose start year doesn't match `year`.
export function groupEventsByMonth(
  events: LdpEvent[],
  year: number
): MonthGroup[] {
  const buckets = new Map<string, LdpEvent[]>();
  for (const e of events) {
    if (e.start.getFullYear() !== year) continue;
    const m = e.start.getMonth() + 1;
    const key = `${year}-${m}`;
    const bucket = buckets.get(key) ?? [];
    bucket.push(e);
    buckets.set(key, bucket);
  }
  const out: MonthGroup[] = [];
  for (const [key, bucketEvents] of buckets) {
    const [y, m] = key.split("-").map(Number);
    bucketEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
    out.push({ year: y, month: m, events: bucketEvents });
  }
  out.sort((a, b) => a.month - b.month);
  return out;
}

// Filter helper: events starting within [start, end) sorted ascending.
export function eventsInRange(
  events: LdpEvent[],
  start: Date,
  end: Date
): LdpEvent[] {
  return events
    .filter((e) => e.start >= start && e.start < end)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

// ---- iCal parser ---------------------------------------------------
//
// Minimal VEVENT parser. Handles line unfolding (RFC 5545 §3.1 —
// lines starting with a space continue the previous line), basic
// property parsing (PROP[;PARAMS]:VALUE), and DTSTART/DTEND with
// VALUE=DATE (all-day) or dateTime forms. Unescapes \n, \, and ;.

function parseIcs(ics: string): LdpEvent[] {
  const lines = unfoldLines(ics);
  const events: LdpEvent[] = [];
  let current: Partial<RawEvent> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) {
        const e = finalizeEvent(current);
        if (e && !isSpam(e.summary, e.description)) events.push(e);
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx < 0) continue;
    const head = line.slice(0, colonIdx);
    const value = line.slice(colonIdx + 1);
    const [prop, ...paramPairs] = head.split(";");
    const params: Record<string, string> = {};
    for (const p of paramPairs) {
      const eq = p.indexOf("=");
      if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1);
    }

    switch (prop.toUpperCase()) {
      case "UID":
        current.uid = value;
        break;
      case "SUMMARY":
        current.summary = unescapeIcal(value);
        break;
      case "DESCRIPTION":
        current.description = unescapeIcal(value);
        break;
      case "LOCATION":
        current.location = unescapeIcal(value);
        break;
      case "ORGANIZER":
        // ORGANIZER;CN=Louisville Dems:mailto:info@louisvilledems.com
        current.organizerName = params["CN"] ?? null;
        break;
      case "DTSTART":
        current.start = parseDateValue(value, params);
        current.startAllDay = params["VALUE"] === "DATE";
        break;
      case "DTEND":
        current.end = parseDateValue(value, params);
        break;
      case "STATUS":
        current.status = value;
        break;
    }
  }
  return events;
}

type RawEvent = {
  uid?: string;
  summary?: string;
  description?: string;
  location?: string;
  organizerName?: string | null;
  start?: Date | null;
  end?: Date | null;
  startAllDay?: boolean;
  status?: string;
};

function finalizeEvent(r: RawEvent): LdpEvent | null {
  if (!r.uid || !r.start) return null;
  if (r.status?.toUpperCase() === "CANCELLED") return null;
  return {
    uid: r.uid,
    summary: (r.summary ?? "").trim(),
    description: (r.description ?? "").trim(),
    location: (r.location ?? "").trim(),
    start: r.start,
    end: r.end ?? null,
    allDay: !!r.startAllDay,
    organizer: r.organizerName ?? null,
  };
}

function unfoldLines(ics: string): string[] {
  const raw = ics.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (const line of raw) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && out.length > 0) {
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function unescapeIcal(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function parseDateValue(value: string, params: Record<string, string>): Date | null {
  // All-day: VALUE=DATE → YYYYMMDD
  if (params["VALUE"] === "DATE") {
    if (value.length !== 8) return null;
    const y = Number(value.slice(0, 4));
    const m = Number(value.slice(4, 6));
    const d = Number(value.slice(6, 8));
    // Construct in local time so "April 20" doesn't slip to April 19
    // on Eastern-time callers.
    return new Date(y, m - 1, d);
  }
  // UTC: YYYYMMDDTHHMMSSZ
  if (value.endsWith("Z")) {
    const y = Number(value.slice(0, 4));
    const m = Number(value.slice(4, 6));
    const d = Number(value.slice(6, 8));
    const hh = Number(value.slice(9, 11));
    const mm = Number(value.slice(11, 13));
    const ss = Number(value.slice(13, 15));
    return new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
  }
  // Floating / local time: YYYYMMDDTHHMMSS, assume calendar tz
  // (America/New_York). For display we mostly use the date, so the
  // small rounding if the tz flips is acceptable.
  if (value.length >= 15) {
    const y = Number(value.slice(0, 4));
    const m = Number(value.slice(4, 6));
    const d = Number(value.slice(6, 8));
    const hh = Number(value.slice(9, 11));
    const mm = Number(value.slice(11, 13));
    const ss = Number(value.slice(13, 15));
    return new Date(y, m - 1, d, hh, mm, ss);
  }
  return null;
}

// Strip the Mobilize boilerplate that LDP uses on every Mobilize-
// sourced event description. We want the user-written body, not the
// "Click the link to sign up. If the link doesn't work..." template.
export function cleanDescription(desc: string): string {
  return desc
    .replace(/Louisville Democratic Party\s+https?:\/\/[^\s]+\s*/i, "")
    .replace(/League of Women Voters of Kentucky\s+https?:\/\/[^\s]+\s*/i, "")
    .replace(/Click the link to sign up\.[\s\S]*$/i, "")
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

// Try to extract a Mobilize signup URL from the description.
export function extractSignupUrl(desc: string): string | null {
  const match = desc.match(/https:\/\/www\.mobilize\.us\/[^\s<]+/);
  return match ? match[0] : null;
}
