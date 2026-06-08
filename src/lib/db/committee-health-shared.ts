// Client-safe types + activity-bucket helpers for committee health.
// Server fetcher lives in committee-health.ts.

export type CommitteeHealth = {
  code: string;
  name: string;
  type: "STANDING" | "AD_HOC";
  chair_id: string | null;
  chair_name: string | null;
  last_activity_at: string | null;
  days_since_activity: number | null;
  last_met_on: string | null;
  next_meeting_on: string | null;
  open_action_items: number;
  pending_action_items: number;
  has_unpublished_minutes: boolean;
};

export type ActivityBucket = "ACTIVE" | "QUIET" | "DARK" | "NEVER";

export function activityBucket(c: CommitteeHealth): ActivityBucket {
  const d = c.days_since_activity;
  if (d == null) return "NEVER";
  if (d <= 30) return "ACTIVE";
  if (d <= 90) return "QUIET";
  return "DARK";
}

export const ACTIVITY_LABEL: Record<ActivityBucket, string> = {
  ACTIVE: "Active",
  QUIET: "Quiet",
  DARK: "Dark",
  NEVER: "Never met",
};

export const ACTIVITY_COLOR: Record<ActivityBucket, string> = {
  ACTIVE: "#059669",
  QUIET: "var(--color-ldp-gold)",
  DARK: "var(--color-ldp-red)",
  NEVER: "#64748b",
};
