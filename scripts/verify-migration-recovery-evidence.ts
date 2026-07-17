#!/usr/bin/env tsx
/**
 * CLOUD.1D — validate operator-attested migration recovery evidence (no secrets logged).
 */
import {
  assertHostedEnvNotLocalhost,
  loadHostedOperatorEnv,
} from "./lib/hosted-operator-env";
import { validateMigrationRecoveryEvidence } from "./lib/migration-recovery-evidence";

function main() {
  const envLoad = loadHostedOperatorEnv({
    primaryEnvFile: ".env.staging.runtime",
    supplementalEnvFiles: [".env.migration.recovery"],
  });
  assertHostedEnvNotLocalhost(envLoad);

  console.log("\n=== CLOUD.1D migration recovery evidence ===\n");
  console.log(`env_files=${envLoad.loadedFiles.join(",")}`);
  console.log(`target_classification=${envLoad.targetClassification}`);

  const validation = validateMigrationRecoveryEvidence();
  console.log(`reference_present=${validation.sanitized.referencePresent}`);
  console.log(`reference_length=${validation.sanitized.referenceLength}`);
  console.log(`verified_at=${validation.sanitized.verifiedAt ?? "(unset)"}`);
  console.log(`recovery_method=${validation.sanitized.method ?? "(unset)"}`);
  if (validation.sanitized.verifiedAtAgeHours !== null) {
    console.log(`verified_at_age_hours=${validation.sanitized.verifiedAtAgeHours.toFixed(2)}`);
  }
  console.log(
    `predates_migration_execution=${validation.sanitized.predatesMigrationExecution}`
  );

  if (!validation.valid) {
    console.log("\nRECOVERY_EVIDENCE_VERIFIED=false");
    for (const error of validation.errors) {
      console.error(`  ✗ ${error}`);
    }
    console.log("");
    process.exit(1);
  }

  console.log(`\nRECOVERY_EVIDENCE_VERIFIED=true`);
  console.log(`recovery_method=${validation.evidence?.method}`);
  console.log(`recovery_verified_at=${validation.evidence?.verifiedAt}`);
  console.log("\nPASS — OPERATOR RECOVERY EVIDENCE VALIDATED\n");
}

main();
