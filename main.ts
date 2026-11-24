import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One line, roasting my own AI agent: it outsources the joke, then
// outsources judging whether the joke worked.
const roast =
  "My agent spawned twelve subagents to write this roast, then asked me to check if it was funny.";

// The harness points at this directory with MAKEFUN_OUTPUT_DIR
// (/output in the grader); running by hand falls back to ./output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), roast, "utf8");

console.log(roast);
