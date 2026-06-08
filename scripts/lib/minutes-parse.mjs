// Pure parser for LDPEC plenary minutes (Brook Benningfield format).
// Input: raw text extracted from a .docx via textutil.
// Output: structured shape with full text preserved + named section
// blocks + attendance + raw motion captures.
//
// Verbatim philosophy: full_text is the canonical record. Sections,
// motions, and attendance are derived ANNOTATIONS layered on top.
// Parse failures degrade gracefully — full_text is always preserved.
//
// Format notes from observed Brook docs:
//   - Header: "Month YYYY Executive Meeting Minutes"
//   - Called-to-order line: "<Chair> called to order ... on M/D/YY."
//   - Attendance: two formats:
//       (a) Table: rows of [district-code, name, A|P|blank]
//       (b) Lists: "Present: ...", "Proxy: ...", "Absent: ..."
//   - Section anchors are line-leading text matching the SECTIONS map
//   - Motion blocks: "Motion: NAME / Seconded: NAME / Motion passed"
//   - Treasurer report link: "https://drive.google.com/file/d/..."
//   - Agenda link: "https://docs.google.com/document/d/..."

// Canonical section anchors → output key. Order matters: earlier
// entries match before later ones (e.g. "Communications" before
// "Communication" — Brook uses both spellings across months).
const SECTION_ANCHORS = [
  ["Secretary Report", "secretary_report"],
  ["Chair Report", "chair_report"],
  ["Vice Chair Report", "vice_chair_report"],
  ["Treasurer Report", "treasurer_report"],
  ["Committee Reports", "committee_reports_header"],
  ["Bylaws:", "bylaws"],
  ["Bylaws", "bylaws"],
  ["Candidate Recruitment:", "candidate_recruitment"],
  ["Candidate Recruitment", "candidate_recruitment"],
  ["Communications:", "communications"],
  ["Communication:", "communications"],
  ["Communications", "communications"],
  ["Communication", "communications"],
  ["Events:", "events"],
  ["Events", "events"],
  ["Facilities:", "facilities"],
  ["Facilities", "facilities"],
  ["Finance:", "finance"],
  ["Finance", "finance"],
  ["Platform:", "platform"],
  ["Platform", "platform"],
  ["Rebranding:", "rebranding"],
  ["Branding:", "rebranding"],
  ["Rebranding", "rebranding"],
  ["Branding", "rebranding"],
  ["Training:", "training"],
  ["Training", "training"],
  ["Volunteer:", "volunteers"],
  ["Volunteers:", "volunteers"],
  ["Volunteer", "volunteers"],
  ["Volunteers", "volunteers"],
  ["Endorsement Process:", "endorsement_process"],
  ["Endorsement Process", "endorsement_process"],
  ["Open issues", "open_issues"],
  ["Open Issues", "open_issues"],
  ["New business", "new_business"],
  ["New Business", "new_business"],
  ["Announcements", "announcements"],
];

const MONTHS = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

// Match a leading section anchor on a line. Returns
//   { key, inline_content } when matched (inline_content is whatever
//   comes after the anchor on the same line — Brook often writes
//   "Volunteers: Meeting every 1st Thursday of the month" inline),
//   or null.
function matchAnchor(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  // Sort by length descending so "Vice Chair Report" beats "Chair Report".
  const sorted = [...SECTION_ANCHORS].sort((a, b) => b[0].length - a[0].length);
  for (const [anchor, key] of sorted) {
    // Anchor matches when the line IS the anchor, or the line starts
    // with the anchor followed by ":" / whitespace.
    if (trimmed === anchor) return { key, inline_content: "" };
    if (trimmed === anchor.replace(/:$/, "")) return { key, inline_content: "" };
    if (trimmed.startsWith(anchor)) {
      const after = trimmed.slice(anchor.length);
      if (after === "" || after.startsWith(":") || /^\s/.test(after)) {
        const inline = after.replace(/^[:\s]+/, "").trim();
        return { key, inline_content: inline };
      }
    }
  }
  return null;
}

