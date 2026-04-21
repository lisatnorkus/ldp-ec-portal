// Inspect the LDP_Org_Chart_2025.xlsx and print sheet structure + a sample.
// Goal: find fields we haven't pulled into Supabase yet.
//
// Usage: node scripts/inspect-xlsx.mjs

import * as XLSX from "xlsx";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const xlsxPath = resolve(__dirname, "../docs/source-data/LDP_Org_Chart_2025.xlsx");
const buf = readFileSync(xlsxPath);
const wb = XLSX.read(buf, { type: "buffer" });

console.log(`Workbook: ${xlsxPath}`);
console.log(`Sheets: ${wb.SheetNames.length}`);
for (const name of wb.SheetNames) {
  const ws = wb.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null });
  console.log(`\n── Sheet: ${name} (${rows.length} data rows) ──`);
  if (rows.length === 0) {
    // Check if there's a header-only or merged-cell structure
    const aoa = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
    console.log("(empty as objects; raw first 5 rows):");
    console.log(JSON.stringify(aoa.slice(0, 5), null, 2));
    continue;
  }
  const headers = Object.keys(rows[0] || {});
  console.log(`Columns (${headers.length}): ${headers.join(" | ")}`);
  console.log("\nFirst 3 rows:");
  for (const r of rows.slice(0, 3)) {
    console.log(JSON.stringify(r, null, 2));
  }
  if (rows.length > 3) {
    console.log(`... and ${rows.length - 3} more rows`);
  }
}
