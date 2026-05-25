/**
 * Read-only public → admin → discovery pipeline verification (MEEM + Rimal).
 *
 *   npm run request:pipeline:verify
 *   npm run discovery:verify:meem
 *   npm run discovery:verify:rimal
 *
 * Env: .env.staging (DATABASE_URL). Optional TENANT_SLUG / MEEM_SLUG overrides.
 */

import { MEEM_REFERENCE_CODE, MEEM_TENANT_SLUG } from "../src/lib/constants/meem";
import {
  RIMAL_REFERENCE_CODE,
  RIMAL_TENANT_SLUG,
} from "../src/lib/constants/rimal";
import { resolveSectorTemplateKey } from "../src/lib/org-intelligence/resolve-sector";
import { createScriptPrisma } from "../src/lib/prisma-script";

const prisma = createScriptPrisma();

type ChainTarget = "meem" | "rimal" | "all";

function parseTarget(): ChainTarget {
  const arg = process.argv.find((a) => a.startsWith("--target="));
  const v = arg?.split("=")[1] ?? process.env.PIPELINE_VERIFY_TARGET ?? "all";
  if (v === "meem" || v === "rimal") return v;
  return "all";
}

async function verifyRequestChain(opts: {
  label: string;
  referenceCode: string;
  tenantSlug: string;
  expectedIndustry?: string;
  expectedSector: string;
  forbidLogisticsModule?: boolean;
  allowGoLive?: boolean;
}) {
  let failed = false;
  const fail = (msg: string) => {
    console.error(`  FAIL: ${msg}`);
    failed = true;
  };
  const ok = (msg: string) => console.log(`  OK: ${msg}`);

  console.log(`\n=== ${opts.label} (${opts.referenceCode}) ===`);

  const request = await prisma.implementationRequest.findUnique({
    where: { referenceCode: opts.referenceCode },
    include: {
      requestedModules: true,
      discoveryProfile: {
        include: {
          orgIntelligence: true,
          answers: {
            where: {
              sectionKey: "org_intelligence",
              questionKey: "sectorTemplateKey",
            },
          },
        },
      },
      enterpriseBlueprint: {
        include: { tenant: { select: { slug: true, id: true } } },
      },
    },
  });

  if (!request) {
    fail(`Request not found for reference ${opts.referenceCode}`);
    return failed;
  }

  ok(`Request id ${request.id} status ${request.status}`);

  const allowedStatuses = opts.allowGoLive
    ? ["PENDING_REVIEW", "UNDER_DISCOVERY", "READY_FOR_BLUEPRINT", "GO_LIVE"]
    : ["PENDING_REVIEW", "UNDER_DISCOVERY", "READY_FOR_BLUEPRINT"];
  if (!allowedStatuses.includes(request.status)) {
    fail(`Unexpected status ${request.status}`);
  }

  if (opts.expectedIndustry && request.industry !== opts.expectedIndustry) {
    fail(`Industry ${request.industry ?? "(null)"} !== ${opts.expectedIndustry}`);
  } else if (opts.expectedIndustry) {
    ok(`Industry ${request.industry}`);
  }

  const resolved = resolveSectorTemplateKey({
    industry: request.industry,
    moduleKeys: request.requestedModules.map((m) => m.moduleKey),
  });
  if (resolved !== opts.expectedSector) {
    fail(`resolveSectorTemplateKey=${resolved}, expected ${opts.expectedSector}`);
  } else {
    ok(`Sector resolver ${resolved}`);
  }

  if (!request.discoveryProfile) {
    fail("No discovery profile linked");
  } else {
    ok(`Discovery profile ${request.discoveryProfile.id} (${request.discoveryProfile.status})`);

    const answerSector = request.discoveryProfile.answers[0]?.valueJson;
    const orgSector = request.discoveryProfile.orgIntelligence?.sectorTemplateKey;
    if (orgSector && orgSector !== opts.expectedSector) {
      fail(`OrgIntelligence sector ${orgSector} !== ${opts.expectedSector}`);
    } else if (orgSector) {
      ok(`OrgIntelligence sector ${orgSector}`);
    }
    if (typeof answerSector === "string" && answerSector !== opts.expectedSector) {
      fail(`Discovery answer sector ${answerSector} !== ${opts.expectedSector}`);
    }
  }

  const tenantSlug = request.enterpriseBlueprint?.tenant?.slug;
  if (tenantSlug !== opts.tenantSlug) {
    fail(`Tenant slug ${tenantSlug ?? "(none)"} !== ${opts.tenantSlug}`);
  } else if (tenantSlug) {
    ok(`Blueprint tenant ${tenantSlug}`);
  }

  if (opts.forbidLogisticsModule) {
    const mods = request.requestedModules.map((m) => m.moduleKey);
    if (mods.includes("logistics")) {
      fail("Logistics module present — MEEM bleed risk");
    } else {
      ok(`Modules (no logistics): ${mods.join(", ") || "(none)"}`);
    }
  }

  const otherSlug = opts.tenantSlug === MEEM_TENANT_SLUG ? RIMAL_TENANT_SLUG : MEEM_TENANT_SLUG;
  const other = await prisma.tenant.findUnique({ where: { slug: otherSlug }, select: { id: true } });
  const bpTenantId = request.enterpriseBlueprint?.tenant?.id;
  if (other && bpTenantId && bpTenantId === other.id) {
    fail(`Blueprint tenant id matches other lighthouse ${otherSlug}`);
  }

  return failed;
}

async function main() {
  const target = parseTarget();
  console.log(`Pipeline verify target: ${target}`);

  let anyFailed = false;

  if (target === "meem" || target === "all") {
    const meemFailed = await verifyRequestChain({
      label: "MEEM lighthouse",
      referenceCode: MEEM_REFERENCE_CODE,
      tenantSlug: MEEM_TENANT_SLUG,
      expectedSector: "logistics",
      allowGoLive: true,
    });
    anyFailed = anyFailed || meemFailed;
  }

  if (target === "rimal" || target === "all") {
    const rimalFailed = await verifyRequestChain({
      label: "Rimal construction",
      referenceCode: RIMAL_REFERENCE_CODE,
      tenantSlug: RIMAL_TENANT_SLUG,
      expectedIndustry: "construction",
      expectedSector: "construction",
      forbidLogisticsModule: true,
      allowGoLive: true,
    });
    anyFailed = anyFailed || rimalFailed;
  }

  if (anyFailed) {
    console.error("\nPipeline verification FAILED.");
    process.exit(1);
  }
  console.log("\nPipeline verification PASSED.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
