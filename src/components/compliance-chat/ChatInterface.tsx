"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { Scale, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_QUESTIONS: { label: string; question: string }[] = [
  {
    label: "Can JCDEC contribute to a Metro Council race?",
    question:
      "Can JCDEC contribute money or in-kind support to a Metro Council candidate now that Louisville-area Metro Council races are nonpartisan under HB 388?",
  },
  {
    label: "What are the federal coordinated party expenditure limits for 2026?",
    question:
      "What are the federal coordinated party expenditure limits that apply to JCDEC's role under 11 CFR 109.33 for the 2026 cycle?",
  },
  {
    label: "How do Levin/non-federal funds work for FEA?",
    question:
      "How does the Levin amendment work for funding Federal Election Activity (FEA), and what activity qualifies as FEA for JCDEC?",
  },
  {
    label: "Can a judicial candidate's committee solicit at our event?",
    question:
      "Can a Kentucky judicial candidate's committee solicit contributions at a JCDEC event, and what are the limits under Canon 4 / SCR 4.300?",
  },
];

export function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const submit = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      if (isStreaming) return;

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setSubmittedQuestion(trimmed);
      setAnswer("");
      setError(null);
      setIsStreaming(true);

      try {
        const res = await fetch("/api/compliance-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed }),
          signal: ctrl.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `Request failed with ${res.status}`);
        }
        if (!res.body) {
          throw new Error("Response had no streamed body.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setAnswer(acc);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Request failed.");
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming]
  );

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(question);
  }

  function pickSample(q: string) {
    setQuestion(q);
    void submit(q);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border-l-4 border-[var(--color-ldp-red)] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Scale className="mt-0.5 size-5 shrink-0 text-[var(--color-ldp-red)]" aria-hidden />
          <div className="text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
            <p className="font-semibold text-[var(--color-ldp-navy-900)]">
              Reference tool — not legal advice.
            </p>
            <p className="mt-1">
              Answers cite Kentucky statutes (KRS 121, 32 KAR), federal law (FECA / BCRA / 11 CFR),
              and the Kentucky Code of Judicial Conduct. For a binding answer on your specific
              situation, consult JCDEC counsel or file a KREF / FEC advisory opinion. The model
              cites only from the loaded corpus; if it doesn&apos;t know, it&apos;ll say so.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={onSubmit} className="space-y-3">
        <label
          htmlFor="compliance-question"
          className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]"
        >
          Ask a compliance question
        </label>
        <textarea
          id="compliance-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Can JCDEC pay for a slate-card mailer that includes a Metro Council candidate?"
          rows={3}
          maxLength={4000}
          disabled={isStreaming}
          className="block w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-2 text-sm shadow-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-navy-700)] disabled:opacity-60"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[var(--color-ldp-ink-700)]">
            {question.length}/4000 · Single-turn V1 — refresh to start over.
          </div>
          <Button
            type="submit"
            variant="ldp"
            disabled={isStreaming || !question.trim()}
            className="gap-2"
          >
            <Send className="size-4" aria-hidden />
            {isStreaming ? "Thinking…" : "Ask"}
          </Button>
        </div>
      </form>

      {!submittedQuestion && !isStreaming && (
        <section>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            <Sparkles className="size-3.5" aria-hidden /> Try one of these
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {SAMPLE_QUESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => pickSample(s.question)}
                className="rounded-lg border border-[var(--color-ldp-line)] bg-white p-3 text-left text-sm text-[var(--color-ldp-navy-900)] transition-colors hover:border-[var(--color-ldp-navy-700)] hover:bg-[#F7F8FA]"
              >
                {s.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {error && (
        <div className="rounded-lg border border-[var(--color-ldp-red)] bg-red-50 p-4 text-sm text-[var(--color-ldp-red)]">
          {error}
        </div>
      )}

      {submittedQuestion && (
        <section className="space-y-3">
          <div className="rounded-lg border border-[var(--color-ldp-line)] bg-[#F7F8FA] p-4">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Question
            </div>
            <div className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">{submittedQuestion}</div>
          </div>
          <div className="rounded-lg border-2 border-[var(--color-ldp-navy-900)] bg-white p-5">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
              Answer
            </div>
            <div className="prose prose-sm mt-2 max-w-none whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
              {answer || (isStreaming ? <em className="text-[var(--color-ldp-ink-700)]">Loading…</em> : null)}
              {isStreaming && answer && (
                <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[var(--color-ldp-navy-700)] align-middle" />
              )}
            </div>
            {!isStreaming && answer && (
              <div className="mt-4 border-t border-[var(--color-ldp-line)] pt-3 text-[11px] leading-relaxed text-[var(--color-ldp-ink-700)]">
                <strong>Reminder:</strong> this is a reference tool. For a binding answer, contact
                JCDEC counsel, file a KREF advisory opinion (state law), or an FEC advisory opinion
                (federal law).
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
