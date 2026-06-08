// Client-safe types + constants for meeting records. Pulled out of
// meeting-records.ts so client components can import these without
// dragging "server-only" / next/headers into the client bundle.

// Status workflow per migration 20260529001:
//   DRAFT → PUBLISHED → APPROVED (and APPROVED → AMENDED if revised later)
export type MeetingRecordStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "APPROVED"
  | "AMENDED";

export type MeetingType = "LDPEC" | "COMMITTEE";

export type MeetingRecordRow = {
  id: string;
  meeting_date: string;
  meeting_type: MeetingType;
  committee_code: string | null;
  minutes_post_id: string | null;
  treasurer_report_post_id: string | null;
  status: MeetingRecordStatus;
  approved_at: string | null;
  approved_by_member_id: string | null;
  created_by_member_id: string;
  created_at: string;
  updated_at: string;
  annotations: MeetingAnnotations;
};

// Parsed structure layered on top of the verbatim minutes. Read-only
// here — written by the ingest script. The minutes content_md on the
// linked workspace_post remains canonical; this is for rollup + filter.
export type MeetingAnnotations = {
  motions?: MotionAnnotation[];
  decisions?: DecisionAnnotation[];
  action_items?: ActionItemAnnotation[];
  attendance?: AttendanceBlock;
};

export type MotionAnnotation = {
  text: string;                       // what was moved
  section: string;                    // e.g. "Chair Report" / "Facilities" / "New business"
  motion_by_name: string | null;
  motion_by_member_id: string | null;
  seconded_by_name: string | null;
  seconded_by_member_id: string | null;
  passed: boolean;
};

export type DecisionAnnotation = {
  text: string;                       // e.g. "Approved Peter Mathews as LD31 Chair"
  section: string;
  related_motion_index?: number;      // pointer into motions[] if applicable
};

export type ActionItemAnnotation = {
  text: string;
  section: string;
  owner_name: string | null;
  owner_member_id: string | null;
  due_date: string | null;            // ISO if extractable
};

export type AttendanceBlock = {
  present: string[];
  proxy: string[];
  absent: string[];
};

// A "linked post" is the snippet of workspace_posts data the records list
// renders inline — title, author, content, plus the link target. Avoids a
// second N+1 query per record.
export type LinkedPost = {
  id: string;
  title: string | null;
  content_md: string | null;
  author_display_name: string;
  created_at: string;
};

export type MeetingRecord = MeetingRecordRow & {
  committee_name: string | null;
  minutes: LinkedPost | null;
  treasurer_report: LinkedPost | null;
  approved_by_name: string | null;
};

// NOTES posts that have a meeting_date set but no meeting_record yet —
// candidates for the Secretary to promote into Official Records.
export type PromotableNotesPost = {
  id: string;
  committee_code: string;
  committee_name: string | null;
  title: string | null;
  meeting_date: string;
  author_display_name: string;
  created_at: string;
};

export const MEETING_STATUS_LABEL: Record<MeetingRecordStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  APPROVED: "Approved",
  AMENDED: "Amended",
};

// Tailwind-safe color tokens for status pills. Mirrors the project's
// existing color usage — navy for in-flight, emerald for terminal-good,
// gold for review.
export const MEETING_STATUS_COLOR: Record<MeetingRecordStatus, string> = {
  DRAFT: "#64748b",
  PUBLISHED: "var(--color-ldp-navy-700)",
  APPROVED: "#059669",
  AMENDED: "var(--color-ldp-gold)",
};
