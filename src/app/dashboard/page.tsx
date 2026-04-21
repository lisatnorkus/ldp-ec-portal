import Link from "next/link";
import { SectionNav } from "@/components/nav/SectionNav";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              LDPEC Portal
            </div>
            <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">Dashboard</div>
          </div>
          <nav className="flex items-center gap-4 text-xs">
            <Link href="/tour/1" className="text-[var(--color-ldp-navy-700)] hover:underline">
              Revisit the tour
            </Link>
            <Button asChild variant="ldp" size="sm">
              <a
                href="https://us02web.zoom.us/j/89692618777"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join EC Meeting
              </a>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-10">
          <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-gold)]">
              Welcome
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
              Your role-aware dashboard will live here.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-ldp-ink-700)]">
              Once the Google sign-in lands and we load LDPEC members into Supabase, this surface
              renders your role-specific view — this-week&apos;s-action, your Q report status,
              Canvass Tools shortcut, and the transitions tracker. For now, jump into any section
              below.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Sections
          </h2>
          <SectionNav />
        </section>
      </main>
    </div>
  );
}
