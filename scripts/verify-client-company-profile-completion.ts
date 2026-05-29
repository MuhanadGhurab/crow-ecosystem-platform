/**
 * K2.6 — Client company profile completion (safe edits + field-action registry).
 *
 *   npm run client-company-profile:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertClientCompanyCompletenessRegistry,
  CLIENT_COMPANY_COMPLETENESS_REGISTRY,
  CLIENT_PORTAL_EMPLOYEE_BAND_OPTIONS,
} from "../src/lib/client-portal/client-company-profile-fields";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "src/lib/client-portal/client-company-profile-fields.ts",
  "src/lib/client-portal/company-link-status-label.ts",
  "src/lib/services/client-company-edit.service.ts",
  "src/lib/actions/client-profile.ts",
  "src/components/client-portal/client-company-complete-form.tsx",
  "src/app/client/company/page.tsx",
] as const;

const FORBIDDEN_PHRASES = [
  "linked via linked via",
  "live payments enabled",
  "auto-provision",
  "platform_admin",
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
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing required file: ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  try {
    assertClientCompanyCompletenessRegistry();
    pass = ok("Completeness field registry: every field has edit action or blockedReason") && pass;
  } catch (e) {
    pass = fail(`Registry assertion: ${e instanceof Error ? e.message : String(e)}`) && pass;
  }

  const employeeBand = CLIENT_COMPANY_COMPLETENESS_REGISTRY.find((f) => f.key === "employeeBand");
  if (!employeeBand?.editableByClient) {
    pass = fail("employeeBand must be editableByClient in registry") && pass;
  } else {
    pass = ok("employeeBand is client-editable in registry") && pass;
  }

  if (CLIENT_PORTAL_EMPLOYEE_BAND_OPTIONS.length < 5) {
    pass = fail("Expected at least 5 employee band options for client portal") && pass;
  } else {
    pass = ok("Client portal employee band options defined") && pass;
  }

  const companyPage = fileText("src/app/client/company/page.tsx");
  const completeForm = fileText("src/components/client-portal/client-company-complete-form.tsx");

  if (!completeForm.includes("Complete missing information")) {
    pass = fail("Company completion UI must include Complete missing information section") && pass;
  } else {
    pass = ok("Complete missing information action present") && pass;
  }

  if (!companyPage.includes("ClientCompanyCompleteForm")) {
    pass = fail("/client/company must render ClientCompanyCompleteForm") && pass;
  } else {
    pass = ok("/client/company renders company completion form") && pass;
  }

  if (!companyPage.includes("formatCompanyLinkStatusLabel")) {
    pass = fail("/client/company must use formatCompanyLinkStatusLabel (no duplicate Linked via)") && pass;
  } else {
    pass = ok("/client/company uses link status label helper") && pass;
  }

  for (const phrase of FORBIDDEN_PHRASES) {
    if (companyPage.toLowerCase().includes(phrase.toLowerCase())) {
      pass = fail(`Forbidden phrase in company page: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden duplicate link copy on company page") && pass;

  const actions = fileText("src/lib/actions/client-profile.ts");
  if (!actions.includes("updateClientCompanySafeFields")) {
    pass = fail("client-profile actions must export updateClientCompanySafeFields") && pass;
  } else {
    pass = ok("Server action updateClientCompanySafeFields present") && pass;
  }

  if (!actions.includes("resolveCanClientEditCompanyProfile")) {
    pass = fail("Company update action must use resolveCanClientEditCompanyProfile ownership guard") && pass;
  } else {
    pass = ok("Company update uses ownership guard") && pass;
  }

  if (!actions.includes("CLIENT_PORTAL_EMPLOYEE_BAND_VALUES") && !actions.includes("employee_band")) {
    pass = fail("Company update must validate employee_band allowlist") && pass;
  } else {
    pass = ok("Company update validates employee band allowlist") && pass;
  }

  if (/proposalStatus|tenantId|approveProposal|clientApprove|provisionTenant/i.test(actions)) {
    const updateBlock = actions.slice(actions.indexOf("updateClientCompanySafeFields"));
    if (/proposalStatus|tenantId|approveProposal|clientApprove|provisionTenant/i.test(updateBlock)) {
      pass =
        fail("Company profile update must not mutate approval/proposal/tenant/provisioning") && pass;
    }
  }
  pass = ok("Company profile update avoids approval/tenant/provisioning mutations") && pass;

  if (actions.includes('crow_role: "platform_admin"') || actions.includes("crow_role: 'platform_admin'")) {
    pass = fail("Company profile action must not assign platform_admin") && pass;
  } else {
    pass = ok("No platform_admin assignment in company profile action") && pass;
  }

  const editService = fileText("src/lib/services/client-company-edit.service.ts");
  if (!editService.includes("linked_via_contact_email")) {
    pass = fail("Ownership guard must block email-only linkage edits") && pass;
  } else {
    pass = ok("Email-only reviewer edit blocked in ownership guard") && pass;
  }

  if (!editService.includes("isPlatformStaff")) {
    pass = fail("Ownership guard must block platform staff edits") && pass;
  } else {
    pass = ok("Platform staff blocked from company edits") && pass;
  }

  const profileService = fileText("src/lib/services/client-profile.service.ts");
  if (!profileService.includes("resolveCanClientEditCompanyProfile")) {
    pass = fail("client-profile.service must resolve canEdit via ownership guard") && pass;
  } else {
    pass = ok("Company page model uses ownership guard for canEdit") && pass;
  }

  if (!profileService.includes("employeeBand: primary.employeeBand")) {
    pass = fail("Company profile must read employeeBand from implementation request") && pass;
  } else {
    pass = ok("employeeBand sourced from implementation request") && pass;
  }

  if (!completeForm.includes("employee_band")) {
    pass = fail("Completion form must include employee_band field") && pass;
  } else {
    pass = ok("Completion form includes employee band select") && pass;
  }

  for (const field of CLIENT_COMPANY_COMPLETENESS_REGISTRY) {
    if (field.editableByClient) continue;
    if (!field.blockedReason?.trim()) {
      pass = fail(`Registry field ${field.label} missing blockedReason`) && pass;
    }
  }
  pass = ok("All non-editable registry fields have blockedReason") && pass;

  if (pass) {
    console.log("\nPASS: client company profile completion (K2.6)");
  } else {
    console.error("\nFAIL: client company profile completion checks failed");
  }

  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
