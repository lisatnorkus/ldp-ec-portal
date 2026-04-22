"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle, Sparkles, User } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";

// Onboarding card that shows at the top of the dashboard until the
// user has set their display_name. Once they do, it disappears —
// no dismiss button needed, no localStorage flag, no drift between
// "I set my name" and "the nudge is gone."

export function FirstTimeNudge() {
  const { profile, hydrated } = useUserProfile();
  if (!hydrated) return null;
  if (profile.display_name) return null;

  return (
    <section className="mb-6 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-gold)] bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-navy-800) 0%, var(--color-ldp-gold) 50%, var(--color-ldp-red) 100%)",
        }}
      />
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-gold)] text-[var(--color-ldp-navy-900)]">
            <Sparkles aria-hidden="true" className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
              Welcome to the LDPEC Portal
            </div>
            <h2 className="mt-1 text-xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              Two-step setup. Takes a minute.
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-[var(--color-ldp-ink-900)]">
              <li className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-[10px] font-bold text-white">
                  1
                </span>
                <span>
                  <strong className="text-[var(--color-ldp-navy-900)]">Set your profile.</strong>{" "}
                  Name, role, and LD. That&apos;s how notes, tasks, and interactions get attributed
                  to you — and how the dashboard shows what&apos;s on you specifically.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-[10px] font-bold text-white">
                  2
                </span>
                <span>
                  <strong className="text-[var(--color-ldp-navy-900)]">Skim the help page.</strong>{" "}
                  Three minutes covers the whole portal — tasks, notes, the recruiting pipeline,
                  the continuity package, and the strategy map.
                </span>
              </li>
            </ol>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="#profile-picker"
                onClick={(e) => {
                  // The WorkingSetHeader is directly below this nudge —
                  // scroll to it rather than trust a fragment that isn't
                  // wired up.
                  e.preventDefault();
                  const el = document.querySelector("#ws-name") ??
                    document.querySelector("[data-working-set]");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    if (el instanceof HTMLElement) el.focus?.();
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
              >
                <User aria-hidden="true" className="size-4" />
                Set your profile
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </a>
              <Link
                href="/help"
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-ldp-navy-900)] hover:border-[var(--color-ldp-navy-700)]"
              >
                <HelpCircle aria-hidden="true" className="size-4" />
                Help & FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
