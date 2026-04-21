// Tour step definitions. Content placeholders for Phase 1; full content in Phase 2.
// Source of truth: docs/tour-specification.md.

export type TourStep = {
  num: 1 | 2 | 3 | 4 | 5 | 6;
  slug: string;
  title: string;
  subtitle: string;
  nextLabel: string;
  status: "ready" | "placeholder";
};

export const TOUR_STEPS: TourStep[] = [
  {
    num: 1,
    slug: "orientation",
    title: "What is the LDPEC",
    subtitle: "Why we're here and how this fits.",
    nextLabel: "Next: let's talk about YOUR role",
    status: "placeholder",
  },
  {
    num: 2,
    slug: "your-role",
    title: "Your Role",
    subtitle: "What you're specifically supposed to do.",
    nextLabel: "Next: let's look at YOUR district",
    status: "placeholder",
  },
  {
    num: 3,
    slug: "your-district",
    title: "Your District",
    subtitle: "Your LD, your precincts, your races this cycle.",
    nextLabel: "Next: how we meet",
    status: "placeholder",
  },
  {
    num: 4,
    slug: "how-we-meet",
    title: "How We Meet",
    subtitle: "LDPEC meetings, proxies, voting, Robert's Rules basics.",
    nextLabel: "Next: what's happening right now",
    status: "placeholder",
  },
  {
    num: 5,
    slug: "current-work",
    title: "Current Work & Plug-In Points",
    subtitle: "What's live, what's next, where to plug in.",
    nextLabel: "Last step: the long horizon",
    status: "placeholder",
  },
  {
    num: 6,
    slug: "reorg",
    title: "The 2028 Cycle & Reorg",
    subtitle: "Your long-horizon responsibility.",
    nextLabel: "You're ready. Here's your dashboard",
    status: "placeholder",
  },
];

export function getStep(num: number): TourStep | undefined {
  return TOUR_STEPS.find((s) => s.num === num);
}
