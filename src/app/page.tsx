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
        <p className="mt-4 max-w-2xl text-lg text-white/85">
          The committee&apos;s internal playbook. What your role is, what we&apos;re working on,
          and what&apos;s coming in 2028. If this is your first time, take the tour.
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

        <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          <LinkTile href="/tour/1" label="What the LDPEC is" />
          <LinkTile href="/my-ld" label="My LD" />
          <LinkTile href="/this-month" label="This month" />
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
