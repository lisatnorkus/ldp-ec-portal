import { Video } from "lucide-react";
import { KDP_CALL_META, getNextKdpCall } from "@/lib/kdp-monthly-call";

// Compact strip advertising the next KDP monthly county-party call.
// Placed below the cycle section on the dashboard and intentionally
// rendered smaller than the "Join EC Meeting" action so it doesn't
// compete with LDPEC's own meeting link.
export function KdpCallStrip() {
  const call = getNextKdpCall();
  const soon = call.daysUntil >= 0 && call.daysUntil <= 7;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-[11px] text-[var(--color-ldp-ink-700)]">
      <Video aria-hidden="true" className="size-3.5 text-[var(--color-ldp-ink-700)]" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        KDP monthly call
      </span>
      {call.isToday ? (
        <span className="font-bold text-[var(--color-ldp-red)]">
          Tonight · {KDP_CALL_META.startLocalLabel}
        </span>
      ) : soon ? (
        <span>
          <span className="font-semibold text-[var(--color-ldp-navy-900)]">{call.label}</span>
          <span> · {KDP_CALL_META.startLocalLabel}</span>
        </span>
      ) : (
        <span>
          Next:{" "}
          <span className="font-medium text-[var(--color-ldp-ink-900)]">{call.label}</span>,{" "}
          {KDP_CALL_META.startLocalLabel}
        </span>
      )}
      <a
        href={KDP_CALL_META.zoomUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-ldp-navy-700)] underline"
      >
        Join
      </a>
      <span className="text-[10px] italic">
        {KDP_CALL_META.cadenceLabel} · host: {KDP_CALL_META.host}
      </span>
    </div>
  );
}
