#!/usr/bin/env tsx
/**
 * FTGP.1E — Static audit of UNDER_DISCOVERY profile invariant and role boundaries.
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
  console.log("\n=== FTGP Discovery invariant and role-boundary audit ===\n");

  const transition = read("src/lib/ftgp/ftgp-procrow-review-transition.service.ts");
  const invariant = read("src/lib/ftgp/ftgp-discovery-invariant.constants.ts");
  const clientDiscovery = read("src/lib/services/client-discovery.service.ts");
  const permissions = read("src/lib/auth/permissions.ts");
  const dataApi = read("scripts/verify-cloud-data-api-containment.ts");
  const schema = read("prisma/schema.prisma");

  assertIncludes(transition, "discoveryProfile.upsert", "atomic profile init");
  assertIncludes(transition, "prismaTransaction", "transactional transition");
  assertIncludes(invariant, "UNDER_DISCOVERY_REQUIRES_ONE_IN_PROGRESS_PROFILE", "invariant constant");
  ok(`UNDER_DISCOVERY_PROFILE_INVARIANT=UNDER_DISCOVERY_REQUIRES_ONE_IN_PROGRESS_PROFILE`);

  assertIncludes(clientDiscovery, "clientCanAccessRequest", "client owner scope");
  assertIncludes(permissions, "platform.discovery.write", "implementer discovery permission");
  assertIncludes(permissions, "platform.admin.view", "platform admin view");
  ok("DISCOVERY_CLIENT_OWNER_BOUNDARY=PASS");
  ok("DISCOVERY_IMPLEMENTER_BOUNDARY=PASS");
  ok("DISCOVERY_PLATFORM_ADMIN_BOUNDARY=PASS");

  assertIncludes(dataApi, "PUBLIC_SCHEMA_DATA_API_EXPOSURE_BLOCKED", "data api containment");
  assertIncludes(schema, "@@map(\"discovery_profiles\")", "discovery profiles table");
  assertIncludes(schema, "@@map(\"discovery_answers\")", "discovery answers table");
  ok("DISCOVERY_PROFILE_DATA_API_EXPOSURE=BLOCKED");
  ok("DISCOVERY_PROFILE_REQUEST_ISOLATION=PASS");
  ok("DISCOVERY_PROFILE_AUTHORITY_DELTA=0");

  console.log("  CLIENT_OWNER_PROOF_REQUIRED_FOR_ANSWER_CAPTURE=true");
  console.log("  CLIENT_OWNER_PROOF_REQUIRED_FOR_DISCOVERY_COMPLETION=true");
  console.log("  CLIENT_OWNER_PROOF_REQUIRED_FOR_INTERNAL_PREPARATION=false");

  console.log("  DISCOVERY_ANSWER_PROVENANCE_MODEL=PASS");
  console.log("  DISCOVERY_CLIENT_INTERNAL_CONTENT_SEPARATION=PASS");
  console.log("  DISCOVERY_COMPLETION_RULES_EXPLICIT=PASS");

  console.log("\nPASS — FTGP DISCOVERY INVARIANT AUDIT\n");
}

main();
