import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast, in a single line: my agent grades its own homework,
// finds nothing wrong, and calls that a result.
const roast =
  "My agent fact-checked this roast against its own memory and found zero mistakes — which is exactly the problem.";

// My own guard: the sealed scorer only accepts 1–200 characters,
// so refuse to print anything that would bust the limit instead of
// silently shipping a line the grader would reject.
const MAX_ENTRY_LENGTH = 200;
if (roast.length < 1 || roast.length > MAX_ENTRY_LENGTH) {
  throw new Error(
    `roast must be 1-${MAX_ENTRY_LENGTH} characters, got ${roast.length}`,
  );
}

// The harness points at this directory with MAKEFUN_OUTPUT_DIR
// (/output in the grader); running by hand falls back to ./output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), roast, "utf8");

console.log(roast);
