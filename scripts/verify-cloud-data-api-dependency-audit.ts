#!/usr/bin/env tsx
/**
 * CLOUD.1B — repository Data API dependency audit (read-only scan).
 */
import { summarizeDependencyAudit } from "./lib/cloud-data-api-dependency-scan";
import {
  assertCompleteTableClassification,
  classificationSummary,
  CLOUD_PUBLIC_TABLE_CLASSIFICATION,
} from "./lib/cloud-table-classification";

function main() {
  const summary = summarizeDependencyAudit();
  assertCompleteTableClassification();

  console.log("\n=== CLOUD Data API dependency audit ===\n");
  console.log(`PRODUCTION_BUSINESS_DATA_API_DEPENDENCIES=${summary.productionBusinessDataApiDependencies}`);
  console.log(`BROWSER_BUSINESS_DATA_API_DEPENDENCIES=${summary.browserBusinessDataApiDependencies}`);
  console.log(`SERVER_ANON_KEY_DATA_API_DEPENDENCIES=${summary.serverAnonKeyDataApiDependencies}`);
  console.log(`SERVER_SERVICE_ROLE_DATA_API_DEPENDENCIES=${summary.serverServiceRoleDataApiDependencies}`);
  console.log(`AUTH_ONLY_SUPABASE_DEPENDENCIES=${summary.authOnlySupabaseDependencies}`);
  console.log(`PRISMA_DIRECT_DATABASE_DOMAINS=${summary.prismaDirectDatabaseDomains}`);

  if (summary.businessDependencies.length > 0) {
    console.log("\nBusiness Data API hits:");
    for (const dep of summary.businessDependencies) {
      console.log(`  ${dep.file}:${dep.line} ${dep.operation} ${dep.tableOrRpc ?? "?"}`);
    }
    console.error("\nFAIL — business-table PostgREST dependencies found\n");
    process.exit(1);
  }

  console.log("\nTable classification summary:");
  console.log(JSON.stringify(classificationSummary(), null, 2));
  console.log(`\nTables classified: ${CLOUD_PUBLIC_TABLE_CLASSIFICATION.length}`);

  console.log("\nPASS — NO PRODUCTION BUSINESS DATA API DEPENDENCIES IN REPOSITORY\n");
}

main();
