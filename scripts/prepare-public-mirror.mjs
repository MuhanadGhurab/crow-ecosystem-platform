#!/usr/bin/env node
/**
 * Lists files safe to copy into a public GitHub mirror.
 * Usage: node scripts/prepare-public-mirror.mjs [targetDir]
 *
 * Does NOT copy automatically — review output, then rsync/robocopy manually.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const target = process.argv[2] ?? join(ROOT, "..", "crow-ecosystem-public");

const INCLUDE = [
  "README.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "SECURITY.md",
  ".env.example",
  ".gitignore",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
  "tailwind.config.ts",
  "vercel.json",
  "prisma.config.ts",
  "prisma/schema.prisma",
  "prisma/migrations",
  "public",
  "src",
  "docs/SECDEVOPS.md",
  "docs/AI_PLATFORM.md",
  "docs/MULTI_TENANT.md",
  "docs/ARCHITECTURE.md",
  "docs/PLATFORM_ENGINES.md",
  "docs/LIFECYCLE.md",
  "docs/CEM.md",
  "docs/CYBERCROW.md",
  "docs/SAREA.md",
  "docs/ROADMAP.md",
  "docs/PHILOSOPHY.md",
  "docs/PUBLIC_GITHUB.md",
  "docs/assets",
  "scripts/free-port.mjs",
];

const EXCLUDE_ALWAYS = [
  ".env",
  ".env.local",
  "docs/customers",
  "docs/archive",
  "docs/CYBERCROW_MASTER_CONTEXT.md",
  "archive",
  "node_modules",
  ".next",
  ".git",
];

const manifest = {
  generated: new Date().toISOString(),
  targetDir: target,
  include: INCLUDE,
  excludeAlways: EXCLUDE_ALWAYS,
  notes: [
    "Run rg for secrets before push — see docs/PUBLIC_GITHUB.md",
    "Replace live MEEM IDs with mock-* in any copied internal doc",
    "Set package.json private:false on public mirror if publishing OSS",
  ],
};

mkdirSync(target, { recursive: true });
const outPath = join(target, "PUBLIC_MIRROR_MANIFEST.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2));

console.log("Public mirror manifest written to:");
console.log(outPath);
console.log("\nInclude paths (" + INCLUDE.length + "):");
INCLUDE.forEach((p) => console.log("  +", p));
console.log("\nAlways exclude:");
EXCLUDE_ALWAYS.forEach((p) => console.log("  -", p));
console.log("\nNext: copy files manually or extend this script with fs.cpSync.");
