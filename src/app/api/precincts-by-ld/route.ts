import { NextResponse } from "next/server";
import { getKypoliticsServer } from "@/lib/supabase/kypolitics";
import { precinctCodeFrom } from "@/lib/db/precincts";

export const dynamic = "force-dynamic";

// Lightweight endpoint the PC picker calls client-side to populate the
// precinct dropdown once an LD is chosen. Returns a deduped list of
// L-codes sorted numerically. Falls back to an empty list on any
// kypolitics failure so the picker can still save with just an LD.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ld = searchParams.get("ld");
  if (!ld || !/^\d+$/.test(ld)) {
    return NextResponse.json({ precincts: [] });
  }
  try {
    const supabase = await getKypoliticsServer();
    const { data, error } = await supabase
      .from("jeffco_voter_targeting")
      .select("precinct")
      .eq("hd", ld);
    if (error) {
      return NextResponse.json({ precincts: [] });
    }
    const codes = new Set<string>();
    for (const row of data ?? []) {
      const c = precinctCodeFrom((row as { precinct: string }).precinct);
      if (c) codes.add(c);
    }
    const sorted = Array.from(codes).sort((a, b) => {
      const na = parseInt(a.slice(1), 10);
      const nb = parseInt(b.slice(1), 10);
      return na - nb;
    });
    return NextResponse.json({ precincts: sorted });
  } catch {
    return NextResponse.json({ precincts: [] });
  }
}
