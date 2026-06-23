import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

{
  const invariant = read("src/lib/ftgp/ftgp-discovery-invariant.constants.ts");
  assert.equal(
    invariant.includes("UNDER_DISCOVERY_REQUIRES_ONE_IN_PROGRESS_PROFILE"),
    true
  );
  assert(invariant.includes("ftgp_lifecycle_audit"));
  assert(invariant.includes("client_discovery"));
}

{
  const transition = read("src/lib/ftgp/ftgp-procrow-review-transition.service.ts");
  assert(transition.includes("discoveryProfile.upsert"));
  assert(transition.includes("prismaTransaction"));
}

{
  const answerWrite = read("src/lib/ftgp/ftgp-discovery-answer-write.service.ts");
  assert(answerWrite.includes("planDiscoveryAnswerWrite"));
  assert(answerWrite.includes("writeDiscoveryAnswerAudited"));
  assert(answerWrite.includes("actor_not_request_owner"));
  assert(answerWrite.includes("owner_browser_proof_required"));
  assert(answerWrite.includes("internal_actor_cannot_client_provide"));
  assert(!answerWrite.includes("completeDiscovery"));
}

{
  const catalog = read("src/lib/ftgp/ftgp-discovery-question-catalog.ts");
  assert(catalog.includes("17_constraints_risks_budget_timeline"));
  assert(catalog.includes("FTGP_DISCOVERY_QUESTION_CATALOG_VERSION"));
}

{
  const provenance = read("src/lib/ftgp/ftgp-discovery-provenance.constants.ts");
  assert(provenance.includes("CLIENT_PROVIDED"));
  assert(provenance.includes("IMPLEMENTER_OBSERVATION"));
  assert(provenance.includes("SYSTEM_LIFECYCLE_MARKER"));
}

{
  const dryRun = read("scripts/verify-ftgp-discovery-session-dry-run.ts");
  assert(dryRun.includes("DISCOVERY_WRITES_EXECUTED=false"));
  assert(dryRun.includes("CLIENT_ANSWER_CAPTURE_AUTHORIZED=false"));
}

{
  const gitignore = read(".gitignore");
  assert(gitignore.includes(".ftgp-discovery-readiness-manifest"));
  assert(gitignore.includes(".ftgp-discovery-interview-plan.local.json"));
  assert(gitignore.includes(".ftgp-discovery-client-answer-manifest"));
  assert(gitignore.includes(".ftgp-discovery-implementer-observation-manifest"));
}

console.log("PASS — FTGP Discovery readiness");
