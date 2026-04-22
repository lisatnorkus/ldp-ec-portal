// Types and constants for the recruiting CRM. Split from ld-contacts.ts
// so client components can safely import STAGE_LABEL / STAGE_COLOR
// without pulling the server-only fetchers into the browser bundle.

export type PipelineStage =
  | "IDENTIFIED"
  | "CONTACTED"
  | "WARM"
  | "COMMITTED"
  | "ACTIVE"
  | "EC_MEMBER"
  | "COLD"
  | "PAUSED"
  | "NOT_INTERESTED";

export type ContactSource =
  | "CANVASS"
  | "REFERRAL"
  | "EVENT"
  | "SOCIAL"
  | "WALK_IN"
  | "OTHER";

export type ContactMethod =
  | "CALL"
  | "TEXT"
  | "DOOR"
  | "EMAIL"
  | "IN_PERSON"
  | "EVENT"
  | "OTHER";

export type InteractionOutcome =
  | "LEFT_VOICEMAIL"
  | "HAD_CONVERSATION"
  | "NOT_HOME"
  | "AGREED_TO"
  | "DECLINED"
  | "OTHER";

export type LdContact = {
  id: string;
  ld_number: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  home_precinct: string | null;
  address_street: string | null;
  address_city: string | null;
  address_zip: string | null;
  voter_file_id: string | null;
  pipeline_stage: PipelineStage;
  interest_tags: string[];
  source: ContactSource;
  assigned_to_name: string | null;
  is_key_relationship: boolean;
  last_contacted_at: string | null;
  notes: string | null;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  created_at: string;
  updated_at: string;
};

export type LdInteraction = {
  id: string;
  contact_id: string;
  ld_number: number;
  contact_method: ContactMethod;
  contacted_at: string;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  outcome: InteractionOutcome;
  outcome_detail: string | null;
  new_stage: PipelineStage | null;
  follow_up_task_id: string | null;
  notes: string | null;
  created_at: string;
};

export const STAGE_LABEL: Record<PipelineStage, string> = {
  IDENTIFIED: "Identified",
  CONTACTED: "Contacted",
  WARM: "Warm",
  COMMITTED: "Committed",
  ACTIVE: "Active",
  EC_MEMBER: "EC Member",
  COLD: "Cold",
  PAUSED: "Paused",
  NOT_INTERESTED: "Not interested",
};

export const STAGE_COLOR: Record<PipelineStage, string> = {
  IDENTIFIED: "#64748b", // slate
  CONTACTED: "#0891b2", // cyan
  WARM: "#F59E0B", // amber
  COMMITTED: "#059669", // emerald
  ACTIVE: "#0E4C9E", // navy
  EC_MEMBER: "#7c3aed", // violet
  COLD: "#94a3b8", // muted
  PAUSED: "#94a3b8", // muted
  NOT_INTERESTED: "#C8102E", // red
};
