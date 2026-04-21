import type { LucideIcon } from "lucide-react";
import { Calendar, Users, FolderOpen, Map, Home, Vote, Building2, Ticket, Handshake, ClipboardList, Megaphone, Scale, Clock, ArrowLeftRight } from "lucide-react";

export type SectionNavItem = {
  slug: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const SECTION_NAV: SectionNavItem[] = [
  {
    slug: "plan-map",
    label: "Plan & Map",
    href: "/plan-map",
    icon: Map,
    description: "Strategy map, the 2026 plan, precinct targeting countywide.",
  },
  {
    slug: "my-ld",
    label: "My LD",
    href: "/my-ld",
    icon: Home,
    description: "Your district: precincts, leadership, races on the ballot.",
  },
  {
    slug: "this-month",
    label: "This Month",
    href: "/this-month",
    icon: Calendar,
    description: "What's happening right now — canvasses, events, calls.",
  },
  {
    slug: "canvass-tools",
    label: "Canvass Tools",
    href: "/canvass-tools",
    icon: Vote,
    description: "VoteBuilder, priority districts, volunteer pipeline, guides.",
  },
  {
    slug: "candidates",
    label: "2026 Candidates",
    href: "/candidates",
    icon: ClipboardList,
    description: "Who's on the primary ballot — State House, State Senate, Metro Council. LDP endorsements flagged.",
  },
  {
    slug: "early-voting",
    label: "Early Voting",
    href: "/early-voting",
    icon: Clock,
    description: "24 Jefferson County early voting locations for the May 19 primary. Countywide — any voter can use any site.",
  },
  {
    slug: "people",
    label: "People",
    href: "/people",
    icon: Users,
    description: "LDPEC directory: officers, LD Chairs, committee chairs, at-large members.",
  },
  {
    slug: "committees",
    label: "Committees",
    href: "/committees",
    icon: Building2,
    description: "All 11 committees: responsibilities, workflow, members, Drive folders.",
  },
  {
    slug: "endorsement",
    label: "Endorsement Process",
    href: "/endorsement",
    icon: Scale,
    description: "How the LDP endorses — 60% threshold, secret ballot, Jan-Feb timeline per cycle.",
  },
  {
    slug: "comms",
    label: "Communications",
    href: "/comms",
    icon: Megaphone,
    description: "How the party gets heard — social, email, ads, printed, photography. Beth's scope.",
  },
  {
    slug: "events",
    label: "Events",
    href: "/events",
    icon: Ticket,
    description: "Signature events + your $500 annual raise via ticket-sale links.",
  },
  {
    slug: "transitions",
    label: "Transitions",
    href: "/transitions",
    icon: ArrowLeftRight,
    description: "Seats vacated since the June 2025 reorg + who filled them. CEC has 90 days to fill LD vacancies.",
  },
  {
    slug: "partners",
    label: "Partners",
    href: "/partners",
    icon: Handshake,
    description: "Louisville-area labor, advocacy, and training orgs we work with.",
  },
  {
    slug: "drive",
    label: "Drive",
    href: "/drive",
    icon: FolderOpen,
    description: "Shortcuts to the party's Google Drive working docs.",
  },
];
