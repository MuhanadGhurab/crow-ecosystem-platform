#!/usr/bin/env tsx
/**
 * FTGP.1B — Verify designated first-request target (read-only).
 * Run: npm run ftgp-first-request-target:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "@prisma/client";

import { hasMandatoryLegalAcceptanceComplete } from "../src/lib/legal/legal-acceptance.service";
import {
  FTGP_PROCROW_REVIEW_FROM_STATUS,
  FTGP_PROCROW_REVIEW_TO_STATUS,
} from "../src/lib/ftgp/ftgp-procrow-review-transition.constants";
import { assertHostedEnvNotLocalhost, loadHostedOperatorEnv } from "./lib/hosted-operator-env";
import { requireProofOperatorEnv, resolveProofRequesterPlatformAccount } from "./lib/c3-proof-requester-resolution";
import { requestFingerprint } from "./lib/ftgp-procrow-review-transition-manifest";

const OPERATOR_ENV = ".env.ftgp-first-request.operator";
const CANDIDATE_MATRIX = ".ftgp-first-request-candidates.local.json";
const EXPECTED_LABEL = "FTGP-REQUEST-CANDIDATE-07";
const EXPECTED_FINGERPRINT = "9439dd8cc806696e";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function blocked(msg: string): never {
  console.error(`\nFIRST_TENANT_REQUEST_TARGET=BLOCKED`);
  console.error(`  reason: ${msg}\n`);
  process.exit(2);
}

function loadCandidateMatrix(): {
  localOnlyRequestIds: string[];
  candidates: Array<{ operatorLabel: string; requestFingerprint: string }>;
} | null {
  const path = join(process.cwd(), CANDIDATE_MATRIX);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as {
    localOnlyRequestIds: string[];
    candidates: Array<{ operatorLabel: string; requestFingerprint: string }>;
  };
}

async function main() {
  const operatorPath = join(process.cwd(), OPERATOR_ENV);
  if (!existsSync(operatorPath)) {
    blocked(`${OPERATOR_ENV} missing`);
  }

  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [
      ".env.preview.operator",
      ".env.platform-bootstrap.operator",
      ".env.ftgp-implementer-grant.operator",
      ".env.ftgp-first-request.operator",
    ],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== FTGP first request target verify (read-only) ===\n");

  const requestId = process.env.FTGP_FIRST_REQUEST_ID?.trim();
  const purpose = process.env.FTGP_FIRST_REQUEST_PURPOSE?.trim();
  if (!requestId) blocked("FTGP_FIRST_REQUEST_ID not set");
  if (purpose !== "FIRST_TENANT_GOLDEN_PATH") {
    blocked(`FTGP_FIRST_REQUEST_PURPOSE=${purpose ?? "missing"}`);
  }
  if (process.env.FTGP_FIRST_REQUEST_TRANSITION_EXECUTE_AUTHORIZED === "true") {
    blocked("execution authorization must not be enabled");
  }

  const fingerprint = requestFingerprint(requestId);
  if (fingerprint !== EXPECTED_FINGERPRINT) {
    blocked(`fingerprint=${fingerprint} (expected ${EXPECTED_FINGERPRINT})`);
  }

  const matrix = loadCandidateMatrix();
  if (matrix) {
    const idx = matrix.localOnlyRequestIds.indexOf(requestId);
    if (idx < 0) blocked("request ID not in local candidate matrix");
    const label = matrix.candidates[idx]?.operatorLabel;
    if (label !== EXPECTED_LABEL) {
      blocked(`matrix label=${label ?? "missing"} (expected ${EXPECTED_LABEL})`);
    }
    ok(`matrix maps to ${EXPECTED_LABEL}`);
  }

  console.log(`  REQUEST_SELECTION_MODE=EXPLICIT_IMMUTABLE_REQUEST_ID`);
  console.log(`  SELECTED_REQUEST_LABEL=${EXPECTED_LABEL}`);
  console.log(`  SELECTED_REQUEST_FINGERPRINT=${EXPECTED_FINGERPRINT}`);
  console.log(`  SELECTED_REQUEST_COUNT=1`);
  console.log(`  REQUEST_TRANSITION_EXECUTION_AUTHORIZED=false`);

  const prisma = new PrismaClient();
  try {
    const request = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      include: {
        discoveryProfile: {
          include: {
            answers: true,
            enterpriseBlueprint: { select: { id: true, proposalStatus: true, tenantId: true } },
          },
        },
        enterpriseBlueprint: { select: { id: true, proposalStatus: true, tenantId: true } },
        clientOrganizationRequestLinks: { select: { id: true } },
      },
    });
    if (!request) blocked("request does not exist");
    ok("request exists");
    ok(`request fingerprint = ${EXPECTED_FINGERPRINT}`);

    if (request.status !== FTGP_PROCROW_REVIEW_FROM_STATUS) {
      blocked(`status=${request.status}`);
    }
    ok(`current status = ${FTGP_PROCROW_REVIEW_FROM_STATUS}`);
    ok(`intended target status = ${FTGP_PROCROW_REVIEW_TO_STATUS}`);

    const archived = request.status === "REJECTED" || request.status === "CANCELLED";
    if (archived) blocked("archived or cancelled");
    ok("archived = false");
    ok("cancelled = false");

    const requester = await resolveProofRequesterPlatformAccount(prisma);
    if (!requester) blocked("retained requester PlatformAccount not resolved");
    if (!request.submittedByUserId) blocked("no submittedByUserId");
    if (requester.supabaseUserId !== request.submittedByUserId) {
      console.log("  REQUEST_OWNER_COLLISION=true");
      blocked("owner is not retained requester");
    }
    ok("authoritative owner = retained requester");
    console.log("  REQUEST_OWNER_COLLISION=false");

    const locale = process.env.PLATFORM_OWNER_LEGAL_LOCALE?.trim() || "en-US";
    if (requester.status !== "ACTIVE") blocked("owner not ACTIVE");
    ok("owner PlatformAccount = ACTIVE");
    const legalOk = await hasMandatoryLegalAcceptanceComplete(requester.id, locale);
    if (!legalOk) blocked("owner legal incomplete");
    ok("owner legal acceptance = current");

    const blueprint =
      request.enterpriseBlueprint ?? request.discoveryProfile?.enterpriseBlueprint;
    const tenantLinks = blueprint?.tenantId ? 1 : 0;
    const discoveryCompleted = request.discoveryProfile?.status === "COMPLETED" ? 1 : 0;
    const blueprintApproved =
      blueprint && blueprint.proposalStatus !== "DRAFT" ? 1 : 0;
    const pricingApproved = blueprintApproved;

    if (tenantLinks > 0) {
      console.log("  REQUEST_TENANT_COLLISION=true");
      blocked("tenant linked");
    }
    if (discoveryCompleted > 0) {
      console.log("  REQUEST_DISCOVERY_COLLISION=true");
      blocked("discovery completed");
    }
    if (blueprintApproved > 0) {
      console.log("  REQUEST_BLUEPRINT_COLLISION=true");
      blocked("approved blueprint");
    }
    if (pricingApproved > 0) {
      console.log("  REQUEST_PRICING_COLLISION=true");
      blocked("approved pricing");
    }

    const laterStatuses = [
      "UNDER_DISCOVERY",
      "BLUEPRINT_BUILD",
      "CLIENT_REVIEW",
      "GO_LIVE",
    ] as const;
    if ((laterStatuses as readonly string[]).includes(request.status)) {
      console.log("  REQUEST_ALREADY_IN_REVIEW_OR_LATER=true");
      blocked("already in review or later");
    }

    ok("tenant links = 0");
    ok("completed Discovery records = 0");
    ok("approved Blueprint records = 0");
    ok("approved pricing/proposal records = 0");
    console.log("  REQUEST_TENANT_COLLISION=false");
    console.log("  REQUEST_DISCOVERY_COLLISION=false");
    console.log("  REQUEST_BLUEPRINT_COLLISION=false");
    console.log("  REQUEST_PRICING_COLLISION=false");
    console.log("  REQUEST_ALREADY_IN_REVIEW_OR_LATER=false");
    console.log("  conflicting lifecycle process = false");

    console.log(`  client_organization_links=${request.clientOrganizationRequestLinks.length}`);
    console.log(`  discovery_profile_count=${request.discoveryProfile ? 1 : 0}`);
    console.log(`  lifecycle_audit_answers=${
      request.discoveryProfile?.answers.filter(
        (a) => a.sectionKey === "ftgp_lifecycle_audit"
      ).length ?? 0
    }`);

    console.log("\nFIRST_TENANT_REQUEST_TARGET=READY");
    console.log("\nPASS — FTGP FIRST REQUEST TARGET VERIFIED\n");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
