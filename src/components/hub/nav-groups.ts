import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  LayoutDashboard,
  Calendar,
  Home,
  Map,
  Vote,
  ClipboardList,
  Clock,
  Users,
  Building2,
  Handshake,
  Scale,
  Megaphone,
  Ticket,
  ArrowLeftRight,
  FolderOpen,
  Compass,
  HelpCircle,
  Gavel,
  HandHeart,
  HeartHandshake,
  IdCard,
  Repeat,
  Share2,
  Target,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  accent?: string; // per-item override; else inherits from group
  // Hidden from the sidebar unless the viewer holds the admin token
  // cookie. Used while a feature is being previewed and not yet ready
  // for the wider EC to see.
  adminOnly?: boolean;
};

export type NavGroup = {
  key: string;
  label: string | null; // null = top-level ungrouped
  accent: string; // group color — lights up the sidebar row + destination masthead + any dashboard widget linking into this group
  items: NavItem[];
};

// Semantic color map:
//   Top (no label) — Dashboard, My LD, This Month, Amplify, Events
//     These are daily/weekly surfaces. Always visible, never collapsed.
//   Campaign & Field — red (urgent, organizing work)
//   People — violet
//   Governance — cyan
//   Resources — amber
//   Per-item overrides for concepts with their own semantic color.
//
// Targeting Explained intentionally NOT in the sidebar — it's a
// reference, not a destination. Linked from Plan & Map, Captains,
// My LD, and anywhere we render strategy buckets.
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "command",
    label: null,
    accent: "#0E4C9E",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/my-ld", label: "My LD", icon: Home, accent: "#C8102E" },
      { href: "/this-month", label: "This Month", icon: Calendar, accent: "#F59E0B" },
      { href: "/amplify", label: "Amplify", icon: Share2, accent: "#0891b2" },
      { href: "/events", label: "Events", icon: Ticket, accent: "#059669" },
    ],
  },
  {
    key: "field",
    label: "Campaign & Field",
    accent: "#C8102E",
    items: [
      { href: "/plan-map", label: "Plan & Map", icon: Map },
      { href: "/captains", label: "Captain Coverage", icon: Target },
      { href: "/canvass-tools", label: "Canvass Tools", icon: Vote },
      { href: "/follow-ups", label: "Follow-Ups", icon: Repeat },
      { href: "/candidates", label: "2026 Candidates", icon: ClipboardList },
      { href: "/voter-registration", label: "Voter Registration", icon: IdCard },
      { href: "/early-voting", label: "Early Voting", icon: Clock },
    ],
  },
  {
    key: "people",
    label: "People",
    accent: "#7c3aed",
    items: [
      { href: "/people", label: "Directory", icon: Users },
      { href: "/committees", label: "Committees", icon: Building2 },
      { href: "/volunteers", label: "Volunteers", icon: HeartHandshake },
      { href: "/coalitions", label: "Coalitions", icon: HandHeart },
      { href: "/partners", label: "Partners", icon: Handshake },
    ],
  },
  {
    key: "governance",
    label: "Governance",
    accent: "#0891b2",
    items: [
      { href: "/governance", label: "Governance Reference", icon: Gavel },
      { href: "/compliance-chat", label: "Compliance Q&A", icon: Scale, accent: "#b45309" },
      { href: "/endorsement", label: "Endorsement Process", icon: Scale },
      { href: "/comms", label: "Communications", icon: Megaphone },
      { href: "/transitions", label: "Transitions", icon: ArrowLeftRight, accent: "#64748b" },
    ],
  },
  {
    key: "resources",
    label: "Resources",
    accent: "#b45309",
    items: [
      { href: "/overview", label: "What this portal does", icon: BookOpen },
      { href: "/glossary", label: "Glossary", icon: BookOpen },
      { href: "/drive", label: "Drive", icon: FolderOpen },
      { href: "/tour/1", label: "Welcome Tour", icon: Compass },
      { href: "/help", label: "Help & FAQ", icon: HelpCircle },
    ],
  },
];

// Flat list of all nav items — useful for breadcrumb lookups.
export const NAV_ITEMS_FLAT: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

// Resolve the accent color for a given pathname — used by destination
// pages and dashboard widget tiles that link to a section.
export function accentForPath(pathname: string): string {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (item.href === pathname) return item.accent ?? group.accent;
      if (item.href !== "/dashboard" && pathname.startsWith(item.href)) {
        return item.accent ?? group.accent;
      }
    }
  }
  return "#0E4C9E"; // fallback navy
}

// Pretty title overrides for breadcrumbs that aren't a simple path segment.
// e.g., /my-ld/41 → "LD41" instead of "41"
export function labelForPath(pathname: string): string {
  const exact = NAV_ITEMS_FLAT.find((i) => i.href === pathname);
  if (exact) return exact.label;
  if (pathname.startsWith("/my-ld/")) {
    const n = pathname.split("/")[2];
    return n ? `LD${n}` : "My LD";
  }
  if (pathname.startsWith("/committees/")) {
    const code = pathname.split("/")[2];
    if (code) return code.replace(/_/g, " ");
  }
  if (pathname.startsWith("/people/")) return "Member";
  if (pathname.startsWith("/volunteers/")) {
    const seg = pathname.split("/")[2];
    if (seg === "new") return "Add Volunteer";
    if (seg === "signup") return "Volunteer Signup";
    return "Volunteer";
  }
  if (pathname.startsWith("/precincts/")) {
    const code = pathname.split("/")[2];
    return code ? `Precinct ${code.toUpperCase()}` : "Precinct";
  }
  if (pathname.startsWith("/tour/")) return "Welcome Tour";
  if (pathname.startsWith("/vacancies/")) return "Legislative Vacancies";
  if (pathname === "/") return "Home";
  // Fallback: last segment, title-cased
  const seg = pathname.split("/").filter(Boolean).pop() ?? "";
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
