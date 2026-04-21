// Extract remaining data from LDP_Org_Chart_2025.xlsx:
//  - All phone numbers (from People Directory + LD Committees sheets)
//  - Vacancies with recommended actions
//  - Structural template (current vs ideal seats with gap counts)
//
// Output: supabase/seed_xlsx_detail.sql
// Usage: node scripts/extract-xlsx-detail.mjs

import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const xlsxPath = resolve(repoRoot, "docs/source-data/LDP_Org_Chart_2025.xlsx");
const OUT_SQL = resolve(repoRoot, "supabase/seed_xlsx_detail.sql");

const wb = XLSX.read(readFileSync(xlsxPath), { type: "buffer" });

function sheetRows(name) {
  const ws = wb.Sheets[name];
  return XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
}

function sqlStr(s) {
  if (s === null || s === undefined) return "NULL";
  return `'${String(s).replace(/'/g, "''")}'`;
}
function sqlStrN(s) {
  if (s === null || s === undefined || s === "") return "NULL";
  return sqlStr(s);
}

// Name aliases to canonical spelling in ec_members.
const ALIASES = {
  "Lisa Norkus": "Lisa Tanner Norkus",
  "Resean Crawley": "Rasean Crawley",
  "Beverly Chester-Burton": "Beverly Chester Burton",
};
function canon(name) { return ALIASES[name?.trim()] ?? name?.trim(); }

const sql = [];
sql.push("-- Data extracted from LDP_Org_Chart_2025.xlsx");
sql.push("-- Generated " + new Date().toISOString());
sql.push("");

// ─── Phone numbers from People Directory (most complete) ────────────────
sql.push("-- Phone numbers from xlsx People Directory + LD Committees sheets");
const peopleRows = sheetRows("People Directory");
// First row is header: [Name, Current Role(s), Email, Phone]
let phoneCount = 0;
for (let i = 1; i < peopleRows.length; i++) {
  const [name, roles, email, phone] = peopleRows[i] || [];
  if (!name || !phone) continue;
  const canonical = canon(name);
  if (!canonical) continue;
  const parts = canonical.split(/\s+/);
  const first = parts[0];
  const last = parts.slice(1).join(" ");
  sql.push(
    `UPDATE ec_members SET phone = COALESCE(phone, ${sqlStr(phone)}) WHERE first_name = ${sqlStr(first)} AND last_name = ${sqlStr(last)};`
  );
  phoneCount++;
}
sql.push("");

// Also walk LD Committees sheet for additional coverage
const ldRows = sheetRows("LD Committees");
// Headers: [LD, Chair, Chair Email, Chair Phone, Vice Chair, VC Email, VC Phone]
for (let i = 1; i < ldRows.length; i++) {
  const [ldLabel, chair, chairEmail, chairPhone, vc, vcEmail, vcPhone] = ldRows[i] || [];
  if (chair && chairPhone) {
    const c = canon(chair);
    const parts = c.split(/\s+/);
    sql.push(
      `UPDATE ec_members SET phone = COALESCE(phone, ${sqlStr(chairPhone)}) WHERE first_name = ${sqlStr(parts[0])} AND last_name = ${sqlStr(parts.slice(1).join(" "))};`
    );
  }
  if (vc && vcPhone) {
    const c = canon(vc);
    const parts = c.split(/\s+/);
    sql.push(
      `UPDATE ec_members SET phone = COALESCE(phone, ${sqlStr(vcPhone)}) WHERE first_name = ${sqlStr(parts[0])} AND last_name = ${sqlStr(parts.slice(1).join(" "))};`
    );
  }
  // Also backfill emails if email was missing
  if (chair && chairEmail) {
    const c = canon(chair);
    const parts = c.split(/\s+/);
    sql.push(
      `UPDATE ec_members SET email = COALESCE(email, ${sqlStr(chairEmail)}) WHERE first_name = ${sqlStr(parts[0])} AND last_name = ${sqlStr(parts.slice(1).join(" "))};`
    );
  }
  if (vc && vcEmail) {
    const c = canon(vc);
    const parts = c.split(/\s+/);
    sql.push(
      `UPDATE ec_members SET email = COALESCE(email, ${sqlStr(vcEmail)}) WHERE first_name = ${sqlStr(parts[0])} AND last_name = ${sqlStr(parts.slice(1).join(" "))};`
    );
  }
}
sql.push("");

// ─── Vacancies: supplemental rows into transitions with recommended action ──
sql.push("-- Vacancies / structural gaps from xlsx Vacancies sheet");
const vacancyRows = sheetRows("Vacancies");
// Headers: [Where, What's open, Context, Recommended action]
// Extend transitions table with optional recommended_action column.
sql.push("ALTER TABLE transitions ADD COLUMN IF NOT EXISTS recommended_action text;");
for (let i = 1; i < vacancyRows.length; i++) {
  const [where, whatsOpen, context, action] = vacancyRows[i] || [];
  if (!where || !whatsOpen) continue;
  // Skip header-like rows
  if (where === "Where") continue;
  // Only patch recommended_action for ones that map to existing transitions
  // by seat descriptor. Vacancy table references seats; transitions uses seat_code.
  // Instead of cross-joining, just insert these as general "open seats" notes if
  // they don't already exist.
  const seatCode = normalizeSeat(where, whatsOpen);
  sql.push(
    `INSERT INTO transitions (seat_code, status, notes, recommended_action) VALUES (${sqlStr(seatCode)}, 'VACANT', ${sqlStrN(context)}, ${sqlStrN(action)}) ON CONFLICT DO NOTHING;`
  );
}
sql.push("");

function normalizeSeat(where, whatsOpen) {
  const prefix = (where ?? "").toString().toUpperCase().replace(/\s+/g, "");
  const role = (whatsOpen ?? "").toLowerCase();
  if (role.includes("vice chair")) return `${prefix}_VC_GAP`;
  if (role.includes("chair")) return `${prefix}_CHAIR_GAP`;
  return `${prefix}_GAP`;
}

// ─── Structural template: current vs ideal seat counts ───────────────────
sql.push("-- Structural template table (seat counts)");
sql.push(`CREATE TABLE IF NOT EXISTS structural_template (
  id serial primary key,
  level text not null,
  seat text not null,
  structural_count int,
  currently_filled int,
  gap int,
  display_order int not null default 0,
  updated_at timestamptz not null default now()
);`);
sql.push("DELETE FROM structural_template;");

const templateRows = sheetRows("Structural Template");
// Headers: [Level, Seat, Structural count, Currently filled, Gap]
let order = 0;
for (let i = 1; i < templateRows.length; i++) {
  const [level, seat, structural, filled, gap] = templateRows[i] || [];
  if (!level || !seat) continue;
  if (level === "Level") continue;
  sql.push(
    `INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES (${sqlStr(level)}, ${sqlStr(seat)}, ${structural ?? "NULL"}, ${filled ?? "NULL"}, ${gap ?? "NULL"}, ${++order});`
  );
}
sql.push("");

writeFileSync(OUT_SQL, sql.join("\n"));
console.log(`Wrote ${OUT_SQL}`);
console.log(`  ${phoneCount} phones from People Directory, ${templateRows.length - 1} template rows, ${vacancyRows.length - 1} vacancy rows`);
