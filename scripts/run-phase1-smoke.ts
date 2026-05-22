/**
 * Phase 1 end-to-end smoke test (DB + pipeline).
 * Usage: npm run smoke:phase1
 * Optional: SMOKE_BASE_URL=http://localhost:3002
 */
import { upsertDiscoveryAnswer } from "../src/lib/services/discovery.service";
import { createImplementationRequest } from "../src/lib/services/implementation-request.service";
import {
  completeDiscoveryAndCreateBlueprint,
  provisionAndInitializeTenant,
  startDiscovery,
} from "../src/lib/services/pipeline.service";
import { slugifyOrganization } from "../src/lib/slugify";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3002";
const checkHealth = process.env.SMOKE_CHECK_HEALTH === "1";

async function preflightHealth() {
  if (!checkHealth) return;
  console.log("0. Health preflight…");
  try {
    const res = await fetch(`${baseUrl}/api/health`);
    const body = (await res.json()) as {
      ok?: boolean;
      db?: string;
      auth?: string;
      mockData?: boolean;
    };
    if (body.db !== "ok") {
      throw new Error(`GET /api/health db=${body.db ?? "unknown"} (expected ok)`);
    }
    if (body.mockData) {
      throw new Error("USE_MOCK_DATA=true — smoke requires live Postgres");
    }
    console.log(`   ✓ health db=${body.db} auth=${body.auth}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Health preflight failed (${baseUrl}/api/health): ${msg}. Start dev server or unset SMOKE_CHECK_HEALTH.`
    );
  }
}

const stamp = Date.now().toString(36);
const orgName = `E2E Smoke ${stamp}`;
const slug = `${slugifyOrganization(orgName)}-${stamp}`.slice(0, 48);

async function main() {
  console.log("\n=== Phase 1 smoke test ===\n");

  await preflightHealth();

  console.log("1. Submit implementation request…");
  const request = await createImplementationRequest({
    organizationName: orgName,
    industry: "Technology",
    employeeBand: "51-200",
    countryCode: "SA",
    planKey: "growth",
    moduleKeys: ["hr", "crm", "finance"],
    securityPackageKeys: ["crow_shield"],
    contact: {
      fullName: "Smoke Tester",
      email: `smoke+${stamp}@example.com`,
      jobTitle: "IT Director",
    },
    notes: "Automated Phase 1 smoke test",
  });
  console.log(`   ✓ ${request.referenceCode} (${request.id})`);

  console.log("2. Start discovery…");
  await startDiscovery(request.id);
  console.log("   ✓ UNDER_DISCOVERY");

  console.log("3. Save discovery answers…");
  await upsertDiscoveryAnswer(request.id, "organization", "operatingModel", "hybrid");
  await upsertDiscoveryAnswer(request.id, "organization", "employeeBand", "51-200");
  await upsertDiscoveryAnswer(request.id, "organization", "goLiveTarget", "Q3 2026");
  await upsertDiscoveryAnswer(request.id, "modules", "confirmedKeys", ["hr", "crm", "finance"]);
  console.log("   ✓ organization + modules");

  console.log("4. Complete discovery → blueprint…");
  const blueprint = await completeDiscoveryAndCreateBlueprint(request.id);
  console.log(`   ✓ blueprint ${blueprint.id} (${blueprint.modules.length} modules)`);

  console.log("5. Approve & provision tenant…");
  const tenant = await provisionAndInitializeTenant(
    blueprint.id,
    slug,
    orgName,
    "growth"
  );
  console.log(`   ✓ tenant /${tenant.slug} → GO_LIVE`);

  const links = {
    adminRequest: `${baseUrl}/admin/requests/${request.id}`,
    discoveryOrg: `${baseUrl}/discovery/${request.id}/organization`,
    discoverySummary: `${baseUrl}/discovery/${request.id}/summary`,
    blueprintOverview: `${baseUrl}/blueprints/${blueprint.id}/overview`,
    tenantDashboard: `${baseUrl}/${tenant.slug}/dashboard`,
  };

  console.log("\n=== Open in your browser (signed in as platform admin) ===\n");
  for (const [label, url] of Object.entries(links)) {
    console.log(`  ${label}: ${url}`);
  }
  console.log("\nDone.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
