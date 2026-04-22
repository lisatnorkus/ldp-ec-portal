import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { PackageStatus, TaskDisposition } from "./ld-continuity";

export type CommitteeContinuityPackage = {
  id: string;
  committee_code: string;
  cycle: string;
  outgoing_chair_name: string | null;
  status: PackageStatus;
  submitted_at: string | null;
  locked_at: string | null;
  locked_by_name: string | null;
  state_narrative: string | null;
  scope_and_workflow_notes: string | null;
  chair_note_to_successor: string | null;
  task_dispositions: Record<string, TaskDisposition>;
  // { member_name: { note: string, keep_on_committee: boolean } }
  member_notes: Record<string, { note: string; keep_on_committee: boolean }>;
  created_at: string;
  updated_at: string;
};

export async function fetchActiveCommitteePackage(
  code: string
): Promise<CommitteeContinuityPackage | null> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("committee_continuity_packages")
    .select("*")
    .eq("committee_code", code)
    .in("status", ["DRAFT", "SUBMITTED", "LOCKED"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("fetchActiveCommitteePackage error", error);
    return null;
  }
  return (data as CommitteeContinuityPackage | null) ?? null;
}

export async function fetchPastCommitteePackages(
  code: string
): Promise<CommitteeContinuityPackage[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("committee_continuity_packages")
    .select("*")
    .eq("committee_code", code)
    .eq("status", "ARCHIVED")
    .order("locked_at", { ascending: false });
  if (error) {
    console.error("fetchPastCommitteePackages error", error);
    return [];
  }
  return (data ?? []) as CommitteeContinuityPackage[];
}
