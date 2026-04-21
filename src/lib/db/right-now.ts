import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getKypoliticsServer } from "@/lib/supabase/kypolitics";

export type LdSnapshot = {
  ld_number: number;
  precinct_count: number;
  pc_count: number;
  pc_precinct_count: number;
  dark_precinct_count: number;
  endorsed_candidate_count: number;
};

export type RightNowContext = {
  days_to_primary: number | null;
  primary_date_iso: string;
  voter_guide_url: string | null;
  next_event_name: string | null;
  next_event_days_until: number | null;
  next_event_tickets_url: string | null;
  ld_snapshots: LdSnapshot[];
};

const PRIMARY_ISO = "2026-05-19";

export async function fetchRightNowContext(): Promise<RightNowContext> {
  const supabase = await getSupabaseServer();
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const primaryDate = new Date(PRIMARY_ISO + "T00:00:00");
  const daysToPrimary = Math.round(
    (primaryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const [voterGuide, nextEvent, pcRows, candidateRows] = await Promise.all([
    supabase.from("settings").select("value").eq("key", "voter_guide_url").maybeSingle(),
    supabase
      .from("events")
      .select("id, name, event_date, tickets_url")
      .eq("active", true)
      .gte("event_date", todayIso)
      .order("event_date", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase.from("precinct_captains").select("ld_number, precinct_code"),
    supabase
      .from("candidates")
      .select("office_type, district_number, is_endorsed")
      .eq("cycle_year", 2026)
      .eq("is_endorsed", true),
  ]);

  // Fetch precinct counts per LD from kypolitics.
  const kypolitics = await getKypoliticsServer();
  const LD_NUMBERS = [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 46, 48];
  const { data: precinctRows } = await kypolitics
    .from("precincts")
    .select("hd")
    .in("hd", LD_NUMBERS.map(String));

  const precinctCountByLd = new Map<number, number>();
  for (const p of precinctRows ?? []) {
    const n = parseInt(p.hd, 10);
    if (!Number.isNaN(n)) {
      precinctCountByLd.set(n, (precinctCountByLd.get(n) ?? 0) + 1);
    }
  }

  // PC counts + distinct precincts per LD
  const pcCountByLd = new Map<number, number>();
  const pcPrecinctsByLd = new Map<number, Set<string>>();
  for (const r of pcRows.data ?? []) {
    const ld = r.ld_number as number;
    const pre = r.precinct_code as string;
    pcCountByLd.set(ld, (pcCountByLd.get(ld) ?? 0) + 1);
    const set = pcPrecinctsByLd.get(ld) ?? new Set<string>();
    set.add(pre);
    pcPrecinctsByLd.set(ld, set);
  }

  // Endorsed-candidate counts per LD (State House only — Metro Council
  // endorsements aren't scoped to LD).
  const endorsedByLd = new Map<number, number>();
  for (const c of candidateRows.data ?? []) {
    if (c.office_type !== "STATE_HOUSE") continue;
    const ld = c.district_number as number;
    endorsedByLd.set(ld, (endorsedByLd.get(ld) ?? 0) + 1);
  }

  const ld_snapshots: LdSnapshot[] = LD_NUMBERS.map((ld) => {
    const precinct_count = precinctCountByLd.get(ld) ?? 0;
    const pc_count = pcCountByLd.get(ld) ?? 0;
    const pc_precinct_count = pcPrecinctsByLd.get(ld)?.size ?? 0;
    return {
      ld_number: ld,
      precinct_count,
      pc_count,
      pc_precinct_count,
      dark_precinct_count: Math.max(0, precinct_count - pc_precinct_count),
      endorsed_candidate_count: endorsedByLd.get(ld) ?? 0,
    };
  });

  const nextEventDate = nextEvent.data?.event_date
    ? new Date(nextEvent.data.event_date + "T00:00:00")
    : null;
  const nextEventDaysUntil = nextEventDate
    ? Math.max(0, Math.round((nextEventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  return {
    days_to_primary: daysToPrimary >= 0 ? daysToPrimary : null,
    primary_date_iso: PRIMARY_ISO,
    voter_guide_url: (voterGuide.data?.value as string | undefined) ?? null,
    next_event_name: nextEvent.data?.name ?? null,
    next_event_days_until: nextEventDaysUntil,
    next_event_tickets_url: (nextEvent.data?.tickets_url as string | undefined) ?? null,
    ld_snapshots,
  };
}
