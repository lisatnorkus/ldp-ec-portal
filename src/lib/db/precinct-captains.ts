import "server-only";
import { getSupabaseServer } from "@/lib/supabase/server";

export type PcRole = "MAN" | "WOMAN" | "YOUTH";

export type PrecinctCaptain = {
  id: string;
  ld_number: number;
  precinct_code: string;
  role: PcRole | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  preferred_name: string | null;
  email: string | null;
  phone: string | null;
  credentialed_2025: boolean;
  elected_at: string | null;
  source: string | null;
  notes: string | null;
};

export async function fetchPcsForLd(ld: number): Promise<PrecinctCaptain[]> {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("precinct_captains")
    .select("*")
    .eq("ld_number", ld)
    .order("precinct_code", { ascending: true })
    .order("last_name", { ascending: true });
  if (error) {
    console.error("fetchPcsForLd error", error);
    return [];
  }
  return (data ?? []) as PrecinctCaptain[];
}

export function groupPcsByPrecinct(
  pcs: PrecinctCaptain[]
): Map<string, PrecinctCaptain[]> {
  const m = new Map<string, PrecinctCaptain[]>();
  for (const pc of pcs) {
    const existing = m.get(pc.precinct_code);
    if (existing) existing.push(pc);
    else m.set(pc.precinct_code, [pc]);
  }
  return m;
}

export function pcDisplayName(pc: PrecinctCaptain): string {
  const first = pc.preferred_name || pc.first_name;
  return `${first} ${pc.last_name}`;
}
