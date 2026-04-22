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
  assigned_to_name: string | null;
  assigned_by_name: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  decline_note: string | null;
  is_template_task: boolean;
  continuity_disposition: "HAND_OFF" | "CLOSE" | "ESCALATE" | null;
  created_at: string;
  updated_at: string;
};

export type Assignable = { name: string; role: string };

// The pool of people an LD task can be assigned to: the LD's Chair,
// Vice Chair, and every Precinct Captain on file for that LD. Names
// are returned in a stable order — leadership first, then PCs
// alphabetical. Empty fields fall back gracefully so the picker still
// renders.
export async function fetchAssignablesForLd(ld_number: number): Promise<Assignable[]> {
  const supabase = await getSupabaseServer();
  const [leaders, pcs] = await Promise.all([
    supabase
      .from("ec_members")
      .select("first_name, last_name, preferred_name, primary_role")
      .eq("ld_number", ld_number)
      .in("primary_role", ["LD_CHAIR", "LD_VC"]),
    supabase
      .from("precinct_captains")
      .select("first_name, last_name, preferred_name, role, precinct_code")
      .eq("ld_number", ld_number)
      .order("precinct_code", { ascending: true })
      .order("last_name", { ascending: true }),
  ]);
  const out: Assignable[] = [];
  for (const m of leaders.data ?? []) {
    const first = (m.preferred_name as string | null) ?? (m.first_name as string);
    out.push({
      name: `${first} ${m.last_name}`.trim(),
      role: m.primary_role === "LD_CHAIR" ? "LD Chair" : "LD Vice Chair",
    });
  }
  for (const pc of pcs.data ?? []) {
    const first = (pc.preferred_name as string | null) ?? (pc.first_name as string);
    const roleBit = pc.role ? `PC · ${pc.role.toLowerCase()}` : "PC";
    out.push({
      name: `${first} ${pc.last_name}`.trim(),
      role: `${roleBit} · ${pc.precinct_code}`,
    });
  }
  return out;
}

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
