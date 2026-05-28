import type { LucideIcon } from "lucide-react";
import { Calendar, Users, FolderOpen, Map, Home, Vote, Building2, Ticket, Handshake, ClipboardList, Megaphone, Scale, Clock, ArrowLeftRight, CheckSquare, FileText } from "lucide-react";

export type SectionNavItem = {
  slug: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  accent: string; // hex color — used for the card's top-stripe + icon tint
};

export const SECTION_NAV: SectionNavItem[] = [
  { slug: "plan-map", label: "Plan & Map", href: "/plan-map", icon: Map,
    description: "Strategy map, the 2026 plan, precinct targeting countywide.",
    accent: "#0E4C9E" },
  { slug: "general-plan", label: "General Plan", href: "/general-plan", icon: FileText,
    description: "The 2026 General Strategic Plan — Phase 2 of the cycle. Priority races, strategy zones, what every LD chair runs from June through November.",
    accent: "#C8102E" },
  { slug: "my-ld", label: "My LD", href: "/my-ld", icon: Home,
    description: "Your district: precincts, leadership, races on the ballot.",
    accent: "#C8102E" },
  { slug: "this-month", label: "This Month", href: "/this-month", icon: Calendar,
    description: "What's happening right now — canvasses, events, calls.",
    accent: "#F59E0B" },
  { slug: "canvass-tools", label: "Canvass Tools", href: "/canvass-tools", icon: Vote,
    description: "VoteBuilder, priority districts, volunteer pipeline, guides.",
    accent: "#059669" },
  { slug: "ballot", label: "November Ballot", href: "/ballot", icon: CheckSquare,
    description: "What you'll actually choose on November 3 — finalists only, no primary noise. Picks up your LD automatically.",
    accent: "#c89a3b" },
  { slug: "candidates", label: "Primary Results", href: "/candidates", icon: ClipboardList,
    description: "Full 2026 primary results — vote totals, who advanced, who was eliminated, endorsements.",
    accent: "#0A3772" },
  { slug: "early-voting", label: "Early Voting", href: "/early-voting", icon: Clock,
    description: "24 Jefferson County early-voting locations. Same sites for the November 3 general — confirm hours closer to Oct 29.",
    accent: "#C8102E" },
  { slug: "people", label: "People", href: "/people", icon: Users,
    description: "LDPEC directory: officers, LD Chairs, committee chairs, at-large members.",
    accent: "#7c3aed" },
  { slug: "committees", label: "Committees", href: "/committees", icon: Building2,
    description: "All 11 committees: responsibilities, workflow, members, Drive folders.",
    accent: "#0891b2" },
  { slug: "endorsement", label: "Endorsement Process", href: "/endorsement", icon: Scale,
    description: "How the LDP endorses — 60% threshold, secret ballot, Jan-Feb timeline per cycle.",
    accent: "#b45309" },
  { slug: "compliance-chat", label: "Compliance Q&A", href: "/compliance-chat", icon: Scale,
    description: "Ask campaign-finance OR bylaws questions. Citation-first answers from KRS 121, 32 KAR, FECA/BCRA, Canon 4, DNC Charter, KDP, LJCDP, Robert's Rules. Reference tool — not legal advice.",
    accent: "#b45309" },
  { slug: "comms", label: "Communications", href: "/comms", icon: Megaphone,
    description: "How the party gets heard — social, email, ads, printed, photography.",
    accent: "#0E4C9E" },
  { slug: "events", label: "Events", href: "/events", icon: Ticket,
    description: "Signature events + your $500 annual raise via ticket-sale links.",
    accent: "#db2777" },
  { slug: "transitions", label: "Transitions", href: "/transitions", icon: ArrowLeftRight,
    description: "Seats vacated since the June 2025 reorg + who filled them. CEC has 90 days to fill LD vacancies.",
    accent: "#64748b" },
  { slug: "partners", label: "Partners", href: "/partners", icon: Handshake,
    description: "Louisville-area labor, advocacy, and training orgs we work with.",
    accent: "#059669" },
  { slug: "drive", label: "Drive", href: "/drive", icon: FolderOpen,
    description: "Shortcuts to the party's Google Drive working docs.",
    accent: "#0A3772" },
];
