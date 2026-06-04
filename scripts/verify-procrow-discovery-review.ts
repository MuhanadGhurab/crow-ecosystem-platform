/**
 * L6 — ProCrow discovery-to-blueprint review verifier.
 *
 *   npm run procrow-discovery:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/procrow/procrow-discovery-review-contract.ts",
  "src/lib/services/procrow-discovery-review.service.ts",
  "src/lib/actions/procrow-discovery-review.ts",
  "src/components/admin/admin-procrow-discovery-review-panel.tsx",
  "docs/internal/L6_DISCOVERY_TO_BLUEPRINT_PROCROW_REVIEW.md",
] as const;

const FORBIDDEN = [
  "platform_admin",
  "auto-provision",
  "live checkout",
  "production launch approved",
  "activate subscription",
  "automatic tenant provisioning",
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

  console.log("\n=== L6 ProCrow discovery review ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"procrow-discovery:verify"')) {
    pass = fail("package.json missing procrow-discovery:verify") && pass;
  } else {
    pass = ok("npm script procrow-discovery:verify") && pass;
  }

  const contract = fileText("src/lib/procrow/procrow-discovery-review-contract.ts");
  if (
    !contract.includes("accepted_into_blueprint") ||
    !contract.includes("ProCrowDiscoveryReviewSnapshot")
  ) {
    pass = fail("Review contract incomplete") && pass;
  } else {
    pass = ok("ProCrow discovery review contract") && pass;
  }

  const service = fileText("src/lib/services/procrow-discovery-review.service.ts");
  if (!service.includes("acceptClientDiscoveryIntoBlueprint")) {
    pass = fail("Review service must accept into blueprint") && pass;
  } else {
    pass = ok("ProCrow discovery review service") && pass;
  }

  if (service.includes("provisionTenant") || service.includes("completeDiscoveryAndCreateBlueprint")) {
    pass = fail("Accept must not auto-provision or auto-complete discovery") && pass;
  } else {
    pass = ok("Accept does not auto-provision tenant or auto-generate blueprint") && pass;
  }

  const actions = fileText("src/lib/actions/procrow-discovery-review.ts");
  if (!actions.includes("requireActionDiscoveryWrite") || !actions.includes("requirePlatformStaff")) {
    pass = fail("Actions must be platform-guarded") && pass;
  } else {
    pass = ok("ProCrow actions platform/admin guarded") && pass;
  }

  const clientActions = fileText("src/lib/actions/client-discovery.ts");
  if (
    clientActions.includes("acceptClientDiscoveryIntoBlueprint") ||
    clientActions.includes("requestClientDiscoveryChangesAction")
  ) {
    pass = fail("Client actions must not call ProCrow accept/request-change") && pass;
  } else {
    pass = ok("Client cannot call accept/request-change actions") && pass;
  }

  const adminPage = fileText("src/app/admin/requests/[requestId]/page.tsx");
  if (!adminPage.includes("AdminProcrowDiscoveryReviewPanel")) {
    pass = fail("Admin request page must include review panel") && pass;
  } else {
    pass = ok("Admin request page includes review panel") && pass;
  }

  const panel = fileText("src/components/admin/admin-procrow-discovery-review-panel.tsx");
  if (
    !panel.includes("Start review") ||
    !panel.includes("Request changes") ||
    !panel.includes("Accept into blueprint")
  ) {
    pass = fail("Review panel must expose all three actions") && pass;
  } else {
    pass = ok("Review panel actions present") && pass;
  }

  const wizard = fileText("src/components/client-portal/client-discovery-wizard.tsx");
  if (!wizard.includes("procrowChangeRequest") || !wizard.includes("procrowAcceptedMessage")) {
    pass = fail("Client wizard must handle changes_requested and accepted states") && pass;
  } else {
    pass = ok("Client discovery handles changes_requested and accepted_into_blueprint") && pass;
  }

  const readiness = fileText("src/lib/constants/runtime-readiness-wording.ts");
  if (!readiness.includes("accepted_into_blueprint")) {
    pass = fail("Runtime readiness must use accepted_into_blueprint gate") && pass;
  } else {
    pass = ok("Runtime readiness uses accepted_into_blueprint") && pass;
  }

  const surfaces = [service, actions, panel, contract].join("\n");
  for (const phrase of FORBIDDEN) {
    if (surfaces.includes(phrase)) {
      pass = fail(`Forbidden phrase in L6 surfaces: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden payment/provisioning/auth phrases in L6 surfaces") && pass;

  if (pass) console.log("\nPASS: ProCrow discovery-to-blueprint review (L6)");
  else console.error("\nFAIL: L6 checks failed");
  return pass;
}

process.exit(main() ? 0 : 1);
