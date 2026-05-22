/**
 * Audit src/ for invalid JSX (historical <motion> typos) and run typecheck.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");
const BAD_PATTERNS = [
  /<motion[\s>]/g,
  /<\/motion>/g,
  /<motion\./g,
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, files);
    else if (/\.(tsx|jsx)$/.test(name.name)) files.push(p);
  }
  return files;
}

let failed = false;
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, "utf8");
  for (const re of BAD_PATTERNS) {
    re.lastIndex = 0;
    if (re.test(text)) {
      console.error(`Invalid JSX tag in ${path.relative(process.cwd(), file)}`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\nRun: npm run fix:src");
  process.exit(1);
}

console.log("src/ JSX audit: OK");
execSync("npm run typecheck", { stdio: "inherit" });
