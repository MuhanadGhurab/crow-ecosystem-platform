/**
 * M2.0 — Vercel build memory / OOM guard verifier.
 *
 *   npm run build-memory:verify
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const SERVER_ONLY_SERVICES = [
  "src/lib/services/sarea-experience-mapping.service.ts",
  "src/lib/sarea/sarea-experience-go-no-go.ts",
  "src/lib/sarea/sarea-experience-studio-loader.ts",
  "src/lib/services/cybercrow-tenant-trust.service.ts",
  "src/lib/services/procrow-go-no-go.service.ts",
] as const;

const STUDIO_PAGES = [
  "src/app/sarea/overview/page.tsx",
  "src/app/sarea/navigation/page.tsx",
  "src/app/sarea/profiles/page.tsx",
  "src/app/sarea/role-mapping/page.tsx",
  "src/app/sarea/preview/page.tsx",
  "src/app/sarea/widgets/page.tsx",
] as const;

const FORBIDDEN_CLIENT_IMPORTS = [
  "sarea-experience-mapping.service",
  "@/lib/services/sarea-experience-mapping.service",
  "sarea-experience-studio-loader",
  "sarea-experience-go-no-go",
  "cybercrow-tenant-trust.service",
  "@/lib/services/cybercrow-tenant-trust.service",
  "procrow-go-no-go.service",
] as const;

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function walkTsx(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkTsx(full, out);
    else if (name.endsWith(".tsx") || name.endsWith(".ts")) out.push(full);
  }
  return out;
}

function relFromRoot(abs: string): string {
  return abs.replace(ROOT + "\\", "").replace(ROOT + "/", "").replace(/\\/g, "/");
}

function main(): boolean {
  let pass = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      pass = false;
    }
  };

  console.log("\n=== M2.0 Vercel build memory guard ===\n");

  const nextConfigPath = existsSync(join(ROOT, "next.config.ts"))
    ? "next.config.ts"
    : existsSync(join(ROOT, "next.config.mjs"))
      ? "next.config.mjs"
      : null;
  check(nextConfigPath !== null, "next.config present", "Missing next.config.ts or .mjs");

  if (nextConfigPath) {
    const nextCfg = fileText(nextConfigPath);
    check(
      nextCfg.includes("webpackMemoryOptimizations"),
      "experimental.webpackMemoryOptimizations enabled",
      "Enable experimental.webpackMemoryOptimizations in next.config"
    );
    check(
      nextCfg.includes("productionBrowserSourceMaps: false"),
      "productionBrowserSourceMaps disabled",
      "Set productionBrowserSourceMaps: false"
    );
    check(
      !nextCfg.includes("ignoreBuildErrors"),
      "No typescript ignoreBuildErrors suppression",
      "Remove ignoreBuildErrors from next.config"
    );
    check(
      nextCfg.includes("serverExternalPackages"),
      "serverExternalPackages configured for Prisma",
      "Externalize @prisma/client and prisma in next.config"
    );
    check(
      nextCfg.includes("VERCEL") && nextCfg.includes("webpackBuildWorker: false"),
      "Vercel build disables webpackBuildWorker",
      "Set webpackBuildWorker: false when VERCEL=1 to avoid dual-process OOM on 8 GB builders"
    );
    check(
      nextCfg.includes("cpus: 1"),
      "Vercel build limits compile parallelism (cpus: 1)",
      "Set experimental.cpus: 1 when VERCEL=1"
    );
  }

  const pkg = fileText("package.json");
  check(pkg.includes('"build-memory:verify"'), "package.json defines build-memory:verify", "Add build-memory:verify script");
  check(
    pkg.includes("next-build-with-memory.mjs"),
    "build script uses next-build-with-memory.mjs",
    "Wire build to scripts/next-build-with-memory.mjs"
  );
  check(existsSync(join(ROOT, "scripts/next-build-with-memory.mjs")), "next-build-with-memory.mjs exists", "Add memory wrapper script");

  const memScript = fileText("scripts/next-build-with-memory.mjs");
  check(
    memScript.includes("heapMb") && memScript.includes("4096") && memScript.includes("6144"),
    "Vercel-aware heap ceilings (4096 Vercel / 6144 local)",
    "Set 4096 MB heap on VERCEL=1 and 6144 MB locally in next-build-with-memory.mjs"
  );

  for (const rel of SERVER_ONLY_SERVICES) {
    check(existsSync(join(ROOT, rel)), `Found ${rel}`, `Missing ${rel}`);
    if (existsSync(join(ROOT, rel))) {
      check(fileText(rel).includes('import "server-only"'), `${rel} has server-only`, `Add server-only to ${rel}`);
    }
  }

  for (const rel of STUDIO_PAGES) {
    const t = fileText(rel);
    check(
      t.includes("sarea-experience-studio-loader"),
      `${rel} uses studio loader`,
      `${rel} must import studio snapshot via sarea-experience-studio-loader`
    );
    check(
      !t.includes("sarea-experience-mapping.service"),
      `${rel} avoids direct mapping service import`,
      `${rel} must not import sarea-experience-mapping.service directly`
    );
    check(t.includes('dynamic = "force-dynamic"'), `${rel} is force-dynamic`, `Add force-dynamic to ${rel}`);
  }

  const goNoGoPage = fileText("src/app/admin/go-no-go/page.tsx");
  check(
    goNoGoPage.includes("sarea-experience-go-no-go"),
    "Go/No-Go uses lightweight SAREA dependency module",
    "Import buildSareaExperienceGoNoGoDependency from sarea-experience-go-no-go"
  );
  check(
    !goNoGoPage.includes("sarea-experience-mapping.service"),
    "Go/No-Go avoids heavy mapping service",
    "Remove mapping service import from go-no-go page"
  );

  const procrowPanel = fileText("src/components/procrow/procrow-sarea-experience-go-no-go-panel.tsx");
  check(
    procrowPanel.includes("sarea-experience-mapping-contract"),
    "Go/No-Go panel types from contract only",
    "Procrow SAREA panel must import types from contract"
  );

  const componentsDir = join(ROOT, "src/components");
  const clientFiles = walkTsx(componentsDir).filter((abs) => {
    const t = readFileSync(abs, "utf8");
    return t.startsWith('"use client"') || t.startsWith("'use client'");
  });

  for (const abs of clientFiles) {
    const rel = relFromRoot(abs);
    const t = readFileSync(abs, "utf8");
    for (const bad of FORBIDDEN_CLIENT_IMPORTS) {
      if (t.includes(bad)) {
        check(false, "", `"use client" file ${rel} imports forbidden server module: ${bad}`);
      }
    }
  }
  if (pass) ok("No client components import Prisma/heavy SAREA/CyberCrow services");

  let staged = "";
  try {
    staged = execSync("git diff --cached --name-only", { cwd: ROOT, encoding: "utf8" });
  } catch {
    staged = "";
  }
  const stagedPaths = staged.split(/\r?\n/).filter(Boolean);
  check(
    !stagedPaths.some((p) => p.includes(".heapprofile")),
    "No staged .heapprofile artifacts",
    "Unstage .heapprofile before commit"
  );
  check(
    !stagedPaths.some((p) => p.startsWith(".next")),
    "No staged .next artifacts",
    "Unstage .next before commit"
  );

  check(
    existsSync(join(ROOT, "docs/internal/M2_0_VERCEL_BUILD_OOM_OPTIMIZATION.md")),
    "M2.0 optimization doc present",
    "Add docs/internal/M2_0_VERCEL_BUILD_OOM_OPTIMIZATION.md"
  );

  console.log(pass ? "\nPASS: M2.0 build memory guard\n" : "\nFAIL: M2.0 build memory guard\n");
  return pass;
}

process.exit(main() ? 0 : 1);
