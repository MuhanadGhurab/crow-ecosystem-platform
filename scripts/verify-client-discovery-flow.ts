/**
 * L4 — Client-led discovery foundation verifier.
 *
 *   npm run client-discovery:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertClientDiscoveryFieldRegistry,
  CLIENT_DISCOVERY_FIELD_REGISTRY,
} from "../src/lib/client-portal/client-discovery-contract";
import { CLIENT_DISCOVERY_STAGE_TEMPLATES } from "../src/lib/constants/client-discovery-stage-templates";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-discovery-contract.ts",
  "src/lib/constants/client-discovery-stage-templates.ts",
  "src/lib/services/client-discovery.service.ts",
  "src/lib/services/client-discovery-recommendations.ts",
  "src/lib/actions/client-discovery.ts",
  "src/app/client/requests/[requestId]/discovery/page.tsx",
  "src/components/client-portal/client-discovery-wizard.tsx",
  "src/components/admin/admin-client-discovery-panel.tsx",
  "docs/internal/L4_CLIENT_LED_DISCOVERY_BLUEPRINT_CONFIGURATION.md",
] as const;

const FORBIDDEN = [
  "automatic blueprint approval",
  "auto-provision",
  "live checkout",
  "platform_admin",
  "fully compliant",
  "ai-powered approval",
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

  for (const rel of REQUIRED_FILES) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing: ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  try {
    assertClientDiscoveryFieldRegistry();
    pass = ok("Discovery field registry complete") && pass;
  } catch (e) {
    pass = fail(String(e)) && pass;
  }

  const stages = CLIENT_DISCOVERY_STAGE_TEMPLATES.map((s) => s.key).sort().join(",");
  if (stages !== "enterprise,growth,startup") {
    pass = fail(`Expected startup/growth/enterprise templates, got: ${stages}`) && pass;
  } else {
    pass = ok("Startup/Growth/Enterprise stage templates") && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"client-discovery:verify"')) {
    pass = fail("package.json missing client-discovery:verify script") && pass;
  } else {
    pass = ok("npm script client-discovery:verify") && pass;
  }

  const discoveryPage = fileText("src/app/client/requests/[requestId]/discovery/page.tsx");
  if (!discoveryPage.includes("ClientDiscoveryWizard")) {
    pass = fail("Discovery route must render wizard") && pass;
  } else {
    pass = ok("Client discovery route exists") && pass;
  }

  const requestPage = fileText("src/app/client/requests/[requestId]/page.tsx");
  if (!requestPage.includes("requestDiscovery")) {
    pass = fail("Client request detail must link to discovery") && pass;
  } else {
    pass = ok("Client request detail links to discovery") && pass;
  }

  const companyPage = fileText("src/app/client/company/page.tsx");
  if (!companyPage.includes("requestDiscovery")) {
    pass = fail("Client company page must link missing fields to discovery") && pass;
  } else {
    pass = ok("Client company links to discovery") && pass;
  }

  const adminPage = fileText("src/app/admin/requests/[requestId]/page.tsx");
  if (
    !adminPage.includes("AdminProcrowDiscoveryReviewPanel") &&
    !adminPage.includes("buildProCrowDiscoveryReviewSnapshot")
  ) {
    pass = fail("Admin request page must surface client discovery review") && pass;
  } else {
    pass = ok("ProCrow request workspace shows discovery review") && pass;
  }

  const recs = fileText("src/lib/services/client-discovery-recommendations.ts");
  if (!recs.includes("getSectorTemplateModel") && !recs.includes("MODELED_SECTOR_CATALOG")) {
    pass = fail("Industry recommendations must use sector templates") && pass;
  } else {
    pass = ok("Industry template integration") && pass;
  }

  const employeeField = CLIENT_DISCOVERY_FIELD_REGISTRY.find((f) => f.key === "employeeBand");
  if (employeeField?.discoveryStep !== "company_size") {
    pass = fail("employeeBand must map to company_size discovery step") && pass;
  } else {
    pass = ok("Employee band tied to discovery step") && pass;
  }

  const discoveryService = fileText("src/lib/services/client-discovery.service.ts");
  if (!discoveryService.includes("resolveCanClientEditCompanyProfile")) {
    pass = fail("Discovery service must use ownership guard") && pass;
  } else {
    pass = ok("Server actions use ownership guard") && pass;
  }

  const actions = fileText("src/lib/actions/client-discovery.ts");

  if (!actions.includes("saveClientDiscoveryDraft")) {
    pass = fail("Missing saveClientDiscoveryDraftAction wiring") && pass;
  } else {
    pass = ok("Save draft action present") && pass;
  }

  if (/approveProposal|clientApprove|provisionTenant|tenantId.*update/i.test(actions)) {
    pass = fail("Discovery actions must not mutate approval/tenant/provisioning") && pass;
  } else {
    pass = ok("No forbidden approval/tenant mutations in actions") && pass;
  }

  const editService = fileText("src/lib/services/client-company-edit.service.ts");
  if (!editService.includes("linked_via_contact_email")) {
    pass = fail("Email-only reviewer must be blocked from edits") && pass;
  } else {
    pass = ok("Email-only reviewer blocked") && pass;
  }

  const companyFields = fileText("src/lib/client-portal/client-company-profile-fields.ts");
  if (!companyFields.includes("employeeBand")) {
    pass = fail("Company completeness registry must include employee band") && pass;
  } else {
    pass = ok("Company profile employee band in registry") && pass;
  }

  const surfaces = [
    discoveryPage,
    requestPage,
    fileText("src/components/client-portal/client-discovery-wizard.tsx"),
  ].join("\n");

  for (const phrase of FORBIDDEN) {
    if (surfaces.toLowerCase().includes(phrase)) {
      pass = fail(`Forbidden phrase in client discovery surfaces: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden overclaim phrases in discovery UI") && pass;

  if (pass) console.log("\nPASS: client-led discovery foundation (L4)");
  else console.error("\nFAIL: client discovery checks failed");
  return pass;
}

process.exit(main() ? 0 : 1);
