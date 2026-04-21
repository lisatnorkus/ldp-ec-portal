import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--color-ldp-navy-900)] to-[var(--color-ldp-navy-800)] text-white">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          404
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Page not found.</h1>
        <p className="mt-4 text-base text-white/80">
          That URL doesn&apos;t point to anything the portal knows about.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="ldpGold" size="lg">
            <Link href="/dashboard">Back to the dashboard</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/tour/1">Start the tour</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
