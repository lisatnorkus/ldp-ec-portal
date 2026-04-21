"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portal error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
          Something broke
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          The portal hit a snag loading that page.
        </h1>
        <p className="mt-3 max-w-md text-sm text-[var(--color-ldp-ink-700)]">
          Usually this means the database took too long or returned something unexpected. Try again;
          if it keeps happening, tell the portal maintainer what page you were on.
        </p>
        {error.digest && (
          <p className="mt-2 text-[10px] font-mono text-[var(--color-ldp-ink-700)]">
            Error id: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} variant="ldp" size="lg">
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
