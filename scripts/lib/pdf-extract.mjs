// Thin wrapper around `pdftotext` (poppler) for treasurer report PDFs.
// Returns the extracted text and a small structural-quality heuristic
// so the caller can decide whether to flag the file for manual review.

import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

export async function extractPdfText(pdfPath) {
  const dir = mkdtempSync(join(tmpdir(), "ldpec-pdf-"));
  const out = join(dir, "out.txt");
  // -layout preserves columnar structure, which matters for ledger-
  // style treasurer reports. -nopgbrk drops the form-feed page
  // separators so the output reads as one continuous document.
  await execFileP("pdftotext", ["-layout", "-nopgbrk", pdfPath, out]);
  const text = readFileSync(out, "utf8");
  return {
    text,
    char_count: text.length,
    line_count: text.split("\n").length,
    // Cheap quality heuristic: useful PDFs have a few hundred chars AND
    // either a dollar amount OR a structured-number-with-decimals OR
    // a financial keyword. Catches Brook's treasurer PDFs (no $ signs,
    // but commas+decimals in a tabular layout).
    looks_useful:
      text.length >= 300 &&
      (/\$[\d,]+(\.\d{2})?/.test(text) ||
        /\d{1,3}(,\d{3})+\.\d{2}/.test(text) ||
        /\b(Balance|Total|Beginning|Ending|Deposits|Withdrawals|Operating|Mortgage|PNC|Republic)\b/i.test(
          text
        )),
  };
}
