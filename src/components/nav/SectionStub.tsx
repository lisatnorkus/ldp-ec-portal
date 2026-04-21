import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SECTION_NAV } from "@/lib/nav/sections";
import { Button } from "@/components/ui/button";

export function SectionStub({ slug }: { slug: string }) {
  const section = SECTION_NAV.find((s) => s.slug === slug);
  if (!section) return null;

  const Icon = section.icon;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b border-[var(--color-ldp-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ldp-navy-700)] hover:underline"
          >
            <ArrowLeft className="size-4" /> Back to dashboard
          </Link>
          <Button asChild variant="ldp" size="sm">
            <a href="https://us02web.zoom.us/j/89692618777" target="_blank" rel="noopener noreferrer">
              Join EC Meeting
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-xl border border-[var(--color-ldp-line)] bg-white p-10 text-center">
          <Icon className="mx-auto size-10 text-[var(--color-ldp-navy-800)]" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
            {section.label}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--color-ldp-ink-700)]">
            {section.description}
          </p>
          <div className="mx-auto mt-6 max-w-md rounded-lg border border-[var(--color-ldp-line)] bg-[#FAFAFA] px-4 py-3 text-xs text-[var(--color-ldp-ink-700)]">
            Section coming online in Phase 2. Schema is in place; data migration + UI next.
          </div>
        </div>
      </main>
    </div>
  );
}
