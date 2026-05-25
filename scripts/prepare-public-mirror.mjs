#!/usr/bin/env node
/**
 * Lists files safe to copy into a public GitHub mirror.
 * Usage: node scripts/prepare-public-mirror.mjs [targetDir]
 */
import { mkdirSync, writeFileSync } from "node:fs";
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
  "docs/README.md",
  "docs/public",
  "scripts/free-port.mjs",
];

/** docs/internal is private strategy — never copy to public mirror. */
const EXCLUDE_ALWAYS = [
  ".env",
  ".env.local",
  "docs/internal",
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
    "Public docs live in docs/public/ only",
    "Never copy docs/internal/ to a public mirror",
    "Run rg for secrets before push — see docs/internal/PUBLIC_GITHUB.md",
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
