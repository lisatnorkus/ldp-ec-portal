import { getSupabaseServer } from "@/lib/supabase/server";

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
  officer_role: string | null;
  committee_chair_codes: string[];
  committee_member_codes: string[];
  notes: string | null;
  active: boolean;
};

export type Committee = {
  code: string;
  name: string;
  type: "STANDING" | "AD_HOC";
  chair_id: string | null;
  chair_title_override: string | null;
  adhoc_note: string | null;
  drive_folder_url: string | null;
  display_order: number;
};

export async function fetchAllMembers(): Promise<EcMember[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("ec_members")
    .select("*")
    .eq("active", true)
    .order("last_name");
  if (error) throw error;
  return data as EcMember[];
}

export async function fetchCommittees(): Promise<Committee[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("committees")
    .select("*")
    .eq("active", true)
    .order("display_order");
  if (error) throw error;
  return data as Committee[];
}

export const ROLE_LABEL: Record<EcMember["primary_role"], string> = {
  OFFICER: "Officer",
  LD_CHAIR: "LD Chair",
  LD_VC: "LD Vice Chair",
  AT_LARGE: "At-Large",
  LYD_PRES: "LYD President",
  WOMENS_CLUB_PRES: "JCDWC President",
  PRECINCT_CAPTAIN: "Precinct Captain",
  COMMITTEE_CHAIR_ONLY: "Committee Chair",
};

export function displayName(m: Pick<EcMember, "first_name" | "last_name" | "preferred_name">) {
  const first = m.preferred_name || m.first_name;
  return `${first} ${m.last_name}`.trim();
}
