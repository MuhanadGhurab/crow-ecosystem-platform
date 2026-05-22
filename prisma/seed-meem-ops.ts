/**

 * MEEM Global operational enrichment (idempotent).

 *

 *   npm run db:seed:meem:ops

 *

 * Requires base catalog + MEEM pipeline (`npm run db:seed:meem`).

 */

import { enrichMeemGlobalOps } from "../src/lib/services/meem-ops.service";



async function main() {

  console.log("Enriching MEEM Global (meem-global)…");

  const result = await enrichMeemGlobalOps();



  console.log(`Tenant: /${result.tenantSlug}/dashboard`);

  console.log(`Workflows (${result.workflowNames.length}):`);

  for (const name of result.workflowNames) {

    console.log(`  · ${name}`);

  }

  console.log(`AI extras: ${result.aiExtraKeys.join(", ")}`);

  console.log(

    `Structure: ${result.departments} depts · ${result.branches} branches · ${result.roles} roles`

  );

  console.log(

    `Samples: ${result.hrEmployees} HR · ${result.crmAccounts} CRM · ${result.salesOpportunities} sales · ${result.inventoryItems} inventory · ${result.warehouseLocations} warehouse · ${result.financeEntries} finance`

  );

  console.log(

    `Verify: /${result.tenantSlug}/sales · /${result.tenantSlug}/inventory · /${result.tenantSlug}/warehouse · /${result.tenantSlug}/finance · /${result.tenantSlug}/workflows · /${result.tenantSlug}/logistics`

  );

}



main().catch((e) => {

  console.error(e);

  process.exit(1);

});


