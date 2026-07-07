#!/usr/bin/env tsx
/**
 * CROW.PUBLIC.PROD — post-deploy public route smoke (read-only HTTP).
 */
const BASE = (process.env.CROW_PUBLIC_PROD_BASE_URL ?? "https://crow-ecosystem-platform.vercel.app").replace(
  /\/$/,
  ""
);

const PUBLIC_ROUTES = [
  "/",
  "/how-crow-works",
  "/new-organization",
  "/transform-existing",
  "/enterprise-blueprint",
  "/platform",
  "/platform/cem",
  "/platform/cybercrow",
  "/platform/sarea",
  "/platform/procrow",
  "/security",
  "/industries",
  "/pricing",
  "/start",
  "/request",
  "/login",
  "/signup",
] as const;

const LEGACY_REDIRECTS: Array<{ from: string; to: string }> = [
  { from: "/architecture", to: "/how-crow-works" },
  { from: "/modules", to: "/platform/cem" },
  { from: "/services", to: "/how-crow-works" },
  { from: "/clients", to: "/industries" },
  { from: "/loyalty-programs", to: "/how-crow-works" },
  { from: "/experience/architects-map", to: "/how-crow-works" },
  { from: "/experience/architects-map/article", to: "/how-crow-works" },
];

const GATED_ROUTES = ["/client/requests"] as const;

function ok(msg: string) {
  console.log(`  ✓ ${msg}`);
}

function fail(msg: string): never {
  console.error(`  ✗ ${msg}`);
  process.exit(1);
}

async function get(path: string, redirect: RequestRedirect = "manual") {
  const res = await fetch(`${BASE}${path}`, { redirect, headers: { "User-Agent": "crow-public-prod-smoke/1.0" } });
  const text = res.status === 200 ? await res.text() : "";
  return { status: res.status, location: res.headers.get("location"), text };
}

async function main() {
  console.log(`\n=== CROW.PUBLIC.PROD smoke — ${BASE} ===\n`);

  for (const path of PUBLIC_ROUTES) {
    const res = await get(path);
    if (res.status !== 200) fail(`${path} expected 200, got ${res.status}`);
    ok(`${path} → 200`);
  }

  for (const { from, to } of LEGACY_REDIRECTS) {
    const res = await get(from);
    const acceptable = res.status === 307 || res.status === 308 || res.status === 301 || res.status === 302;
    if (!acceptable) fail(`${from} expected redirect, got ${res.status}`);
    const loc = res.location ?? "";
    if (!loc.includes(to)) fail(`${from} redirect location ${loc} missing ${to}`);
    ok(`${from} → ${to}`);
  }

  for (const path of GATED_ROUTES) {
    const res = await get(path);
    const gated = res.status === 307 || res.status === 302 || res.status === 308;
    if (!gated) fail(`${path} expected auth redirect, got ${res.status}`);
    ok(`${path} gated (${res.status})`);
  }

  const home = await get("/");
  const markers = [
    "pv2-signature-hero",
    "pv2-btn-journey",
    "pv2-btn-transform",
    "data-pv2-locked-design",
    "Operating Model",
    "Build a New Organization",
    "Transform an Existing Organization",
  ];
  for (const m of markers) {
    if (!home.text.includes(m)) fail(`homepage missing marker: ${m}`);
    ok(`homepage marker: ${m}`);
  }
  if (home.text.includes("Architect's Map") || home.text.includes("architects-map-hero")) {
    fail("homepage still exposes legacy Architect's Map surface");
  }
  ok("homepage has no legacy Architect's Map hero");

  const request = await get("/request");
  if (!request.text.includes("sign in") && !request.text.includes("Sign in")) {
    fail("/request missing sign-in gating copy");
  }
  ok("/request public explanation with sign-in gating copy");

  const login = await get("/login");
  if (!login.text.includes("pv2-auth") && !login.text.includes("public-v2-bright")) {
    fail("/login missing semi-dark public auth frame markers");
  }
  ok("/login semi-dark auth frame present");

  console.log("\nPASS — CROW.PUBLIC.PROD smoke\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
