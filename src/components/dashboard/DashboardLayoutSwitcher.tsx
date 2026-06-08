"use client";

import type { ReactNode } from "react";
import { useUserProfile } from "@/lib/userContext";
import {
  OfficerDashboard,
  type OfficerDashboardData,
} from "./OfficerDashboard";

// Picks between the officer dashboard and the default dashboard based
// on the active lens. Both data shapes are fetched server-side and
// passed in; the swap is purely client-side so changing the View-as
// toggle re-lays the page instantly.

const OFFICER_ROLES = new Set([
  "OFFICER",
  "OFFICER_CHAIR",
  "OFFICER_VC",
  "OFFICER_SECRETARY",
  "OFFICER_TREASURER",
]);

export function DashboardLayoutSwitcher({
  officerData,
  children,
}: {
  officerData: OfficerDashboardData;
  children: ReactNode;
}) {
  const { profile, hydrated } = useUserProfile();

  // Until we know the lens, render the default layout. The OfficerDashboard
  // expects client data anyway, so first paint shows the LD-flavored
  // default — and officers see the swap right after hydration.
  if (!hydrated) return <>{children}</>;

  const role = profile.role;
  if (role && OFFICER_ROLES.has(role)) {
    // Use the active lens for the officer view's framing.
    return <OfficerDashboard data={{ ...officerData, role }} />;
  }

  return <>{children}</>;
}
