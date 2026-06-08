"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  CheckSquare,
  Compass,
  FolderOpen,
  HeartHandshake,
  Home,
  Map as MapIcon,
  ScrollText,
  Share2,
  Sparkles,
  Ticket,
  Users,
  Vote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";
import type { RoleKey } from "@/content/highest-leverage-rules";

type Tile = { href: string; label: string; icon: LucideIcon; color: string };

// Tile bundles per role. Each role gets exactly 6 — keeps the grid
// consistent (2 / 3 / 6 columns) so the dashboard doesn't reflow when
// the user switches lenses.

const TILES_OFFICER: Tile[] = [
  { href: "/leadership-transition", label: "Your briefing", icon: Sparkles, color: "var(--color-ldp-navy-800)" },
  { href: "/official-records", label: "Official Records", icon: ScrollText, color: "#0E4C9E" },
  { href: "/transitions", label: "Transitions", icon: ArrowLeftRight, color: "#64748b" },
  { href: "/committees", label: "Committees", icon: Building2, color: "#0891b2" },
  { href: "/events", label: "Events", icon: Ticket, color: "#db2777" },
  { href: "/people", label: "Roster", icon: Users, color: "#7c3aed" },
];

const TILES_LD_CHAIR: Tile[] = [
  { href: "/my-ld", label: "My LD", icon: Home, color: "var(--color-ldp-red)" },
  { href: "/canvass-tools", label: "Canvass Tools", icon: Vote, color: "#059669" },
  { href: "/ballot", label: "November Ballot", icon: CheckSquare, color: "#c89a3b" },
  { href: "/events", label: "Events", icon: Ticket, color: "#db2777" },
  { href: "/volunteers", label: "Volunteers", icon: HeartHandshake, color: "#059669" },
  { href: "/amplify", label: "Amplify", icon: Share2, color: "#0891b2" },
];

const TILES_LD_VC: Tile[] = [
  { href: "/my-ld", label: "My LD", icon: Home, color: "var(--color-ldp-red)" },
  { href: "/canvass-tools", label: "Canvass Tools", icon: Vote, color: "#059669" },
  { href: "/ballot", label: "November Ballot", icon: CheckSquare, color: "#c89a3b" },
  { href: "/events", label: "Events", icon: Ticket, color: "#db2777" },
  { href: "/volunteers", label: "Volunteers", icon: HeartHandshake, color: "#059669" },
  { href: "/plan-map", label: "Plan & Map", icon: MapIcon, color: "#0E4C9E" },
];

const TILES_AT_LARGE: Tile[] = [
  { href: "/plan-map", label: "Plan & Map", icon: MapIcon, color: "#0E4C9E" },
  { href: "/committees", label: "Committees", icon: Building2, color: "#0891b2" },
  { href: "/people", label: "Roster", icon: Users, color: "#7c3aed" },
  { href: "/events", label: "Events", icon: Ticket, color: "#db2777" },
  { href: "/volunteers", label: "Volunteers", icon: HeartHandshake, color: "#059669" },
  { href: "/amplify", label: "Amplify", icon: Share2, color: "#0891b2" },
];

const TILES_COMMITTEE: Tile[] = [
  { href: "/committees", label: "Committees", icon: Building2, color: "#0891b2" },
  { href: "/official-records", label: "Official Records", icon: ScrollText, color: "#0E4C9E" },
  { href: "/events", label: "Events", icon: Ticket, color: "#db2777" },
  { href: "/volunteers", label: "Volunteers", icon: HeartHandshake, color: "#059669" },
  { href: "/people", label: "Roster", icon: Users, color: "#7c3aed" },
  { href: "/drive", label: "Drive", icon: FolderOpen, color: "#0A3772" },
];

const TILES_PRECINCT_CAPTAIN: Tile[] = [
  { href: "/my-ld", label: "My LD", icon: Home, color: "var(--color-ldp-red)" },
  { href: "/canvass-tools", label: "Canvass Tools", icon: Vote, color: "#059669" },
  { href: "/volunteers", label: "Volunteers", icon: HeartHandshake, color: "#059669" },
  { href: "/ballot", label: "November Ballot", icon: CheckSquare, color: "#c89a3b" },
  { href: "/events", label: "Events", icon: Ticket, color: "#db2777" },
  { href: "/amplify", label: "Amplify", icon: Share2, color: "#0891b2" },
];

