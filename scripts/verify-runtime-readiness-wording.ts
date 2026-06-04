/**
 * K2.7 — Runtime preparation readiness wording guards.
 *
 *   npm run runtime-readiness-wording:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { assertClientDiscoveryFieldRegistry } from "../src/lib/client-portal/client-discovery-contract";

const ROOT = join(import.meta.dirname, "..");

const SURFACES = [
  "src/lib/services/readiness.service.ts",
  "src/lib/constants/runtime-readiness-wording.ts",
  "src/app/blueprints/[blueprintId]/go-live/page.tsx",
  "src/app/blueprints/[blueprintId]/readiness/page.tsx",
  "src/lib/constants/readiness-groups.ts",
] as const;

const FORBIDDEN = [
  "Discovery must be completed before go-live",
  "Approve blueprint & go live",
  "tenant is live",
  "Already live",
  "automatic tenant provisioning",
  "activate subscription",
  "live checkout",
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

  console.log("\n=== K2.7 Runtime readiness wording ===\n");

  for (const rel of SURFACES) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const pkg = fileText("package.json");
  if (!pkg.includes('"runtime-readiness-wording:verify"')) {
    pass = fail("package.json missing runtime-readiness-wording:verify") && pass;
  } else {
    pass = ok("npm script runtime-readiness-wording:verify") && pass;
  }

  const readiness = fileText("src/lib/services/readiness.service.ts");
  const wording = fileText("src/lib/constants/runtime-readiness-wording.ts");
  const combined = SURFACES.map(fileText).join("\n");

  for (const phrase of FORBIDDEN) {
    if (combined.includes(phrase)) {
      pass = fail(`Forbidden phrase: ${phrase}`) && pass;
    }
  }
  pass = ok("No forbidden phrases in readiness surfaces") && pass;

  if (
    !wording.includes("Blueprint must be approved before runtime preparation") ||
    !readiness.includes("blueprintApprovalBlocker")
  ) {
    pass = fail("Blueprint approval blocker copy must be defined and used") && pass;
  } else {
    pass = ok("Blueprint must be approved blocker copy") && pass;
  }

  if (!readiness.includes("evaluateClientDiscoveryRuntimeGate")) {
    pass = fail("readiness.service must evaluate client discovery runtime gate") && pass;
  } else {
    pass = ok("Client discovery runtime gate integrated") && pass;
  }

  if (!readiness.includes("CLIENT_DISCOVERY_REVIEW_CHECK_LABEL")) {
    pass = fail("readiness.service must include client discovery reviewed check") && pass;
  } else {
    pass = ok("Client discovery reviewed check in operations group") && pass;
  }

  if (!readiness.includes("Runtime preparation blocked")) {
    pass = fail("Provision assert must say Runtime preparation blocked") && pass;
  } else {
    pass = ok("Runtime preparation blocked error message") && pass;
  }

  if (
    !wording.includes("waiting for ProCrow review") ||
    !wording.includes("changes were requested") ||
    !wording.includes("accepted into the blueprint")
  ) {
    pass = fail("L4/L6 client discovery status messages missing") && pass;
  } else {
    pass = ok("Client discovery status messages (L4/L6)") && pass;
  }

  if (!wording.includes("F23-gated") && !fileText("src/app/blueprints/[blueprintId]/readiness/page.tsx").includes("F23")) {
    pass = fail("F23 / Go-No-Go safety copy missing on readiness page") && pass;
  } else {
    pass = ok("F23 / Go-No-Go safety copy present") && pass;
  }

  if (!wording.includes("runtime preparation")) {
    pass = fail("runtime-readiness-wording.ts must define runtime preparation copy") && pass;
  } else {
    pass = ok("Runtime preparation wording constants") && pass;
  }

  if (readiness.includes("platform_admin")) {
    pass = fail("readiness.service must not assign platform_admin") && pass;
  } else {
    pass = ok("No platform_admin in readiness service") && pass;
  }

  try {
    assertClientDiscoveryFieldRegistry();
    pass = ok("Client discovery field registry still valid") && pass;
  } catch (e) {
    pass = fail(String(e)) && pass;
  }

  if (pass) console.log("\nPASS: runtime readiness wording (K2.7)");
  else console.error("\nFAIL: runtime readiness wording checks failed");
  return pass;
}

process.exit(main() ? 0 : 1);
