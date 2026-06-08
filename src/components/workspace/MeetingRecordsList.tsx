"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, FileText, Pencil, Plus, ScrollText, Trash2 } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import {
  MEETING_STATUS_COLOR,
  MEETING_STATUS_LABEL,
  type MeetingRecord,
  type PromotableNotesPost,
} from "@/lib/db/meeting-records-shared";
import {
  amendMeetingRecord,
  approveMeetingRecord,
  deleteMeetingRecord,
} from "./meeting-record-actions";
import { PublishRecordComposer } from "./PublishRecordComposer";

type Tab = "ALL" | "LDPEC" | "COMMITTEE";

function formatMeetingDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MeetingRecordsList({
  records,
  promotablePosts,
  committeeOptions,
}: {
  records: MeetingRecord[];
  promotablePosts: PromotableNotesPost[];
  committeeOptions: Array<{ code: string; name: string }>;
}) {
  const { profile, hydrated } = useUserProfile();
  const [tab, setTab] = useState<Tab>("ALL");
  const [composing, setComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // canPublish/canApprove are advisory in Phase 1 — we can't actually
  // verify the role server-side without OAuth. We surface the action
  // when display_name is set and trust the server action to no-op if
  // the role doesn't match. UI noise is acceptable here vs. a heavier
  // hydration pattern.
  const canAct = hydrated && !!profile.display_name;

  const filtered = useMemo(() => {
    if (tab === "ALL") return records;
    return records.filter((r) => r.meeting_type === tab);
  }, [records, tab]);

  const counts = useMemo(() => {
    return {
      ALL: records.length,
      LDPEC: records.filter((r) => r.meeting_type === "LDPEC").length,
      COMMITTEE: records.filter((r) => r.meeting_type === "COMMITTEE").length,
    };
  }, [records]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {(["ALL", "LDPEC", "COMMITTEE"] as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  active
                    ? "border-[var(--color-ldp-navy-800)] bg-[var(--color-ldp-navy-800)] text-white"
                    : "border-[var(--color-ldp-line)] bg-white text-[var(--color-ldp-ink-700)] hover:border-[var(--color-ldp-navy-700)]"
                }`}
              >
                {t === "ALL" ? "All" : t === "LDPEC" ? "LDPEC" : "Committees"}
                <span className={`ml-1 ${active ? "text-white/80" : "text-[var(--color-ldp-ink-700)]"}`}>
                  {counts[t]}
                </span>
              </button>
            );
          })}
        </div>
        {canAct && !composing && (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-navy-800)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            Publish record
          </button>
        )}
      </div>

      {composing && (
        <PublishRecordComposer
          promotablePosts={promotablePosts}
          committeeOptions={committeeOptions}
          onClose={() => {
            setComposing(false);
            setError(null);
          }}
          onError={setError}
        />
      )}

      {error && (
        <div className="rounded-lg border border-[var(--color-ldp-red)]/30 bg-[#FFF5F6] p-3 text-xs text-[var(--color-ldp-red)]">
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState canAct={canAct} onCompose={() => setComposing(true)} />
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <RecordRow
              key={r.id}
              record={r}
              canAct={canAct}
              myName={profile.display_name ?? ""}
              onError={setError}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function RecordRow({
  record,
  canAct,
  myName,
  onError,
}: {
  record: MeetingRecord;
  canAct: boolean;
  myName: string;
  onError: (msg: string | null) => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const statusColor = MEETING_STATUS_COLOR[record.status];
  const isLdpec = record.meeting_type === "LDPEC";

  function handleApprove() {
    startTransition(async () => {
      const res = await approveMeetingRecord(record.id, { display_name: myName });
      if (!res.ok) onError(res.error);
    });
  }

  function handleAmend() {
    startTransition(async () => {
      const res = await amendMeetingRecord(record.id);
      if (!res.ok) onError(res.error);
    });
  }

  function handleDelete() {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    startTransition(async () => {
      const res = await deleteMeetingRecord(record.id);
      if (!res.ok) onError(res.error);
    });
  }

  return (
    <li
      className="overflow-hidden rounded-lg border bg-white shadow-sm"
      style={{ borderLeft: `4px solid ${statusColor}` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: statusColor }}
            >
              {MEETING_STATUS_LABEL[record.status]}
            </span>
            <span className="rounded-full bg-[var(--color-ldp-navy-800)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-navy-900)]">
              {isLdpec ? "LDPEC" : record.committee_name ?? record.committee_code}
            </span>
            <span className="text-[var(--color-ldp-ink-700)]">
              {formatMeetingDate(record.meeting_date)}
            </span>
          </div>

          <h3 className="mt-1 text-base font-bold text-[var(--color-ldp-navy-900)]">
            {isLdpec
              ? "LDPEC meeting"
              : `${record.committee_name ?? record.committee_code} meeting`}
          </h3>

          {record.approved_by_name && record.approved_at && (
            <div className="mt-1 text-[11px] text-[var(--color-ldp-ink-700)]">
              Approved {new Date(record.approved_at).toLocaleDateString("en-US")} ·{" "}
              {record.approved_by_name}
            </div>
          )}

          <div className="mt-2 space-y-1.5">
            {record.minutes ? (
              <DocLink
                icon={<ScrollText className="size-3.5" />}
                label="Minutes"
                title={record.minutes.title}
                author={record.minutes.author_display_name}
                committeeCode={record.committee_code}
              />
            ) : (
              <div className="text-[11px] italic text-[var(--color-ldp-ink-700)]">
                No minutes attached.
              </div>
            )}
            {record.treasurer_report && (
              <DocLink
                icon={<FileText className="size-3.5" />}
                label="Treasurer report"
                title={record.treasurer_report.title}
                author={record.treasurer_report.author_display_name}
                committeeCode={record.committee_code}
              />
            )}
          </div>
        </div>

        {canAct && (
          <div className="flex shrink-0 items-center gap-1">
            {record.status === "PUBLISHED" && (
              <button
                type="button"
                onClick={handleApprove}
                disabled={isPending}
                className="inline-flex items-center gap-1 rounded-md bg-[#059669] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#047857] disabled:opacity-50"
                title="Mark approved (use this after the next meeting ratifies)"
              >
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
                Approve
              </button>
            )}
            {record.status === "APPROVED" && (
              <button
                type="button"
                onClick={handleAmend}
                disabled={isPending}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-gold)] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[var(--color-ldp-gold)]/10 disabled:opacity-50"
                title="Mark amended (record was revised after approval)"
              >
                <Pencil aria-hidden="true" className="size-3.5" />
                Amend
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              onBlur={() => setConfirmingDelete(false)}
              disabled={isPending}
              aria-label={confirmingDelete ? "Confirm delete" : "Delete"}
              title={confirmingDelete ? "Click again to confirm" : "Delete record"}
              className={`rounded p-1.5 transition-colors disabled:opacity-50 ${
                confirmingDelete
                  ? "bg-[var(--color-ldp-red)] text-white"
                  : "text-[var(--color-ldp-ink-700)] hover:bg-[#FFF5F6] hover:text-[var(--color-ldp-red)]"
              }`}
            >
              <Trash2 aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function DocLink({
  icon,
  label,
  title,
  author,
  committeeCode,
}: {
  icon: React.ReactNode;
  label: string;
  title: string | null;
  author: string;
  committeeCode: string | null;
}) {
  // Phase 1: the minutes / treasurer reports live as posts inside the
  // committee's workspace. Link to the committee page (the workspace
  // section anchor scrolls to it). LDPEC-wide records don't have a
  // single committee page yet — display as a non-link.
  const inner = (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-ldp-navy-700)]">
      <span style={{ color: "var(--color-ldp-navy-700)" }}>{icon}</span>
      <span className="font-semibold">{label}:</span>
      <span className="truncate text-[var(--color-ldp-ink-900)]">
        {title ?? "(untitled)"}
      </span>
      <span className="text-[var(--color-ldp-ink-700)]">· {author}</span>
    </span>
  );
  if (committeeCode) {
    return (
      <a
        href={`/committees/${committeeCode.toLowerCase()}#committee-workspace`}
        className="block hover:underline"
      >
        {inner}
      </a>
    );
  }
  return <div>{inner}</div>;
}

function EmptyState({
  canAct,
  onCompose,
}: {
  canAct: boolean;
  onCompose: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-navy-800) 0%, var(--color-ldp-gold) 100%)",
        }}
      />
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-white">
            <ScrollText aria-hidden="true" className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
              No published records yet
            </div>
            <h3 className="mt-1 text-xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              The official record starts the next time you publish minutes.
            </h3>
            <p className="mt-2 text-sm text-[var(--color-ldp-ink-900)]">
              Write the minutes as a NOTES post in the relevant committee workspace,
              then come back here to publish them as an official record. PUBLISHED →
              APPROVED happens at the next meeting.
            </p>
            {canAct && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onCompose}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-ldp-navy-800)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ldp-navy-900)]"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Publish record
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
