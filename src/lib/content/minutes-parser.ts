// Tolerant parser for meeting-minutes content_md. The NOTES posts in
// workspace_posts hold the raw markdown; this pulls out the sections a
// briefing actually wants (decisions, action items, attendance) without
// assuming a strict template. If the minutes don't follow the shape,
// the parser returns empty arrays and the UI falls back to "see the
// full post" — never throws.

export type ParsedMinutes = {
  decisions: string[];
  action_items: string[];
  attendees: string[];
  // Anything we couldn't classify. UI shows it as a "more in the
  // minutes…" preview.
  other: string[];
  // Did we find any structured sections at all? When false, content_md
  // is probably free text — render it as a single preview block.
  has_structure: boolean;
};

// Heading patterns we recognize. Loose on purpose — chairs write
// minutes in lots of styles ("Decisions", "Decisions Made", "Votes",
// "Action Items", "Follow-ups").
const SECTION_PATTERNS: Array<{
  kind: keyof Omit<ParsedMinutes, "has_structure">;
  patterns: RegExp[];
}> = [
  {
    kind: "decisions",
    patterns: [/^decisions?\b/i, /^votes?\b/i, /^motions?\b/i, /^approved\b/i, /^resolved\b/i],
  },
  {
    kind: "action_items",
    patterns: [
      /^action items?\b/i,
      /^action[- ]items?\b/i,
      /^to[- ]?dos?\b/i,
      /^todo\b/i,
      /^follow[- ]?ups?\b/i,
      /^next steps?\b/i,
      /^tasks?\b/i,
    ],
  },
  {
    kind: "attendees",
    patterns: [/^attend(ees|ance|ing)?\b/i, /^present\b/i, /^in attendance\b/i, /^roll call\b/i],
  },
];

function classifyHeading(text: string): keyof Omit<ParsedMinutes, "has_structure"> | "other" {
  const trimmed = text.trim().replace(/[:\-—]+\s*$/, "");
  for (const section of SECTION_PATTERNS) {
    if (section.patterns.some((p) => p.test(trimmed))) {
      return section.kind;
    }
  }
  return "other";
}

// Strip leading bullets (-, *, +, 1., etc.) so a parsed item is the
// plain text the chair wrote, not "- The motion passed."
function stripBullet(line: string): string {
  return line
    .replace(/^\s*[-*+]\s+/, "")
    .replace(/^\s*\d+[.)]\s+/, "")
    .trim();
}

export function parseMinutes(content_md: string | null): ParsedMinutes {
  const empty: ParsedMinutes = {
    decisions: [],
    action_items: [],
    attendees: [],
    other: [],
    has_structure: false,
  };
  if (!content_md || !content_md.trim()) return empty;

  const lines = content_md.split(/\r?\n/);
  let current: keyof Omit<ParsedMinutes, "has_structure"> | "other" | null = null;
  let sawHeading = false;
  const buckets = {
    decisions: [] as string[],
    action_items: [] as string[],
    attendees: [] as string[],
    other: [] as string[],
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // Heading detection: markdown `##` / `###`, or a line that ends
    // with a colon and is short ("Decisions:" "Action items:").
    const mdHeading = line.match(/^#{1,4}\s+(.+)$/);
    const colonHeading = line.match(/^([A-Za-z][A-Za-z \-]{0,40}):\s*$/);
    if (mdHeading) {
      const kind = classifyHeading(mdHeading[1]);
      current = kind;
      sawHeading = true;
      continue;
    }
    if (colonHeading) {
      const kind = classifyHeading(colonHeading[1]);
      // Only treat as a heading if it matched a known section. Random
      // "Time:" lines aren't headings.
      if (kind !== "other") {
        current = kind;
        sawHeading = true;
        continue;
      }
    }

    // Non-heading line — bucket it under the current section.
    const cleaned = stripBullet(line);
    if (!cleaned) continue;

    if (current === null) {
      // Content before any heading — park in "other" so it's not lost.
      buckets.other.push(cleaned);
    } else {
      buckets[current].push(cleaned);
    }
  }

  return {
    decisions: buckets.decisions,
    action_items: buckets.action_items,
    attendees: buckets.attendees,
    other: buckets.other,
    has_structure: sawHeading,
  };
}

// Aggregate across many parsed records. Used by the YIR rollup.
export function aggregateMinutes(parsed: ParsedMinutes[]): {
  total_decisions: number;
  total_action_items: number;
  total_attendees_recorded: number;
} {
  let d = 0;
  let a = 0;
  let p = 0;
  for (const m of parsed) {
    d += m.decisions.length;
    a += m.action_items.length;
    p += m.attendees.length;
  }
  return {
    total_decisions: d,
    total_action_items: a,
    total_attendees_recorded: p,
  };
}
