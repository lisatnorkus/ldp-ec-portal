// Types + labels for volunteer management. Client-safe (no server-only
// imports) so UI components and server actions can both depend on it.

export type VolunteerStatus = "ACTIVE" | "LAPSED" | "PAUSED" | "DO_NOT_CONTACT";

export type VolunteerSource =
  | "SIGNUP_FORM"
  | "REFERRAL"
  | "EVENT"
  | "CANVASS"
  | "SOCIAL"
  | "WALK_IN"
  | "OTHER";

export type VolunteerActivityType =
  | "CANVASS"
  | "PHONES"
  | "TEXTS"
  | "DATA"
  | "EVENT_HELP"
  | "HOSTING"
  | "RIDES"
  | "TRANSLATION"
  | "SOCIAL"
  | "FOOD"
  | "WRITING"
  | "TECH"
  | "CHILDCARE"
  | "ADMIN"
  | "OTHER";

export type AvailabilityWindow =
  | "WEEKDAY_DAY"
  | "WEEKDAY_EVENING"
  | "WEEKEND_DAY"
  | "WEEKEND_EVENING";

// Canonical interest tags — match activity types 1:1 so "likes canvass"
// and "did canvass" use the same key. Free-form tags are still allowed
// in the DB column so Jessica can coin new ones, but the dropdown
// renders this list.
export const VOLUNTEER_INTERESTS: { key: string; label: string; hint: string }[] = [
  { key: "CANVASS", label: "Canvass", hint: "Knock doors" },
  { key: "PHONES", label: "Phone bank", hint: "Calls from script" },
  { key: "TEXTS", label: "Text bank", hint: "Peer-to-peer texting" },
  { key: "DATA", label: "Data entry", hint: "VBM lookup, tracker updates" },
  { key: "EVENT_HELP", label: "Event help", hint: "Staff fundraisers, rallies" },
  { key: "HOSTING", label: "Host house parties", hint: "Open their home" },
  { key: "RIDES", label: "Rides to polls", hint: "Drive voters on election day" },
  { key: "TRANSLATION", label: "Translation", hint: "Bilingual support" },
  { key: "SOCIAL", label: "Social amplification", hint: "Share, repost, comment" },
  { key: "FOOD", label: "Food for events", hint: "Bring dishes, coordinate meals" },
  { key: "WRITING", label: "Writing / LTEs", hint: "Letters to the editor, copy" },
  { key: "TECH", label: "Tech / web help", hint: "Website, tools, automation" },
  { key: "CHILDCARE", label: "Childcare", hint: "Watch kids during events" },
  { key: "ADMIN", label: "Admin / office", hint: "Filing, mailings, logistics" },
];

export type Volunteer = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  email: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_zip: string | null;
  home_ld: number | null;
  home_precinct: string | null;
  status: VolunteerStatus;
  source: VolunteerSource;
  interest_tags: string[];
  availability_windows: string[];
  remote_ok: boolean;
  recruited_by_name: string | null;
  owner_name: string | null;
  notes: string | null;
  last_active_at: string | null;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  created_at: string;
  updated_at: string;
};

export type VolunteerActivity = {
  id: string;
  volunteer_id: string;
  activity_type: VolunteerActivityType;
  activity_date: string;
  title: string | null;
  hours: number | null;
  related_ld: number | null;
  notes: string | null;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  created_at: string;
};

export const STATUS_LABEL: Record<VolunteerStatus, string> = {
  ACTIVE: "Active",
  LAPSED: "Lapsed",
  PAUSED: "Paused",
  DO_NOT_CONTACT: "Do not contact",
};

export const STATUS_COLOR: Record<VolunteerStatus, string> = {
  ACTIVE: "#059669",
  LAPSED: "#F59E0B",
  PAUSED: "#94a3b8",
  DO_NOT_CONTACT: "#C8102E",
};

export const SOURCE_LABEL: Record<VolunteerSource, string> = {
  SIGNUP_FORM: "Sign-up form",
  REFERRAL: "Referral",
  EVENT: "Event",
  CANVASS: "Canvass",
  SOCIAL: "Social",
  WALK_IN: "Walk-in",
  OTHER: "Other",
};

export const ACTIVITY_LABEL: Record<VolunteerActivityType, string> = {
  CANVASS: "Canvassed",
  PHONES: "Phone bank",
  TEXTS: "Text bank",
  DATA: "Data entry",
  EVENT_HELP: "Event help",
  HOSTING: "Hosted",
  RIDES: "Drove voters",
  TRANSLATION: "Translated",
  SOCIAL: "Social post",
  FOOD: "Brought food",
  WRITING: "Wrote",
  TECH: "Tech help",
  CHILDCARE: "Childcare",
  ADMIN: "Admin / office",
  OTHER: "Other",
};

export const AVAILABILITY_LABEL: Record<AvailabilityWindow, string> = {
  WEEKDAY_DAY: "Weekday · daytime",
  WEEKDAY_EVENING: "Weekday · evening",
  WEEKEND_DAY: "Weekend · daytime",
  WEEKEND_EVENING: "Weekend · evening",
};

export function volunteerDisplayName(v: Pick<Volunteer, "first_name" | "last_name" | "preferred_name">): string {
  const first = v.preferred_name?.trim() || v.first_name;
  return `${first} ${v.last_name}`.trim();
}

export function interestLabel(key: string): string {
  return VOLUNTEER_INTERESTS.find((i) => i.key === key)?.label ?? prettyLabel(key);
}

function prettyLabel(s: string): string {
  return s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
