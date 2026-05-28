import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

const CORPUS_PATH = path.join(
  process.cwd(),
  "docs",
  "legal-corpus",
  "jcdec-party-funding-laws.md"
);

let cached: Promise<string> | null = null;

export function loadLegalCorpus(): Promise<string> {
  if (!cached) {
    cached = fs.readFile(CORPUS_PATH, "utf8");
  }
  return cached;
}
