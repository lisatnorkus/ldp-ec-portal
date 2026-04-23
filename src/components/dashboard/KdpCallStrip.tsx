import { Video } from "lucide-react";
import { KDP_CALL_DEFAULTS, getNextKdpCall } from "@/lib/kdp-monthly-call";
import { getSupabaseServer } from "@/lib/supabase/server";

// Compact strip advertising the next KDP monthly county-party call.
// Placed below the cycle section on the dashboard and intentionally
// rendered smaller than the "Join EC Meeting" action so it doesn't
// compete with LDPEC's own meeting link.
//
// Zoom URL + IDs come from the `settings` table so Morgan rotating
// the meeting is a data update, not a deploy. Falls back to the
// hardcoded defaults if the settings rows are missing.
export async function KdpCallStrip() {
  const [call, meta] = [getNextKdpCall(), await fetchKdpCallMeta()];
  const soon = call.daysUntil >= 0 && call.daysUntil <= 7;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-[var(--color-ldp-line)] bg-[#FAFBFC] px-3 py-2 text-[11px] text-[var(--color-ldp-ink-700)]">
      <Video aria-hidden="true" className="size-3.5 text-[var(--color-ldp-ink-700)]" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
        KDP monthly call
      </span>
      {call.isToday ? (
        <span className="font-bold text-[var(--color-ldp-red)]">
          Tonight · {meta.startLocalLabel}
        </span>
      ) : soon ? (
        <span>
          <span className="font-semibold text-[var(--color-ldp-navy-900)]">{call.label}</span>
          <span> · {meta.startLocalLabel}</span>
        </span>
      ) : (
        <span>
          Next:{" "}
          <span className="font-medium text-[var(--color-ldp-ink-900)]">{call.label}</span>,{" "}
          {meta.startLocalLabel}
        </span>
      )}
      <a
        href={meta.zoomUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-ldp-navy-700)] underline"
      >
        Join
      </a>
      <span className="text-[10px] italic">
        {meta.cadenceLabel} · host: {meta.host}
      </span>
    </div>
  );
}

type KdpCallMetaResolved = {
  zoomUrl: string;
  meetingId: string;
  passcode: string;
  startLocalLabel: string;
  cadenceLabel: string;
  host: string;
};

async function fetchKdpCallMeta(): Promise<KdpCallMetaResolved> {
  try {
    const supabase = await getSupabaseServer();
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [
        "kdp_monthly_call_zoom_url",
        "kdp_monthly_call_meeting_id",
        "kdp_monthly_call_passcode",
      ]);
    const map = new Map(((data ?? []) as Array<{ key: string; value: string }>).map((r) => [r.key, r.value]));
    return {
      ...KDP_CALL_DEFAULTS,
      zoomUrl: map.get("kdp_monthly_call_zoom_url") || KDP_CALL_DEFAULTS.zoomUrl,
      meetingId: map.get("kdp_monthly_call_meeting_id") || KDP_CALL_DEFAULTS.meetingId,
      passcode: map.get("kdp_monthly_call_passcode") || KDP_CALL_DEFAULTS.passcode,
    };
  } catch (err) {
    console.error("[KdpCallStrip] fetchKdpCallMeta failed, using defaults", err);
    return KDP_CALL_DEFAULTS;
  }
}
