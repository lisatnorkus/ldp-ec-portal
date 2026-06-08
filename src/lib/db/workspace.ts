import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type {
  PostAssignmentRow,
  WorkspacePost,
  WorkspacePostRow,
} from "./workspace-shared";

// Client-safe types/constants live in ./workspace-shared. Re-exported
// here so existing server callers keep one import path.
export * from "./workspace-shared";

export async function fetchPosts(committee_code: string): Promise<WorkspacePost[]> {
  const supabase = await getSupabaseServer();
  const { data: posts, error } = await supabase
    .from("workspace_posts")
    .select("*")
    .eq("committee_code", committee_code)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchPosts error", error);
    return [];
  }
  const rows = (posts ?? []) as WorkspacePostRow[];
  const actionItemIds = rows.filter((p) => p.post_type === "ACTION_ITEM").map((p) => p.id);
  if (actionItemIds.length === 0) {
    return rows.map((p) => ({ ...p, assignments: [] }));
  }
  const { data: assignments, error: aErr } = await supabase
    .from("post_assignments")
    .select("*")
    .in("post_id", actionItemIds);
  if (aErr) {
    console.error("fetchPosts assignments error", aErr);
    return rows.map((p) => ({ ...p, assignments: [] }));
  }
  const byPost = new Map<string, PostAssignmentRow[]>();
  for (const a of (assignments ?? []) as PostAssignmentRow[]) {
    const list = byPost.get(a.post_id) ?? [];
    list.push(a);
    byPost.set(a.post_id, list);
  }
  return rows.map((p) => ({ ...p, assignments: byPost.get(p.id) ?? [] }));
}

// Upcoming meetings (for the dashboard "Upcoming for you" strip + the
// workspace's own header). Returns AGENDA posts with meeting_date today
// or later, ordered by date.
export async function fetchUpcomingMeetings(
  committee_code?: string
): Promise<WorkspacePostRow[]> {
  const supabase = await getSupabaseServer();
  const today = new Date().toISOString().slice(0, 10);
  let q = supabase
    .from("workspace_posts")
    .select("*")
    .eq("post_type", "AGENDA")
    .gte("meeting_date", today)
    .order("meeting_date", { ascending: true });
  if (committee_code) q = q.eq("committee_code", committee_code);
  const { data, error } = await q;
  if (error) {
    console.error("fetchUpcomingMeetings error", error);
    return [];
  }
  return (data ?? []) as WorkspacePostRow[];
}

// Assignables for a committee workspace — chair + every member of that
// committee with a resolved ec_members row. Returns member_id (real
// uuid) so post_assignments can FK to ec_members properly.
export type WorkspaceAssignable = {
  member_id: string;
  name: string;
  role: string;
};

export async function fetchAssignablesForCommittee(
  committee_code: string
): Promise<WorkspaceAssignable[]> {
  const supabase = await getSupabaseServer();
  // Anyone whose committee_chair_codes OR committee_member_codes
  // contains this committee_code. Postgres array operators via the
  // contains() helper on the column.
  const [chairs, members] = await Promise.all([
    supabase
      .from("ec_members")
      .select("id, first_name, last_name, preferred_name, ld_number, primary_role")
      .contains("committee_chair_codes", [committee_code]),
    supabase
      .from("ec_members")
      .select("id, first_name, last_name, preferred_name, ld_number, primary_role")
      .contains("committee_member_codes", [committee_code]),
  ]);
  const seen = new Set<string>();
  const out: WorkspaceAssignable[] = [];
  type Row = {
    id: string;
    first_name: string;
    last_name: string;
    preferred_name: string | null;
    ld_number: number | null;
    primary_role: string;
  };
  function add(r: Row, label: string) {
    if (seen.has(r.id)) return;
    seen.add(r.id);
    const first = r.preferred_name ?? r.first_name;
    out.push({
      member_id: r.id,
      name: `${first} ${r.last_name}`.trim(),
      role: r.ld_number ? `${label} · LD${r.ld_number}` : label,
    });
  }
  for (const c of (chairs.data ?? []) as Row[]) add(c, "Chair");
  for (const m of (members.data ?? []) as Row[]) add(m, "Member");
  return out;
}

// Best-effort resolve a localStorage display_name to an ec_members.id.
// Exact match first, then case-insensitive, then first + last token.
// Returns null when no confident match — the server action can still
// insert with author_member_id=null + author_display_name as the string.
export async function resolveMemberIdByDisplayName(
  display_name: string
): Promise<string | null> {
  const trimmed = display_name.trim();
  if (!trimmed) return null;
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("ec_members")
    .select("id, first_name, last_name, preferred_name");
  if (!data) return null;
  type Row = { id: string; first_name: string; last_name: string; preferred_name: string | null };
  const rows = data as Row[];
  // Exact: "Preferred Last" or "First Last"
  for (const r of rows) {
    const first = r.preferred_name ?? r.first_name;
    if (`${first} ${r.last_name}` === trimmed) return r.id;
    if (`${r.first_name} ${r.last_name}` === trimmed) return r.id;
  }
  // Case-insensitive
  const lower = trimmed.toLowerCase();
  for (const r of rows) {
    const first = r.preferred_name ?? r.first_name;
    if (`${first} ${r.last_name}`.toLowerCase() === lower) return r.id;
    if (`${r.first_name} ${r.last_name}`.toLowerCase() === lower) return r.id;
  }
  // First + last token
  const tokens = trimmed.split(/\s+/);
  if (tokens.length >= 2) {
    const f = tokens[0].toLowerCase();
    const l = tokens[tokens.length - 1].toLowerCase();
    for (const r of rows) {
      const first = (r.preferred_name ?? r.first_name).toLowerCase();
      if (first === f && r.last_name.toLowerCase() === l) return r.id;
    }
  }
  return null;
}

// rollupAssignmentStatus, RollupStatus, POST_TYPE_LABEL all live in
// workspace-shared.ts now and are re-exported at the top of this file.
