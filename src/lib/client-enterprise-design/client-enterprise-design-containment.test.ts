import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readSrc(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

const paths = [
  "src/lib/client-enterprise-design/persistence/client-design-discovery.service.ts",
  "src/lib/actions/client-enterprise-design.ts",
  "src/components/client-enterprise-design/client-design-journey.tsx",
  "src/lib/services/procrow-client-design-review.service.ts",
  "src/components/procrow/model-forge-content.tsx",
  "src/app/admin/model-forge/page.tsx",
];

const forbidden = [
  "prisma.blueprint.create",
  "prisma.blueprintVersion.create",
  "createPersistentBlueprint",
  "saveBlueprintDraft",
  "provisionTenant",
  "grantMembership",
  "grantRole",
  "platform.discovery.write",
];

for (const rel of paths) {
  const src = readSrc(rel);
  for (const token of forbidden) {
    assert(!src.includes(token), `${rel} must not reference ${token}`);
  }
}

// Model Forge handoff is read-only — loads snapshot, no Discovery writes.
{
  const forgePage = readSrc("src/app/admin/model-forge/page.tsx");
  assert(forgePage.includes("buildProCrowClientDesignReviewSnapshot"));
  assert(!forgePage.includes("saveClientEnterpriseDesign"));
  assert(!forgePage.includes("writeDiscoveryAnswerAudited"));

  const forgeContent = readSrc("src/components/procrow/model-forge-content.tsx");
  assert(forgeContent.includes("clientDesignHandoff"));
  assert(!forgeContent.includes("submitClientEnterpriseDesign"));
}

// Draft type flags remain advisory.
{
  const types = readSrc("src/lib/client-enterprise-design/types.ts");
  assert(types.includes("advisory"));
  assert(types.includes("authoritative: false"));
  assert(types.includes("createsBlueprint: false"));
  assert(types.includes("provisionsTenant: false"));
}

// Submission blocks structural contradictions only — not silent Blueprint side effects.
{
  const persistence = readSrc(
    "src/lib/client-enterprise-design/persistence/client-design-discovery.service.ts",
  );
  assert(persistence.includes("hasStructuralContradictions"));
  assert(!persistence.includes("blueprint"));
}

console.log("client-enterprise-design-containment: PASS");
