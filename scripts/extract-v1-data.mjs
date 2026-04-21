// Extract v1 portal data → seed SQL for Supabase.
// Reads docs/source-data/v1-snapshot.html, pulls the embedded JS constant
// declarations (COMMITTEES, LDS, AT_LARGE, EMAILS, ATTENDANCE, PHONES,
// OVERLAPS, STATE_HOUSE, STATE_SENATE, METRO_COUNCIL), evaluates them in a
// sandbox, then writes seed SQL to supabase/seed_v1_data.sql.
//
// Usage: node scripts/extract-v1-data.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const HTML_PATH = resolve(repoRoot, "docs/source-data/v1-snapshot.html");
const OUT_SQL = resolve(repoRoot, "supabase/seed_v1_data.sql");

const html = readFileSync(HTML_PATH, "utf8");

// ─── Extract each top-level const declaration ────────────────────────────
// We match `const NAME = <literal>;` up through the closing `};` or `];` at
// column 0. Each data block is self-contained.
const NAMES = [
  "COMMITTEES",
  "LDS",
  "AT_LARGE",
  "EMAILS",
  "ATTENDANCE_TOTAL",
  "ATTENDANCE",
  "PHONES",
  "OVERLAPS",
  "STATE_HOUSE",
  "STATE_SENATE",
  "METRO_COUNCIL",
];

function extractBlock(src, name) {
  // Word-boundary match: `const NAME` followed by whitespace or `=`
  const re = new RegExp(`const ${name}(?=\\s|=)`);
  const match = re.exec(src);
  if (!match) throw new Error(`Constant ${name} not found`);
  const startIdx = match.index;
  // Walk forward tracking bracket depth until we hit a top-level `;`
  let i = src.indexOf("=", startIdx) + 1;
  let depth = 0;
  let inStr = null;
  let escape = false;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
    if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") depth--;
    else if (ch === ";" && depth === 0) break;
    else if (ch === "/" && src[i + 1] === "/") {
      // line comment
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
  }
  return src.slice(startIdx, i + 1);
}

const blocks = NAMES.map((n) => extractBlock(html, n)).join("\n\n");

// Turn the JS chunk into an ESM module and dynamic-import it.
const moduleBody = blocks + "\n\nexport { " + NAMES.join(", ") + " };\n";
const tmpFile = resolve(tmpdir(), `v1-data-${randomBytes(6).toString("hex")}.mjs`);
writeFileSync(tmpFile, moduleBody);
let mod;
try {
  mod = await import(pathToFileURL(tmpFile).href);
} catch (err) {
  console.error("Failed to evaluate extracted blocks:", err.message);
  console.error("Temp file:", tmpFile);
  process.exit(1);
}

const {
  COMMITTEES,
  LDS,
  AT_LARGE,
  EMAILS,
  ATTENDANCE,
  ATTENDANCE_TOTAL,
  PHONES,
  OVERLAPS,
  STATE_HOUSE,
  STATE_SENATE,
  METRO_COUNCIL,
} = mod;

// ─── Normalize + build people roster ─────────────────────────────────────

// Countywide officers extracted from the #officers HTML section (lines ~2260–2307).
// Maps name → { officer_role, phone }.
const OFFICERS = {
  "Logan Gatti":        { officer_role: "CHAIR", phone: "(502) 931-6721" },
  "Roz Welch":          { officer_role: "VICE_CHAIR", phone: "(502) 295-5435" },
  "Brook Benningfield": { officer_role: "SECRETARY", phone: null },
  "Linda Jones":        { officer_role: "TREASURER", phone: "(502) 262-3728" },
};

// Unique people set. Sources:
//   - LDS: {ld, chair, vc, ...}
//   - AT_LARGE: [name, ld] tuples
//   - COMMITTEES: {chair, members[]}
//   - EMAILS/PHONES/ATTENDANCE: referenced by name
//   - OFFICERS constant above
// One row per unique person name.

const people = new Map(); // name → {first, last, roles[], ld_number, phone, email, attendance}

// Name aliases: different strings → same canonical person.
const NAME_ALIASES = {
  "Lisa Norkus": "Lisa Tanner Norkus",
};

