import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export type RouteClass =
  | "public"
  | "auth"
  | "activation"
  | "legal"
  | "account"
  | "client"
  | "request"
  | "discovery"
  | "blueprint-client"
  | "admin"
  | "procrow"
  | "studio"
  | "tenant-runtime"
  | "api"
  | "legacy"
  | "error";

export type DiscoveredRoute = {
  pattern: string;
  modulePath: string;
  kind: "page" | "route";
  routeClass: RouteClass;
  requiresLoading: boolean;
  hasLoading: boolean;
  hasPageOrHandler: boolean;
};

const ROOT = join(process.cwd(), "src", "app");

const REQUIRED_LOADING_PATTERNS = [
  "/",
  "/request",
  "/signup",
  "/login",
  "/auth/resolving",
  "/account",
  "/onboarding/legal",
  "/register/legal",
  "/client",
  "/client/requests",
  "/client/requests/new",
  "/client/requests/[requestId]/confirmation",
  "/client/requests/[requestId]",
  "/client/requests/[requestId]/discovery/design",
  "/client/requests/[requestId]/discovery/compare",
  "/client/requests/[requestId]/discovery/summary",
  "/client/requests/[requestId]/blueprint",
  "/admin/overview",
  "/admin/requests",
  "/admin/model-forge",
  "/admin/tenant-studio",
  "/admin/blueprint-studio",
  "/admin/blueprints",
] as const;

function segmentToPattern(segment: string): string {
  if (segment.startsWith("(") && segment.endsWith(")")) return "";
  if (segment.startsWith("[") && segment.endsWith("]")) return `[${segment.slice(1, -1)}]`;
  return segment;
}

function hasLoadingBoundary(segments: string[]): boolean {
  for (let i = segments.length; i >= 0; i--) {
    const dir = i === 0 ? ROOT : join(ROOT, ...segments.slice(0, i));
    if (existsSync(join(dir, "loading.tsx"))) return true;
  }
  return false;
}

function walk(dir: string, segments: string[], out: DiscoveredRoute[]): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    const nextSegments = [...segments, name];
    const pagePath = join(full, "page.tsx");
    const routePath = join(full, "route.ts");
    const patternParts = nextSegments.map(segmentToPattern).filter(Boolean);
    const pattern = "/" + patternParts.join("/");

    if (existsSync(pagePath)) {
      out.push({
        pattern: pattern || "/",
        modulePath: relative(process.cwd(), pagePath).replace(/\\/g, "/"),
        kind: "page",
        routeClass: classifyRoute(pattern || "/"),
        requiresLoading: REQUIRED_LOADING_PATTERNS.includes(pattern as (typeof REQUIRED_LOADING_PATTERNS)[number]),
        hasLoading: hasLoadingBoundary(nextSegments),
        hasPageOrHandler: true,
      });
    }
    if (existsSync(routePath)) {
      out.push({
        pattern: pattern || "/",
        modulePath: relative(process.cwd(), routePath).replace(/\\/g, "/"),
        kind: "route",
        routeClass: classifyRoute(pattern || "/"),
        requiresLoading: false,
        hasLoading: false,
        hasPageOrHandler: true,
      });
    }
    walk(full, nextSegments, out);
  }
}

function classifyRoute(pattern: string): RouteClass {
  if (pattern.startsWith("/api")) return "api";
  if (pattern.startsWith("/auth")) return "auth";
  if (pattern.startsWith("/admin")) return pattern.includes("blueprint-studio") || pattern.includes("model-forge") || pattern.includes("tenant-studio") ? "studio" : "admin";
  if (pattern.startsWith("/client/requests") && pattern.includes("/discovery")) return "discovery";
  if (pattern.startsWith("/client/requests")) return "request";
  if (pattern.startsWith("/client")) return "client";
  if (pattern.startsWith("/account") || pattern.startsWith("/onboarding") || pattern.startsWith("/register") || pattern.startsWith("/verify-email")) return pattern.includes("legal") ? "legal" : "activation";
  if (pattern.startsWith("/legal")) return "legal";
  if (pattern.startsWith("/blueprints") || pattern.includes("/blueprint")) return "blueprint-client";
  if (pattern.startsWith("/[tenant]")) return "tenant-runtime";
  if (pattern.startsWith("/portal") || pattern.startsWith("/discovery/")) return "legacy";
  if (pattern === "/login" || pattern === "/signup") return "auth";
  return "public";
}

export function discoverActiveRoutes(): DiscoveredRoute[] {
  const routes: DiscoveredRoute[] = [];
  walk(ROOT, [], routes);
  return routes.sort((a, b) => a.pattern.localeCompare(b.pattern));
}

export function verifyRouteInventory(): {
  routes: DiscoveredRoute[];
  missingLoading: string[];
  brokenModules: string[];
} {
  const routes = discoverActiveRoutes();
  const missingLoading = routes
    .filter((r) => r.requiresLoading && !r.hasLoading)
    .map((r) => r.pattern);
  const brokenModules = routes
    .filter((r) => !existsSync(join(process.cwd(), r.modulePath)))
    .map((r) => r.modulePath);

  for (const route of routes) {
    if (existsSync(join(process.cwd(), route.modulePath))) {
      const src = readFileSync(join(process.cwd(), route.modulePath), "utf8");
      if (src.trim().length === 0) brokenModules.push(route.modulePath);
    }
  }

  return { routes, missingLoading, brokenModules };
}

export function requiredLoadingPatterns(): readonly string[] {
  return REQUIRED_LOADING_PATTERNS;
}
