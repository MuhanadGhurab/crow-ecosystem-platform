/**
 * A1 — Architecture simplification + portal UX system reset verifier.
 *
 *   npm run architecture-simplification:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED_FILES = [
  "docs/internal/A1_ARCHITECTURE_SIMPLIFICATION_PORTAL_UX_SYSTEM_RESET.md",
  "src/lib/constants/crow-ux-principles.ts",
  "src/lib/constants/crow-simplified-lifecycle.ts",
  "src/lib/constants/crow-route-ownership.ts",
  "src/lib/constants/crow-workforce-activation.ts",
  "src/components/product/product-page-header.tsx",
  "src/components/product/product-section.tsx",
  "src/components/product/product-status-card.tsx",
  "src/components/product/product-next-action.tsx",
  "scripts/verify-architecture-simplification.ts",
] as const;

const FORBIDDEN_OVERCLAIM = [
  "certified compliance",
  "SIEM replacement",
  "legal audit evidence",
  "autonomous detection",
  "autonomous remediation",
  "SAREA grants access",
  "SAREA replaces RBAC",
  "email sent",
  "invite email sent",
  "activate live payments",
  "automatic tenant provisioning",
  "production go-live approved",
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
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      pass = false;
    }
  };

  console.log("\n=== A1 Architecture simplification + portal UX ===\n");

  for (const f of REQUIRED_FILES) {
    check(existsSync(join(ROOT, f)), `Required file: ${f}`, `Missing: ${f}`);
  }

  const pkg = fileText("package.json");
  check(
    pkg.includes('"architecture-simplification:verify"'),
    "package.json defines architecture-simplification:verify",
    "Add architecture-simplification:verify script"
  );

  const homepage = fileText("src/lib/constants/homepage.ts");
  check(
    homepage.includes("Build the operating workspace your company actually runs on") ||
      homepage.includes("Map your company, prepare a secure tenant runtime"),
    "Homepage hero uses simplified Crow flow",
    "Update HOMEPAGE_HERO_HEADLINE"
  );
  check(
    homepage.includes("Business Portal"),
    "Homepage references Business Portal",
    "Homepage must distinguish Business Portal"
  );

  const accessPage = fileText("src/app/access/page.tsx");
  check(
    accessPage.includes("Choose your workspace") || accessPage.includes("workspace"),
    "/access uses workspace selector language",
    "Update /access page title"
  );

  const gateway = fileText("src/components/portal/portal-access-gateway.tsx");
  const portalContractLabels = fileText("src/lib/portal/portal-access-contract.ts");
  check(
    (gateway.includes("Client Portal") &&
      gateway.includes("Business Portal") &&
      gateway.includes("ProCrow")) ||
      (portalContractLabels.includes("Client Portal") &&
        portalContractLabels.includes("Business Portal") &&
        portalContractLabels.includes("ProCrow")),
    "/access gateway shows three portal cards (gateway or portal contract labels)",
    "Portal access gateway must show Client / Business / ProCrow labels"
  );

  const portalContract = fileText("src/lib/portal/portal-access-contract.ts");
  check(
    portalContract.includes("Request, discovery, proposal, onboarding") ||
      portalContract.includes("discovery, proposal"),
    "Client Portal subtitle in portal contract",
    "Update CLIENT portal description in portal-access-contract"
  );

  const invitePanel = fileText("src/components/admin/admin-tenant-membership-invite-panel.tsx");
  check(
    invitePanel.includes("Tenant workforce activation") ||
      invitePanel.includes("TENANT_WORKFORCE_ACTIVATION_TITLE"),
    "ProCrow invite panel uses Tenant Workforce Activation framing",
    "Reframe admin tenant invite panel under workforce activation"
  );
  check(
    invitePanel.includes("Business Portal invite") || invitePanel.includes("BUSINESS_PORTAL_INVITE"),
    "ProCrow invite panel uses Business Portal invite copy",
    "Rename tenant invite link to Business Portal invite"
  );
  check(
    invitePanel.includes("Manual copy-link") || invitePanel.includes("manualDelivery"),
    "M4C manual copy-link mode documented (no false email-sent claim)",
    "Document manual copy-link mode on invite panel"
  );
  check(
    invitePanel.includes("createTenantInviteTokenAction"),
    "M4C token flow preserved in invite panel",
    "Do not remove M4C createTenantInviteTokenAction"
  );

  const clientUx = fileText("src/lib/constants/public-client-ux.ts");
  check(
    clientUx.includes("Request and configure") || clientUx.includes("configure Crow"),
    "Client Portal purpose distinguishes from Business Portal",
    "Update CLIENT_PORTAL_PURPOSE"
  );

  const tenantPage = fileText("src/app/admin/tenants/[tenantId]/page.tsx");
  check(
    tenantPage.includes("Tenant workforce activation") ||
      tenantPage.includes("Tenant Workforce Activation"),
    "ProCrow tenant overview groups workforce activation",
    "Group M4C under Tenant workforce activation on tenant page"
  );
  check(
    tenantPage.includes("CyberCrow trust readiness"),
    "ProCrow tenant page CyberCrow section",
    "Add CyberCrow trust readiness section"
  );

  const purchasePage = fileText("src/app/[tenant]/workflows/purchase-to-stock/page.tsx");
  check(
    purchasePage.indexOf("Stage timeline") < purchasePage.indexOf("Workflow persistence details") ||
      purchasePage.includes("Stage timeline"),
    "Purchase-to-stock timeline appears before persistence details",
    "Reorder purchase-to-stock: timeline before persistence"
  );

  const lifecycle = fileText("src/lib/constants/crow-simplified-lifecycle.ts");
  check(
    lifecycle.includes("Tenant workforce activation") && lifecycle.includes("Go/No-Go"),
    "Simplified lifecycle includes workforce activation and Go/No-Go",
    "Complete CROW_SIMPLIFIED_LIFECYCLE steps"
  );

  const routes = fileText("src/lib/constants/crow-route-ownership.ts");
  check(
    routes.includes("CROW_ROUTE_OWNERSHIP") && routes.includes("/admin"),
    "Route ownership map documents ProCrow /admin",
    "Add route ownership entries"
  );

  const cybercrowPanel = fileText("src/components/admin/admin-cybercrow-trust-readiness-panel.tsx");
  if (existsSync(join(ROOT, "src/components/admin/admin-cybercrow-trust-readiness-panel.tsx"))) {
    check(
      !cybercrowPanel.toLowerCase().includes("certified compliant") &&
        (cybercrowPanel.includes("trust") || cybercrowPanel.includes("readiness")),
      "CyberCrow panel uses safe trust readiness wording",
      "Remove unsafe CyberCrow compliance claims"
    );
  }

  const sareaPanel = fileText("src/components/admin/admin-sarea-experience-mapping-panel.tsx");
  if (existsSync(join(ROOT, "src/components/admin/admin-sarea-experience-mapping-panel.tsx"))) {
    check(
      sareaPanel.includes("RBAC") || sareaPanel.includes("experience"),
      "SAREA panel preserves RBAC vs experience distinction",
      "SAREA panel must note RBAC controls access"
    );
  }

  const portalService = fileText("src/lib/services/portal-access.service.ts");
  check(
    portalService.includes("isClient(role)") && portalService.includes('kind: "procrow"'),
    "ProCrow hidden from client-only users in portal service",
    "ProCrow must not appear for client-only roles"
  );
  check(
    portalService.includes("tenantSlugs") || portalService.includes("tenant_admin"),
    "Business Portal requires tenant membership",
    "Business portal gating in portal-access.service"
  );

  const inviteAccept = fileText("src/lib/services/tenant-invite-token.service.ts");
  check(
    !inviteAccept.includes("platform_admin") ||
      inviteAccept.includes("never") ||
      inviteAccept.includes("does not grant"),
    "Invite flow does not grant platform_admin",
    "Audit tenant-invite-token.service for platform_admin escalation"
  );

  const scanTargets = [
    "src/lib/constants/homepage.ts",
    "src/lib/constants/crow-workforce-activation.ts",
    "src/components/admin/admin-tenant-membership-invite-panel.tsx",
    "docs/internal/A1_ARCHITECTURE_SIMPLIFICATION_PORTAL_UX_SYSTEM_RESET.md",
  ];
  for (const rel of scanTargets) {
    if (!existsSync(join(ROOT, rel))) continue;
    const text = fileText(rel).toLowerCase();
    for (const phrase of FORBIDDEN_OVERCLAIM) {
      if (text.includes(phrase.toLowerCase())) {
        pass = fail(`Forbidden overclaim "${phrase}" in ${rel}`) && pass;
      }
    }
  }

  console.log(pass ? "\nA1 architecture simplification: PASSED\n" : "\nA1 architecture simplification: FAILED\n");
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
