#!/usr/bin/env tsx
/**
 * FTGP.1E — Static audit of Discovery answer-write fail-closed boundaries.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

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

function assertIncludes(src: string, needle: string, label: string) {
  if (!src.includes(needle)) fail(`${label}: missing "${needle}"`);
}

function main() {
  console.log("\n=== FTGP Discovery answer-write audit ===\n");

  const service = read("src/lib/ftgp/ftgp-discovery-answer-write.service.ts");
  const invariant = read("src/lib/ftgp/ftgp-discovery-invariant.constants.ts");
  const discoveryActions = read("src/lib/actions/discovery.ts");
  const clientDiscovery = read("src/lib/actions/client-discovery.ts");
  const discoveryService = read("src/lib/services/discovery.service.ts");

  assertIncludes(invariant, "UNDER_DISCOVERY_REQUIRES_ONE_IN_PROGRESS_PROFILE", "invariant");
  assertIncludes(service, "planDiscoveryAnswerWrite", "plan function");
  assertIncludes(service, "requestId: string", "explicit request id");
  assertIncludes(service, "discoveryProfileId: string", "explicit profile id");
  assertIncludes(service, "actorPlatformAccountId", "explicit actor");
  assertIncludes(service, "correlationId", "correlation id");
  assertIncludes(service, "provenance", "answer provenance");
  assertIncludes(service, "IN_PROGRESS", "profile status gate");
  assertIncludes(service, "FTGP_PROCROW_REVIEW_TO_STATUS", "request status gate");
  assertIncludes(service, "prismaTransaction", "transaction boundary");
  assertIncludes(service, "actor_not_request_owner", "owner check");
  assertIncludes(service, "questionVersion", "question version");
  assertIncludes(service, "owner_browser_proof_required", "owner proof gate");
  assertIncludes(service, "internal_actor_cannot_client_provide", "implementer impersonation block");
  assertIncludes(service, "unknown_question_key", "catalog lookup");
  assertIncludes(service, "actor_forbidden", "implementer gate");
  ok("DISCOVERY_ANSWER_WRITE_FAIL_CLOSED=PASS");

  assertIncludes(service, "correlationId", "audit correlation");
  assertIncludes(service, "provenance", "audit provenance field");
  assertIncludes(service, "at: new Date().toISOString()", "audit timestamp");
  ok("DISCOVERY_ANSWER_WRITE_AUDITED=PASS");

  assertIncludes(service, "idempotent: true", "idempotent path");
  assertIncludes(service, "existing", "duplicate detection");
  ok("DISCOVERY_ANSWER_WRITE_IDEMPOTENT=PASS");

  if (service.includes("completeDiscovery") || service.includes("BLUEPRINT_BUILD")) {
    fail("answer write must not advance lifecycle");
  }
  ok("AUTOMATIC_DISCOVERY_COMPLETION=false");

  assertIncludes(discoveryActions, "requireActionDiscoveryWrite", "platform discovery gated");
  assertIncludes(clientDiscovery, "requireClientAccess", "client discovery gated");
  if (discoveryService.includes("createClient") && discoveryService.includes("supabase")) {
    fail("unexpected direct client path");
  }

  console.log("\nPASS — FTGP DISCOVERY ANSWER-WRITE AUDIT\n");
}

main();
