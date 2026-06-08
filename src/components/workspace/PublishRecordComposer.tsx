"use client";

import { useMemo, useState, useTransition } from "react";
import { FileCheck2, X } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { PromotableNotesPost } from "@/lib/db/meeting-records-shared";
import { publishMeetingRecord } from "./meeting-record-actions";

type Mode = "LDPEC" | "COMMITTEE";

export function PublishRecordComposer({
  promotablePosts,
  committeeOptions,
  onClose,
  onError,
}: {
  promotablePosts: PromotableNotesPost[];
  committeeOptions: Array<{ code: string; name: string }>;
  onClose: () => void;
  onError: (msg: string | null) => void;
}) {
  const { profile, hydrated } = useUserProfile();
  const [mode, setMode] = useState<Mode>("LDPEC");
  const [committeeCode, setCommitteeCode] = useState<string>("");
  const [minutesPostId, setMinutesPostId] = useState<string>("");
  const [treasurerPostId, setTreasurerPostId] = useState<string>("");
  const [meetingDate, setMeetingDate] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Filter promotable posts by the chosen scope so the picker only shows
  // relevant minutes. For COMMITTEE, scope to the selected code; for
  // LDPEC, scope to the LDPEC committee row (assumes a top-level
  // LDPEC-ish code exists; otherwise the picker is just the full list).
  const filteredPosts = useMemo(() => {
    if (mode === "LDPEC") return promotablePosts;
    if (!committeeCode) return [];
    return promotablePosts.filter((p) => p.committee_code === committeeCode);
  }, [mode, committeeCode, promotablePosts]);

  // Auto-fill meeting_date from the selected minutes post.
  function pickMinutes(id: string) {
    setMinutesPostId(id);
    const p = promotablePosts.find((p) => p.id === id);
    if (p?.meeting_date) setMeetingDate(p.meeting_date);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onError(null);
    const author_name = profile.display_name;
    if (!author_name) {
      onError("Set your name on the dashboard first.");
      return;
    }
    if (!meetingDate) {
      onError("Pick a meeting date (or select a minutes post to autofill it).");
      return;
    }
    if (mode === "COMMITTEE" && !committeeCode) {
      onError("Pick a committee.");
      return;
    }
    if (!minutesPostId && !treasurerPostId) {
      onError("Attach minutes or a treasurer report (at least one).");
      return;
    }
    startTransition(async () => {
      const res = await publishMeetingRecord(
        {
          meeting_date: meetingDate,
          meeting_type: mode,
          committee_code: mode === "COMMITTEE" ? committeeCode : null,
          minutes_post_id: minutesPostId || null,
          treasurer_report_post_id: treasurerPostId || null,
        },
        { display_name: author_name }
      );
      if (!res.ok) {
        onError(res.error);
        return;
      }
      onClose();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white shadow-sm"
    >
      <header className="flex items-center justify-between border-b border-[var(--color-ldp-line)] bg-[#FAFBFC] px-4 py-3">
        <div className="flex items-center gap-2">
          <FileCheck2
            aria-hidden="true"
            className="size-4 text-[var(--color-ldp-navy-800)]"
          />
          <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
            Publish an official record
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded p-1 text-[var(--color-ldp-ink-700)] hover:bg-white hover:text-[var(--color-ldp-navy-900)]"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </header>

      <div className="space-y-4 p-4">
        {/* Scope */}
        <fieldset>
          <legend className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Meeting type
          </legend>
          <div className="flex gap-2">
            {(["LDPEC", "COMMITTEE"] as Mode[]).map((m) => (
              <label
                key={m}
                className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${
                  mode === m
                    ? "border-[var(--color-ldp-navy-800)] bg-[var(--color-ldp-navy-800)] text-white"
                    : "border-[var(--color-ldp-line)] bg-white text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)]"
                }`}
              >
                <input
                  type="radio"
                  name="record-mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => {
                    setMode(m);
                    setMinutesPostId("");
                    setTreasurerPostId("");
                  }}
                  className="sr-only"
                />
                {m === "LDPEC" ? "LDPEC (countywide)" : "Committee"}
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "COMMITTEE" && (
          <label className="block text-sm">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
              Committee
            </span>
            <select
              value={committeeCode}
              onChange={(e) => {
                setCommitteeCode(e.target.value);
                setMinutesPostId("");
              }}
              className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
            >
              <option value="">Select a committee…</option>
              {committeeOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block text-sm">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Minutes post
            <span className="ml-1 font-normal normal-case text-[var(--color-ldp-ink-700)]">
              (NOTES posts from {mode === "COMMITTEE" ? "that committee" : "any workspace"})
            </span>
          </span>
          <select
            value={minutesPostId}
            onChange={(e) => pickMinutes(e.target.value)}
            className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
          >
            <option value="">— No minutes attached —</option>
            {filteredPosts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.meeting_date} · {p.title ?? "(untitled)"} ·{" "}
                {p.committee_name ?? p.committee_code}
              </option>
            ))}
          </select>
          {filteredPosts.length === 0 && (
            <span className="mt-1 block text-[11px] text-[var(--color-ldp-ink-700)]">
              No promotable NOTES posts. Write minutes as a NOTES post in the committee
              workspace first (with a meeting date set).
            </span>
          )}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Treasurer report post <span className="font-normal normal-case">(optional)</span>
          </span>
          <select
            value={treasurerPostId}
            onChange={(e) => setTreasurerPostId(e.target.value)}
            className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
          >
            <option value="">— No treasurer report —</option>
            {filteredPosts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.meeting_date} · {p.title ?? "(untitled)"} ·{" "}
                {p.committee_name ?? p.committee_code}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
            Meeting date
          </span>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="w-full rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1.5 text-sm"
          />
        </label>
      </div>

      <footer className="flex justify-end gap-2 border-t border-[var(--color-ldp-line)] bg-[#FAFBFC] px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-[var(--color-ldp-line)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || !hydrated}
          className="rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)] disabled:opacity-50"
        >
          {isPending ? "Publishing…" : "Publish record"}
        </button>
      </footer>
    </form>
  );
}
