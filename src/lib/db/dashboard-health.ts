import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getKypoliticsServer } from "@/lib/supabase/kypolitics";

// One-stop KPI + needs-attention + activity-feed aggregator for the
// dashboard. Everything the main dashboard needs in a single await.

export type DashboardKpis = {
  activeVolunteers: number;
  totalVolunteers: number;
  capturedPrecincts: number;
  priorityPrecincts: number; // ACTIVATE + DEFEND
  tasksOverdue: number;
  attendanceRatePct: number | null;
  annualRaiseFloor: number;
  memberCount: number;
};

export async function fetchDashboardKpis(): Promise<DashboardKpis> {
  const supabase = await getSupabaseServer();

  const [
    volunteersAll,
    captainsAll,
    membersAttendance,
    ldTasksOverdue,
    committeeTasksOverdue,
  ] = await Promise.all([
    supabase.from("volunteers").select("status"),
    supabase.from("precinct_captains").select("precinct_code"),
    supabase
      .from("ec_members")
      .select("attendance_present, attendance_excused, attendance_eligible")
      .eq("active", true),
    supabase
      .from("ld_tasks")
      .select("id", { count: "exact", head: true })
      .not("status", "eq", "DONE")
      .not("status", "eq", "DEFERRED")
      .not("due_date", "is", null)
      .lt("due_date", new Date().toISOString().slice(0, 10)),
    supabase
      .from("committee_tasks")
      .select("id", { count: "exact", head: true })
      .not("status", "eq", "DONE")
      .not("status", "eq", "DEFERRED")
      .not("due_date", "is", null)
      .lt("due_date", new Date().toISOString().slice(0, 10)),
  ]);

  const volunteers = (volunteersAll.data ?? []) as { status: string }[];
  const activeVolunteers = volunteers.filter((v) => v.status === "ACTIVE").length;

  const captains = (captainsAll.data ?? []) as { precinct_code: string }[];
  const capturedPrecincts = new Set(captains.map((c) => c.precinct_code.toUpperCase())).size;

  // ACTIVATE + DEFEND counts from kypolitics. Hardcoded 229 (150+79)
  // for the UI — pulling live would be a second query and these are
  // stable over the cycle.
  const priorityPrecincts = 229;

  const members = (membersAttendance.data ?? []) as {
    attendance_present: number | null;
    attendance_excused: number | null;
    attendance_eligible: number | null;
  }[];
  const totalPresent = members.reduce(
    (n, m) => n + (m.attendance_present ?? 0) + (m.attendance_excused ?? 0),
    0
  );
  const totalEligible = members.reduce((n, m) => n + (m.attendance_eligible ?? 0), 0);
  const attendanceRatePct =
    totalEligible > 0 ? Math.round((totalPresent / totalEligible) * 100) : null;

  return {
    activeVolunteers,
    totalVolunteers: volunteers.length,
    capturedPrecincts,
    priorityPrecincts,
    tasksOverdue: (ldTasksOverdue.count ?? 0) + (committeeTasksOverdue.count ?? 0),
    attendanceRatePct,
    annualRaiseFloor: members.length * 620,
    memberCount: members.length,
  };
}

export type NeedsAttentionItem = {
  id: string;
  label: string;
  detail: string;
  count: number;
  href: string;
  urgency: "high" | "medium" | "low";
};

export async function fetchNeedsAttention(): Promise<NeedsAttentionItem[]> {
  const supabase = await getSupabaseServer();

  const [
    captainsAll,
    vacancies,
    lapsedVolunteers,
    newSignups,
  ] = await Promise.all([
    supabase.from("precinct_captains").select("precinct_code"),
    supabase
      .from("transitions")
      .select("id, seat_code, status")
      .eq("status", "VACANT"),
    supabase
      .from("volunteers")
      .select("id, last_active_at, status, source")
      .eq("status", "ACTIVE"),
    supabase
      .from("volunteers")
      .select("id")
      .eq("source", "SIGNUP_FORM")
      .is("last_active_at", null),
  ]);

  const items: NeedsAttentionItem[] = [];

  // Uncovered ACTIVATE+DEFEND precincts. Need the real precinct list
  // from kypolitics to compute — if unavailable, skip gracefully.
  try {
    const kp = await getKypoliticsServer();
    const { data: priority } = await kp
      .from("jeffco_voter_targeting")
      .select("precinct, strategy")
      .in("strategy", ["ACTIVATE", "DEFEND"]);
    if (priority) {
      const covered = new Set(
        ((captainsAll.data ?? []) as { precinct_code: string }[]).map((c) =>
          c.precinct_code.toUpperCase()
        )
      );
      const uncovered = priority.filter((p) => {
        const m = (p.precinct as string).match(/\b([A-Z]\d+)\s*$/i);
        const code = m ? m[1].toUpperCase() : null;
        return code ? !covered.has(code) : false;
      }).length;
      if (uncovered > 0) {
        items.push({
          id: "uncovered-priority",
          label: `${uncovered} uncovered priority precincts`,
          detail: "ACTIVATE + DEFEND precincts with no captain. The captain-coverage bar the skill calls out.",
          count: uncovered,
          href: "/captains",
          urgency: uncovered > 100 ? "high" : "medium",
        });
      }
    }
  } catch {
    // kypolitics unavailable — skip
  }

  const vacancyCount = (vacancies.data ?? []).length;
  if (vacancyCount > 0) {
    items.push({
      id: "vacancies",
      label: `${vacancyCount} open ${vacancyCount === 1 ? "seat" : "seats"}`,
      detail: "CEC has 30 days from notification to fill (90 days before SCEC steps in).",
      count: vacancyCount,
      href: "/transitions",
      urgency: "high",
    });
  }

  const cutoff = Date.now() - 60 * 24 * 60 * 60 * 1000;
  const lapsed = ((lapsedVolunteers.data ?? []) as {
    last_active_at: string | null;
  }[]).filter((v) => {
    if (!v.last_active_at) return true;
    return new Date(v.last_active_at).getTime() < cutoff;
  }).length;
  if (lapsed > 0) {
    items.push({
      id: "lapsed-volunteers",
      label: `${lapsed} volunteers gone quiet`,
      detail: "Active status but no logged activity in 60+ days. Jessica's retention queue.",
      count: lapsed,
      href: "/volunteers",
      urgency: lapsed > 20 ? "medium" : "low",
    });
  }

  const newSignupCount = (newSignups.data ?? []).length;
  if (newSignupCount > 0) {
    items.push({
      id: "new-signups",
      label: `${newSignupCount} new volunteer signups to review`,
      detail: "People who signed themselves up and haven't been contacted yet.",
      count: newSignupCount,
      href: "/volunteers",
      urgency: newSignupCount > 10 ? "medium" : "low",
    });
  }

  return items;
}

