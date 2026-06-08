// Walks Lisa's Google Drive LDPEC folder, ingests all LDPEC plenary
// minutes + treasurer reports for the trailing year, and emits a
// single idempotent SQL file at
//   supabase/backfill_ldpec_minutes_2025_2026.sql
//
// What it creates per meeting:
//   - One workspace_post (post_type=NOTES, committee_code=NULL) with
//     the FULL plenary minutes as content_md, authored by the
//     Secretary, dated to the meeting.
//   - One workspace_post (post_type=NOTES, committee_code=NULL) with
//     the FULL treasurer report text, authored by the Treasurer.
//     link_url = the Drive PDF link from the minutes if present.
//   - N per-committee workspace_posts (one per committee that
//     reported), each storing just that committee's section as
//     content_md, attributed to the committee chair. These hydrate
//     committee workspaces retroactively.
//   - meeting_records UPDATE: links minutes_post_id +
//     treasurer_report_post_id + writes annotations JSONB.
//
// Idempotency: every generated post carries a tag
//   `ingest:ldpec-minutes:YYYY-MM-DD`
// The SQL guards every INSERT with NOT EXISTS on that tag, so the file
// is safe to re-apply.
//
// Usage:
//   ANTHROPIC_API_KEY=sk-... node scripts/ingest-minutes.mjs
//
// Flags (env vars):
//   INGEST_DRY_RUN=1     — parse + annotate + emit SQL but don't write
//   INGEST_NO_LLM=1      — skip LLM step; annotations come from parser only
//   INGEST_ONLY=2026-05  — only ingest meetings whose meeting_date starts with this prefix

import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

import { parseMinutes } from "./lib/minutes-parse.mjs";
import { extractPdfText } from "./lib/pdf-extract.mjs";
import { annotateMinutes } from "./lib/llm-annotate.mjs";

const execFileP = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const DRIVE_ROOT =
  "/Users/lisanorkus/Library/CloudStorage/GoogleDrive-lisatnorkus@gmail.com/My Drive/Political/LDPEC";

const OUT_PATH = resolve(repoRoot, "supabase/backfill_ldpec_minutes_2025_2026.sql");

const DRY_RUN = process.env.INGEST_DRY_RUN === "1";
const NO_LLM = process.env.INGEST_NO_LLM === "1";
const ONLY = process.env.INGEST_ONLY || null;

// Section key → committee code mapping. Sections not in this map are
// kept on the plenary post only (Chair Report, Treasurer Report, etc.).
const SECTION_TO_COMMITTEE = {
  bylaws: "BYLAWS",
  candidate_recruitment: "CANDIDATE_RECRUITMENT",
  communications: "COMMUNICATIONS",
  events: "EVENTS",
  facilities: "FACILITIES",
  finance: "FINANCE",
  platform: "PLATFORM",
  rebranding: "BRANDING",
  training: "TRAINING",
  volunteers: "VOLUNTEER",
  endorsement_process: "ENDORSEMENT_PROCESS",
};

const SECTION_LABEL = {
  bylaws: "Bylaws",
  candidate_recruitment: "Candidate Recruitment",
  communications: "Communications",
  events: "Events",
  facilities: "Facilities",
  finance: "Finance",
  platform: "Platform",
  rebranding: "Branding / Rebranding",
  training: "Training",
  volunteers: "Volunteer",
  endorsement_process: "Endorsement Process",
};

// ─── Drive discovery ───────────────────────────────────────────────────

// Walk a directory tree, returning every file path. Skips dotfiles
// and the noisy "(from Downloads N)" duplicates.
function walkDir(root) {
  const out = [];
  function visit(dir) {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); }
    catch { return; }
    for (const e of entries) {
      if (e.name.startsWith(".")) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) visit(p);
      else if (e.isFile()) out.push(p);
    }
  }
  visit(root);
  return out;
}

