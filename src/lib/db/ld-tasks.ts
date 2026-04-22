import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";

export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE" | "DEFERRED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type LdTask = {
  id: string;
  ld_number: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null; // YYYY-MM-DD
  completed_at: string | null;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  is_template_task: boolean;
  continuity_disposition: "HAND_OFF" | "CLOSE" | "ESCALATE" | null;
  created_at: string;
  updated_at: string;
};

export async function fetchTasksByLd(ld_number: number): Promise<LdTask[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ld_tasks")
    .select("*")
    .eq("ld_number", ld_number)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetchTasksByLd error", error);
    return [];
  }
  return (data ?? []) as LdTask[];
}
