import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import { displayName } from "./members-types";
import type { EcMember } from "./members-types";

export type EngagementRow = {
  id: string;
  name: string;
  role: string;
  ld_number: number | null;
  last_active_at: string | null;
  total_actions: number;
  notes: number;
  tasks_created: number;
  tasks_accepted: number;
  interactions: number;
  continuity_actions: number;
  bucket: "active" | "warm" | "cool" | "dark";
};

export type EngagementSummary = {
  total: number;
  active: number;
  warm: number;
  cool: number;
  dark: number;
};

type Row = { author_name: string | null; created_at?: string | null; accepted_at?: string | null };

function bucketFor(lastIso: string | null): EngagementRow["bucket"] {
  if (!lastIso) return "dark";
  const days = (Date.now() - new Date(lastIso).getTime()) / (24 * 60 * 60 * 1000);
  if (days <= 7) return "active";
  if (days <= 30) return "warm";
  if (days <= 60) return "cool";
  return "dark";
}

// Match an author_name string to an EcMember row. Exact display-name
// match first; then fuzzy first-token + last-token (handles casual
// names like "Lisa Norkus" mapping to "Lisa Tanner Norkus").
function resolveAuthor(name: string, members: EcMember[]): EcMember | undefined {
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  const exact = members.find((m) => displayName(m) === trimmed);
  if (exact) return exact;
  const tokens = trimmed.split(/\s+/);
  if (tokens.length < 2) return undefined;
  const first = tokens[0].toLowerCase();
  const last = tokens[tokens.length - 1].toLowerCase();
  return members.find((m) => {
    const mFirst = (m.preferred_name || m.first_name).toLowerCase();
    const mLast = m.last_name.toLowerCase();
    return (
      mFirst === first &&
      (mLast === last || mLast.endsWith(" " + last) || mLast.startsWith(last + " "))
    );
  });
}

function bump(
  stats: Map<string, Omit<EngagementRow, "name" | "role" | "ld_number" | "bucket" | "id">>,
  memberId: string,
  field: "notes" | "tasks_created" | "tasks_accepted" | "interactions" | "continuity_actions",
  timestamp: string | null
) {
  const current = stats.get(memberId) ?? {
    last_active_at: null,
    total_actions: 0,
    notes: 0,
    tasks_created: 0,
    tasks_accepted: 0,
    interactions: 0,
    continuity_actions: 0,
  };
  current[field] += 1;
  current.total_actions += 1;
  if (timestamp && (!current.last_active_at || timestamp > current.last_active_at)) {
    current.last_active_at = timestamp;
  }
  stats.set(memberId, current);
}