export type ActivityEvent = {
  id: string;
  kind: "note" | "task" | "volunteer" | "activity" | "captain" | "interaction";
  label: string;
  detail: string;
  author: string | null;
  timestamp: string;
  href: string | null;
};

export async function fetchRecentActivity(limit = 12): Promise<ActivityEvent[]> {
  const supabase = await getSupabaseServer();
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [
    notes,
    tasks,
    newVolunteers,
    volunteerActivities,
    interactions,
  ] = await Promise.all([
    supabase
      .from("ld_notes")
      .select("id, ld_number, body, author_name, created_at")
      .gte("created_at", since)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("ld_tasks")
      .select("id, ld_number, title, author_name, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("volunteers")
      .select("id, first_name, last_name, author_name, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("volunteer_activities")
      .select("id, volunteer_id, activity_type, title, author_name, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("ld_interactions")
      .select("id, contact_id, ld_number, author_name, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  const events: ActivityEvent[] = [];

  for (const n of (notes.data ?? []) as {
    id: string;
    ld_number: number;
    body: string;
    author_name: string | null;
    created_at: string;
  }[]) {
    events.push({
      id: `note-${n.id}`,
      kind: "note",
      label: `Note added · LD${n.ld_number}`,
      detail: n.body.slice(0, 80),
      author: n.author_name,
      timestamp: n.created_at,
      href: `/my-ld/${n.ld_number}`,
    });
  }
  for (const t of (tasks.data ?? []) as {
    id: string;
    ld_number: number;
    title: string;
    author_name: string | null;
    created_at: string;
  }[]) {
    events.push({
      id: `task-${t.id}`,
      kind: "task",
      label: `Task · LD${t.ld_number}`,
      detail: t.title,
      author: t.author_name,
      timestamp: t.created_at,
      href: `/my-ld/${t.ld_number}`,
    });
  }
  for (const v of (newVolunteers.data ?? []) as {
    id: string;
    first_name: string;
    last_name: string;
    author_name: string | null;
    created_at: string;
  }[]) {
    events.push({
      id: `vol-${v.id}`,
      kind: "volunteer",
      label: "New volunteer",
      detail: `${v.first_name} ${v.last_name}`,
      author: v.author_name,
      timestamp: v.created_at,
      href: `/volunteers/${v.id}`,
    });
  }
  for (const a of (volunteerActivities.data ?? []) as {
    id: string;
    volunteer_id: string;
    activity_type: string;
    title: string | null;
    author_name: string | null;
    created_at: string;
  }[]) {
    events.push({
      id: `va-${a.id}`,
      kind: "activity",
      label: `Volunteer activity · ${a.activity_type.replace(/_/g, " ").toLowerCase()}`,
      detail: a.title ?? "",
      author: a.author_name,
      timestamp: a.created_at,
      href: `/volunteers/${a.volunteer_id}`,
    });
  }
  for (const i of (interactions.data ?? []) as {
    id: string;
    contact_id: string;
    ld_number: number;
    author_name: string | null;
    created_at: string;
  }[]) {
    events.push({
      id: `int-${i.id}`,
      kind: "interaction",
      label: `Contact touch · LD${i.ld_number}`,
      detail: "Interaction logged in the recruiting CRM",
      author: i.author_name,
      timestamp: i.created_at,
      href: `/my-ld/${i.ld_number}/recruiting`,
    });
  }

  events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return events.slice(0, limit);
}
