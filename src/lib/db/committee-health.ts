import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import { fetchAllMembers, displayName } from "./members";
import type { CommitteeHealth } from "./committee-health-shared";

// Per-committee operational health for the officer dashboard. The chair
// needs to see which committees are running and which have gone dark —
// at a glance, not by clicking into each one.
//
// Client-safe types/helpers live in ./committee-health-shared. Re-exported
// here so server callers keep one import path.
export * from "./committee-health-shared";

export async function fetchCommitteeHealth(): Promise<CommitteeHealth[]> {
  const supabase = await getSupabaseServer();
  const today = new Date().toISOString().slice(0, 10);

  // Batch every read so the officer dashboard doesn't open N+1 queries
  // per committee. We pull all workspace_posts + all post_assignments +
  // all meeting_records + the committees + members list, then fold
  // them in memory.
  const [committeesRes, postsRes, assignmentsRes, recordsRes, members] =
    await Promise.all([
      supabase.from("committees").select("*").eq("active", true).order("display_order"),
      supabase
        .from("workspace_posts")
        .select(
          "id, committee_code, post_type, meeting_date, created_at"
        ),
      supabase.from("post_assignments").select("post_id, status"),
      supabase
        .from("meeting_records")
        .select("committee_code, minutes_post_id, meeting_type"),
      fetchAllMembers(),
    ]);

  const committees =
    (committeesRes.data ?? []) as Array<{
      code: string;
      name: string;
      type: "STANDING" | "AD_HOC";
      chair_id: string | null;
    }>;
  const posts =
    (postsRes.data ?? []) as Array<{
      id: string;
      committee_code: string;
      post_type: string;
      meeting_date: string | null;
      created_at: string;
    }>;
  const assignments =
    (assignmentsRes.data ?? []) as Array<{ post_id: string; status: string }>;
  const records =
    (recordsRes.data ?? []) as Array<{
      committee_code: string | null;
      minutes_post_id: string | null;
      meeting_type: string;
    }>;

  const memberById = new Map(members.map((m) => [m.id, m]));

  // Index posts → committee. Group AGENDA / NOTES with meeting_date for
  // "last met" + "next meeting" lookups.
  type PostRow = (typeof posts)[number];
  const postsByCommittee = new Map<string, PostRow[]>();
  for (const p of posts) {
    const arr = postsByCommittee.get(p.committee_code) ?? [];
    arr.push(p);
    postsByCommittee.set(p.committee_code, arr);
  }

  // Index assignments → post_id → status counts.
  const assignmentsByPost = new Map<string, string[]>();
  for (const a of assignments) {
    const arr = assignmentsByPost.get(a.post_id) ?? [];
    arr.push(a.status);
    assignmentsByPost.set(a.post_id, arr);
  }

  // Set of minutes_post_ids that ARE published — used to detect
  // unpublished NOTES.
  const publishedMinutesPostIds = new Set<string>();
  for (const r of records) {
    if (r.minutes_post_id) publishedMinutesPostIds.add(r.minutes_post_id);
  }

  const out: CommitteeHealth[] = committees.map((c) => {
    const cPosts = (postsByCommittee.get(c.code) ?? []).sort(
      (a, b) => b.created_at.localeCompare(a.created_at)
    );
    const last_activity_at = cPosts[0]?.created_at ?? null;
    const days_since_activity = last_activity_at
      ? Math.floor(
          (Date.now() - new Date(last_activity_at).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    const meetingPosts = cPosts.filter(
      (p) =>
        (p.post_type === "AGENDA" || p.post_type === "NOTES") && p.meeting_date
    );
    const past = meetingPosts
      .filter((p) => (p.meeting_date as string) < today)
      .sort((a, b) =>
        (b.meeting_date as string).localeCompare(a.meeting_date as string)
      );
    const upcoming = meetingPosts
      .filter((p) => (p.meeting_date as string) >= today)
      .sort((a, b) =>
        (a.meeting_date as string).localeCompare(b.meeting_date as string)
      );

    // Count open + pending action items across this committee. An
    // action-item post has assignments; we count distinct posts with at
    // least one non-DONE/non-REJECTED assignment as "open" and posts
    // where ALL assignments are PENDING as "pending."
    const actionPosts = cPosts.filter((p) => p.post_type === "ACTION_ITEM");
    let open = 0;
    let pending = 0;
    for (const ap of actionPosts) {
      const statuses = assignmentsByPost.get(ap.id) ?? [];
      if (statuses.length === 0) continue;
      const stillOpen = statuses.some(
        (s) => s !== "DONE" && s !== "REJECTED"
      );
      if (stillOpen) open += 1;
      if (statuses.every((s) => s === "PENDING")) pending += 1;
    }

    // Latest NOTES post with a meeting_date — if it's not published yet,
    // that's the "minutes written, not yet on the record" signal.
    const latestNotes = cPosts
      .filter((p) => p.post_type === "NOTES" && p.meeting_date)
      .sort((a, b) =>
        (b.meeting_date as string).localeCompare(a.meeting_date as string)
      )[0];
    const has_unpublished_minutes =
      !!latestNotes && !publishedMinutesPostIds.has(latestNotes.id);

    const chair = c.chair_id ? memberById.get(c.chair_id) : null;

    return {
      code: c.code,
      name: c.name,
      type: c.type,
      chair_id: c.chair_id,
      chair_name: chair ? displayName(chair) : null,
      last_activity_at,
      days_since_activity,
      last_met_on: past[0]?.meeting_date ?? null,
      next_meeting_on: upcoming[0]?.meeting_date ?? null,
      open_action_items: open,
      pending_action_items: pending,
      has_unpublished_minutes,
    };
  });

  return out;
}

// activityBucket helper + ACTIVITY_LABEL/COLOR live in
// committee-health-shared.ts now and are re-exported at the top.
