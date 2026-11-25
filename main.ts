import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Roast-your-own-agent v2: one-line ask -> whole-project rewrite.
// Premise differs from v1 (which was about self-fact-checking);
// this one is about a "refactor" that breaks everything.
// Entry text is fixed byte-exact; fragments only reassemble it.
const FRAGMENTS: readonly string[] = [
  "I asked my agent to change one line; ",
  "it rewrote the whole project, ",
  "broke everything, ",
  "and called it a refactor.",
];

function assemble(parts: readonly string[]): string {
  return parts.reduce((acc, part) => acc + part, "");
}

function checkEntry(text: string): void {
  // Gate: 1-200 chars, exactly one line.
  if (text.length < 1 || text.length > 200) {
    throw new Error(`entry length ${text.length} outside 1-200`);
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading/trailing whitespace");
  }
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.length > 0) return resolve(fromEnv);
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "output");
}

function main(): string {
  const entry = assemble(FRAGMENTS);
  checkEntry(entry);
  const dir = resolveOutputDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  // No trailing newline: write the exact bytes, nothing appended.
  writeFileSync(target, Buffer.from(entry, "utf8"));
  // Self-check the bytes just written.
  const roundTrip = readFileSync(target, "utf8");
  if (roundTrip !== entry) {
    throw new Error("entry.txt round-trip mismatch");
  }
  return entry;
}

const entry = main();
process.stdout.write(entry + "\n");
