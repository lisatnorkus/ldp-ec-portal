"use client";

import { useState, useTransition } from "react";
import { Check, CircleDot, Clock, ListChecks, ThumbsDown, Undo2, X } from "lucide-react";
import type {
  AssignmentStatus,
  PostAssignmentRow,
  WorkspacePost,
} from "@/lib/db/workspace-shared";
import { rollupAssignmentStatus } from "@/lib/db/workspace-shared";
import {
  acceptAssignment,
  rejectAssignment,
  setAssignmentStatus,
} from "./workspace-actions";

const STATUS_LABEL: Record<AssignmentStatus, string> = {
  PENDING: "Awaiting acceptance",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

const STATUS_DOT: Record<AssignmentStatus, string> = {
  PENDING: "bg-[var(--color-ldp-gold)]",
  ACCEPTED: "bg-emerald-500",
  REJECTED: "bg-[var(--color-ldp-red)]",
  IN_PROGRESS: "bg-[var(--color-ldp-navy-700)]",
  DONE: "bg-emerald-700",
};

export function ActionItemCard({
  post,
  committeeCode,
  myName,
  memberNamesById,
  onError,
  renderHeader,
}: {
  post: WorkspacePost;
  committeeCode: string;
  myName: string;
  memberNamesById: Record<string, string>;
  onError: (msg: string | null) => void;
  renderHeader: (actions?: React.ReactNode) => React.ReactNode;
}) {
  const rollup = rollupAssignmentStatus(post.assignments);
  const rollupLabel =
    rollup === "ALL_DONE"
      ? "Done"
      : rollup === "ALL_PENDING"
        ? "Awaiting acceptance"
        : rollup === "ANY_REJECTED"
          ? "Has a rejection"
          : rollup === "IN_PROGRESS"
            ? "In progress"
            : rollup === "MIXED"
              ? "Mixed"
              : "—";
  const rollupTone =
    rollup === "ALL_DONE"
      ? "bg-emerald-100 text-emerald-800"
      : rollup === "ANY_REJECTED"
        ? "bg-[#FFF5F6] text-[var(--color-ldp-red)]"
        : rollup === "ALL_PENDING"
          ? "bg-[var(--color-ldp-gold)]/30 text-[var(--color-ldp-navy-900)]"
          : "bg-[#EFF6FF] text-[var(--color-ldp-navy-900)]";

  return (
    <article
      className="overflow-hidden rounded-lg border bg-white shadow-sm"
      style={{ borderLeft: `4px solid var(--color-ldp-gold)` }}
    >
      {renderHeader(
        <span
          className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${rollupTone}`}
        >
          <ListChecks aria-hidden="true" className="size-3" />
          {rollupLabel}
        </span>
      )}

      <div className="px-4 pb-4">
        {post.title && (
          <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">
            {post.title}
          </h3>
        )}

        {post.content_md && (
          <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--color-ldp-ink-900)]">
            {post.content_md}
          </p>
        )}

        <ul className="mt-3 space-y-2">
          {post.assignments.map((a) => (
            <AssigneeRow
              key={a.id}
              assignment={a}
              committeeCode={committeeCode}
              assigneeName={memberNamesById[a.assignee_member_id] ?? "(unknown member)"}
              isMine={memberNamesById[a.assignee_member_id] === myName && !!myName}
              onError={onError}
            />
          ))}
        </ul>
      </div>
    </article>
  );
}

function AssigneeRow({
  assignment,
  committeeCode,
  assigneeName,
  isMine,
  onError,
}: {
  assignment: PostAssignmentRow;
  committeeCode: string;
  assigneeName: string;
  isMine: boolean;
  onError: (msg: string | null) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function doAccept() {
    onError(null);
    startTransition(async () => {
      const res = await acceptAssignment(assignment.id, committeeCode, assigneeName);
      if (!res.ok) onError(res.error);
    });
  }

  function doReject() {
    onError(null);
    if (!reason.trim()) {
      onError("Tell the assigner why — a reason is required.");
      return;
    }
    startTransition(async () => {
      const res = await rejectAssignment(
        assignment.id,
        committeeCode,
        assigneeName,
        reason
      );
      if (!res.ok) {
        onError(res.error);
        return;
      }
      setRejecting(false);
      setReason("");
    });
  }

  function moveTo(status: "IN_PROGRESS" | "DONE") {
    onError(null);
    startTransition(async () => {
      const res = await setAssignmentStatus(
        assignment.id,
        committeeCode,
        assigneeName,
        status
      );
      if (!res.ok) onError(res.error);
    });
  }

  const showAcceptReject =
    isMine && assignment.status === "PENDING" && !rejecting;
  const showProgressControls =
    isMine && (assignment.status === "ACCEPTED" || assignment.status === "IN_PROGRESS");
  const showReopen = isMine && assignment.status === "DONE";

  return (
    <li
      className={`rounded border p-3 text-sm ${
        isMine && assignment.status === "PENDING"
          ? "border-[var(--color-ldp-gold)] bg-[#FEF9E7]"
          : "border-[var(--color-ldp-line)] bg-[#FAFBFC]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          aria-hidden="true"
          className={`inline-block size-2 shrink-0 rounded-full ${STATUS_DOT[assignment.status]}`}
        />
        <span className="font-semibold text-[var(--color-ldp-navy-900)]">
          {assigneeName}
          {isMine && (
            <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
              you
            </span>
          )}
        </span>
        <span className="text-[11px] uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          · {STATUS_LABEL[assignment.status]}
        </span>

        <div className="ml-auto flex items-center gap-1">
          {showAcceptReject && (
            <>
              <button
                type="button"
                onClick={doAccept}
                disabled={isPending}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                <Check aria-hidden="true" className="size-3" />
                Accept
              </button>
              <button
                type="button"
                onClick={() => setRejecting(true)}
                disabled={isPending}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1 text-[11px] text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-red)] hover:text-[var(--color-ldp-red)] disabled:opacity-50"
              >
                <X aria-hidden="true" className="size-3" />
                Reject
              </button>
            </>
          )}
          {showProgressControls && (
            <>
              {assignment.status === "ACCEPTED" && (
                <button
                  type="button"
                  onClick={() => moveTo("IN_PROGRESS")}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-navy-700)] bg-white px-2 py-1 text-[11px] font-semibold text-[var(--color-ldp-navy-900)] hover:bg-[#EFF6FF] disabled:opacity-50"
                >
                  <Clock aria-hidden="true" className="size-3" />
                  Working
                </button>
              )}
              <button
                type="button"
                onClick={() => moveTo("DONE")}
                disabled={isPending}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                <CircleDot aria-hidden="true" className="size-3" />
                Done
              </button>
            </>
          )}
          {showReopen && (
            <button
              type="button"
              onClick={() => moveTo("IN_PROGRESS")}
              disabled={isPending}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1 text-[11px] text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
            >
              <Undo2 aria-hidden="true" className="size-3" />
              Reopen
            </button>
          )}
        </div>
      </div>

      {rejecting && (
        <div className="mt-2 rounded border border-[var(--color-ldp-red)]/40 bg-white p-2">
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-red)]">
            Why are you rejecting? <span className="text-[var(--color-ldp-red)]">required</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            autoFocus
            placeholder="e.g. doesn't fit my LD's bandwidth this month — try Pat?"
            className="mt-1 w-full rounded border border-[var(--color-ldp-line)] bg-white p-2 text-xs focus:border-[var(--color-ldp-red)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ldp-red)]/50"
          />
          <div className="mt-2 flex justify-end gap-1">
            <button
              type="button"
              onClick={() => {
                setRejecting(false);
                setReason("");
              }}
              disabled={isPending}
              className="rounded-md border border-[var(--color-ldp-line)] bg-white px-2 py-1 text-[11px] text-[var(--color-ldp-ink-900)] hover:border-[var(--color-ldp-navy-700)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={doReject}
              disabled={isPending || !reason.trim()}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-ldp-red)] px-2 py-1 text-[11px] font-semibold text-white hover:bg-[var(--color-ldp-red)]/90 disabled:opacity-50"
            >
              <ThumbsDown aria-hidden="true" className="size-3" />
              Submit rejection
            </button>
          </div>
        </div>
      )}

      {assignment.status === "REJECTED" && assignment.rejection_reason && (
        <p className="mt-1 text-xs italic text-[var(--color-ldp-red)]">
          &ldquo;{assignment.rejection_reason}&rdquo;
        </p>
      )}
    </li>
  );
}
