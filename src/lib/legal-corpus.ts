import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

const CORPUS_DIR = path.join(process.cwd(), "docs", "legal-corpus");
const FINANCE_FILE = "jcdec-party-funding-laws.md";
const BYLAWS_HEADER_FILE = "jcdec-bylaws-reference.md";

// Sections already inlined in BYLAWS_HEADER_FILE; skip when concatenating
// the numbered reference files to avoid duplication.
const SECTIONS_INLINED_IN_HEADER = new Set([
  "00-quick-reference.md",
  "05-reorg-cycle.md",
  "10-decision-trees.md",
  "11-known-drift.md",
]);

let financeCache: Promise<string> | null = null;
let bylawsCache: Promise<string> | null = null;

export function loadFinanceCorpus(): Promise<string> {
  if (!financeCache) {
    financeCache = fs.readFile(path.join(CORPUS_DIR, FINANCE_FILE), "utf8");
  }
  return financeCache;
}

async function buildBylawsCorpus(): Promise<string> {
  const entries = await fs.readdir(CORPUS_DIR);
  const numbered = entries
    .filter((f) => /^\d{2}-/.test(f) && f.endsWith(".md") && !SECTIONS_INLINED_IN_HEADER.has(f))
    .sort();

  const parts: string[] = [];

  const headerPath = path.join(CORPUS_DIR, BYLAWS_HEADER_FILE);
  try {
    const header = await fs.readFile(headerPath, "utf8");
    parts.push(`<!-- FILE: ${BYLAWS_HEADER_FILE} -->\n\n${header}`);
  } catch {
    // Header is optional — if absent, the numbered files stand alone.
  }

  for (const file of numbered) {
    const content = await fs.readFile(path.join(CORPUS_DIR, file), "utf8");
    parts.push(`<!-- FILE: ${file} -->\n\n${content}`);
  }
  return parts.join("\n\n---\n\n");
}

export function loadBylawsCorpus(): Promise<string> {
  if (!bylawsCache) {
    bylawsCache = buildBylawsCorpus();
  }
  return bylawsCache;
}

export async function loadAllCorpora(): Promise<{ finance: string; bylaws: string }> {
  const [finance, bylaws] = await Promise.all([loadFinanceCorpus(), loadBylawsCorpus()]);
  return { finance, bylaws };
}
