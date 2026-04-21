// Parses the two 2025 Convention CSVs in AB = Louisville Democrats/25 Convention/
// and emits SQL INSERTs for the precinct_captains table.
//
// Priority merge: a row in the LD41 working sheet (which has role + email +
// phone) replaces a match from the Credentialed-Non-Voters file on
// (ld, precinct_code, last_name, first_name). Anything only in LD41's sheet
// is inserted as-is. Anything only in Credentialed is inserted without
// role/contact.

import { readFileSync } from "node:fs";

const DROPBOX = "/Users/lisanorkus/Library/CloudStorage/Dropbox/AB = Louisville Democrats/25 Convention";
const CRED_CSV = `${DROPBOX}/Credentialed - Non Voters for Merge.csv`;
const LD41_CSV = `${DROPBOX}/Precinct voters- Jefferson county - 41-2.csv`;

function parseCsv(path) {
  const text = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  const rows = [];
  let cur = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\n") { cur.push(field); rows.push(cur); cur = []; field = ""; }
      else if (c === "\r") { /* skip */ }
      else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const o = {};
    header.forEach((h, i) => (o[h] = (r[i] ?? "").trim()));
    return o;
  });
}

function sqlStr(v) {
  if (v == null || v === "") return "null";
  return "'" + String(v).replace(/'/g, "''") + "'";
}

function normalizeRole(r) {
  if (!r) return null;
  const s = r.toLowerCase();
  if (s.startsWith("man")) return "MAN";
  if (s.startsWith("woman")) return "WOMAN";
  if (s.startsWith("youth")) return "YOUTH";
  return null;
}

function key(ld, precinct, first, last) {
  return [ld, precinct, first.toLowerCase(), last.toLowerCase()].join("|");
}

// Credentialed Non-Voters: columns are "d","Proper LD","Precinct","preferred_first_name","Proper","first_name","middle_name","last_name","Proper Last"
// (the leading "d" is actually an LD number label; we'll use it via column name)
const credRaw = parseCsv(CRED_CSV);
const cred = [];
for (const row of credRaw) {
  const ld = parseInt(row["d"] || row["LD"] || "", 10);
  const precinct = (row["Precinct"] || "").trim();
  const first = (row["Proper"] || row["preferred_first_name"] || row["first_name"] || "").trim();
  const last = (row["Proper Last"] || row["last_name"] || "").trim();
  const middle = (row["middle_name"] || "").trim();
  const preferred = (row["preferred_first_name"] || "").trim();
  if (!ld || !precinct || !first || !last) continue;
  cred.push({ ld, precinct, first, last, middle, preferred });
}

// LD41 sheet: LD, Precinct, role, First, Last, email, phone
const ld41Raw = parseCsv(LD41_CSV);
const ld41 = [];
for (const row of ld41Raw) {
  const ld = parseInt(row["LD"] || "", 10);
  const precinct = (row["Precinct"] || "").trim();
  const role = normalizeRole(row["role"]);
  const first = (row["First"] || "").trim();
  const last = (row["Last"] || "").trim();
  const email = (row["email"] || "").trim();
  const phone = (row["phone"] || "").trim();
  if (!ld || !precinct || !first || !last) continue;
  ld41.push({ ld, precinct, role, first, last, email, phone });
}

// Merge
const merged = new Map();
for (const r of cred) {
  merged.set(key(r.ld, r.precinct, r.first, r.last), {
    ...r,
    role: null,
    email: null,
    phone: null,
    credentialed: true,
    source: "CREDENTIALED_2025_CONVENTION",
  });
}
for (const r of ld41) {
  const k = key(r.ld, r.precinct, r.first, r.last);
  const existing = merged.get(k);
  if (existing) {
    existing.role = r.role ?? existing.role;
    existing.email = r.email || existing.email;
    existing.phone = r.phone || existing.phone;
    existing.source = "CREDENTIALED_2025_CONVENTION + LD41_WORKING_SHEET";
  } else {
    merged.set(k, {
      ld: r.ld,
      precinct: r.precinct,
      first: r.first,
      last: r.last,
      middle: "",
      preferred: "",
      role: r.role,
      email: r.email || null,
      phone: r.phone || null,
      credentialed: false,
      source: "LD41_WORKING_SHEET",
    });
  }
}

const out = [
  "insert into precinct_captains (ld_number, precinct_code, role, first_name, last_name, middle_name, preferred_name, email, phone, credentialed_2025, elected_at, source) values",
];
const rows = Array.from(merged.values())
  .sort((a, b) => a.ld - b.ld || a.precinct.localeCompare(b.precinct) || a.last.localeCompare(b.last));
const values = rows.map((r) =>
  `(${r.ld}, ${sqlStr(r.precinct)}, ${r.role ? `'${r.role}'::pc_role` : "null"}, ${sqlStr(r.first)}, ${sqlStr(r.last)}, ${sqlStr(r.middle)}, ${sqlStr(r.preferred)}, ${sqlStr(r.email)}, ${sqlStr(r.phone)}, ${r.credentialed}, '2025 County Convention', ${sqlStr(r.source)})`
);
out.push(values.join(",\n"));
out.push(";");

process.stdout.write(out.join("\n"));
process.stderr.write(
  `\n-- Merged ${rows.length} rows: ${cred.length} from Credentialed, ${ld41.length} from LD41 sheet\n`
);
