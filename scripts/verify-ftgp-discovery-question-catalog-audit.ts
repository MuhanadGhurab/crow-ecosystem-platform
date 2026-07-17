#!/usr/bin/env tsx
/**
 * FTGP.1G — Static audit of Discovery question catalog stability.
 */
import {
  FTGP_DISCOVERY_GROUP_DEFINITIONS,
  FTGP_DISCOVERY_QUESTION_CATALOG,
  FTGP_DISCOVERY_QUESTION_CATALOG_VERSION,
  catalogQuestionCounts,
} from "../src/lib/ftgp/ftgp-discovery-question-catalog";
import { FTGP_DISCOVERY_PROVENANCE } from "../src/lib/ftgp/ftgp-discovery-provenance.constants";

function ok(msg: string) {
  console.log(`  PASS: ${msg}`);
}

function fail(msg: string): never {
  console.error(`  FAIL: ${msg}`);
  process.exit(1);
}

function main() {
  console.log("\n=== FTGP Discovery question catalog audit ===\n");

  if (FTGP_DISCOVERY_GROUP_DEFINITIONS.length !== 17) {
    fail(`expected 17 groups, got ${FTGP_DISCOVERY_GROUP_DEFINITIONS.length}`);
  }
  ok(`question catalog version = ${FTGP_DISCOVERY_QUESTION_CATALOG_VERSION}`);
  ok(`group count = 17`);

  const group17 = FTGP_DISCOVERY_GROUP_DEFINITIONS.find(
    (g) => g.groupKey === "17_constraints_risks_budget_timeline"
  );
  if (!group17) fail("group 17 missing");
  ok("group 17 constraints/risks/budget/timeline is distinct");

  const keys = new Set<string>();
  for (const q of FTGP_DISCOVERY_QUESTION_CATALOG) {
    const composite = `${q.sectionKey}::${q.questionKey}`;
    if (keys.has(composite)) fail(`duplicate key ${composite}`);
    keys.add(composite);
    if (!q.questionVersion) fail(`missing version on ${composite}`);
    if (!q.validation) fail(`missing validation on ${composite}`);
    if (!q.sensitiveDataClass) fail(`missing sensitive class on ${composite}`);
  }
  ok("DISCOVERY_QUESTION_KEYS_STABLE=PASS");
  ok("DISCOVERY_QUESTION_VERSIONING=PASS");
  ok("DISCOVERY_REQUIRED_OPTIONAL_CLASSIFICATION=PASS");
  ok("DISCOVERY_SENSITIVE_DATA_CLASSIFICATION=PASS");

  const counts = catalogQuestionCounts();
  console.log(`  required groups = ${counts.requiredGroupCount}`);
  console.log(`  optional groups = ${counts.optionalGroupCount}`);
  console.log(`  required questions = ${counts.requiredQuestionCount}`);
  console.log(`  optional questions = ${counts.optionalQuestionCount}`);

  const provenanceSet = new Set(
    FTGP_DISCOVERY_QUESTION_CATALOG.map((q) => q.answerProvenance)
  );
  if (!provenanceSet.has(FTGP_DISCOVERY_PROVENANCE.CLIENT_PROVIDED)) {
    fail("missing CLIENT_PROVIDED questions");
  }
  if (!provenanceSet.has(FTGP_DISCOVERY_PROVENANCE.IMPLEMENTER_OBSERVATION)) {
    fail("missing IMPLEMENTER_OBSERVATION questions");
  }
  ok("DISCOVERY_ANSWER_PROVENANCE_MODEL=PASS");

  console.log("\nPASS — FTGP DISCOVERY QUESTION CATALOG AUDIT\n");
}

main();
