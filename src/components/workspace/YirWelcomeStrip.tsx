"use client";

import { AlertCircle, Sparkles } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import { OFFICER_ROLE_LABEL, type OfficerRole } from "@/lib/db/members-types";

// Audience resolution snapshot — built on the server, passed in here so
// the client doesn't have to refetch the EC roster just to greet the
// user. Identity match is by display_name (Phase 1 localStorage gating).
export type YirAudience = {
  // map: display_name → role (current officer or incoming Chair/VC)
  current_officers: Record<string, OfficerRole>;
  incoming_leaders: Record<string, OfficerRole>;
};

export function YirWelcomeStrip({ audience }: { audience: YirAudience }) {
  const { profile, hydrated } = useUserProfile();

  if (!hydrated) {
    return <div className="mb-6 h-24 animate-pulse rounded-xl bg-white" />;
  }

  const name = profile.display_name?.trim() ?? "";
  const currentOfficerRole = name ? audience.current_officers[name] : undefined;
  const incomingRole = name ? audience.incoming_leaders[name] : undefined;
  const eligibleRole = currentOfficerRole ?? incomingRole;
  const isIncoming = !currentOfficerRole && !!incomingRole;

  if (!name) {
    return (
      <div className="mb-6 rounded-xl border-2 border-[var(--color-ldp-gold)] bg-[var(--color-ldp-gold)]/10 p-4 text-sm text-[var(--color-ldp-navy-900)]">
        <div className="flex items-start gap-3">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <div>
            <strong>Set your name on the dashboard</strong> to see the personalized
            welcome. The content below is the same briefing the incoming Chair, Vice
            Chair, and current Officers will be reading.
          </div>
        </div>
      </div>
    );
  }

  if (!eligibleRole) {
    return (
      <div className="mb-6 rounded-xl border border-[var(--color-ldp-line)] bg-white p-4 text-sm text-[var(--color-ldp-ink-900)]">
        <div className="flex items-start gap-3">
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--color-ldp-ink-700)]"
          />
          <div>
            <div className="font-semibold text-[var(--color-ldp-navy-900)]">
              This page is built for incoming Chair + Vice Chair + current Officers.
            </div>
            <p className="mt-1 text-[13px] text-[var(--color-ldp-ink-700)]">
              You can still read it — it&apos;s a useful walkthrough of how the
              workspace, action items, and official records hang together. The
              briefing-style framing assumes you&apos;re about to inherit the role.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const roleLabel = OFFICER_ROLE_LABEL[eligibleRole];

  return (
    <div className="mb-6 overflow-hidden rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white shadow-sm">
      <div
        aria-hidden="true"
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--color-ldp-navy-800) 0%, var(--color-ldp-gold) 100%)",
        }}
      />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <Sparkles
            aria-hidden="true"
            className="mt-0.5 size-5 text-[var(--color-ldp-navy-800)]"
          />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-red)]">
              {isIncoming ? "Incoming" : "Officer"} briefing
            </div>
            <h2 className="mt-1 text-xl font-black tracking-tight text-[var(--color-ldp-navy-900)]">
              Welcome to your workspace, {name}.
            </h2>
            <p className="mt-1 text-[14px] text-[var(--color-ldp-ink-900)]">
              As <strong>{roleLabel}</strong>, everything you need to be an effective
              board member is in this app. The sections below auto-update from live
              workspace activity — minutes, upcoming meetings, action items, the full
              permissions map.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