// Pull the meeting date from the header / called-to-order line.
// Looks for "on M/D/YY" or "on M/D/YYYY". Falls back to month-year
// parsed from the title line if needed.
function extractMeetingDate(text) {
  const onDate = text.match(/on\s+(\d{1,2})\/(\d{1,2})\/(\d{2,4})/i);
  if (onDate) {
    let [, m, d, y] = onDate;
    if (y.length === 2) y = "20" + y;
    return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  // Fallback: month-year in the title line.
  const titleMonth = text.match(
    /^\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/im
  );
  if (titleMonth) {
    const month = MONTHS[titleMonth[1].toLowerCase()];
    return `${titleMonth[2]}-${String(month).padStart(2, "0")}-01`;
  }
  return null;
}

// Attendance — list format. "Present: A, B, C / Proxy: D / Absent: E"
function parseAttendanceLists(text) {
  function listOf(label) {
    const re = new RegExp(`(?:^|\\n)${label}:\\s*([^\\n]*(?:\\n(?!\\s*(?:Present|Proxy|Absent|Agenda|Secretary|Chair|Vice|Treasurer|Committee|Bylaws|Communication|Events|Facilities|Finance|Platform|Rebranding|Branding|Training|Volunteer|New|Open|Announcements)).*)*)`, "i");
    const m = text.match(re);
    if (!m) return [];
    return m[1]
      .replace(/\n/g, " ")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return {
    present: listOf("Present"),
    proxy: listOf("Proxy"),
    absent: listOf("Absent"),
  };
}

// Attendance — table format used in May 2026. Rows look like:
//   28C
//   Almaria Baker
//   A
// where col1 = "{LD}{C|V}" (or "At Large"), col2 = name, col3 = A|P|<blank>.
// We walk the lines linearly and group every 3 non-empty lines that match.
function parseAttendanceTable(text) {
  const lines = text.split("\n").map((l) => l.trim());
  const present = [];
  const proxy = [];
  const absent = [];

  // The table region runs from the start of attendance to "Secretary Report".
  let inTable = false;
  let tableEnd = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^Secretary Report\b/i.test(lines[i])) { tableEnd = i; break; }
  }
  // Find a table start: a line matching "28C" / "29V" / "At Large".
  let tableStart = 0;
  for (let i = 0; i < tableEnd; i++) {
    if (/^(At Large|\d{2}[CV]?)$/i.test(lines[i])) {
      tableStart = i;
      inTable = true;
      break;
    }
  }
  if (!inTable) return null;

  // Walk in 3-line chunks; the 3rd line is the attendance flag, sometimes
  // blank ("present" default). The "At Large" row only spans 2 lines.
  let i = tableStart;
  while (i < tableEnd) {
    const codeLine = lines[i];
    const nameLine = lines[i + 1] ?? "";
    const flagLine = lines[i + 2] ?? "";

    if (codeLine === "At Large" || /^At Large/i.test(codeLine)) {
      // skip the header row
      i += 1;
      continue;
    }
    if (!/^(\d{2}[CV]?)$/i.test(codeLine)) { i += 1; continue; }

    // Heuristic: if flagLine is "A" → absent, "P" → proxy/present-with-proxy,
    // blank or non-flag → present.
    const name = nameLine.replace(/\s+/g, " ").trim();
    if (!name || /^\d{2}[CV]?$/i.test(name) || /^At Large/i.test(name)) {
      i += 1;
      continue;
    }
    if (/^A$/i.test(flagLine)) {
      absent.push(name);
      i += 3;
    } else if (/^P$/i.test(flagLine)) {
      proxy.push(name);
      i += 3;
    } else {
      // Blank flag — treat as present, but advance only 2 lines because
      // the flag line is actually the next code or the next name.
      present.push(name);
      i += /^(\d{2}[CV]?|At Large)$/i.test(flagLine) ? 2 : 3;
    }
  }

  // Heuristic completeness check — if we got nothing, the format isn't
  // table-style. Caller should fall back to list parsing.
  if (present.length + proxy.length + absent.length === 0) return null;
  return { present, proxy, absent };
}

function parseAttendance(text) {
  const table = parseAttendanceTable(text);
  if (table && table.absent.length + table.proxy.length + table.present.length > 0) {
    return table;
  }
  return parseAttendanceLists(text);
}

// Extract every Motion / Seconded / Motion passed block. Returns
// raw captures; LLM normalizes attribution later.
//
// Handles all observed motion-line variants:
//   - "Motion: NAME"
//   - "Motion to accept: NAME"
//   - "Motion to adopt: NAME"
//   - "Motion to adjourn: NAME"
//   - "Motion on the floor is ... Motion: NAME"
// And both layouts:
//   - Multi-line (Motion on one line, Seconded on the next)
//   - Single-line ("Motion to accept: NAME   Seconded: NAME")
//
// "Motion passed" / "MOTION PASSED" within the next 6 lines marks
// passed=true. Empty Motion: / Seconded: lines (template scaffolding
// Brook leaves in place for committees that didn't motion) are
// dropped — only blocks with at least one named mover are kept.

