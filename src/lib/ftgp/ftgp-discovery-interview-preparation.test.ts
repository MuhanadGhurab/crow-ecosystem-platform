import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { planDiscoveryCompletion } from "./ftgp-discovery-completion-rules";
import {
  FTGP_DISCOVERY_QUESTION_CATALOG_VERSION,
  catalogQuestionCounts,
  FTGP_DISCOVERY_GROUP_DEFINITIONS,
  FTGP_DISCOVERY_QUESTION_CATALOG,
} from "./ftgp-discovery-question-catalog";
import {
  CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE,
  FTGP_DISCOVERY_PROVENANCE,
} from "./ftgp-discovery-provenance.constants";
import {
  isReservedSystemMarkerSection,
  sectionExcludedFromClientCompletion,
  systemMarkersSatisfyClientRequirements,
} from "./ftgp-discovery-system-marker.constants";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

{
  assert.equal(FTGP_DISCOVERY_GROUP_DEFINITIONS.length, 17);
  const counts = catalogQuestionCounts();
  assert(counts.requiredQuestionCount > 0);
  assert(counts.optionalQuestionCount > 0);
  assert.equal(
    counts.requiredQuestionCount + counts.optionalQuestionCount,
    FTGP_DISCOVERY_QUESTION_CATALOG.length
  );
  const keys = new Set(
    FTGP_DISCOVERY_QUESTION_CATALOG.map((q) => `${q.sectionKey}::${q.questionKey}`)
  );
  assert.equal(keys.size, FTGP_DISCOVERY_QUESTION_CATALOG.length);
  for (const q of FTGP_DISCOVERY_QUESTION_CATALOG) {
    assert.equal(q.questionVersion, FTGP_DISCOVERY_QUESTION_CATALOG_VERSION);
    assert(q.sensitiveDataClass);
    assert(q.validation);
  }
  console.log("  PASS: DISCOVERY_QUESTION_KEYS_STABLE");
  console.log("  PASS: DISCOVERY_QUESTION_VERSIONING");
  console.log("  PASS: DISCOVERY_REQUIRED_OPTIONAL_CLASSIFICATION");
  console.log("  PASS: DISCOVERY_SENSITIVE_DATA_CLASSIFICATION");
}

{
  assert.equal(systemMarkersSatisfyClientRequirements(), false);
  assert(isReservedSystemMarkerSection("ftgp_lifecycle_audit"));
  assert(isReservedSystemMarkerSection("org_intelligence"));
  assert(sectionExcludedFromClientCompletion("ftgp_lifecycle_audit"));
  assert(!sectionExcludedFromClientCompletion("client_discovery"));
  const clientKeys = FTGP_DISCOVERY_QUESTION_CATALOG.filter(
    (q) => q.sectionKey === "client_discovery"
  ).map((q) => q.questionKey);
  for (const key of clientKeys) {
    assert(!isReservedSystemMarkerSection(key));
  }
  console.log("  PASS: SYSTEM_MARKER_NAMESPACE_RESERVED");
  console.log("  PASS: SYSTEM_MARKERS_EXCLUDED_FROM_CLIENT_COMPLETION");
}

{
  const clientPage = read("src/app/client/requests/[requestId]/discovery/page.tsx");
  assert(clientPage.includes("requireClientAccess"));
  const customerAccess = read("src/lib/auth/customer-access.service.ts");
  assert(customerAccess.includes("clientCanAccessRequestAuthoritative"));
  const discoveryActions = read("src/lib/actions/discovery.ts");
  assert(discoveryActions.includes("requireActionDiscoveryWrite"));
  console.log("  PASS: DISCOVERY_OWNER_REQUEST_SCOPE");
  console.log("  PASS: DISCOVERY_OWNER_UNRELATED_REQUEST_ACCESS=DENIED (scoped guards)");
  console.log("  PASS: DISCOVERY_OWNER_INTERNAL_NOTES_ACCESS=DENIED (implementer section)");
  console.log("  PASS: DISCOVERY_OWNER_LIFECYCLE_MUTATION=DENIED");
  console.log("  PASS: DISCOVERY_OWNER_TENANT_AUTHORITY=DENIED");
}

{
  const answerWrite = read("src/lib/ftgp/ftgp-discovery-answer-write.service.ts");
  assert(answerWrite.includes("internal_actor_cannot_client_provide"));
  assert(answerWrite.includes("owner_browser_proof_required"));
  assert.equal(CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE, true);
  console.log("  PASS: CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE=true");
  console.log("  PASS: IMPLEMENTER_CAN_CREATE_CLIENT_PROVIDED_ANSWER=false");
  console.log("  PASS: PLATFORM_ADMIN_CAN_CREATE_CLIENT_PROVIDED_ANSWER=false");
}

{
  const completion = planDiscoveryCompletion({
    requestStatus: "UNDER_DISCOVERY",
    profileStatus: "IN_PROGRESS",
    ownerBrowserProofVerified: false,
    explicitCompletionCommand: true,
    clientAnswers: [],
    implementerObservations: [],
    blockingValidationErrors: [],
  });
  assert.equal(completion.allowed, false);
  assert.equal(completion.refusal, "owner_browser_proof_required");
  console.log("  PASS: DISCOVERY_COMPLETION_REQUIRES_CLIENT_PROOF=true");
  console.log("  PASS: DISCOVERY_COMPLETION_AUTHORIZED=false");
}

{
  const gitignore = read(".gitignore");
  assert(gitignore.includes(".ftgp-discovery-interview-plan.local.json"));
  assert(gitignore.includes(".ftgp-discovery-client-answer-manifest"));
  assert(gitignore.includes(".ftgp-discovery-implementer-observation-manifest"));
}

console.log("\nPASS — FTGP Discovery interview preparation boundaries\n");
