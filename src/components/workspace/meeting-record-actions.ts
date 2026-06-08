"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { resolveMemberIdByDisplayName } from "@/lib/db/workspace";
import type { MeetingType } from "@/lib/db/meeting-records";

// Phase 1 caveat: permission gating here is advisory. The server actions
// trust the display_name to resolve to an ec_members.id, but RLS is off.
// When OAuth lands these resolve from auth.uid() instead.

type Author = { display_name: string };

function bumpPaths(committee_code: string | null) {
  revalidatePath("/official-records");
  revalidatePath("/leadership-transition");
  if (committee_code) revalidatePath(`/committees/${committee_code.toLowerCase()}`);
}

// Promote an existing NOTES post into a published meeting record. The
// usual happy path: Secretary writes minutes as a NOTES post in the
// committee workspace, then publishes them here.
export type PublishMeetingRecordInput = {
  meeting_date: string; // ISO yyyy-mm-dd
  meeting_type: MeetingType;
  committee_code?: string | null;
  minutes_post_id?: string | null;
  treasurer_report_post_id?: string | null;
};

export async function publishMeetingRecord(
  input: PublishMeetingRecordInput,
  author: Author
): Promise<{ ok: true; record_id: string } | { ok: false; error: string }> {
  const name = author.display_name.trim();
  if (!name) return { ok: false, error: "Set your name on the dashboard first." };

  if (!input.meeting_date) return { ok: false, error: "Meeting date is required." };
  if (input.meeting_type === "COMMITTEE" && !input.committee_code) {
    return { ok: false, error: "Committee meetings need a committee code." };
  }
  if (input.meeting_type === "LDPEC" && input.committee_code) {
    return { ok: false, error: "LDPEC meetings can't be tied to a single committee." };
  }
  if (!input.minutes_post_id && !input.treasurer_report_post_id) {
    return {
      ok: false,
      error: "Attach at least one of: minutes post or treasurer report post.",
    };
  }

  const author_id = await resolveMemberIdByDisplayName(name);
  if (!author_id) {
    return {
      ok: false,
      error: "Couldn't match your name to an EC member record. Check your dashboard name.",
    };
  }

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("meeting_records")
    .insert({
      meeting_date: input.meeting_date,
      meeting_type: input.meeting_type,
      committee_code:
        input.meeting_type === "COMMITTEE" ? input.committee_code : null,
      minutes_post_id: input.minutes_post_id ?? null,
      treasurer_report_post_id: input.treasurer_report_post_id ?? null,
      status: "PUBLISHED",
      created_by_member_id: author_id,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Insert failed." };

  bumpPaths(input.committee_code ?? null);
  return { ok: true, record_id: data.id };
}

export async function attachMinutesPost(
  record_id: string,
  minutes_post_id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("meeting_records")
    .update({ minutes_post_id })
    .eq("id", record_id)
    .select("committee_code")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Update failed." };
  bumpPaths(data.committee_code as string | null);
  return { ok: true };
}

export async function attachTreasurerReportPost(
  record_id: string,
  treasurer_report_post_id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("meeting_records")
    .update({ treasurer_report_post_id })
    .eq("id", record_id)
    .select("committee_code")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Update failed." };
  bumpPaths(data.committee_code as string | null);
  return { ok: true };
}

// Approve a PUBLISHED record. Records ratified at a subsequent meeting
// move PUBLISHED → APPROVED. Stamps approver + timestamp.
export async function approveMeetingRecord(
  record_id: string,
  author: Author
): Promise<{ ok: true } | { ok: false; error: string }> {
  const name = author.display_name.trim();
  if (!name) return { ok: false, error: "Set your name on the dashboard first." };
  const approver_id = await resolveMemberIdByDisplayName(name);
  if (!approver_id) {
    return {
      ok: false,
      error: "Couldn't match your name to an EC member record. Check your dashboard name.",
    };
  }
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("meeting_records")
    .update({
      status: "APPROVED",
      approved_at: new Date().toISOString(),
      approved_by_member_id: approver_id,
    })
    .eq("id", record_id)
    .eq("status", "PUBLISHED")
    .select("committee_code")
    .single();
  if (error) return { ok: false, error: error.message };
  if (!data) {
    return { ok: false, error: "Only PUBLISHED records can be approved." };
  }
  bumpPaths(data.committee_code as string | null);
  return { ok: true };
}

// Mark an APPROVED record as AMENDED — used when a later meeting
// substantively revises previously-approved minutes. Doesn't clear the
// approval; just flags that the record was changed after the fact.
export async function amendMeetingRecord(
  record_id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("meeting_records")
    .update({ status: "AMENDED" })
    .eq("id", record_id)
    .eq("status", "APPROVED")
    .select("committee_code")
    .single();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Only APPROVED records can be amended." };
  bumpPaths(data.committee_code as string | null);
  return { ok: true };
}

export async function deleteMeetingRecord(
  record_id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await getSupabaseServer();
  const { data: row } = await supabase
    .from("meeting_records")
    .select("committee_code")
    .eq("id", record_id)
    .maybeSingle();
  const { error } = await supabase
    .from("meeting_records")
    .delete()
    .eq("id", record_id);
  if (error) return { ok: false, error: error.message };
  bumpPaths((row?.committee_code as string | null) ?? null);
  return { ok: true };
}
