#!/usr/bin/env tsx
/**
 * FTGP.1G — Static audit of Discovery completion fail-closed rules.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DISCOVERY_AUTO_COMPLETION_ON_SAVE,
  DISCOVERY_COMPLETION_AUTHORIZED_DEFAULT,
  planDiscoveryCompletion,
} from "../src/lib/ftgp/ftgp-discovery-completion-rules";
import {
  CLIENT_OWNER_PROOF_REQUIRED_FOR_DISCOVERY_COMPLETION,
  FTGP_DISCOVERY_PROVENANCE,
} from "../src/lib/ftgp/ftgp-discovery-provenance.constants";
import { requiredClientQuestionsForCompletion } from "../src/lib/ftgp/ftgp-discovery-question-catalog";
import { systemMarkersSatisfyClientRequirements } from "../src/lib/ftgp/ftgp-discovery-system-marker.constants";

const root = process.cwd();

function read(rel: string): string {
  return readFileSync(join(root, rel), "utf8");
}

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`  FAIL: ${msg}`);
  process.exit(1);
}

function main() {
  console.log("\n=== FTGP Discovery completion audit ===\n");

  const answerWrite = read("src/lib/ftgp/ftgp-discovery-answer-write.service.ts");
  const completionRules = read("src/lib/ftgp/ftgp-discovery-completion-rules.ts");
  const clientDiscovery = read("src/lib/services/client-discovery.service.ts");

  if (answerWrite.includes("completeDiscovery")) {
    fail("answer write must not complete discovery");
  }
  if (DISCOVERY_AUTO_COMPLETION_ON_SAVE !== false) {
    fail("auto completion on save must be false");
  }
  ok("DISCOVERY_AUTO_COMPLETION_ON_SAVE=false");

  if (!completionRules.includes("explicit_completion_required")) {
    fail("explicit completion command required");
  }
  if (!completionRules.includes("owner_browser_proof_required")) {
    fail("owner proof required for completion");
  }
  ok("DISCOVERY_COMPLETION_RULES_EXPLICIT=PASS");

  if (CLIENT_OWNER_PROOF_REQUIRED_FOR_DISCOVERY_COMPLETION !== true) {
    fail("completion must require client proof");
  }
  ok("DISCOVERY_COMPLETION_REQUIRES_CLIENT_PROOF=true");

  if (DISCOVERY_COMPLETION_AUTHORIZED_DEFAULT !== false) {
    fail("completion not authorized by default");
  }
  ok("DISCOVERY_COMPLETION_AUTHORIZED=false");

  if (systemMarkersSatisfyClientRequirements() !== false) {
    fail("system markers must not satisfy client requirements");
  }
  ok("SYSTEM_MARKERS_SATISFY_CLIENT_REQUIREMENTS=false");

  const withoutCommand = planDiscoveryCompletion({
    requestStatus: "UNDER_DISCOVERY",
    profileStatus: "IN_PROGRESS",
    ownerBrowserProofVerified: true,
    explicitCompletionCommand: false,
    clientAnswers: [],
    implementerObservations: [],
    blockingValidationErrors: [],
  });
  if (withoutCommand.allowed) fail("completion without command must fail");

  const required = requiredClientQuestionsForCompletion();
  const satisfied = required.map((q) => ({
    sectionKey: q.sectionKey,
    questionKey: q.questionKey,
    provenance: FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED,
  }));
  const withAll = planDiscoveryCompletion({
    requestStatus: "UNDER_DISCOVERY",
    profileStatus: "IN_PROGRESS",
    ownerBrowserProofVerified: true,
    explicitCompletionCommand: true,
    clientAnswers: satisfied,
    implementerObservations: [],
    blockingValidationErrors: [],
  });
  if (!withAll.allowed) fail("fully satisfied completion plan should allow");

  if (clientDiscovery.includes("completeDiscovery")) {
    fail("client discovery must not auto-complete platform discovery");
  }

  console.log("\nPASS — FTGP DISCOVERY COMPLETION AUDIT\n");
}

main();
