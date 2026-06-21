/**
 * CLOUD.1B — repository scan for Supabase Data API vs Auth-only usage.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export type DataApiDependency = {
  file: string;
  line: number;
  pattern: string;
  tableOrRpc: string | null;
  operation: "read" | "create" | "update" | "delete" | "rpc" | "realtime" | "storage" | "unknown";
  runtime: "browser" | "server" | "operator" | "unknown";
  keyClass: "publishable" | "service_role" | "unknown";
  userJwtAttached: boolean;
  productionReachable: boolean;
};

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "coverage",
  "docs/internal/screenshots",
]);

const SOURCE_ROOTS = ["src", "scripts"];

const BUSINESS_DATA_API_PATTERNS: Array<{
  pattern: RegExp;
  kind: DataApiDependency["operation"];
}> = [
  { pattern: /supabase\.from\s*\(\s*['"`]/, kind: "read" },
  { pattern: /\.from\s*\(\s*['"`](?!public\/|Array\.from)/, kind: "read" },
  { pattern: /supabase\.rpc\s*\(/, kind: "rpc" },
  { pattern: /supabase\.channel\s*\(/, kind: "realtime" },
  { pattern: /postgres_changes/, kind: "realtime" },
  { pattern: /\/rest\/v1\//, kind: "read" },
  { pattern: /supabase\.storage\./, kind: "storage" },
];

const AUTH_SAFE_PATTERNS = [
  /\.auth\./,
  /auth\.admin\./,
  /signInWithPassword/,
  /signInWithOAuth/,
  /signUp/,
  /signOut/,
  /getUser/,
  /exchangeCodeForSession/,
  /resetPasswordForEmail/,
  /updateUser/,
  /refreshSession/,
  /inviteUserByEmail/,
  /listUsers/,
  /createUser/,
  /deleteUser/,
];

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(process.cwd(), full);
    if (SKIP_DIRS.has(entry) || rel.includes("node_modules")) continue;
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) out.push(full);
  }
}

function inferRuntime(file: string, text: string): DataApiDependency["runtime"] {
  if (file.includes("scripts/")) return "operator";
  if (text.includes('"use client"') || file.includes("/components/")) return "browser";
  if (
    text.includes('"server-only"') ||
    file.includes("/app/") ||
    file.includes("/lib/actions/") ||
    file.includes("/lib/services/")
  ) {
    return "server";
  }
  return "unknown";
}

function inferKeyClass(text: string): DataApiDependency["keyClass"] {
  if (text.includes("SUPABASE_SERVICE_ROLE_KEY") || text.includes("getSupabaseAdmin")) {
    return "service_role";
  }
  if (
    text.includes("getSupabaseAnonKey") ||
    text.includes("NEXT_PUBLIC_SUPABASE_ANON") ||
    text.includes("createBrowserClient") ||
    text.includes("createServerClient")
  ) {
    return "publishable";
  }
  return "unknown";
}

function extractTable(line: string): string | null {
  const m =
    line.match(/\.from\s*\(\s*['"`]([^'"`]+)['"`]/) ??
    line.match(/supabase\.from\s*\(\s*['"`]([^'"`]+)['"`]/);
  return m?.[1] ?? null;
}

function isAuthOnlyLine(line: string): boolean {
  return AUTH_SAFE_PATTERNS.some((p) => p.test(line));
}

const SKIP_AUDIT_TOOL_FILES =
  /(?:cloud-data-api-dependency-scan|probe-cloud-data-api-exposure|verify-cloud-data-api)/;

function isAuditMetaLine(line: string): boolean {
  if (/must not include \/rest\/v1\//i.test(line)) return true;
  if (/{ pattern:/.test(line) && /kind:/.test(line)) return true;
  if (line.includes("BUSINESS_DATA_API_PATTERNS")) return true;
  return false;
}

function isRestV1BusinessUsage(line: string): boolean {
  if (!/\/rest\/v1\//.test(line)) return false;
  return /fetch\s*\(|`\$\{.*\}\/rest\/v1\//.test(line);
}

function isFalsePositiveFrom(line: string): boolean {
  if (/Array\.from|Buffer\.from|timingSafeEqual|readFileSync|FormData|URLSearchParams/.test(line)) {
    return true;
  }
  if (/routes\.auth|cc-kbd|className=/.test(line)) return true;
  return false;
}

export function scanRepositoryForDataApiDependencies(): DataApiDependency[] {
  const files: string[] = [];
  for (const root of SOURCE_ROOTS) {
    walk(join(process.cwd(), root), files);
  }

  const deps: DataApiDependency[] = [];

  for (const file of files) {
    const rel = relative(process.cwd(), file).replace(/\\/g, "/");
    if (SKIP_AUDIT_TOOL_FILES.test(rel)) continue;
    const text = readFileSync(file, "utf8");
    const runtime = inferRuntime(rel, text);
    const keyClass = inferKeyClass(text);
    const lines = text.split("\n");

    lines.forEach((line, index) => {
      if (isFalsePositiveFrom(line)) return;
      if (isAuditMetaLine(line)) return;

      for (const { pattern, kind } of BUSINESS_DATA_API_PATTERNS) {
        if (!pattern.test(line)) continue;
        if (kind === "read" && /\/rest\/v1\//.test(line) && !isRestV1BusinessUsage(line)) {
          continue;
        }
        if (kind === "read" && line.includes(".from(") && isAuthOnlyLine(line)) continue;
        if (kind === "read" && line.includes(".from(") && isFalsePositiveFrom(line)) continue;

        deps.push({
          file: rel,
          line: index + 1,
          pattern: pattern.source,
          tableOrRpc: extractTable(line),
          operation: kind,
          runtime,
          keyClass,
          userJwtAttached: runtime === "browser" || line.includes("createServerClient"),
          productionReachable: rel.startsWith("src/"),
        });
      }
    });
  }

  return deps;
}

export type DependencyAuditSummary = {
  productionBusinessDataApiDependencies: number;
  browserBusinessDataApiDependencies: number;
  serverAnonKeyDataApiDependencies: number;
  serverServiceRoleDataApiDependencies: number;
  authOnlySupabaseDependencies: number;
  prismaDirectDatabaseDomains: number;
  businessDependencies: DataApiDependency[];
};

export function summarizeDependencyAudit(): DependencyAuditSummary {
  const deps = scanRepositoryForDataApiDependencies();
  const business = deps.filter(
    (d) =>
      d.operation !== "unknown" &&
      !(d.operation === "read" && d.tableOrRpc === null && d.pattern.includes("\\.from"))
  );

  let authOnlyCount = 0;
  const allFiles: string[] = [];
  for (const root of SOURCE_ROOTS) walk(join(process.cwd(), root), allFiles);
  for (const file of allFiles) {
    const text = readFileSync(file, "utf8");
    if (/\.auth\.|auth\.admin\./.test(text) && !text.includes("supabase.from(")) {
      authOnlyCount++;
    }
  }

  const prismaFiles = allFiles.filter((f) => {
    const t = readFileSync(f, "utf8");
    return t.includes('from "@/lib/db"') || t.includes("from '@/lib/db'") || /\bprisma\./.test(t);
  });

  return {
    productionBusinessDataApiDependencies: business.filter((d) => d.productionReachable).length,
    browserBusinessDataApiDependencies: business.filter((d) => d.runtime === "browser").length,
    serverAnonKeyDataApiDependencies: business.filter(
      (d) => d.runtime === "server" && d.keyClass === "publishable"
    ).length,
    serverServiceRoleDataApiDependencies: business.filter(
      (d) => d.keyClass === "service_role" && d.operation !== "unknown"
    ).length,
    authOnlySupabaseDependencies: authOnlyCount,
    prismaDirectDatabaseDomains: prismaFiles.length,
    businessDependencies: business,
  };
}
