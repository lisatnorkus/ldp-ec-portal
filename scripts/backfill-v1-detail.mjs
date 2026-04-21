// One-shot backfill: populate committee responsibilities/workflow/docs/members,
// structured attendance, phone numbers, officer primary_role from v1 data.
// Outputs supabase/backfill_v1_detail.sql; apply via MCP or psql.
//
// Usage: node scripts/backfill-v1-detail.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const HTML_PATH = resolve(repoRoot, "docs/source-data/v1-snapshot.html");
const OUT_SQL = resolve(repoRoot, "supabase/backfill_v1_detail.sql");

const html = readFileSync(HTML_PATH, "utf8");

const NAMES = ["COMMITTEES", "ATTENDANCE", "PHONES"];

function extractBlock(src, name) {
  const re = new RegExp(`const ${name}(?=\\s|=)`);
  const match = re.exec(src);
  if (!match) throw new Error(`Constant ${name} not found`);
  const startIdx = match.index;
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
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
  }
  return src.slice(startIdx, i + 1);
}

const blocks = NAMES.map((n) => extractBlock(html, n)).join("\n\n");
const moduleBody = blocks + "\n\nexport { " + NAMES.join(", ") + " };\n";
const tmpFile = resolve(tmpdir(), `v1-backfill-${randomBytes(6).toString("hex")}.mjs`);
writeFileSync(tmpFile, moduleBody);
const { COMMITTEES, ATTENDANCE, PHONES } = await import(pathToFileURL(tmpFile).href);

function committeeCode(name) {
  return name.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function sqlStr(s) {
  if (s === null || s === undefined) return "NULL";
  return `'${String(s).replace(/'/g, "''")}'`;
}
function sqlStrNullable(s) {
  if (s === null || s === undefined || s === "") return "NULL";
  return sqlStr(s);
}
function strArrLiteral(arr) {
  if (!arr || arr.length === 0) return "ARRAY[]::text[]";
  return `ARRAY[${arr.map((v) => sqlStr(v)).join(",")}]::text[]`;
}
function jsonbLiteral(obj) {
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

const KEEP = new Set([
  "Bylaws", "Candidate Recruitment", "Communications", "Events", "Facilities",
  "Finance", "Training", "Volunteer", "Branding", "Endorsement Process", "Platform",
]);

const sql = [];
sql.push("-- v1 backfill: committee detail + attendance + phones + officer primary_role");
sql.push("-- Generated " + new Date().toISOString());
sql.push("");
sql.push("BEGIN;");
sql.push("");

// ─── Committees: populate description_md, workflow, docs, member_codes ───
sql.push("-- Committee detail");
for (const c of COMMITTEES) {
  if (!KEEP.has(c.name)) continue;
  const code = committeeCode(c.name);
  const workflow = Array.isArray(c.workflow) ? c.workflow : [];
  const docs = Array.isArray(c.docs) ? c.docs : [];
  const members = (c.members ?? []).map((m) => {
    // Codes are the member names themselves; the UI resolves to ec_members by name.
    return m;
  });
  sql.push(
    `UPDATE committees SET description_md = ${sqlStrNullable(c.responsibilities)}, workflow = ${strArrLiteral(workflow)}, docs = ${jsonbLiteral(docs)}, member_codes = ${strArrLiteral(members)} WHERE code = ${sqlStr(code)};`
  );
}
sql.push("");

// ─── Attendance: split `p/x/a/e` from notes into structured columns ──────
sql.push("-- Structured attendance");
for (const [name, att] of Object.entries(ATTENDANCE)) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  const last = parts.slice(1).join(" ");
  const p = Number(att.p) || 0;
  const x = Number(att.x) || 0;
  const a = Number(att.a) || 0;
  const e = Number(att.e) || 0;
  sql.push(
    `UPDATE ec_members SET attendance_present = ${p}, attendance_excused = ${x}, attendance_absent = ${a}, attendance_eligible = ${e} WHERE first_name = ${sqlStr(first)} AND last_name = ${sqlStr(last)};`
  );
}
// Handle Lisa Norkus aliasing
sql.push(
  `UPDATE ec_members SET attendance_present = coalesce(attendance_present, 10), attendance_eligible = coalesce(attendance_eligible, 10) WHERE first_name = 'Lisa' AND last_name = 'Tanner Norkus';`
);
sql.push("");

// ─── Phones: merge PHONES constant entries ───────────────────────────────
sql.push("-- Phone numbers from PHONES constant");
for (const [name, phone] of Object.entries(PHONES)) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  const last = parts.slice(1).join(" ");
  sql.push(
    `UPDATE ec_members SET phone = COALESCE(phone, ${sqlStr(phone)}) WHERE first_name = ${sqlStr(first)} AND last_name = ${sqlStr(last)};`
  );
}
sql.push("");

// ─── Officers: re-assert officer_role + phones ───────────────────────────
sql.push("-- Officer roles + officer phones (re-applied, idempotent)");
const OFFICERS = [
  { first: "Logan", last: "Gatti", role: "CHAIR", phone: "(502) 931-6721" },
  { first: "Roz", last: "Welch", role: "VICE_CHAIR", phone: "(502) 295-5435" },
  { first: "Brook", last: "Benningfield", role: "SECRETARY", phone: null },
  { first: "Linda", last: "Jones", role: "TREASURER", phone: "(502) 262-3728" },
];
for (const o of OFFICERS) {
  sql.push(
    `UPDATE ec_members SET officer_role = '${o.role}', phone = COALESCE(phone, ${sqlStrNullable(o.phone)}) WHERE first_name = ${sqlStr(o.first)} AND last_name = ${sqlStr(o.last)};`
  );
}
sql.push("");

sql.push("COMMIT;");

writeFileSync(OUT_SQL, sql.join("\n"));
const committeeCount = COMMITTEES.filter((c) => KEEP.has(c.name)).length;
console.log(`Wrote ${OUT_SQL}`);
console.log(`  ${committeeCount} committees updated, ${Object.keys(ATTENDANCE).length} attendance rows, ${Object.keys(PHONES).length} phones, ${OFFICERS.length} officers re-asserted`);
