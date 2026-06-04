/**
 * L7 — Pricing package templates verifier.
 *
 *   npm run pricing-packages:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/pricing/pricing-package-contract.ts",
  "src/lib/constants/pricing-package-templates.ts",
  "src/lib/services/pricing-package-recommendation.service.ts",
  "src/lib/actions/pricing-package-preference.ts",
  "src/components/admin/admin-procrow-pricing-package-panel.tsx",
  "src/components/client-portal/client-pricing-package-panel.tsx",
  "docs/internal/L7_STARTUP_GROWTH_ENTERPRISE_PRICING_PACKAGES.md",
] as const;

const FORBIDDEN = [
  "platform_admin",
  "live checkout",
  "Pay now",
  "Subscribe now",
  "subscription active",
  "guaranteed price",
  "binding offer",
  "auto-provision",
  "production launch approved",
  "service_role",
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

  console.log("\n=== L7 Pricing package templates ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"pricing-packages:verify"')) {
    pass = fail("package.json missing pricing-packages:verify") && pass;
  } else {
    pass = ok("npm script pricing-packages:verify") && pass;
  }

  const templates = fileText("src/lib/constants/pricing-package-templates.ts");
  if (
    !templates.includes('startup') ||
    !templates.includes('growth') ||
    !templates.includes('enterprise')
  ) {
    pass = fail("Startup/Growth/Enterprise templates required") && pass;
  } else {
    pass = ok("Startup/Growth/Enterprise templates") && pass;
  }

  const service = fileText("src/lib/services/pricing-package-recommendation.service.ts");
  if (!service.includes("buildPricingPackageEstimateForRequest")) {
    pass = fail("Recommendation service must build estimates") && pass;
  } else {
    pass = ok("Pricing package recommendation service") && pass;
  }

  if (service.includes("provisionTenant") || service.includes("sendCommercialProposal")) {
    pass = fail("Service must not auto-provision or send proposal") && pass;
  } else {
    pass = ok("No auto-provision or proposal activation in service") && pass;
  }

  const adminPage = fileText("src/app/admin/requests/[requestId]/page.tsx");
  if (!adminPage.includes("AdminProcrowPricingPackagePanel")) {
    pass = fail("Admin request must include pricing package panel") && pass;
  } else {
    pass = ok("ProCrow pricing panel on admin request") && pass;
  }

  const clientRequest = fileText("src/app/client/requests/[requestId]/page.tsx");
  const clientProposal = fileText("src/app/client/proposals/[proposalId]/page.tsx");
  if (
    !clientRequest.includes("ClientPricingPackagePanel") &&
    !clientProposal.includes("ClientPricingPackagePanel")
  ) {
    pass = fail("Client package view required on request or proposal") && pass;
  } else {
    pass = ok("Client pricing package panel") && pass;
  }

  const publicPricing = fileText("src/app/(public)/pricing/page.tsx");
  if (!publicPricing.includes("PUBLIC_PRICING_PACKAGE_SUMMARY")) {
    pass = fail("Public pricing must reference advisory packages") && pass;
  } else {
    pass = ok("Public pricing package alignment") && pass;
  }

  const prefAction = fileText("src/lib/actions/pricing-package-preference.ts");
  if (!prefAction.includes("recordClientPackagePreference")) {
    pass = fail("Package preference action required") && pass;
  } else {
    pass = ok("Package preference via client action + review notes") && pass;
  }

  const surfaces = [
    service,
    templates,
    fileText("src/components/admin/admin-procrow-pricing-package-panel.tsx"),
    fileText("src/components/client-portal/client-pricing-package-panel.tsx"),
    publicPricing,
  ].join("\n");

  for (const phrase of FORBIDDEN) {
    if (surfaces.toLowerCase().includes(phrase.toLowerCase())) {
      pass = fail(`Forbidden phrase in L7 surfaces: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden payment/checkout/guarantee phrases in L7 surfaces") && pass;

  if (pass) console.log("\nPASS: pricing package templates (L7)");
  else console.error("\nFAIL: L7 checks failed");
  return pass;
}

process.exit(main() ? 0 : 1);