export async function fetchEngagement(
  members: EcMember[]
): Promise<{ rows: EngagementRow[]; summary: EngagementSummary }> {
  const supabase = await getSupabaseServer();

  const [
    ldNotes,
    ldTasks,
    ldContacts,
    ldInteractions,
    committeeNotes,
    committeeTasks,
    ldContinuity,
    committeeContinuity,
  ] = await Promise.all([
    supabase.from("ld_notes").select("author_name, created_at").eq("is_archived", false),
    supabase.from("ld_tasks").select("author_name, assigned_to_name, accepted_at, created_at"),
    supabase.from("ld_contacts").select("author_name, created_at"),
    supabase.from("ld_interactions").select("author_name, created_at"),
    supabase.from("committee_notes").select("author_name, created_at").eq("is_archived", false),
    supabase.from("committee_tasks").select("author_name, assigned_to_name, accepted_at, created_at"),
    supabase.from("ld_continuity_packages").select("outgoing_chair_name, created_at, updated_at"),
    supabase
      .from("committee_continuity_packages")
      .select("outgoing_chair_name, created_at, updated_at"),
  ]);

  const stats = new Map<
    string,
    Omit<EngagementRow, "name" | "role" | "ld_number" | "bucket" | "id">
  >();

  const handleAuthor = (
    row: Row,
    field: "notes" | "tasks_created" | "interactions" | "continuity_actions"
  ) => {
    const name = row.author_name ?? null;
    if (!name) return;
    const member = resolveAuthor(name, members);
    if (!member) return;
    bump(stats, member.id, field, row.created_at ?? null);
  };

  for (const r of ldNotes.data ?? []) handleAuthor(r as Row, "notes");
  for (const r of committeeNotes.data ?? []) handleAuthor(r as Row, "notes");
  for (const r of ldContacts.data ?? []) handleAuthor(r as Row, "interactions"); // contact-creation counts as interaction
  for (const r of ldInteractions.data ?? []) handleAuthor(r as Row, "interactions");

  for (const r of (ldTasks.data ?? []) as Array<Row & { assigned_to_name?: string | null }>) {
    const author = r.author_name ? resolveAuthor(r.author_name, members) : undefined;
    if (author) bump(stats, author.id, "tasks_created", r.created_at ?? null);
    if (r.accepted_at && r.assigned_to_name) {
      const assignee = resolveAuthor(r.assigned_to_name, members);
      if (assignee) bump(stats, assignee.id, "tasks_accepted", r.accepted_at);
    }
  }
  for (const r of (committeeTasks.data ?? []) as Array<Row & { assigned_to_name?: string | null }>) {
    const author = r.author_name ? resolveAuthor(r.author_name, members) : undefined;
    if (author) bump(stats, author.id, "tasks_created", r.created_at ?? null);
    if (r.accepted_at && r.assigned_to_name) {
      const assignee = resolveAuthor(r.assigned_to_name, members);
      if (assignee) bump(stats, assignee.id, "tasks_accepted", r.accepted_at);
    }
  }

  for (const r of (ldContinuity.data ?? []) as Array<{
    outgoing_chair_name: string | null;
    created_at: string | null;
    updated_at: string | null;
  }>) {
    if (!r.outgoing_chair_name) continue;
    const member = resolveAuthor(r.outgoing_chair_name, members);
    if (!member) continue;
    bump(stats, member.id, "continuity_actions", r.updated_at ?? r.created_at ?? null);
  }
  for (const r of (committeeContinuity.data ?? []) as Array<{
    outgoing_chair_name: string | null;
    created_at: string | null;
    updated_at: string | null;
  }>) {
    if (!r.outgoing_chair_name) continue;
    const member = resolveAuthor(r.outgoing_chair_name, members);
    if (!member) continue;
    bump(stats, member.id, "continuity_actions", r.updated_at ?? r.created_at ?? null);
  }

  // Build the final row list from every member, whether they've acted
  // or not — we need the dark list to be visible.
  const rows: EngagementRow[] = members.map((m) => {
    const s = stats.get(m.id);
    return {
      id: m.id,
      name: displayName(m),
      role: m.primary_role,
      ld_number: m.ld_number,
      last_active_at: s?.last_active_at ?? null,
      total_actions: s?.total_actions ?? 0,
      notes: s?.notes ?? 0,
      tasks_created: s?.tasks_created ?? 0,
      tasks_accepted: s?.tasks_accepted ?? 0,
      interactions: s?.interactions ?? 0,
      continuity_actions: s?.continuity_actions ?? 0,
      bucket: bucketFor(s?.last_active_at ?? null),
    };
  });

  // Sort: dark first, then cool, warm, active — ascending by recency
  // within each bucket so the least-recently-active lead.
  const bucketOrder: Record<EngagementRow["bucket"], number> = {
    dark: 0,
    cool: 1,
    warm: 2,
    active: 3,
  };
  rows.sort((a, b) => {
    const diff = bucketOrder[a.bucket] - bucketOrder[b.bucket];
    if (diff !== 0) return diff;
    const aTs = a.last_active_at ?? "";
    const bTs = b.last_active_at ?? "";
    return aTs.localeCompare(bTs);
  });

  const summary: EngagementSummary = {
    total: rows.length,
    active: rows.filter((r) => r.bucket === "active").length,
    warm: rows.filter((r) => r.bucket === "warm").length,
    cool: rows.filter((r) => r.bucket === "cool").length,
    dark: rows.filter((r) => r.bucket === "dark").length,
  };

  return { rows, summary };
}