// Match minutes files. Brook's naming drifts month-to-month:
//   "May 2026 Executive Meeting Minutes.docx"
//   "April 2026 Executive Meeting Minutes.docx"
//   "Minutes January 2026.docx"
//   "Minutes February 2026.docx"
//   "Louisville Dems March 2025 Minutes.docx"
//   "WDJC Minutes - April 2025.pdf"    (likely LDPEC, see note)
//   "Septembner Minutes.pdf"           (typos happen)
// Strategy: any file whose name contains "Minutes" (case-insensitive)
// AND a month name, AND is .docx or .pdf — and isn't in Archives'
// "Meeting Minutes 2" duplicate folder, isn't an agenda, etc.
const MINUTES_NAME_RE = /\b(minutes)\b/i;
const AGENDA_NAME_RE = /\bagenda\b/i;
const TREASURER_PDF_RE = /LDP_treasurer_report_(\d{4})(\d{2})\.pdf$/i;
const DOWNLOADS_DUPE_RE = /\(from\s+Downloads/i;
const DRAFT_DUPE_RE = /\(\d+\)\.(docx|pdf)$/i;          // "X (1).docx"
const MEETING_MINUTES_DUPE_FOLDER_RE = /Meeting Minutes 2\//;

function isMinutesFile(path) {
  const name = path.split("/").pop() ?? "";
  if (!MINUTES_NAME_RE.test(name)) return false;
  if (AGENDA_NAME_RE.test(name)) return false;
  if (!/\.(docx|pdf)$/i.test(name)) return false;
  if (DOWNLOADS_DUPE_RE.test(name)) return false;
  if (DRAFT_DUPE_RE.test(name)) return false;
  if (MEETING_MINUTES_DUPE_FOLDER_RE.test(path)) return false;
  return true;
}

function isTreasurerPdf(path) {
  const name = path.split("/").pop() ?? "";
  return TREASURER_PDF_RE.test(name) && !DOWNLOADS_DUPE_RE.test(name);
}

// Extract YYYY-MM from filename. Used as a fallback when the parser
// can't pull a date out of the doc content. We pair this with the
// parser's date if both are present (parser wins).
const MONTHS_LOOKUP = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08", september: "09",
  septembner: "09", october: "10", november: "11", december: "12",
};
function inferYearMonthFromFilename(path) {
  const name = path.split("/").pop() ?? "";
  const monthMatch = name.match(/\b(january|february|march|april|may|june|july|august|september|septembner|october|november|december)\b/i);
  const yearMatch = name.match(/\b(20\d{2})\b/);
  if (!monthMatch || !yearMatch) return null;
  return `${yearMatch[1]}-${MONTHS_LOOKUP[monthMatch[1].toLowerCase()]}`;
}

// ─── Format conversion ────────────────────────────────────────────────

async function docxToText(docxPath) {
  const dir = mkdtempSync(join(tmpdir(), "ldpec-docx-"));
  const out = join(dir, "out.txt");
  await execFileP("textutil", ["-convert", "txt", docxPath, "-output", out]);
  return readFileSync(out, "utf8");
}

async function pdfToText(pdfPath) {
  const { text } = await extractPdfText(pdfPath);
  return text;
}

async function readMinutes(path) {
  if (path.toLowerCase().endsWith(".docx")) return await docxToText(path);
  if (path.toLowerCase().endsWith(".pdf")) return await pdfToText(path);
  throw new Error(`Unsupported minutes extension: ${path}`);
}

// Some files in the LDPEC Drive folder are NOT LDPEC minutes — most
// notably JCDWC (Jefferson County Democratic Women's Club) minutes,
// which get titled "WDJC Minutes - <month>.pdf" and dropped at the
// top of LDPEC by whoever shared them. We don't want to ingest those
// as LDPEC plenary records. Detect by:
//   1. Filename starts with "WDJC" (case-insensitive)
//   2. Content opens with "DEMOCRATIC WOMAN" or "WOMEN'S CLUB"
function isWrongOrgMinutes(filename, text) {
  if (/^WDJC\b/i.test(filename)) return true;
  const head = text.slice(0, 500).toUpperCase();
  if (head.includes("DEMOCRATIC WOMAN") || head.includes("WOMEN'S CLUB")) return true;
  return false;
}

// ─── SQL emission ─────────────────────────────────────────────────────