const MOTION_HEAD_RE = /^\s*Motion(?:\s+to\s+(?:accept|adopt|adjourn|approve))?:\s*([^\n]+?)\s*$/i;
const MOTION_HEAD_INLINE_RE = /^\s*Motion(?:\s+to\s+(?:accept|adopt|adjourn|approve))?:\s*([^\n]+?)\s{2,}Seconded:\s*(.+?)\s*$/i;

function parseMotions(text, sectionByLineIndex) {
  const lines = text.split("\n");
  const motions = [];
  for (let i = 0; i < lines.length; i++) {
    // Single-line variant first — its match consumes both names.
    const inline = lines[i].match(MOTION_HEAD_INLINE_RE);
    if (inline) {
      const motion_by = inline[1].trim();
      const seconded_by = inline[2].trim();
      if (!motion_by) continue;
      let passed = null;
      for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
        if (/motion\s+passed/i.test(lines[j])) passed = true;
      }
      motions.push({
        motion_by,
        seconded_by,
        passed,
        section: sectionByLineIndex.get(i) ?? "unknown",
      });
      continue;
    }

    const motionLine = lines[i].match(MOTION_HEAD_RE);
    if (!motionLine) continue;
    const motion_by = motionLine[1].trim();
    // Drop template-scaffolding empty Motion: / Seconded: pairs that
    // sit under committees that didn't motion.
    if (!motion_by) continue;
    let seconded_by = null;
    let passed = null;
    for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
      const s = lines[j].match(/^\s*Seconded:\s*(.+?)\s*$/i);
      if (s && s[1].trim()) seconded_by = s[1].trim();
      if (/motion\s+passed/i.test(lines[j])) passed = true;
    }
    motions.push({
      motion_by,
      seconded_by,
      passed,
      section: sectionByLineIndex.get(i) ?? "unknown",
    });
  }
  return motions;
}

// Extract URL of treasurer report (the one in the "Treasurer Report" block).
function extractTreasurerLink(sections) {
  const tr = sections.treasurer_report ?? "";
  const m = tr.match(/https?:\/\/[^\s)]+/);
  return m ? m[0] : null;
}

function extractAgendaLink(text) {
  const m = text.match(/Agenda link:\s*(https?:\/\/[^\s)]+)/i);
  return m ? m[1] : null;
}

// Main entry. Returns the structured shape described at top of file.
export function parseMinutes({ filename, text }) {
  const meeting_date = extractMeetingDate(text);

  const lines = text.split("\n");
  const sectionsRaw = {};
  const sectionByLineIndex = new Map();
  let current = null;
  let buf = [];
  for (let i = 0; i < lines.length; i++) {
    const anchor = matchAnchor(lines[i]);
    if (anchor) {
      if (current) {
        sectionsRaw[current] = (sectionsRaw[current] ?? "") + buf.join("\n").trim() + "\n";
      }
      current = anchor.key === "committee_reports_header" ? null : anchor.key;
      buf = [];
      // Preserve inline content from the anchor line itself ("Volunteers:
      // Meeting every 1st Thursday of the month"). The motion-section
      // index also needs to know this line belongs to the new section
      // for proper attribution.
      if (current && anchor.inline_content) {
        buf.push(anchor.inline_content);
        sectionByLineIndex.set(i, current);
      }
      continue;
    }
    if (current) {
      buf.push(lines[i]);
      sectionByLineIndex.set(i, current);
    }
  }
  if (current) {
    sectionsRaw[current] = (sectionsRaw[current] ?? "") + buf.join("\n").trim();
  }

  // Trim trailing whitespace on every section.
  const sections = {};
  for (const [k, v] of Object.entries(sectionsRaw)) {
    sections[k] = v.trim();
  }

  const attendance = parseAttendance(text);
  const motions = parseMotions(text, sectionByLineIndex);
  const treasurer_report_link = extractTreasurerLink(sections);
  const agenda_link = extractAgendaLink(text);

  return {
    source_filename: filename,
    full_text: text,
    meeting_date,
    meeting_type: "LDPEC",
    sections,
    attendance,
    raw_motions: motions,
    treasurer_report_link,
    agenda_link,
  };
}
