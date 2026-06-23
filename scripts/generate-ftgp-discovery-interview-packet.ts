#!/usr/bin/env tsx
/**
 * FTGP.1G — Generate gitignored Discovery interview packet and future mutation manifests.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  FTGP_DISCOVERY_GROUP_DEFINITIONS,
  FTGP_DISCOVERY_QUESTION_CATALOG_VERSION,
  catalogQuestionCounts,
} from "../src/lib/ftgp/ftgp-discovery-question-catalog";

const INTERVIEW_PLAN_PATH = ".ftgp-discovery-interview-plan.local.json";
const CLIENT_MANIFEST_PATH = ".ftgp-discovery-client-answer-manifest";
const IMPLEMENTER_MANIFEST_PATH = ".ftgp-discovery-implementer-observation-manifest";

const CANDIDATE_07_FINGERPRINT = "9439dd8cc806696e";
const CANDIDATE_07_OWNER_FINGERPRINT = "876863fe8c15c5c3";
const PROFILE_FINGERPRINT = "383de76e7e784e22";

function main() {
  const counts = catalogQuestionCounts();

  const interviewPlan = {
    requestLabel: "FTGP-REQUEST-CANDIDATE-07",
    requestFingerprint: CANDIDATE_07_FINGERPRINT,
    ownerFingerprint: CANDIDATE_07_OWNER_FINGERPRINT,
    profileFingerprint: PROFILE_FINGERPRINT,
    profileStatus: "IN_PROGRESS",
    questionCatalogVersion: FTGP_DISCOVERY_QUESTION_CATALOG_VERSION,
    requiredGroupCount: counts.requiredGroupCount,
    optionalGroupCount: counts.optionalGroupCount,
    requiredQuestionCount: counts.requiredQuestionCount,
    optionalQuestionCount: counts.optionalQuestionCount,
    clientAnswerCaptureAuthorized: false,
    implementerObservationCaptureAuthorized: false,
    discoveryCompletionAuthorized: false,
    blueprintGenerationAuthorized: false,
    groups: FTGP_DISCOVERY_GROUP_DEFINITIONS.map((g) => ({
      groupKey: g.groupKey,
      title: g.title,
      requiredForCompletion: g.requiredForCompletion,
      facilitatorNotes: g.facilitatorNotes,
      clientFacingPurpose: g.clientFacingPurpose,
      evidenceChecklist: g.evidenceChecklist,
      sensitiveDataWarnings: g.sensitiveDataWarnings,
      followUpRules: g.followUpRules,
      saveAsDraftExpectation: g.saveAsDraftExpectation,
      completionRelevance: g.completionRelevance,
    })),
  };

  writeFileSync(
    join(process.cwd(), INTERVIEW_PLAN_PATH),
    `${JSON.stringify(interviewPlan, null, 2)}\n`,
    "utf8"
  );

  const clientManifest = `# FTGP Discovery client answer capture manifest (template)
Execution authorized: false
Writes executed: false
Discovery completion authorized: false
Blueprint authorized: false

Request label: FTGP-REQUEST-CANDIDATE-07
Request fingerprint: ${CANDIDATE_07_FINGERPRINT}
Owner fingerprint: ${CANDIDATE_07_OWNER_FINGERPRINT}
Profile fingerprint: ${PROFILE_FINGERPRINT}

Expected future mutation:
- one explicit question
- one client-provided answer (provenance CLIENT_PROVIDED)
- one answer audit event
- zero lifecycle changes

Do not populate with real answer content until explicitly authorized.
`;

  const implementerManifest = `# FTGP Discovery IMPLEMENTER observation manifest (template)
Execution authorized: false
Writes executed: false
Discovery completion authorized: false
Blueprint authorized: false

Request label: FTGP-REQUEST-CANDIDATE-07
Request fingerprint: ${CANDIDATE_07_FINGERPRINT}
Profile fingerprint: ${PROFILE_FINGERPRINT}

Expected future mutation:
- one explicit internal observation
- one internal-provenance record (IMPLEMENTER_OBSERVATION)
- one audit event
- zero client-answer changes
- zero lifecycle changes

Do not populate with real observation content until explicitly authorized.
`;

  writeFileSync(join(process.cwd(), CLIENT_MANIFEST_PATH), clientManifest, "utf8");
  writeFileSync(join(process.cwd(), IMPLEMENTER_MANIFEST_PATH), implementerManifest, "utf8");

  console.log(`Wrote ${INTERVIEW_PLAN_PATH}`);
  console.log(`Wrote ${CLIENT_MANIFEST_PATH}`);
  console.log(`Wrote ${IMPLEMENTER_MANIFEST_PATH}`);
}

main();
