import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--color-ldp-navy-900)] to-[var(--color-ldp-navy-800)] text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          Louisville Democratic Party
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Executive Committee Portal
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-white/85">
          Infrastructure for the LDPEC — concrete deliverables you can execute against. Your role,
          your district, the plan right now, and the 2028 reorg ahead.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="ldpGold" size="lg">
            <Link href="/tour/1">Start the tour</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/dashboard">Go to the dashboard</Link>
          </Button>
        </div>

        <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          <LinkTile href="/tour/2" label="Your role" />
          <LinkTile href="/my-ld" label="Your district" />
          <LinkTile href="/this-month" label="This month" />
          <LinkTile href="/tour/4" label="Meetings" />
        </div>

        <div className="mt-auto pt-16 text-xs text-white/50">
          Private to Louisville Democratic Party Executive Committee members.
        </div>
      </div>
    </main>
  );
}

function LinkTile({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80 transition-colors hover:border-[var(--color-ldp-gold)] hover:text-white"
    >
      {label} →
    </Link>
  );
}
