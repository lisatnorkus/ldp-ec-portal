"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode, type FormEvent } from "react";
import { checkPassphrase, isUnlocked, markUnlocked } from "@/lib/auth/passphrase";
import { Button } from "@/components/ui/button";

export function AuthGate({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUnlocked(isUnlocked());
    setHydrated(true);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (checkPassphrase(input)) {
      markUnlocked();
      setUnlocked(true);
      setError(null);
    } else {
      setError("That passphrase doesn't match. Check with the committee if you need it.");
    }
  }

  if (!hydrated) {
    return (
      <div
        className="min-h-screen bg-[var(--color-ldp-navy-900)]"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Loading portal…</span>
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-ldp-navy-900)] to-[var(--color-ldp-navy-800)] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center border-b border-[var(--color-ldp-line)] pb-5 text-center">
          <Image
            src="/democratic-kicking-donkey.png"
            alt="Democratic Party"
            width={84}
            height={84}
            priority
            className="mb-3 h-16 w-auto drop-shadow-sm"
          />
          <div className="text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            LDP Executive Committee
          </div>
          <h1 className="mt-1 text-2xl font-bold text-[var(--color-ldp-navy-900)]">
            Executive Committee Portal
          </h1>
          <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
            Private tool for LDPEC members. Enter the committee passphrase to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="passphrase" className="block text-sm font-medium text-[var(--color-ldp-ink-900)]">
              Passphrase
            </label>
            <input
              id="passphrase"
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              autoComplete="off"
              aria-invalid={error != null}
              aria-describedby={error ? "passphrase-error" : undefined}
              className="mt-1 block w-full rounded-md border border-[var(--color-ldp-line)] px-3 py-2 text-sm shadow-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
              placeholder="Enter passphrase"
            />
          </div>
          {error && (
            <p
              id="passphrase-error"
              className="text-sm text-[var(--color-ldp-red)]"
              role="alert"
            >
              {error}
            </p>
          )}
          <Button type="submit" variant="ldp" size="lg" className="w-full">
            Unlock
          </Button>
        </form>

        <p className="mt-6 text-xs text-[var(--color-ldp-ink-700)]">
          Can&apos;t remember the passphrase?{" "}
          <a
            href="mailto:communications@louisvilledems.com"
            className="font-medium text-[var(--color-ldp-navy-700)] hover:underline"
          >
            Ask the Communications Committee.
          </a>
        </p>
      </div>
    </div>
  );
}