// Fallback tile set — what the dashboard rendered before role-awareness
// landed. Used pre-hydration and when the user hasn't set a role yet,
// so first-time visitors see something useful.
const TILES_DEFAULT: Tile[] = [
  { href: "/my-ld", label: "My LD", icon: Home, color: "var(--color-ldp-red)" },
  { href: "/targeting", label: "Targeting", icon: Compass, color: "#0E4C9E" },
  { href: "/ballot", label: "November Ballot", icon: CheckSquare, color: "#c89a3b" },
  { href: "/events", label: "Events", icon: Ticket, color: "#059669" },
  { href: "/volunteers", label: "Volunteers", icon: HeartHandshake, color: "#059669" },
  { href: "/amplify", label: "Amplify", icon: Share2, color: "#0891b2" },
];

// Single source of truth: maps each role to its tile bundle + a short
// dashboard subtitle that anchors the lens.
const ROLE_BUNDLE: Record<
  RoleKey,
  { tiles: Tile[]; subtitle: string }
> = {
  OFFICER: { tiles: TILES_OFFICER, subtitle: "Officer view · countywide operations" },
  OFFICER_CHAIR: { tiles: TILES_OFFICER, subtitle: "LDP Chair · countywide operations" },
  OFFICER_VC: { tiles: TILES_OFFICER, subtitle: "LDP Vice Chair · countywide operations" },
  OFFICER_SECRETARY: { tiles: TILES_OFFICER, subtitle: "LDP Secretary · records + roster" },
  OFFICER_TREASURER: { tiles: TILES_OFFICER, subtitle: "LDP Treasurer · finance + records" },
  LD_CHAIR: { tiles: TILES_LD_CHAIR, subtitle: "LD Chair · your district, this week" },
  LD_VC: { tiles: TILES_LD_VC, subtitle: "LD Vice Chair · ready to step in" },
  AT_LARGE: { tiles: TILES_AT_LARGE, subtitle: "At-Large · cross-LD priorities" },
  LYD_PRES: { tiles: TILES_AT_LARGE, subtitle: "LYD President" },
  WOMENS_CLUB_PRES: { tiles: TILES_AT_LARGE, subtitle: "JCDWC President" },
  PRECINCT_CAPTAIN: { tiles: TILES_PRECINCT_CAPTAIN, subtitle: "Precinct Captain · your turf" },
  COMMITTEE_CHAIR_ONLY: { tiles: TILES_COMMITTEE, subtitle: "Committee Chair · your committee" },
};

export function JumpToTiles() {
  const { profile, hydrated } = useUserProfile();

  // Pre-hydration: render the default set so SSR + client first paint
  // match. Avoids a flash of officer-tiles → default-tiles when the
  // user has no role saved.
  const bundle = hydrated && profile.role ? ROLE_BUNDLE[profile.role] : null;
  const tiles = bundle?.tiles ?? TILES_DEFAULT;
  const subtitle = bundle?.subtitle;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ldp-navy-800)]">
            Jump to
          </h2>
          {subtitle && (
            <p className="text-[11px] text-[var(--color-ldp-ink-700)]">{subtitle}</p>
          )}
        </div>
        <Link
          href="/overview"
          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-ldp-navy-700)] hover:underline"
        >
          Full surface list <ArrowRight aria-hidden="true" className="size-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {tiles.map((t) => (
          <JumpTile key={t.href} {...t} />
        ))}
      </div>
    </section>
  );
}

function JumpTile({ href, label, icon: Icon, color }: Tile) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-2 rounded-xl border bg-white p-4 transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-sm"
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <span
        className="flex size-10 items-center justify-center rounded-lg text-white"
        style={{ backgroundColor: color }}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <span className="text-xs font-semibold text-[var(--color-ldp-navy-900)] group-hover:text-[var(--color-ldp-navy-800)]">
        {label}
      </span>
    </Link>
  );
}

