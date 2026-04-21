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
        <p className="mt-4 max-w-2xl text-lg text-white/80">
          This portal is the committee&apos;s internal playbook — what your role is, what we&apos;re
          working on, and what&apos;s coming in 2028. If this is your first time, take the tour.
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
            <Link href="/dashboard">Skip to the dashboard</Link>
          </Button>
        </div>

        <div className="mt-16 rounded-lg border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70">
          v2.0 alpha · passphrase auth ·{" "}
          <span className="text-[var(--color-ldp-gold)]">Google sign-in coming post-testing</span>
        </div>
      </div>
    </main>
  );
}
