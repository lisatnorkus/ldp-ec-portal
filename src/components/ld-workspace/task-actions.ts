"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { TaskPriority, TaskStatus } from "@/lib/db/ld-tasks";

type Author = {
  name: string;
  role: string | null;
  ld: number | null;
};

export async function createTask(
  ld_number: number,
  input: {
    title: string;
    description?: string | null;
    priority?: TaskPriority;
    due_date?: string | null;
  },
  author: Author
): Promise<{ ok: true } | { ok: false; error: string }> {
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required." };
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("ld_tasks").insert({
    ld_number,
    title,
    description: input.description?.trim() || null,
    priority: input.priority ?? "MEDIUM",
    due_date: input.due_date || null,
    status: "OPEN",
    author_name: author.name.trim(),
    author_role: author.role,
    author_ld: author.ld,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true };
}

export async function setTaskStatus(
  task_id: string,
  ld_number: number,
  status: TaskStatus
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const patch: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  patch.completed_at = status === "DONE" ? new Date().toISOString() : null;
  const { error } = await supabase.from("ld_tasks").update(patch).eq("id", task_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true };
}

export async function updateTask(
  task_id: string,
  ld_number: number,
  input: {
    title?: string;
    description?: string | null;
    priority?: TaskPriority;
    due_date?: string | null;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) {
    const t = input.title.trim();
    if (!t) return { ok: false, error: "Title is required." };
    patch.title = t;
  }
  if (input.description !== undefined) patch.description = input.description?.trim() || null;
  if (input.priority !== undefined) patch.priority = input.priority;
  if (input.due_date !== undefined) patch.due_date = input.due_date || null;
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("ld_tasks").update(patch).eq("id", task_id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true };
}

// Bulk-insert the eight onboarding tasks for a new LD chair. Due dates
// are relative-from-now so the template is always fresh when invoked.
const NEW_CHAIR_TEMPLATE: Array<{
  title: string;
  due_in_days: number | null;
  priority: TaskPriority;
}> = [
  { title: "Log into the LDPEC Portal and set your profile (name + role + LD)", due_in_days: 3, priority: "HIGH" },
  { title: "Pick 1–2 committees to serve on — browse /committees, email the chair to introduce yourself", due_in_days: 14, priority: "HIGH" },
  { title: "Confirm your LD's precinct captain list is current", due_in_days: 14, priority: "HIGH" },
  { title: "Schedule your first LD meeting", due_in_days: 30, priority: "HIGH" },
  { title: "Review past LD notes from prior chair", due_in_days: null, priority: "MEDIUM" },
  { title: "Contact your top 3 recruiting prospects", due_in_days: 21, priority: "HIGH" },
  { title: "Connect with your assigned Metro Council candidate", due_in_days: 30, priority: "MEDIUM" },
  { title: "Register on Mobilize for upcoming canvasses", due_in_days: 7, priority: "HIGH" },
  { title: "Introduce yourself to the LDP Volunteer Coordinator", due_in_days: 14, priority: "MEDIUM" },
];

export async function insertNewChairTemplate(
  ld_number: number,
  author: Author
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  if (!author.name.trim()) return { ok: false, error: "Tell the portal who you are first." };
  const supabase = await getSupabaseServer();
  const now = Date.now();
  const rows = NEW_CHAIR_TEMPLATE.map((t) => ({
    ld_number,
    title: t.title,
    status: "OPEN",
    priority: t.priority,
    due_date: t.due_in_days
      ? new Date(now + t.due_in_days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      : null,
    is_template_task: true,
    author_name: author.name.trim(),
    author_role: author.role,
    author_ld: author.ld,
  }));
  const { error } = await supabase.from("ld_tasks").insert(rows);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/my-ld/${ld_number}`);
  return { ok: true, count: rows.length };
}
