import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";

export type PackageStatus = "DRAFT" | "SUBMITTED" | "LOCKED" | "ARCHIVED";

export type TaskDisposition = "HAND_OFF" | "CLOSE" | "ESCALATE";

export type PrecinctHandoffNote = {
  note: string;
  status: "DARK" | "COVERED" | "STRONG" | "";
};

export type PipelineSnapshotRow = {
  first_name: string;
  last_name: string;
  pipeline_stage: string;
  last_contacted_at: string | null;
  interest_tags: string[];
  notes: string | null;
};

export type LdContinuityPackage = {
  id: string;
  ld_number: number;
  cycle: string;
  outgoing_chair_name: string | null;
  status: PackageStatus;
  submitted_at: string | null;
  locked_at: string | null;
  locked_by_name: string | null;
  state_narrative: string | null;
  resource_notes: string | null;
  chair_note_to_successor: string | null;
  key_contact_ids: string[];
  task_dispositions: Record<string, TaskDisposition>;
  precinct_notes: Record<string, PrecinctHandoffNote>;
  pipeline_snapshot: PipelineSnapshotRow[];
  created_at: string;
  updated_at: string;
};

export async function fetchActivePackage(
  ld_number: number
): Promise<LdContinuityPackage | null> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ld_continuity_packages")
    .select("*")
    .eq("ld_number", ld_number)
    .in("status", ["DRAFT", "SUBMITTED", "LOCKED"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("fetchActivePackage error", error);
    return null;
  }
  return (data as LdContinuityPackage | null) ?? null;
}

export async function fetchPastPackages(
  ld_number: number
): Promise<LdContinuityPackage[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ld_continuity_packages")
    .select("*")
    .eq("ld_number", ld_number)
    .eq("status", "ARCHIVED")
    .order("locked_at", { ascending: false });
  if (error) {
    console.error("fetchPastPackages error", error);
    return [];
  }
  return (data ?? []) as LdContinuityPackage[];
}
