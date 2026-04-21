import Link from "next/link";
import { PageMasthead } from "@/components/nav/PageMasthead";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "My LD" };

type LdSummary = {
  number: number;
  chair_id: string | null;
  vc_id: string | null;
};

async function fetchLdSummaries(): Promise<LdSummary[]> {
  const supabase = await getSupabaseServer();
  const { data } = await supabase
    .from("legislative_districts")
    .select("number, chair_id, vc_id")
    .order("number");
  return (data ?? []) as LdSummary[];
}

export default async function MyLdIndex() {
  const lds = await fetchLdSummaries();
  const gaps = lds.filter((l) => !l.chair_id || !l.vc_id);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageMasthead
        eyebrow="My LD"
        title="Pick your Legislative District."
        subtitle="Each page shows leadership, precincts by strategy, races on the ballot, precinct captains on file, early voting inside the district, and what to do this week."
      />

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {lds.map((ld) => {
            const hasGap = !ld.chair_id || !ld.vc_id;
            return (
              <Link
                key={ld.number}
                href={`/my-ld/${ld.number}`}
                className={`group rounded-lg border bg-white p-4 text-center transition-colors hover:border-[var(--color-ldp-navy-700)] hover:shadow-sm ${
                  hasGap ? "border-[var(--color-ldp-red)]" : "border-[var(--color-ldp-line)]"
                }`}
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                  LD
                </div>
                <div className="text-2xl font-bold text-[var(--color-ldp-navy-900)]">
                  {ld.number}
                </div>
                {hasGap && (
                  <div className="mt-1 text-[10px] font-semibold uppercase text-[var(--color-ldp-red)]">
                    Vacancy
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {gaps.length > 0 && (
          <p className="mt-4 text-xs text-[var(--color-ldp-ink-700)]">
            {gaps.length} LD{gaps.length === 1 ? "" : "s"} currently have a chair
            or vice-chair vacancy (red border).
          </p>
        )}
      </main>
    </div>
  );
}
