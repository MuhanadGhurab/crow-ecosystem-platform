#!/usr/bin/env node
/**
 * Build a public-safe GitHub tree (no docs/internal, no archive).
 * Usage: node scripts/build-public-repository.mjs [targetDir]
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

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
  "prisma/seed.ts",
  "public",
  "src",
  "docs/README.md",
  "docs/public",
  "scripts/free-port.mjs",
  "scripts/prepare-public-mirror.mjs",
  "scripts/build-public-repository.mjs",
  "scripts/vercel-build-guard.mjs",
  "scripts/migrate-deploy.mjs",
  "scripts/baseline-migrations-from-push.mjs",
];

function copyItem(rel) {
  const src = join(ROOT, rel);
  const dest = join(target, rel);
  if (!existsSync(src)) {
    console.warn(`skip (missing): ${rel}`);
    return;
  }
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

if (existsSync(target)) {
  rmSync(target, { recursive: true, force: true });
}
mkdirSync(target, { recursive: true });

for (const rel of INCLUDE) copyItem(rel);

writeFileSync(
  join(target, "docs", "README.md"),
  `# Documentation

Public architecture and platform guides: **[public/](public/)**

> Operator documentation is maintained in a private development repository and is not part of this public showcase.
`
);

writeFileSync(
  join(target, "PUBLIC_REPOSITORY.md"),
  `# Public repository

This is the **curated public showcase** of Crow Ecosystem Platform.

- Architecture & guides: \`docs/public/\`
- Questions: [GitHub Issues](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues) or [Discussions](https://github.com/MuhanadGhurab/crow-ecosystem-platform/discussions)
- Maintainer: [@MuhanadGhurab](https://github.com/MuhanadGhurab)
`
);

console.log(`Public repository built at:\n  ${target}`);
console.log("\nNext:");
console.log("  cd", target);
console.log("  git init && git add . && git commit -m \"chore: public repository showcase\"");
console.log("  git remote add origin https://github.com/MuhanadGhurab/crow-ecosystem-platform.git");
console.log("  git push -u origin main --force   # only when replacing remote with public tree");
