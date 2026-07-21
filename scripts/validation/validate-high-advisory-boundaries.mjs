/**
 * GHV.IMPLEMENTATION.0B-CLOSURE-01
 * Fail CI if High/Critical advisories return, if sharp < 0.35.0 is installed,
 * or if next/image is introduced before a governed dependency review.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function walk(d, acc = []) {
  if (!existsSync(d)) return acc;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (["node_modules", ".next", "dist"].includes(e.name)) continue;
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const sourceRoots = ["apps", "packages", "workers", "scripts"];
const files = sourceRoots.flatMap((r) => walk(r));
const imageImportRe =
  /from\s+["']next\/image["']|require\(\s*["']next\/image["']\s*\)/;
const badImports = files.filter((f) => {
  if (f.endsWith("next-env.d.ts")) return false;
  if (f.includes(`${join("scripts", "validation")}`)) return false;
  return imageImportRe.test(readFileSync(f, "utf8"));
});
if (badImports.length > 0) {
  console.error(
    "validate:high-advisory-boundaries: forbidden next/image imports:\n" +
      badImports.join("\n"),
  );
  process.exit(1);
}

/** Single-string shell form avoids DEP0190 arg-concatenation warning; command is fixed. */
const auditProc = spawnSync("npm audit --json", {
  encoding: "utf8",
  shell: true,
  windowsHide: true,
});
if (auditProc.error) {
  console.error(
    "validate:high-advisory-boundaries: npm audit failed to start:",
    auditProc.error.message,
  );
  process.exit(1);
}
if (auditProc.status !== 0 && !(auditProc.stdout || "").trim()) {
  console.error(
    "validate:high-advisory-boundaries: npm audit failed:",
    auditProc.stderr || `exit ${auditProc.status}`,
  );
  process.exit(1);
}

let audit;
try {
  audit = JSON.parse(auditProc.stdout || "{}");
} catch (err) {
  console.error(
    "validate:high-advisory-boundaries: could not parse npm audit JSON:",
    err instanceof Error ? err.message : String(err),
  );
  process.exit(1);
}

const vulns = audit.vulnerabilities ?? {};
const highOrCritical = Object.entries(vulns).filter(([, v]) =>
  ["high", "critical"].includes(v.severity),
);

if (highOrCritical.length > 0) {
  console.error(
    "validate:high-advisory-boundaries: High/Critical advisories present:",
    highOrCritical.map(([n, v]) => `${n}:${v.severity}`).join(", "),
  );
  process.exit(1);
}

const totals = audit.metadata?.vulnerabilities ?? {};
if ((totals.critical ?? 0) > 0 || (totals.high ?? 0) > 0) {
  console.error(
    "validate:high-advisory-boundaries: Critical/High advisory totals must be 0:",
    totals,
  );
  process.exit(1);
}

const sharpPkgPath = join("node_modules", "sharp", "package.json");
if (existsSync(sharpPkgPath)) {
  const sharpVer = JSON.parse(readFileSync(sharpPkgPath, "utf8")).version;
  const [maj, min] = sharpVer.split(".").map(Number);
  if (maj === 0 && min < 35) {
    console.error(
      `validate:high-advisory-boundaries: sharp ${sharpVer} is below fixed 0.35.0 (GHSA-f88m-g3jw-g9cj)`,
    );
    process.exit(1);
  }
  console.log(`sharp installed at ${sharpVer} (>= 0.35.0)`);
} else {
  console.log("sharp not installed");
}

console.log(
  "validate:high-advisory-boundaries OK — no next/image imports; High/Critical=0",
);
