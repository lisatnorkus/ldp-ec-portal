"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bug,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  X,
} from "lucide-react";
import { useUserProfile } from "@/lib/userContext";

type Kind = "feature" | "bug" | "feedback";
type Tab = "menu" | "request" | "bug" | "submitted";

export function HelpButton() {
  const pathname = usePathname();
  const { profile } = useUserProfile();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("menu");

  // Don't render on the landing page or the tour — they have their
  // own help affordances and the FAB would crowd the hero.
  if (pathname === "/" || pathname.startsWith("/tour")) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTab("menu");
        }}
        aria-label="Open help"
        className="fixed bottom-4 right-4 z-40 inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-white shadow-lg transition-all hover:bg-[var(--color-ldp-navy-900)] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ldp-gold)] focus-visible:ring-offset-2"
      >
        <HelpCircle aria-hidden="true" className="size-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center">
          <button
            aria-label="Close help"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-ldp-line)] bg-[var(--color-ldp-navy-900)] px-5 py-3 text-white">
              <div className="flex items-center gap-2">
                <HelpCircle aria-hidden="true" className="size-5 text-[var(--color-ldp-gold)]" />
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  {tab === "menu" ? "Help" : tab === "request" ? "Request a change" : tab === "bug" ? "Report a bug" : "Submitted"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded p-1 text-white/70 hover:text-white"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="p-5">
              {tab === "menu" && (
                <MenuTab
                  onFaq={() => setOpen(false)}
                  onRequest={() => setTab("request")}
                  onBug={() => setTab("bug")}
                />
              )}
              {(tab === "request" || tab === "bug") && (
                <FeedbackForm
                  kind={tab === "request" ? "feature" : "bug"}
                  pathname={pathname ?? ""}
                  authorName={profile.display_name ?? ""}
                  onBack={() => setTab("menu")}
                  onSubmitted={() => setTab("submitted")}
                />
              )}
              {tab === "submitted" && (
                <SubmittedTab
                  onClose={() => {
                    setOpen(false);
                    setTab("menu");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MenuTab({
  onFaq,
  onRequest,
  onBug,
}: {
  onFaq: () => void;
  onRequest: () => void;
  onBug: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-[var(--color-ldp-ink-700)]">What do you need?</p>
      <Link
        href="/help"
        onClick={onFaq}
        className="flex items-start gap-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 transition-colors hover:border-[var(--color-ldp-navy-700)]"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-ldp-navy-800)] text-white">
          <HelpCircle aria-hidden="true" className="size-4" />
        </span>
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">Help & FAQ</div>
          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            How the portal works, section-by-section.
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={onRequest}
        className="flex w-full items-start gap-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-left transition-colors hover:border-[var(--color-ldp-navy-700)]"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-ldp-gold)] text-[var(--color-ldp-navy-900)]">
          <Lightbulb aria-hidden="true" className="size-4" />
        </span>
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
            Request a change
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            Feature idea, copy fix, new data, anything. Goes straight to the queue.
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={onBug}
        className="flex w-full items-start gap-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-left transition-colors hover:border-[var(--color-ldp-navy-700)]"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-ldp-red)] text-white">
          <Bug aria-hidden="true" className="size-4" />
        </span>
        <div>
          <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">Report a bug</div>
          <div className="mt-0.5 text-xs text-[var(--color-ldp-ink-700)]">
            Something broken, wrong, or not behaving the way it should.
          </div>
        </div>
      </button>
      <div className="border-t border-[var(--color-ldp-line)] pt-3 text-[11px] text-[var(--color-ldp-ink-700)]">
        Urgent? Email{" "}
        <a
          href="mailto:communications@louisvilledems.com"
          className="text-[var(--color-ldp-navy-700)] underline"
        >
          communications@louisvilledems.com
        </a>
        .
      </div>
    </div>
  );
}

function FeedbackForm({
  kind,
  pathname,
  authorName,
  onBack,
  onSubmitted,
}: {
  kind: "feature" | "bug";
  pathname: string;
  authorName: string;
  onBack: () => void;
  onSubmitted: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are both required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/submit-feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: kind satisfies Kind,
            title,
            description,
            page: pathname,
            author_name: authorName,
            author_email: email,
          }),
        });
        const data = await res.json();
        if (!data.ok) {
          setError(data.error || "Submission failed.");
          return;
        }
        // If the server returned a mailto fallback (no GitHub token
        // configured), open the user's mail client so the feedback
        // still reaches a human.
        if (data.fallback === "mailto" && data.mailto) {
          window.location.href = data.mailto;
        }
        onSubmitted();
      } catch (err) {
        console.error(err);
        setError("Request failed. Try again, or email communications@louisvilledems.com.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-[var(--color-ldp-ink-700)]">
        You&apos;re on <code className="rounded bg-[#FAFAFA] px-1">{pathname}</code>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Short title
        </span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={
            kind === "feature"
              ? "e.g. Add a way to export the task list"
              : "e.g. Drawer doesn't close on mobile"
          }
          className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
          autoFocus
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          What&apos;s going on?
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder={
            kind === "feature"
              ? "What do you want it to do? Why?"
              : "What did you click, what did you expect, what actually happened?"
          }
          className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
        />
      </label>
      {!authorName && (
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Your email (optional, so we can follow up)
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)]"
          />
        </label>
      )}
      {error && <p className="text-xs text-[var(--color-ldp-red)]">{error}</p>}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="text-xs text-[var(--color-ldp-ink-700)] hover:underline disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={isPending || !title.trim() || !description.trim()}
          className={`inline-flex items-center gap-1 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
            kind === "feature"
              ? "bg-[var(--color-ldp-gold)] text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-gold)]/90"
              : "bg-[var(--color-ldp-red)] hover:bg-[var(--color-ldp-red)]/90"
          }`}
        >
          <MessageSquare aria-hidden="true" className="size-4" />
          {isPending ? "Sending…" : "Submit"}
        </button>
      </div>
    </div>
  );
}

function SubmittedTab({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <MessageSquare aria-hidden="true" className="size-6" />
      </div>
      <h3 className="text-base font-bold text-[var(--color-ldp-navy-900)]">Thanks — it&apos;s in the queue.</h3>
      <p className="mt-2 text-sm text-[var(--color-ldp-ink-700)]">
        Lisa reviews new requests daily during the preview. Urgent things always beat the queue —
        email Communications if it&apos;s blocking you.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
      >
        Close
      </button>
    </div>
  );
}
