import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  LinkedPost,
  MeetingRecord,
  MeetingRecordRow,
  PromotableNotesPost,
} from "./meeting-records-shared";

// Client-safe types/constants live in ./meeting-records-shared. Re-exported
// here so existing server callers keep one import path.
export * from "./meeting-records-shared";

// Hydrate raw rows into MeetingRecord (joins minutes + treasurer report
// posts + committee name + approver name in batch). Used by every list
// query below.
async function hydrateRecords(
  rows: MeetingRecordRow[]
): Promise<MeetingRecord[]> {
  if (rows.length === 0) return [];
  const supabase = await getSupabaseServer();
  const postIds = new Set<string>();
  const memberIds = new Set<string>();
  const committeeCodes = new Set<string>();
  for (const r of rows) {
    if (r.minutes_post_id) postIds.add(r.minutes_post_id);
    if (r.treasurer_report_post_id) postIds.add(r.treasurer_report_post_id);
    if (r.approved_by_member_id) memberIds.add(r.approved_by_member_id);
    if (r.committee_code) committeeCodes.add(r.committee_code);
  }
  const [postsRes, membersRes, committeesRes] = await Promise.all([
    postIds.size
      ? supabase
          .from("workspace_posts")
          .select("id, title, content_md, author_display_name, created_at")
          .in("id", [...postIds])
      : Promise.resolve({ data: [] as LinkedPost[] }),
    memberIds.size
      ? supabase
          .from("ec_members")
          .select("id, first_name, last_name, preferred_name")
          .in("id", [...memberIds])
      : Promise.resolve({ data: [] as Array<{ id: string; first_name: string; last_name: string; preferred_name: string | null }> }),
    committeeCodes.size
      ? supabase.from("committees").select("code, name").in("code", [...committeeCodes])
      : Promise.resolve({ data: [] as Array<{ code: string; name: string }> }),
  ]);
  const postsById = new Map<string, LinkedPost>();
  for (const p of (postsRes.data ?? []) as LinkedPost[]) postsById.set(p.id, p);
  const memberNameById = new Map<string, string>();
  for (const m of (membersRes.data ?? []) as Array<{
    id: string;
    first_name: string;
    last_name: string;
    preferred_name: string | null;
  }>) {
    const first = m.preferred_name ?? m.first_name;
    memberNameById.set(m.id, `${first} ${m.last_name}`.trim());
  }
  const committeeNameByCode = new Map<string, string>();
  for (const c of (committeesRes.data ?? []) as Array<{ code: string; name: string }>) {
    committeeNameByCode.set(c.code, c.name);
  }
  return rows.map((r) => ({
    ...r,
    committee_name: r.committee_code
      ? committeeNameByCode.get(r.committee_code) ?? null
      : null,
    minutes: r.minutes_post_id ? postsById.get(r.minutes_post_id) ?? null : null,
    treasurer_report: r.treasurer_report_post_id
      ? postsById.get(r.treasurer_report_post_id) ?? null
      : null,
    approved_by_name: r.approved_by_member_id
      ? memberNameById.get(r.approved_by_member_id) ?? null
      : null,
  }));
}

export async function fetchAllMeetingRecords(): Promise<MeetingRecord[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("meeting_records")
    .select("*")
    .order("meeting_date", { ascending: false });
  if (error) {
    console.error("fetchAllMeetingRecords error", error);
    return [];
  }
  return hydrateRecords((data ?? []) as MeetingRecordRow[]);
}

export async function fetchLdpecMeetingRecords(): Promise<MeetingRecord[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("meeting_records")
    .select("*")
    .eq("meeting_type", "LDPEC")
    .order("meeting_date", { ascending: false });
  if (error) {
    console.error("fetchLdpecMeetingRecords error", error);
    return [];
  }
  return hydrateRecords((data ?? []) as MeetingRecordRow[]);
}

export async function fetchCommitteeMeetingRecords(
  committee_code: string
): Promise<MeetingRecord[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("meeting_records")
    .select("*")
    .eq("meeting_type", "COMMITTEE")
    .eq("committee_code", committee_code)
    .order("meeting_date", { ascending: false });
  if (error) {
    console.error("fetchCommitteeMeetingRecords error", error);
    return [];
  }
  return hydrateRecords((data ?? []) as MeetingRecordRow[]);
}

// For YIR: the last N months of records across LDPEC + every committee.
// Defaults to a 12-month window — the "year in review" framing.
export async function fetchMeetingRecordsSince(
  since: Date
): Promise<MeetingRecord[]> {
  const supabase = await getSupabaseServer();
  const sinceIso = since.toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("meeting_records")
    .select("*")
    .gte("meeting_date", sinceIso)
    .order("meeting_date", { ascending: false });
  if (error) {
    console.error("fetchMeetingRecordsSince error", error);
    return [];
  }
  return hydrateRecords((data ?? []) as MeetingRecordRow[]);
}

// fetchPromotableNotesPosts: returns NOTES posts with a meeting_date set
// that haven't been promoted into a meeting_record yet. Bounded to the
// last 18 months so the picker doesn't grow unbounded.
export async function fetchPromotableNotesPosts(): Promise<PromotableNotesPost[]> {
  const supabase = await getSupabaseServer();
  const since = new Date();
  since.setMonth(since.getMonth() - 18);
  const sinceIso = since.toISOString().slice(0, 10);

  const [postsRes, recordsRes, committeesRes] = await Promise.all([
    supabase
      .from("workspace_posts")
      .select("id, committee_code, title, meeting_date, author_display_name, created_at")
      .eq("post_type", "NOTES")
      .gte("meeting_date", sinceIso)
      .not("meeting_date", "is", null)
      .order("meeting_date", { ascending: false }),
    supabase.from("meeting_records").select("minutes_post_id"),
    supabase.from("committees").select("code, name"),
  ]);
  if (postsRes.error) {
    console.error("fetchPromotableNotesPosts posts error", postsRes.error);
    return [];
  }
  const taken = new Set(
    ((recordsRes.data ?? []) as Array<{ minutes_post_id: string | null }>)
      .map((r) => r.minutes_post_id)
      .filter((v): v is string => !!v)
  );
  const committeeNameByCode = new Map<string, string>();
  for (const c of (committeesRes.data ?? []) as Array<{ code: string; name: string }>) {
    committeeNameByCode.set(c.code, c.name);
  }
  type Row = {
    id: string;
    committee_code: string;
    title: string | null;
    meeting_date: string;
    author_display_name: string;
    created_at: string;
  };
  const rows = (postsRes.data ?? []) as Row[];
  return rows
    .filter((p) => !taken.has(p.id))
    .map((p) => ({
      ...p,
      committee_name: committeeNameByCode.get(p.committee_code) ?? null,
    }));
}

// MEETING_STATUS_LABEL + MEETING_STATUS_COLOR live in
// meeting-records-shared.ts now and are re-exported at the top of this file.
