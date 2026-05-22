"use client";

import { useState, useTransition } from "react";
import { BookOpen, MessageCircle, Plus } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import { addTakeaway } from "./takeaway-actions";

export type TakeawayDTO = {
  id: string;
  ld_number: number;
  election_key: string;
  author_name: string | null;
  author_role: string | null;
  body: string;
  created_at: string;
};

type Props = {
  ld_number: number; // 0 for countywide
  election_key: string;
  election_label: string;
  takeaways: TakeawayDTO[];
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.round(months / 12);
  return `${years}y ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ElectionTakeaways({
  ld_number,
  election_key,
  election_label,
  takeaways,
}: Props) {
  const { profile, hydrated } = useUserProfile();
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const author_name = profile.display_name?.trim() ?? "";
  const author_role = profile.role ?? null;

  function submit() {
    setError(null);
    if (!author_name) {
      setError(
        "Add your name in the header at the top of this page before saving takeaways."
      );
      return;
    }
    startTransition(async () => {
      const res = await addTakeaway(ld_number, election_key, draft, {
        name: author_name,
        role: author_role,
      });
      if (res.ok) {
        setDraft("");
        setDrafting(false);
      } else {
        setError(res.error);
      }
    });
  }

  const scope_blurb =
    ld_number === 0
      ? "Countywide takeaways — readable from every LD."
      : `Takeaways stay with LD${ld_number}. Future officers will read what you saw.`;

  return (
    <section
      aria-label="Election takeaways"
      className="mb-8 rounded-xl border bg-[var(--color-ldp-cream,#fbf8f1)] p-5"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
            <BookOpen className="size-3.5" aria-hidden />
            Takeaways · {election_label}
          </div>
          <p className="mt-1 text-xs text-[var(--color-ldp-ink-700)]">{scope_blurb}</p>
        </div>
        {!drafting && (
          <button
            type="button"
            onClick={() => {
              setDrafting(true);
              setError(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-ldp-navy-700)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-navy-100,#eef0f4)]"
          >
            <Plus className="size-3.5" aria-hidden />
            Add takeaway
          </button>
        )}
      </header>

      {drafting && (
        <div className="mb-4 rounded-lg border bg-white p-3">
          <label htmlFor="takeaway-body" className="sr-only">
            New takeaway
          </label>
          <textarea
            id="takeaway-body"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder="What did you learn? What surprised you? What worked, what didn't? (Future LD chairs will read this.)"
            className="w-full resize-y rounded-md border border-[var(--color-ldp-ink-200,#d8dbe1)] bg-white p-2 text-sm leading-relaxed focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ldp-navy-700)]"
          />
          {error && (
            <p className="mt-2 text-xs text-[var(--color-ldp-red)]">{error}</p>
          )}
          {hydrated && !author_name && (
            <p className="mt-2 text-xs text-amber-700">
              You&apos;re not signed in yet — the portal won&apos;t know who wrote
              this. Set your name in the role picker at the top.
            </p>
          )}
          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="text-[11px] text-[var(--color-ldp-ink-700)]">
              {hydrated && author_name ? (
                <>
                  Saving as <span className="font-semibold">{author_name}</span>
                  {author_role && (
                    <>
                      {" "}
                      ·{" "}
                      <span className="uppercase tracking-widest">
                        {author_role.replace(/_/g, " ").toLowerCase()}
                      </span>
                    </>
                  )}
                </>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDrafting(false);
                  setDraft("");
                  setError(null);
                }}
                className="rounded-md px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-ink-700)] hover:bg-[var(--color-ldp-ink-100,#e6e7ea)]"
                disabled={pending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={pending || !draft.trim()}
                className="rounded-md bg-[var(--color-ldp-navy-700)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
              >
                {pending ? "Saving…" : "Save takeaway"}
              </button>
            </div>
          </div>
        </div>
      )}

      {takeaways.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-5 text-center">
          <MessageCircle
            className="mx-auto size-5 text-[var(--color-ldp-ink-400,#7a808b)]"
            aria-hidden
          />
          <p className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">
            No takeaways yet. Whoever writes the first one starts the record
            for this LD.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {takeaways.map((t) => (
            <li
              key={t.id}
              className="rounded-lg border bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]"
            >
              <header className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--color-ldp-navy-900)]">
                    {t.author_name || "Anonymous"}
                  </span>
                  {t.author_role && (
                    <span className="rounded bg-[var(--color-ldp-ink-100,#e6e7ea)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
                      {t.author_role.replace(/_/g, " ").toLowerCase()}
                    </span>
                  )}
                </div>
                <time
                  dateTime={t.created_at}
                  className="text-[var(--color-ldp-ink-700)]"
                  title={formatDate(t.created_at)}
                >
                  {relativeTime(t.created_at)}
                </time>
              </header>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
                {t.body}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