// Placeholder strings that look like people but aren't.
const NAME_BLOCKLIST = new Set([
  "VACANT",
  "Members: TBD — named when the committee reconvenes",
  "Members TBD",
  "TBD",
]);

function upsertPerson(name) {
  if (!name || typeof name !== "string") return null;
  if (NAME_BLOCKLIST.has(name)) return null;
  if (/^Members[:\s]/i.test(name)) return null;
  const canonical = NAME_ALIASES[name] ?? name;
  if (people.has(canonical)) return people.get(canonical);
  const trimmed = canonical.trim();
  const parts = trimmed.split(/\s+/);
  const first = parts[0];
  const last = parts.slice(1).join(" ") || "";
  const p = {
    name: trimmed,
    first,
    last,
    committee_chair_codes: [],
    committee_member_codes: [],
    ld_number: null,
    phone: null,
    email: null,
    primary_role: null,
    officer_role: null,
    attendance: null,
  };
  // Apply officer overlay if this is one of the four countywide officers.
  const officer = OFFICERS[trimmed];
  if (officer) {
    p.officer_role = officer.officer_role;
    if (officer.phone) p.phone = officer.phone;
  }
  people.set(trimmed, p);
  return p;
}

// LDs — Chair and VC
for (const ld of LDS) {
  if (ld.chair) {
    const p = upsertPerson(ld.chair);
    if (p) {
      p.primary_role = "LD_CHAIR";
      p.ld_number = Number(ld.ld);
    }
  }
  if (ld.vc) {
    const p = upsertPerson(ld.vc);
    if (p) {
      p.primary_role = "LD_VC";
      p.ld_number = Number(ld.ld);
    }
  }
}

// AT_LARGE — 18 pairs
for (const [name, ld] of AT_LARGE) {
  const p = upsertPerson(name);
  if (!p) continue;
  if (!p.primary_role) p.primary_role = "AT_LARGE";
  if (!p.ld_number && ld) p.ld_number = Number(ld);
}

// COMMITTEES — chairs and members
for (const c of COMMITTEES) {
  const code = committeeCode(c.name);
  if (c.chair) {
    const p = upsertPerson(c.chair);
    if (p) {
      if (!p.committee_chair_codes.includes(code)) p.committee_chair_codes.push(code);
      if (!p.primary_role) p.primary_role = "COMMITTEE_CHAIR_ONLY";
    }
  }
  for (const m of c.members ?? []) {
    const p = upsertPerson(m);
    if (p && !p.committee_member_codes.includes(code)) p.committee_member_codes.push(code);
  }
}

// Emails / phones / attendance
for (const [name, email] of Object.entries(EMAILS ?? {})) {
  const p = upsertPerson(name);
  if (p) p.email = email;
}
for (const [name, phone] of Object.entries(PHONES ?? {})) {
  const p = upsertPerson(name);
  if (p) p.phone = phone;
}
for (const [name, att] of Object.entries(ATTENDANCE ?? {})) {
  const p = upsertPerson(name);
  if (p) p.attendance = att;
}

