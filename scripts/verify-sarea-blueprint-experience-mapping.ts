/**
 * M2 — SAREA blueprint-to-experience mapping verifier.
 *
 *   npm run sarea-blueprint:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const REQUIRED = [
  "src/lib/sarea/sarea-experience-mapping-contract.ts",
  "src/lib/services/sarea-experience-mapping.service.ts",
  "src/lib/constants/sarea-blueprint-experience-templates.ts",
  "src/components/admin/admin-sarea-experience-mapping-panel.tsx",
  "src/components/sarea/sarea-blueprint-experience-summary.tsx",
  "src/components/procrow/procrow-sarea-experience-go-no-go-panel.tsx",
  "src/components/tenant/tenant-sarea-experience-note.tsx",
  "docs/internal/M2_SAREA_BLUEPRINT_TO_EXPERIENCE_MAPPING.md",
] as const;

const FORBIDDEN = [
  "SAREA enforces access",
  "SAREA replaces RBAC",
  "SAREA grants permissions",
  "autonomous personalization",
  "permission editor",
  "auto-provision",
  "production launch approved",
  "live checkout",
  "platform_admin",
  "certified compliant",
] as const;

const REQUIRED_PHRASES = [
  "RBAC controls access",
  "SAREA controls experience",
  "CyberCrow validates trust and access boundaries",
  "role-based experience mapping",
  "sarea-blueprint:verify",
  "Business Portal is shaped by SAREA",
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

  console.log("\n=== M2 SAREA blueprint-to-experience mapping ===\n");

  for (const rel of REQUIRED) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"sarea-blueprint:verify"')) {
    pass = fail("package.json missing sarea-blueprint:verify") && pass;
  } else {
    pass = ok("npm script sarea-blueprint:verify") && pass;
  }

  const surfaces = [
    "src/app/admin/tenants/[tenantId]/page.tsx",
    "src/app/admin/requests/[requestId]/page.tsx",
    "src/app/admin/go-no-go/page.tsx",
    "src/app/sarea/overview/page.tsx",
    "src/app/sarea/profiles/page.tsx",
    "src/app/sarea/role-mapping/page.tsx",
    "src/app/sarea/preview/page.tsx",
    "src/app/sarea/navigation/page.tsx",
    "src/app/sarea/widgets/page.tsx",
    "src/app/[tenant]/dashboard/page.tsx",
    "src/app/[tenant]/modules/page.tsx",
  ];

  for (const rel of surfaces) {
    const t = fileText(rel);
    if (!t.includes("Sarea") && !t.includes("sarea")) {
      pass = fail(`${rel} missing SAREA mapping integration`) && pass;
    } else {
      pass = ok(`${rel} integrates SAREA mapping`) && pass;
    }
  }

  const combined = [
    "src/lib/sarea/sarea-experience-mapping-contract.ts",
    "src/lib/services/sarea-experience-mapping.service.ts",
    "src/lib/constants/sarea-blueprint-experience-templates.ts",
    "src/components/tenant/tenant-sarea-experience-note.tsx",
    "src/components/admin/admin-sarea-experience-mapping-panel.tsx",
    "package.json",
  ]
    .map(fileText)
    .join("\n");

  for (const phrase of REQUIRED_PHRASES) {
    if (!combined.toLowerCase().includes(phrase.toLowerCase())) {
      pass = fail(`Missing required phrase: ${phrase}`) && pass;
    }
  }
  if (pass) pass = ok("Required safe-readiness phrases") && pass;

  const service = fileText("src/lib/services/sarea-experience-mapping.service.ts");
  if (!service.includes("buildSareaExperienceMappingSnapshotForTenantId")) {
    pass = fail("Mapping service must build tenant snapshot") && pass;
  } else {
    pass = ok("Tenant mapping snapshot builder") && pass;
  }

  if (service.includes("graph.microsoft") || service.includes("prisma.role.create")) {
    pass = fail("Service must not call Graph or create roles") && pass;
  } else {
    pass = ok("No Graph/role mutation in mapping service") && pass;
  }

  const forbiddenScan = [
    "src/lib/services/sarea-experience-mapping.service.ts",
    "src/components/admin/admin-sarea-experience-mapping-panel.tsx",
    "src/components/procrow/procrow-sarea-experience-go-no-go-panel.tsx",
  ]
    .map(fileText)
    .join("\n");

  for (const bad of FORBIDDEN) {
    if (forbiddenScan.includes(bad)) {
      pass = fail(`Forbidden phrase: ${bad}`) && pass;
    }
  }
  pass = ok("No forbidden RBAC/autonomy claims in M2 operator surfaces") && pass;

  const goNoGo = fileText("src/lib/services/procrow-go-no-go.service.ts");
  if (!goNoGo.includes("sarea-blueprint-experience-m2")) {
    pass = fail("Go/No-Go missing sarea-blueprint-experience-m2 gate") && pass;
  } else {
    pass = ok("Go/No-Go SAREA mapping gate") && pass;
  }

  const templates = fileText("src/lib/constants/sarea-blueprint-experience-templates.ts");
  if (!templates.includes("executive") || !templates.includes("frontline")) {
    pass = fail("Persona templates must include executive and frontline") && pass;
  } else {
    pass = ok("Blueprint persona templates") && pass;
  }

  console.log(pass ? "\nPASS: M2 SAREA blueprint experience mapping\n" : "\nFAIL: M2 verification\n");
  return pass;
}

process.exit(main() ? 0 : 1);
