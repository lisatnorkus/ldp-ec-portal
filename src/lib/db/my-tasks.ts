import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { TaskPriority, TaskStatus } from "./ld-tasks";

// Unified view of every task anywhere in the portal that has an
// assignee set. Client filters by the current user's display_name
// locally so we can avoid shipping an auth-aware API route in the
// passphrase-gated preview.

export type MyTask = {
  id: string;
  scope: "LD" | "COMMITTEE";
  scope_id: string; // ld_number as string, or committee_code
  scope_label: string; // "LD41" or "Events Committee"
  scope_href: string; // "/my-ld/41" or "/committees/EVENTS"
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assigned_to_name: string;
  assigned_by_name: string | null;
  accepted_at: string | null;
  created_at: string;
};

type CommitteeLookup = { code: string; name: string };

export async function fetchAssignedTasks(): Promise<MyTask[]> {
  const supabase = await getSupabaseServer();
  const [ld, committees, committeeNames] = await Promise.all([
    supabase
      .from("ld_tasks")
      .select(
        "id, ld_number, title, description, status, priority, due_date, assigned_to_name, assigned_by_name, accepted_at, created_at"
      )
      .not("assigned_to_name", "is", null)
      .neq("status", "DONE")
      .neq("status", "DEFERRED"),
    supabase
      .from("committee_tasks")
      .select(
        "id, committee_code, title, description, status, priority, due_date, assigned_to_name, assigned_by_name, accepted_at, created_at"
      )
      .not("assigned_to_name", "is", null)
      .neq("status", "DONE")
      .neq("status", "DEFERRED"),
    supabase.from("committees").select("code, name"),
  ]);
  const nameByCode = new Map<string, string>(
    ((committeeNames.data ?? []) as CommitteeLookup[]).map((c) => [c.code, c.name])
  );
  const rows: MyTask[] = [];
  for (const r of ld.data ?? []) {
    rows.push({
      id: r.id as string,
      scope: "LD",
      scope_id: String(r.ld_number),
      scope_label: `LD${r.ld_number}`,
      scope_href: `/my-ld/${r.ld_number}`,
      title: r.title as string,
      description: (r.description as string | null) ?? null,
      status: r.status as TaskStatus,
      priority: r.priority as TaskPriority,
      due_date: (r.due_date as string | null) ?? null,
      assigned_to_name: r.assigned_to_name as string,
      assigned_by_name: (r.assigned_by_name as string | null) ?? null,
      accepted_at: (r.accepted_at as string | null) ?? null,
      created_at: r.created_at as string,
    });
  }
  for (const r of committees.data ?? []) {
    const code = r.committee_code as string;
    rows.push({
      id: r.id as string,
      scope: "COMMITTEE",
      scope_id: code,
      scope_label: `${nameByCode.get(code) ?? code} Committee`,
      scope_href: `/committees/${code.toLowerCase()}`,
      title: r.title as string,
      description: (r.description as string | null) ?? null,
      status: r.status as TaskStatus,
      priority: r.priority as TaskPriority,
      due_date: (r.due_date as string | null) ?? null,
      assigned_to_name: r.assigned_to_name as string,
      assigned_by_name: (r.assigned_by_name as string | null) ?? null,
      accepted_at: (r.accepted_at as string | null) ?? null,
      created_at: r.created_at as string,
    });
  }
  return rows;
}