function sqlEscape(s) {
  if (s == null) return "NULL";
  return "'" + String(s).replace(/'/g, "''") + "'";
}

function jsonbLit(obj) {
  return "'" + JSON.stringify(obj).replace(/'/g, "''") + "'::jsonb";
}

function arrLit(arr) {
  if (!arr || arr.length === 0) return "ARRAY[]::text[]";
  return "ARRAY[" + arr.map((s) => sqlEscape(s)).join(",") + "]::text[]";
}

// One SQL block per meeting. Wrapped in a DO block so we can hold the
// post IDs in local variables across multiple INSERTs/UPDATEs.
function emitMeetingBlock({
  meeting_date,
  plenary_title,
  plenary_content,
  treasurer_title,
  treasurer_content,
  treasurer_link,
  committee_sections,
  annotations,
}) {
  const tag = `ingest:ldpec-minutes:${meeting_date}`;
  const lines = [];
  lines.push(`-- ────────────────────────────────────────────────────────────`);
  lines.push(`-- LDPEC meeting ${meeting_date}`);
  lines.push(`-- ────────────────────────────────────────────────────────────`);
  lines.push(`DO $$`);
  lines.push(`DECLARE`);
  lines.push(`  v_secretary uuid;`);
  lines.push(`  v_treasurer uuid;`);
  lines.push(`  v_plenary_post uuid;`);
  lines.push(`  v_treasurer_post uuid;`);
  lines.push(`  v_record uuid;`);
  lines.push(`  v_committee_chair uuid;`);
  lines.push(`  v_committee_chair_name text;`);
  lines.push(`BEGIN`);

  // Resolve current officer IDs.
  lines.push(`  SELECT id INTO v_secretary FROM ec_members WHERE primary_role = 'OFFICER' AND officer_role = 'SECRETARY' AND active LIMIT 1;`);
  lines.push(`  SELECT id INTO v_treasurer FROM ec_members WHERE primary_role = 'OFFICER' AND officer_role = 'TREASURER' AND active LIMIT 1;`);

  // Plenary minutes post.
  lines.push(`  SELECT id INTO v_plenary_post FROM workspace_posts WHERE ${sqlEscape(tag)} = ANY(tags) AND committee_code IS NULL AND post_type = 'NOTES' LIMIT 1;`);
  lines.push(`  IF v_plenary_post IS NULL THEN`);
  lines.push(`    INSERT INTO workspace_posts (committee_code, author_member_id, author_display_name, post_type, title, content_md, meeting_date, tags) VALUES (`);
  lines.push(`      NULL,`);
  lines.push(`      v_secretary,`);
  lines.push(`      ${sqlEscape("Brook Benningfield")},`);
  lines.push(`      'NOTES',`);
  lines.push(`      ${sqlEscape(plenary_title)},`);
  lines.push(`      ${sqlEscape(plenary_content)},`);
  lines.push(`      ${sqlEscape(meeting_date)},`);
  lines.push(`      ${arrLit([tag, "ldpec-plenary", "minutes"])}`);
  lines.push(`    ) RETURNING id INTO v_plenary_post;`);
  lines.push(`  END IF;`);

  // Treasurer report post (only if we have content).
  const treasurerTag = `ingest:ldpec-treasurer:${meeting_date}`;
  if (treasurer_content) {
    lines.push(``);
    lines.push(`  SELECT id INTO v_treasurer_post FROM workspace_posts WHERE ${sqlEscape(treasurerTag)} = ANY(tags) AND committee_code IS NULL AND post_type = 'NOTES' LIMIT 1;`);
    lines.push(`  IF v_treasurer_post IS NULL THEN`);
    lines.push(`    INSERT INTO workspace_posts (committee_code, author_member_id, author_display_name, post_type, title, content_md, meeting_date, link_url, tags) VALUES (`);
    lines.push(`      NULL,`);
    lines.push(`      v_treasurer,`);
    lines.push(`      ${sqlEscape("Linda Jones")},`);
    lines.push(`      'NOTES',`);
    lines.push(`      ${sqlEscape(treasurer_title)},`);
    lines.push(`      ${sqlEscape(treasurer_content)},`);
    lines.push(`      ${sqlEscape(meeting_date)},`);
    lines.push(`      ${sqlEscape(treasurer_link)},`);
    lines.push(`      ${arrLit([treasurerTag, "ldpec-treasurer", "financial"])}`);
    lines.push(`    ) RETURNING id INTO v_treasurer_post;`);
    lines.push(`  END IF;`);
  } else {
    lines.push(`  v_treasurer_post := NULL;`);
  }

  // Per-committee derived posts.
  for (const { section_key, committee_code, content } of committee_sections) {
    const committeeTag = `ingest:ldpec-committee-report:${section_key}:${meeting_date}`;
    lines.push(``);
    lines.push(`  -- ${SECTION_LABEL[section_key] ?? section_key} committee report (derived from LDPEC minutes)`);
    lines.push(`  SELECT chair_id, COALESCE((SELECT (CASE WHEN preferred_name IS NULL THEN first_name ELSE preferred_name END) || ' ' || last_name FROM ec_members WHERE id = chair_id), 'Committee Chair')`);
    lines.push(`    INTO v_committee_chair, v_committee_chair_name FROM committees WHERE code = ${sqlEscape(committee_code)};`);
    lines.push(`  IF v_committee_chair IS NULL THEN v_committee_chair_name := 'Committee Chair'; END IF;`);
    lines.push(`  IF NOT EXISTS (SELECT 1 FROM workspace_posts WHERE ${sqlEscape(committeeTag)} = ANY(tags)) THEN`);
    lines.push(`    INSERT INTO workspace_posts (committee_code, author_member_id, author_display_name, post_type, title, content_md, meeting_date, tags) VALUES (`);
    lines.push(`      ${sqlEscape(committee_code)},`);
    lines.push(`      v_committee_chair,`);
    lines.push(`      v_committee_chair_name,`);
    lines.push(`      'NOTES',`);
    lines.push(`      ${sqlEscape(`${SECTION_LABEL[section_key] ?? section_key} — Report to LDPEC ${meeting_date}`)},`);
    lines.push(`      ${sqlEscape(content)},`);
    lines.push(`      ${sqlEscape(meeting_date)},`);
    lines.push(`      ${arrLit([committeeTag, "committee-report", "derived-from-ldpec"])}`);
    lines.push(`    );`);
    lines.push(`  END IF;`);
  }

  // Ensure a meeting_record exists for this date, then update with
  // post IDs + annotations.
  lines.push(``);
  lines.push(`  SELECT id INTO v_record FROM meeting_records WHERE meeting_date = ${sqlEscape(meeting_date)} AND meeting_type = 'LDPEC' LIMIT 1;`);
  lines.push(`  IF v_record IS NULL THEN`);
  lines.push(`    INSERT INTO meeting_records (meeting_date, meeting_type, committee_code, status, created_by_member_id, minutes_post_id, treasurer_report_post_id, annotations)`);
  lines.push(`    VALUES (${sqlEscape(meeting_date)}, 'LDPEC', NULL, 'PUBLISHED', COALESCE(v_secretary, v_treasurer), v_plenary_post, v_treasurer_post, ${jsonbLit(annotations)});`);
  lines.push(`  ELSE`);
  lines.push(`    UPDATE meeting_records SET`);
  lines.push(`      minutes_post_id = v_plenary_post,`);
  lines.push(`      treasurer_report_post_id = COALESCE(v_treasurer_post, treasurer_report_post_id),`);
  lines.push(`      annotations = ${jsonbLit(annotations)}`);
  lines.push(`    WHERE id = v_record;`);
  lines.push(`  END IF;`);

  lines.push(`END $$;`);
  return lines.join("\n");
}

// ─── Orchestration ────────────────────────────────────────────────────

async function processOneMeeting({ minutesPath, treasurerByYm }) {
  const text = await readMinutes(minutesPath);
  const filename = minutesPath.split("/").pop();
  if (isWrongOrgMinutes(filename, text)) {
    console.log(`\n  ⚠ Not LDPEC — looks like JCDWC / women's club minutes. Skipping.`);
    return null;
  }
  const parsed = parseMinutes({ filename, text });

  if (!parsed.meeting_date) {
    const fromName = inferYearMonthFromFilename(minutesPath);
    if (fromName) parsed.meeting_date = `${fromName}-01`;
  }
  if (!parsed.meeting_date) {
    console.warn(`  ⚠ Skipping — could not infer meeting date: ${minutesPath}`);
    return null;
  }

  // Date-prefix filter
  if (ONLY && !parsed.meeting_date.startsWith(ONLY)) return null;

  // LLM annotations (or fallback to parser-only motions).
  let annotations;
  if (NO_LLM) {
    annotations = {
      motions: parsed.raw_motions.map((m) => ({
        text: `Motion in ${m.section}`,
        section: m.section,
        motion_by_name: m.motion_by,
        seconded_by_name: m.seconded_by,
        passed: m.passed,
      })),
      decisions: [],
      action_items: [],
      attendance: parsed.attendance ?? { present: [], proxy: [], absent: [] },
    };
  } else {
    try {
      annotations = await annotateMinutes(parsed);
    } catch (err) {
      console.warn(`  ⚠ LLM annotation failed for ${parsed.meeting_date}: ${err.message}`);
      console.warn(`     Falling back to parser-only annotations.`);
      annotations = {
        motions: parsed.raw_motions.map((m) => ({
          text: `Motion in ${m.section}`,
          section: m.section,
          motion_by_name: m.motion_by,
          seconded_by_name: m.seconded_by,
          passed: m.passed,
        })),
        decisions: [],
        action_items: [],
        attendance: parsed.attendance ?? { present: [], proxy: [], absent: [] },
      };
    }
  }

  // Match a treasurer PDF for this meeting's month.
  const ym = parsed.meeting_date.slice(0, 7).replace("-", "");
  let treasurer_content = null;
  let treasurer_title = null;
  const trPath = treasurerByYm.get(ym);
  if (trPath) {
    try {
      treasurer_content = await pdfToText(trPath);
      const monthLabel = new Date(parsed.meeting_date + "T00:00:00").toLocaleDateString("en-US", {
        month: "long", year: "numeric",
      });
      treasurer_title = `LDPEC Treasurer Report — ${monthLabel}`;
    } catch (err) {
      console.warn(`  ⚠ Could not extract treasurer PDF text: ${err.message}`);
    }
  }

  // Build per-committee derived posts from the parsed sections.
  // Skip sections that are just empty motion-template scaffolding
  // (Brook leaves "Motion: / Seconded: / Yea: / Nay:" under every
  // committee header, even when nothing was reported). A section is
  // substantive only if, after stripping those template lines, there
  // are still >=15 chars of real content.
  const committee_sections = [];
  for (const [section_key, committee_code] of Object.entries(SECTION_TO_COMMITTEE)) {
    const content = parsed.sections?.[section_key];
    if (!content) continue;
    const stripped = content
      .split("\n")
      .filter((line) => {
        const t = line.trim();
        if (!t) return false;
        if (/^(Motion|Seconded|Yea|Nay):\s*$/i.test(t)) return false;
        return true;
      })
      .join("\n")
      .trim();
    if (stripped.length < 15) continue;
    committee_sections.push({ section_key, committee_code, content });
  }

  // Title generation.
  const monthLabel = new Date(parsed.meeting_date + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });
  const plenary_title = `LDPEC Plenary Minutes — ${monthLabel}`;

  // Body: prepend a small structured header, then the verbatim minutes.
  const plenary_content = parsed.full_text;

  return emitMeetingBlock({
    meeting_date: parsed.meeting_date,
    plenary_title,
    plenary_content,
    treasurer_title,
    treasurer_content,
    treasurer_link: parsed.treasurer_report_link,
    committee_sections,
    annotations,
  });
}

async function main() {
  console.log(`📂 Walking ${DRIVE_ROOT}`);
  if (!statSync(DRIVE_ROOT, { throwIfNoEntry: false })) {
    throw new Error(`Drive folder not found: ${DRIVE_ROOT}`);
  }
  const all = walkDir(DRIVE_ROOT);
  const minutesFiles = all.filter(isMinutesFile);
  const treasurerFiles = all.filter(isTreasurerPdf);

  // Build a YYYYMM → treasurer path map.
  const treasurerByYm = new Map();
  for (const p of treasurerFiles) {
    const m = p.match(TREASURER_PDF_RE);
    if (m) treasurerByYm.set(m[1] + m[2], p);
  }

  console.log(`📑 Found ${minutesFiles.length} minutes files, ${treasurerFiles.length} treasurer PDFs.`);
  if (ONLY) console.log(`🎯 INGEST_ONLY=${ONLY} — filtering.`);
  if (NO_LLM) console.log(`🤖 INGEST_NO_LLM=1 — skipping LLM annotation.`);
  if (DRY_RUN) console.log(`🟡 INGEST_DRY_RUN=1 — won't write SQL.`);
  console.log();

  // Sort by inferred filename date, oldest first.
  minutesFiles.sort((a, b) => {
    const am = inferYearMonthFromFilename(a) ?? "";
    const bm = inferYearMonthFromFilename(b) ?? "";
    return am.localeCompare(bm);
  });

  const blocks = [
    "-- LDPEC plenary minutes + treasurer reports backfill (2025-2026).",
    "-- Generated by scripts/ingest-minutes.mjs. Idempotent via tag-based",
    "-- NOT EXISTS guards on workspace_posts. Apply via Supabase MCP or psql.",
    "",
  ];
  let processed = 0;
  let skipped = 0;
  for (const path of minutesFiles) {
    const name = path.split("/").pop();
    process.stdout.write(`→ ${name} … `);
    try {
      const sql = await processOneMeeting({ minutesPath: path, treasurerByYm });
      if (sql == null) {
        console.log("skipped");
        skipped += 1;
        continue;
      }
      blocks.push(sql);
      blocks.push("");
      processed += 1;
      console.log("ok");
    } catch (err) {
      console.log("FAILED:", err.message);
      skipped += 1;
    }
  }

  const finalSql = blocks.join("\n");
  if (!DRY_RUN) {
    writeFileSync(OUT_PATH, finalSql);
    console.log(`\n✅ Wrote ${OUT_PATH} (${(finalSql.length / 1024).toFixed(1)}K)`);
  } else {
    console.log(`\n🟡 Dry run — would have written ${(finalSql.length / 1024).toFixed(1)}K to ${OUT_PATH}`);
  }
  console.log(`Processed: ${processed} · Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
