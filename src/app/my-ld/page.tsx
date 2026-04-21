import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            My LD
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ldp-ink-700)]">
            Pick your Legislative District. Each page shows leadership, precincts
            by strategy, races on the ballot, and what to do this week.
          </p>
        </div>

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
