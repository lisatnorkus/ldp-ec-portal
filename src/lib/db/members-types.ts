// Client-safe types + label helpers (no Supabase imports).
// Server-side fetchers live in @/lib/db/members.

export type OfficerRole = "CHAIR" | "VICE_CHAIR" | "SECRETARY" | "TREASURER";

export type EcMember = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  email: string | null;
  phone: string | null;
  ld_number: number | null;
  primary_role:
    | "OFFICER"
    | "LD_CHAIR"
    | "LD_VC"
    | "AT_LARGE"
    | "LYD_PRES"
    | "WOMENS_CLUB_PRES"
    | "PRECINCT_CAPTAIN"
    | "COMMITTEE_CHAIR_ONLY";
  officer_role: OfficerRole | null;
  committee_chair_codes: string[];
  committee_member_codes: string[];
  notes: string | null;
  active: boolean;
  attendance_present: number | null;
  attendance_excused: number | null;
  attendance_absent: number | null;
  attendance_eligible: number | null;
};

export type Committee = {
  code: string;
  name: string;
  type: "STANDING" | "AD_HOC";
  chair_id: string | null;
  chair_title_override: string | null;
  adhoc_note: string | null;
  drive_folder_url: string | null;
  description_md: string | null;
  workflow: string[];
  docs: Array<{ name: string; howto?: string; link: string }>;
  member_codes: string[];
  display_order: number;
};

export const PRIMARY_ROLE_LABEL: Record<EcMember["primary_role"], string> = {
  OFFICER: "Officer",
  LD_CHAIR: "LD Chair",
  LD_VC: "LD Vice Chair",
  AT_LARGE: "At-Large",
  LYD_PRES: "LYD President",
  WOMENS_CLUB_PRES: "JCDWC President",
  PRECINCT_CAPTAIN: "Precinct Captain",
  COMMITTEE_CHAIR_ONLY: "Committee Chair",
};

export const OFFICER_ROLE_LABEL: Record<OfficerRole, string> = {
  CHAIR: "LDP Chair",
  VICE_CHAIR: "LDP Vice Chair",
  SECRETARY: "LDP Secretary",
  TREASURER: "LDP Treasurer",
};

export const OFFICER_ORDER: OfficerRole[] = ["CHAIR", "VICE_CHAIR", "SECRETARY", "TREASURER"];

export function displayName(
  m: Pick<EcMember, "first_name" | "last_name" | "preferred_name">
): string {
  const first = m.preferred_name || m.first_name;
  return `${first} ${m.last_name}`.trim();
}

export function attendancePct(m: EcMember): number | null {
  if (!m.attendance_eligible || m.attendance_eligible === 0) return null;
  const present = m.attendance_present ?? 0;
  const excused = m.attendance_excused ?? 0;
  return Math.round(((present + excused) / m.attendance_eligible) * 100);
}

export function attendanceLabel(m: EcMember): string {
  if (m.attendance_eligible == null) return "—";
  return `${m.attendance_present ?? 0}/${m.attendance_eligible}`;
}
