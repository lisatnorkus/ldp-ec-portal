import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ClipboardList,
  Flag,
  Handshake,
  Megaphone,
  Siren,
  Sun,
  Vote,
} from "lucide-react";

// Visual identity per month-card theme_tag. Used by both the hero band
// on the current-month playbook and the year-grid tiles so the whole
// page reads as one story rather than a wall of text.

export type MonthTheme = {
  accent: string;      // primary color — border, icon bg
  accentBg: string;    // very light tint for the hero band background
  gradientTo: string;  // second gradient stop on the hero band
  label: string;       // short descriptor ("Primary ramp", "Summer build")
  subtitle: string;    // one-line positioning under the month name
  Icon: LucideIcon;
};

const THEMES: Record<string, MonthTheme> = {
  OFF_CYCLE: {
    accent: "#64748b",
    accentBg: "#F1F5F9",
    gradientTo: "#475569",
    label: "Off-cycle · Planning",
    subtitle: "Refresh, review, and tee up what the cycle needs next.",
    Icon: ClipboardList,
  },
  PRIMARY_WINDOW: {
    accent: "#C8102E",
    accentBg: "#FFF5F6",
    gradientTo: "#8A0B20",
    label: "Primary window",
    subtitle: "Candidates, endorsements, canvass waves, dinner push.",
    Icon: Vote,
  },
  POST_PRIMARY: {
    accent: "#059669",
    accentBg: "#ECFDF5",
    gradientTo: "#065F46",
    label: "Post-primary",
    subtitle: "Debrief, recruit, fold new energy into committees.",
    Icon: Handshake,
  },
  SUMMER: {
    accent: "#D4A017",
    accentBg: "#FEF9E7",
    gradientTo: "#9C7406",
    label: "Summer build",
    subtitle: "Registration drives, WDD push, PC recruiting.",
    Icon: Sun,
  },
  GENERAL: {
    accent: "#0E4C9E",
    accentBg: "#EFF6FF",
    gradientTo: "#0B3A78",
    label: "General cadence",
    subtitle: "Canvass weekly, hold the line, volunteers ramping.",
    Icon: Megaphone,
  },
  ELECTION_WEEK: {
    accent: "#C8102E",
    accentBg: "#FFF5F6",
    gradientTo: "#7A0919",
    label: "Election week",
    subtitle: "Max GOTV. Every precinct captain live. Close it out.",
    Icon: Siren,
  },
  POST_GENERAL: {
    accent: "#334155",
    accentBg: "#F1F5F9",
    gradientTo: "#1E293B",
    label: "Post-general · Close-out",
    subtitle: "Wrap, thank, review, reset for the next cycle.",
    Icon: Archive,
  },
};

const DEFAULT_THEME: MonthTheme = {
  accent: "#0E4C9E",
  accentBg: "#EFF6FF",
  gradientTo: "#0B3A78",
  label: "Monthly playbook",
  subtitle: "What the party is focused on this month.",
  Icon: Flag,
};

export function themeFor(tag: string | null): MonthTheme {
  if (!tag) return DEFAULT_THEME;
  return THEMES[tag] ?? DEFAULT_THEME;
}
