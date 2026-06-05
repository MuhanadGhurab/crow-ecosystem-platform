/**
 * L5 — Access gateway & portal role model verifier.
 *
 *   npm run access-gateway:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/portal/portal-access-contract.ts",
  "src/lib/services/portal-access.service.ts",
  "src/app/access/page.tsx",
  "src/components/portal/portal-access-gateway.tsx",
  "docs/internal/L5_ACCESS_GATEWAY_PORTAL_ROLE_MODEL.md",
] as const;

const FORBIDDEN = [
  "platform_admin",
  "activate subscription",
  "live checkout",
  "production launch approved",
  "automatic tenant provisioning",
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

function main(): boolean {
  let pass = true;

  console.log("\n=== L5 Access gateway ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"access-gateway:verify"')) {
    pass = fail("package.json missing access-gateway:verify") && pass;
  } else {
    pass = ok("npm script access-gateway:verify") && pass;
  }

  const contract = fileText("src/lib/portal/portal-access-contract.ts");
  if (!contract.includes("CrowPortalKind") || !contract.includes("client")) {
    pass = fail("Portal contract must define portal kinds") && pass;
  } else {
    pass = ok("Portal access contract") && pass;
  }

  const service = fileText("src/lib/services/portal-access.service.ts");
  if (!service.includes("buildCrowAccessGatewaySnapshot")) {
    pass = fail("portal-access.service must build gateway snapshot") && pass;
  } else {
    pass = ok("Portal access service") && pass;
  }

  if (!service.includes("isClient(role)") || !service.includes('kind: "procrow"')) {
    pass = fail("ProCrow must be hidden from client-only users") && pass;
  } else {
    pass = ok("ProCrow not exposed to clients") && pass;
  }

  if (!service.includes("tenant_admin") || !service.includes("tenantSlugs")) {
    pass = fail("Business portal requires tenant access") && pass;
  } else {
    pass = ok("Business portal requires tenant access") && pass;
  }

  const landing = fileText("src/lib/auth/post-login-redirect.ts");
  if (!landing.includes("routes.access") || !landing.includes("shouldRouteToAccessGateway")) {
    pass = fail("Post-login must route multi-portal users to /access") && pass;
  } else {
    pass = ok("Post-login uses access gateway for multiple portals") && pass;
  }

  const header = fileText("src/components/public/public-header.tsx");
  if (!header.includes("getAuthenticatedPortalCta")) {
    pass = fail("Public header must use portal CTA") && pass;
  } else {
    pass = ok("Public header role-aware CTA") && pass;
  }

  const lite = fileText("src/lib/portal/portal-access-lite.ts");
  const hasOpenWorkspaceCta =
    landing.includes("Open workspace") || lite.includes("Open workspace");
  if (!hasOpenWorkspaceCta) {
    pass = fail("Multi-portal CTA should offer Open workspace → /access") && pass;
  } else {
    pass = ok("Open workspace CTA for multiple portals") && pass;
  }

  if (!existsSync(join(ROOT, "src/lib/portal/portal-access-lite.ts"))) {
    pass = fail("portal-access-lite.ts required for lightweight header/post-login") && pass;
  } else {
    pass = ok("portal-access-lite split present") && pass;
  }

  const protection = fileText("src/lib/auth/route-protection.ts");
  if (!protection.includes('"/access"')) {
    pass = fail("/access must be a public path") && pass;
  } else {
    pass = ok("/access is public (sign-in gateway)") && pass;
  }

  const surfaces = [
    fileText("src/app/access/page.tsx"),
    service,
    contract,
    landing,
  ].join("\n");

  for (const phrase of FORBIDDEN) {
    if (surfaces.includes(phrase)) {
      pass = fail(`Forbidden phrase in L5 surfaces: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden payment/provisioning claims in gateway surfaces") && pass;

  const signup = fileText("src/app/signup/page.tsx");
  const requestRel = "src/app/(public)/request/page.tsx";
  const requestPage = existsSync(join(ROOT, requestRel)) ? fileText(requestRel) : "";
  const hasSignupRequestFlow =
    signup.includes("routes.public.request") ||
    signup.includes("/request") ||
    requestPage.includes("routes.auth.signup") ||
    requestPage.includes("/signup");
  if (!hasSignupRequestFlow) {
    pass = fail("/request signup flow must remain") && pass;
  } else {
    pass = ok("/request auth-gated to signup pattern preserved") && pass;
  }

  if (pass) console.log("\nPASS: access gateway portal model (L5)");
  else console.error("\nFAIL: access gateway checks failed");
  return pass;
}

process.exit(main() ? 0 : 1);
