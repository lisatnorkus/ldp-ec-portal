import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { TaskPriority, TaskStatus } from "./ld-tasks";

// Committee Notes ----------------------------------------------------

export type CommitteeNote = {
  id: string;
  committee_code: string;
  body: string;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchCommitteeNotes(code: string): Promise<CommitteeNote[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("committee_notes")
    .select("*")
    .eq("committee_code", code)
    .eq("is_archived", false)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchCommitteeNotes error", error);
    return [];
  }
  return (data ?? []) as CommitteeNote[];
}

// Committee Tasks ----------------------------------------------------

export type CommitteeTask = {
  id: string;
  committee_code: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at: string | null;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  assigned_to_name: string | null;
  assigned_by_name: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  decline_note: string | null;
  is_template_task: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchCommitteeTasks(code: string): Promise<CommitteeTask[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("committee_tasks")
    .select("*")
    .eq("committee_code", code)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchCommitteeTasks error", error);
    return [];
  }
  return (data ?? []) as CommitteeTask[];
}
