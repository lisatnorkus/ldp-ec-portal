// Role resolver — single source of truth for committee-workspace
// permission gating in the UI. Mirrors the permission table in
// docs/committee-workspaces-v1.md §4.
//
// Phase 1 caveat: enforcement is advisory only. Identity comes from
// localStorage (see src/lib/userContext.ts), not Supabase Auth. RLS is
// disabled. When Google OAuth lands, these same predicates become the
// basis for RLS policies on workspace_posts / post_assignments /
// meeting_records.

export type EcMemberRole = {
  id: string;
  primary_role:
    | "OFFICER"
    | "LD_CHAIR"
    | "LD_VC"
    | "AT_LARGE"
    | "LYD_PRES"
    | "WOMENS_CLUB_PRES"
    | "PRECINCT_CAPTAIN"
    | "COMMITTEE_CHAIR_ONLY";
  officer_role: "CHAIR" | "VICE_CHAIR" | "SECRETARY" | "TREASURER" | null;
  committee_chair_codes: string[];
  committee_member_codes: string[];
  term_start: string | null; // ISO date
  term_end: string | null;
};

export type EffectiveRoles = {
  is_officer: boolean;
  is_chair: boolean;
  is_vice_chair: boolean;
  is_secretary: boolean;
  is_treasurer: boolean;
  // Incoming = elected but not yet seated. term_start in the future +
  // officer_role of CHAIR or VICE_CHAIR. Gets elevated permissions
  // during the handoff window so they can read everything they're
  // about to inherit.
  is_incoming_leader: boolean;
  chairs_committees: string[];
  member_of_committees: string[];
};

export function getEffectiveRoles(
  m: EcMemberRole,
  today: Date = new Date()
): EffectiveRoles {
  const is_officer = m.primary_role === "OFFICER";
  const termStart = m.term_start ? new Date(m.term_start) : null;
  const is_incoming_leader =
    termStart != null &&
    termStart.getTime() > today.getTime() &&
    (m.officer_role === "CHAIR" || m.officer_role === "VICE_CHAIR");

  return {
    is_officer,
    is_chair: is_officer && m.officer_role === "CHAIR",
    is_vice_chair: is_officer && m.officer_role === "VICE_CHAIR",
    is_secretary: is_officer && m.officer_role === "SECRETARY",
    is_treasurer: is_officer && m.officer_role === "TREASURER",
    is_incoming_leader,
    chairs_committees: m.committee_chair_codes ?? [],
    member_of_committees: m.committee_member_codes ?? [],
  };
}

// ─── Per-action predicates ────────────────────────────────────────────

// Anyone seated on a committee (chair or member) can post in its
// workspace. Officers can post anywhere. Incoming leadership gets the
// same read/write surface so they can practice before they take over.
export function canPostInWorkspace(
  m: EcMemberRole,
  committee_code: string
): boolean {
  const r = getEffectiveRoles(m);
  if (r.is_officer || r.is_incoming_leader) return true;
  return (
    r.chairs_committees.includes(committee_code) ||
    r.member_of_committees.includes(committee_code)
  );
}

// Assigning action items is a chair / officer move. Members can author
// posts but can't assign tasks to others.
export function canAssignTasks(
  m: EcMemberRole,
  committee_code: string
): boolean {
  const r = getEffectiveRoles(m);
  if (r.is_officer || r.is_incoming_leader) return true;
  return r.chairs_committees.includes(committee_code);
}

// Anyone can accept/reject a task assigned to them. The API layer
// also checks that the requester IS the assignee — which until OAuth
// is a soft check (display_name match).
export function canRespondToAssignment(
  m: EcMemberRole,
  assignee_member_id: string
): boolean {
  return m.id === assignee_member_id;
}

// Secretary + Officers publish minutes. (Both Chair and VC can publish
// in a pinch — VC needs to step in during emergencies.)
export function canPublishMinutes(m: EcMemberRole): boolean {
  const r = getEffectiveRoles(m);
  return r.is_secretary || r.is_chair || r.is_vice_chair || r.is_incoming_leader;
}

// Treasurer + Officers publish treasurer reports.
export function canPublishTreasurerReport(m: EcMemberRole): boolean {
  const r = getEffectiveRoles(m);
  return r.is_treasurer || r.is_chair || r.is_vice_chair || r.is_incoming_leader;
}

// Year in Review / leadership-transition brief: incoming Chair + VC,
// plus current Officers who gate-keep the curation step.
export function canViewYearInReview(m: EcMemberRole): boolean {
  const r = getEffectiveRoles(m);
  return r.is_officer || r.is_incoming_leader;
}

// Approving a published meeting record (moves PUBLISHED → APPROVED at
// the next meeting). Requires officer or incoming-leader status —
// committee chairs approve their own committee's records via the
// per-committee variant below.
export function canApproveLdpecRecord(m: EcMemberRole): boolean {
  const r = getEffectiveRoles(m);
  return r.is_officer || r.is_incoming_leader;
}

export function canApproveCommitteeRecord(
  m: EcMemberRole,
  committee_code: string
): boolean {
  const r = getEffectiveRoles(m);
  if (r.is_officer || r.is_incoming_leader) return true;
  return r.chairs_committees.includes(committee_code);
}
