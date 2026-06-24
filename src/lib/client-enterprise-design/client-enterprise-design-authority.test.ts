import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  FTGP_CLIENT_DISCOVERY_ANSWER_SECTIONS,
  FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION,
} from "@/lib/ftgp/ftgp-discovery-invariant.constants";
import { CLIENT_DESIGN_ANSWER_KEYS } from "@/lib/client-enterprise-design/persistence/constants";
import { findCatalogQuestion } from "@/lib/ftgp/ftgp-discovery-question-catalog";
import { FTGP_DISCOVERY_PROVENANCE } from "@/lib/ftgp/ftgp-discovery-provenance.constants";

const root = process.cwd();

function readSrc(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

// Enterprise design section is a governed client answer namespace.
assert(
  (FTGP_CLIENT_DISCOVERY_ANSWER_SECTIONS as readonly string[]).includes(
    FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION,
  ),
  "client_enterprise_design must be in FTGP_CLIENT_DISCOVERY_ANSWER_SECTIONS",
);

for (const key of Object.values(CLIENT_DESIGN_ANSWER_KEYS)) {
  const q = findCatalogQuestion(FTGP_CLIENT_ENTERPRISE_DESIGN_SECTION, key);
  assert(q, `catalog question missing: ${key}`);
  assert.equal(q!.answerProvenance, FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED);
  assert.equal(q!.actorType, "client");
}

// planDiscoveryAnswerWrite blocks internal actors from CLIENT_PROVIDED.
{
  const answerWrite = readSrc("src/lib/ftgp/ftgp-discovery-answer-write.service.ts");
  assert(answerWrite.includes("internal_actor_cannot_client_provide"));
  assert(answerWrite.includes("FTGP_CLIENT_DISCOVERY_ANSWER_SECTIONS"));
  assert(answerWrite.includes("actor_not_request_owner"));
}

// Hosted persistence enforces request ownership before writes.
{
  const persistence = readSrc(
    "src/lib/client-enterprise-design/persistence/client-design-discovery.service.ts",
  );
  assert(persistence.includes("clientCanAccessRequestAuthoritative"));
  assert(persistence.includes("Only the authoritative request owner"));
  assert(persistence.includes('provenance: "client_owner"'));
  assert(!persistence.includes("createBlueprint"));
  assert(!persistence.includes("provisionTenant"));
}

// Server actions require client session + platform account — not metadata alone.
{
  const actions = readSrc("src/lib/actions/client-enterprise-design.ts");
  assert(actions.includes("requireClientAccess"));
  assert(actions.includes("findPlatformAccountBySupabaseUserId"));
  assert(!actions.includes("PLATFORM_ADMIN"));
}

// Client design routes use requireClientAccess.
{
  const designPage = readSrc("src/app/client/requests/[requestId]/discovery/design/page.tsx");
  assert(designPage.includes("requireClientAccess"));
  const pageService = readSrc("src/lib/services/client-enterprise-design-page.service.ts");
  assert(pageService.includes("clientCanAccessRequestAuthoritative"));
}

// hash helper is server-only — not bundled into client journey.
{
  const journey = readSrc("src/components/client-enterprise-design/client-design-journey.tsx");
  assert(!journey.includes("node:crypto"));
  assert(!journey.includes("hashDraftSnapshot"));
  const index = readSrc("src/lib/client-enterprise-design/index.ts");
  assert(!index.includes("snapshot-hash.server"));
}

console.log("client-enterprise-design-authority: PASS");