function committeeCode(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// ─── SQL generation ──────────────────────────────────────────────────────

const sql = [];
sql.push("-- Seed data extracted from docs/source-data/v1-snapshot.html");
sql.push("-- Generated by scripts/extract-v1-data.mjs on " + new Date().toISOString());
sql.push("-- Idempotent: uses ON CONFLICT. Safe to re-run.");
sql.push("");
sql.push("BEGIN;");
sql.push("");

// Legislative Districts (insert first; FKs added after people)
sql.push("-- Legislative Districts (18 rows)");
for (const ld of LDS) {
  const n = Number(ld.ld);
  const overlap = OVERLAPS?.[ld.ld] ?? { sd: [], cd: [], metro: [] };
  sql.push(
    `INSERT INTO legislative_districts (number, state_senate_overlap, metro_council_overlap, us_house_overlap) VALUES (${n}, ${arrLiteral(overlap.sd)}, ${arrLiteral(overlap.metro)}, ${arrLiteral(overlap.cd)}) ON CONFLICT (number) DO UPDATE SET state_senate_overlap = EXCLUDED.state_senate_overlap, metro_council_overlap = EXCLUDED.metro_council_overlap, us_house_overlap = EXCLUDED.us_house_overlap;`
  );
}
sql.push("");

// Committees — seed only the 8 standing + 3 ad hoc per CLAUDE.md.
// The v1 data has a duplicate "Endorsement" standing row and "Endorsement Process" ad hoc — keep the ad hoc only.
const KEEP_COMMITTEE_NAMES = new Set([
  "Bylaws",
  "Candidate Recruitment",
  "Communications",
  "Events",
  "Facilities",
  "Finance",
  "Training",
  "Volunteer",
  "Branding",
  "Endorsement Process",
  "Platform",
]);
const AD_HOC_NAMES = new Set(["Branding", "Endorsement Process", "Platform"]);

sql.push("-- Committees (8 standing + 3 ad hoc, Endorsement duplicate dropped)");
let order = 0;
for (const c of COMMITTEES) {
  if (!KEEP_COMMITTEE_NAMES.has(c.name)) continue;
  const code = committeeCode(c.name);
  const type = AD_HOC_NAMES.has(c.name) ? "AD_HOC" : "STANDING";
  const chairTitle =
    c.name === "Communications" ? "Communications Chair" : null; // fix Director → Chair
  sql.push(
    `INSERT INTO committees (code, name, type, chair_title_override, adhoc_note, drive_folder_url, display_order) VALUES (${sqlStr(code)}, ${sqlStr(c.name)}, '${type}', ${sqlStrNullable(chairTitle)}, ${sqlStrNullable(c.adhocNote)}, ${sqlStrNullable(c.folder)}, ${++order}) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, chair_title_override = EXCLUDED.chair_title_override, adhoc_note = EXCLUDED.adhoc_note, drive_folder_url = EXCLUDED.drive_folder_url, display_order = EXCLUDED.display_order;`
  );
}
sql.push("");

// People
sql.push("-- EC Members (" + people.size + " unique names)");
for (const p of people.values()) {
  const role = p.primary_role ?? "COMMITTEE_CHAIR_ONLY";
  const chair = p.committee_chair_codes.filter((c) => c !== "ENDORSEMENT"); // drop orphan
  const member = p.committee_member_codes.filter((c) => c !== "ENDORSEMENT");
  const att = p.attendance ?? null;
  const notes = att
    ? `attendance: p=${att.p ?? 0} x=${att.x ?? 0} a=${att.a ?? 0} e=${att.e ?? 0}`
    : null;
  sql.push(
    `INSERT INTO ec_members (first_name, last_name, email, phone, ld_number, primary_role, committee_chair_codes, committee_member_codes, notes) VALUES (${sqlStr(p.first)}, ${sqlStr(p.last)}, ${sqlStrNullable(p.email)}, ${sqlStrNullable(p.phone)}, ${p.ld_number ?? "NULL"}, '${role}', ${arrLiteral(chair)}, ${arrLiteral(member)}, ${sqlStrNullable(notes)});`
  );
}
sql.push("");

// STATE_HOUSE candidates
sql.push("-- State House candidates (from STATE_HOUSE)");
for (const [hd, data] of Object.entries(STATE_HOUSE ?? {})) {
  const num = Number(hd);
  if (Array.isArray(data)) {
    for (const c of data) {
      sql.push(buildCandidateInsert("STATE_HOUSE", num, c));
    }
  } else if (typeof data === "object" && data.candidates) {
    for (const c of data.candidates) {
      sql.push(buildCandidateInsert("STATE_HOUSE", num, c, data));
    }
  }
}
sql.push("");

// STATE_SENATE candidates
sql.push("-- State Senate candidates (from STATE_SENATE)");
for (const [sd, data] of Object.entries(STATE_SENATE ?? {})) {
  const num = Number(sd);
  if (Array.isArray(data)) {
    for (const c of data) {
      sql.push(buildCandidateInsert("STATE_SENATE", num, c));
    }
  } else if (typeof data === "object" && data.candidates) {
    for (const c of data.candidates) {
      sql.push(buildCandidateInsert("STATE_SENATE", num, c, data));
    }
  }
}
sql.push("");

// METRO_COUNCIL candidates
sql.push("-- Metro Council candidates (from METRO_COUNCIL)");
for (const [mc, data] of Object.entries(METRO_COUNCIL ?? {})) {
  const num = Number(mc);
  if (Array.isArray(data)) {
    for (const c of data) {
      sql.push(buildCandidateInsert("METRO_COUNCIL", num, c));
    }
  } else if (typeof data === "object" && data.candidates) {
    for (const c of data.candidates) {
      sql.push(buildCandidateInsert("METRO_COUNCIL", num, c, data));
    }
  }
}
sql.push("");

// After people are seeded, patch the LD chair/vc references by name.
sql.push("-- Patch LD chair/vc FKs (after ec_members rows exist)");
for (const ld of LDS) {
  const n = Number(ld.ld);
  if (ld.chair && ld.chair !== "VACANT") {
    const parts = ld.chair.trim().split(/\s+/);
    const first = parts[0];
    const last = parts.slice(1).join(" ");
    sql.push(
      `UPDATE legislative_districts SET chair_id = (SELECT id FROM ec_members WHERE first_name = ${sqlStr(first)} AND last_name = ${sqlStr(last)} LIMIT 1) WHERE number = ${n};`
    );
  }
  if (ld.vc && ld.vc !== "VACANT") {
    const parts = ld.vc.trim().split(/\s+/);
    const first = parts[0];
    const last = parts.slice(1).join(" ");
    sql.push(
      `UPDATE legislative_districts SET vc_id = (SELECT id FROM ec_members WHERE first_name = ${sqlStr(first)} AND last_name = ${sqlStr(last)} LIMIT 1) WHERE number = ${n};`
    );
  }
}
sql.push("");

// Patch committee chair FKs by name
sql.push("-- Patch committee chair FKs");
for (const c of COMMITTEES) {
  if (!KEEP_COMMITTEE_NAMES.has(c.name)) continue;
  if (!c.chair || c.chair === "VACANT") continue;
  const code = committeeCode(c.name);
  const parts = c.chair.trim().split(/\s+/);
  const first = parts[0];
  const last = parts.slice(1).join(" ");
  sql.push(
    `UPDATE committees SET chair_id = (SELECT id FROM ec_members WHERE first_name = ${sqlStr(first)} AND last_name = ${sqlStr(last)} LIMIT 1) WHERE code = ${sqlStr(code)};`
  );
}
sql.push("");
sql.push("COMMIT;");

writeFileSync(OUT_SQL, sql.join("\n"));
console.log(`Wrote ${OUT_SQL}`);
console.log(`  ${people.size} people, ${LDS.length} LDs, ${COMMITTEES.length} raw committees → kept ${[...KEEP_COMMITTEE_NAMES].length}`);

// ─── Helpers ─────────────────────────────────────────────────────────────

function sqlStr(s) {
  if (s === null || s === undefined) return "NULL";
  return `'${String(s).replace(/'/g, "''")}'`;
}
function sqlStrNullable(s) {
  if (s === null || s === undefined || s === "") return "NULL";
  return sqlStr(s);
}
function arrLiteral(arr) {
  if (!arr || arr.length === 0) return "ARRAY[]::text[]";
  // Detect numeric vs string
  const allNum = arr.every((v) => typeof v === "number" || /^-?\d+$/.test(String(v)));
  if (allNum) return `ARRAY[${arr.map(Number).join(",")}]::smallint[]`;
  return `ARRAY[${arr.map((v) => `'${String(v).replace(/'/g, "''")}'`).join(",")}]::text[]`;
}
function buildCandidateInsert(officeType, districtNum, candidate, parent) {
  const name =
    typeof candidate === "string"
      ? candidate
      : candidate.name ?? candidate.full_name ?? "UNKNOWN";
  const party = typeof candidate === "object" && candidate.party ? candidate.party : "D";
  const isIncumbent =
    typeof candidate === "object" && (candidate.incumbent === true || candidate.isIncumbent === true);
  const isEndorsed =
    typeof candidate === "object" && (candidate.endorsed === true || candidate.isEndorsed === true);
  return `INSERT INTO candidates (office_type, district_number, cycle_year, full_name, party, is_incumbent, is_endorsed, on_primary_ballot, on_general_ballot) VALUES ('${officeType}', ${districtNum}, 2026, ${sqlStr(name)}, '${party}', ${isIncumbent}, ${isEndorsed}, true, true);`;
}
