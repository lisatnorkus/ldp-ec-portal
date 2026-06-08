"use client";

import { Crown, ShieldCheck, Home, MapPin, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import {
  ROLE_KEY_LABEL,
  type RoleKey,
} from "@/content/highest-leverage-rules";

// Persistent role identity strip at the top of the dashboard. The
// "View as ▾" switch in WorkingSetHeader is small and people miss it
// — this is the unmissable callout that tells Lisa (or anyone with
// multiple hats) which lens the dashboard is currently rendering in.
//
// Color + label decoded from the active role:
//   - Officer (any flavor) → navy with gold accent + Crown icon
//   - LD Chair → red with white text + Home icon
//   - LD VC → red-tint with navy + Home icon ("ready to step in")
//   - At-Large + LYD/JCDWC → violet + Users icon
//   - Precinct Captain → emerald + MapPin
//   - Default / no role → no banner (stays clean for first-time visitors)

type BannerStyle = {
  label: string;
  scope: string | null;
  bg: string;
  fg: string;
  accent: string;
  icon: LucideIcon;
};

function styleFor(role: RoleKey | null, ld_number: number | null, precinct: string | null): BannerStyle | null {
  if (!role) return null;
  const officer: BannerStyle = {
    label: "",
    scope: "Countywide operations",
    bg: "var(--color-ldp-navy-900)",
    fg: "#ffffff",
    accent: "var(--color-ldp-gold)",
    icon: Crown,
  };
  switch (role) {
    case "OFFICER":
      return { ...officer, label: "LDPEC Officer Dashboard" };
    case "OFFICER_CHAIR":
      return { ...officer, label: "LDP Chair Dashboard", icon: Crown };
    case "OFFICER_VC":
      return { ...officer, label: "LDP Vice Chair Dashboard", icon: ShieldCheck };
    case "OFFICER_SECRETARY":
      return { ...officer, label: "LDP Secretary Dashboard", icon: ShieldCheck, scope: "Records + roster" };
    case "OFFICER_TREASURER":
      return { ...officer, label: "LDP Treasurer Dashboard", icon: ShieldCheck, scope: "Finance + records" };
    case "LD_CHAIR":
      return {
        label: `LD${ld_number ?? "??"} Chair Dashboard`,
        scope: "Your district, this week",
        bg: "var(--color-ldp-red)",
        fg: "#ffffff",
        accent: "var(--color-ldp-gold)",
        icon: Home,
      };
    case "LD_VC":
      return {
        label: `LD${ld_number ?? "??"} Vice Chair Dashboard`,
        scope: "Ready to step in",
        bg: "var(--color-ldp-red)",
        fg: "#ffffff",
        accent: "var(--color-ldp-gold)",
        icon: Home,
      };
    case "AT_LARGE":
      return {
        label: "At-Large Member Dashboard",
        scope: "Cross-LD priorities",
        bg: "#7c3aed",
        fg: "#ffffff",
        accent: "var(--color-ldp-gold)",
        icon: Users,
      };
    case "LYD_PRES":
      return {
        label: "LYD President Dashboard",
        scope: "Louisville Young Democrats",
        bg: "#7c3aed",
        fg: "#ffffff",
        accent: "var(--color-ldp-gold)",
        icon: Users,
      };
    case "WOMENS_CLUB_PRES":
      return {
        label: "JCDWC President Dashboard",
        scope: "Jefferson County Democratic Women's Club",
        bg: "#7c3aed",
        fg: "#ffffff",
        accent: "var(--color-ldp-gold)",
        icon: Users,
      };
    case "PRECINCT_CAPTAIN":
      return {
        label: precinct
          ? `Precinct Captain Dashboard — ${precinct}`
          : "Precinct Captain Dashboard",
        scope: ld_number ? `LD${ld_number} turf` : "Your turf",
        bg: "#059669",
        fg: "#ffffff",
        accent: "var(--color-ldp-gold)",
        icon: MapPin,
      };
    case "COMMITTEE_CHAIR_ONLY":
      return {
        label: "Committee Chair Dashboard",
        scope: "Your committee",
        bg: "#0891b2",
        fg: "#ffffff",
        accent: "var(--color-ldp-gold)",
        icon: Sparkles,
      };
    default:
      return null;
  }
}

export function RoleBanner() {
  const { profile, hydrated } = useUserProfile();
  if (!hydrated) {
    return <div className="mb-4 h-12 animate-pulse rounded-lg bg-white" />;
  }
  const style = styleFor(profile.role, profile.ld_number, profile.precinct_code);
  if (!style) return null;
  const Icon = style.icon;
  const switchingLens = profile.additional_roles.length > 0;
  return (
    <section
      aria-label="Role context"
      className="mb-4 overflow-hidden rounded-xl shadow-sm"
      style={{ backgroundColor: style.bg }}
    >
      <div
        aria-hidden="true"
        className="h-1 w-full"
        style={{ backgroundColor: style.accent }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: style.accent, color: style.bg }}
          >
            <Icon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: style.accent }}
            >
              You are viewing as
            </div>
            <h2
              className="truncate text-lg font-black tracking-tight"
              style={{ color: style.fg }}
            >
              {style.label}
            </h2>
            {style.scope && (
              <p
                className="text-[12px]"
                style={{ color: style.fg, opacity: 0.85 }}
              >
                {style.scope}
              </p>
            )}
          </div>
        </div>
        {switchingLens && (
          <div
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: style.accent, color: style.bg }}
          >
            {profile.additional_roles.length + 1} hat
            {profile.additional_roles.length + 1 === 1 ? "" : "s"} on file
          </div>
        )}
      </div>
    </section>
  );
}

// Tiny re-export of the label table in case anything else wants it.
export { ROLE_KEY_LABEL };
