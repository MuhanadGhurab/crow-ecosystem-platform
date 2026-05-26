/**
 * F8/F9 — Organic request E2E verification (read-only).
 *
 *   npm run request:e2e:dry
 *   npm run request:e2e:verify
 *   npm run request:e2e:verify -- --reference=CROW-2026-XXXXXX
 *   npm run request:e2e:organic -- --reference=CROW-2026-XXXXXX
 *   npm run onboarding:verify -- --reference=CROW-2026-XXXXXX
 *
 * Optional expectations (F9):
 *   --expect-blueprint
 *   --expect-tenant
 *   --expect-sector=construction
 *   --expect-plan=startup
 *
 * Env: .env.staging (DATABASE_URL). No writes, no resets.
 */

import { MEEM_REFERENCE_CODE, MEEM_TENANT_SLUG } from "../src/lib/constants/meem";
import { RIMAL_REFERENCE_CODE, RIMAL_TENANT_SLUG } from "../src/lib/constants/rimal";
import {
  getDiscoveryTemplate,
  listDiscoveryTemplateKeys,
} from "../src/lib/constants/industry-templates";
import { resolveSectorTemplateKey } from "../src/lib/org-intelligence/resolve-sector";
import {
  SECTOR_TEMPLATE_KEYS,
  getSectorTemplateModel,
} from "../src/lib/org-intelligence/sector-template-data";
import { generateImplementationReferenceCode } from "../src/lib/pipeline/reference-code";
import { createScriptPrisma } from "../src/lib/prisma-script";

const prisma = createScriptPrisma();

const REF_PATTERN = /^CROW-\d{4}-[A-Z0-9]{6}$/;

function parseReference(): string | undefined {
  const arg = process.argv.find((a) => a.startsWith("--reference="));
  return arg?.split("=")[1]?.trim().toUpperCase();
}

function isDryOnly(): boolean {
  return process.argv.includes("--dry") || process.env.REQUEST_E2E_DRY === "1";
}

function flagEnabled(name: string): boolean {
  return process.argv.includes(`--expect-${name}`);
}

function flagValue(name: string): string | undefined {
  const arg = process.argv.find((a) => a.startsWith(`--expect-${name}=`));
  return arg?.split("=")[1]?.trim();
}

function verifyTemplatePacks(): boolean {
  let failed = false;
  const fail = (msg: string) => {
    console.error(`  FAIL: ${msg}`);
    failed = true;
  };
  const ok = (msg: string) => console.log(`  OK: ${msg}`);

  console.log("\n=== Discovery JSON template packs ===");

  const keys = listDiscoveryTemplateKeys();
  for (const key of SECTOR_TEMPLATE_KEYS) {
    if (!keys.includes(key)) {
      fail(`Missing discovery JSON pack for industry key "${key}"`);
      continue;
    }
    const pack = getDiscoveryTemplate(key);
    if (!pack) {
      fail(`getDiscoveryTemplate("${key}") returned null`);
      continue;
    }
    if (!pack.departments?.length) {
      fail(`Pack "${key}" has no departments`);
      continue;
    }
    if (!pack.workflows?.length) {
      fail(`Pack "${key}" has no workflows`);
      continue;
    }
    ok(`${key}: ${pack.departments.length} depts, ${pack.workflows.length} workflows`);
  }

  console.log("\n=== Org-intelligence sector templates ===");
  for (const key of SECTOR_TEMPLATE_KEYS) {
    const model = getSectorTemplateModel(key);
    if (!model.departments.length) {
      fail(`Org-intelligence "${key}" has no departments`);
      continue;
    }
    if (!model.workflows.length) {
      fail(`Org-intelligence "${key}" has no workflows`);
      continue;
    }
    if (!model.sareaProfiles.length) {
      fail(`Org-intelligence "${key}" has no SAREA profiles`);
      continue;
    }
    ok(`${key}: ${model.departments.length} depts, ${model.sareaProfiles.length} SAREA profiles`);
  }

  const sample = generateImplementationReferenceCode();
  if (!REF_PATTERN.test(sample)) {
    fail(`Reference format invalid: ${sample}`);
  } else {
    ok(`Reference format sample ${sample}`);
  }

  const neutral = resolveSectorTemplateKey({ industry: "", moduleKeys: [] });
  if (neutral !== "retail") {
    fail(`Ambiguous sector default ${neutral}, expected retail`);
  } else {
    ok("Ambiguous sector default is retail (F7 neutral)");
  }

  return failed;
}

async function verifyRequestByReference(referenceCode: string): Promise<boolean> {
  let failed = false;
  const fail = (msg: string) => {
    console.error(`  FAIL: ${msg}`);
    failed = true;
  };
  const ok = (msg: string) => console.log(`  OK: ${msg}`);

  console.log(`\n=== Organic request chain (${referenceCode}) ===`);

  if (!REF_PATTERN.test(referenceCode)) {
    fail(`Reference does not match CROW-{year}-{6-char}: ${referenceCode}`);
    return true;
  }

  if (referenceCode === MEEM_REFERENCE_CODE) {
    console.log("  (MEEM lighthouse — use npm run discovery:verify:meem for dedicated checks)");
  }
  if (referenceCode === RIMAL_REFERENCE_CODE) {
    console.log("  (Rimal seed — use npm run discovery:verify:rimal for dedicated checks)");
  }

  const request = await prisma.implementationRequest.findUnique({
    where: { referenceCode },
    include: {
      requestedModules: true,
      requestedPlans: true,
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
    fail(`No request found for reference ${referenceCode}`);
    return true;
  }

  ok(`Request ${request.id} status ${request.status}`);
  if (request.industry) {
    ok(`Industry ${request.industry}`);
  } else {
    fail("Industry not set on request");
  }

  const expectedSector = resolveSectorTemplateKey({
    industry: request.industry,
    moduleKeys: request.requestedModules.map((m) => m.moduleKey),
  });
  ok(`Resolved sector ${expectedSector}`);

  const pack = getDiscoveryTemplate(request.industry ?? "");
  if (pack) {
    ok(`Discovery JSON pack available for industry ${request.industry}`);
  } else if (request.industry) {
    fail(`No discovery JSON pack for industry ${request.industry}`);
  }

  if (!request.discoveryProfile) {
    fail("No discovery profile — admin must Start discovery from PENDING_REVIEW");
  } else {
    ok(`Discovery profile ${request.discoveryProfile.id} (${request.discoveryProfile.status})`);
    const answerSector = request.discoveryProfile.answers[0]?.valueJson;
    const orgSector = request.discoveryProfile.orgIntelligence?.sectorTemplateKey;
    if (orgSector && orgSector !== expectedSector) {
      fail(`OrgIntelligence sector ${orgSector} !== resolved ${expectedSector}`);
    } else if (orgSector) {
      ok(`OrgIntelligence sector ${orgSector}`);
    }
    if (typeof answerSector === "string" && answerSector !== expectedSector) {
      fail(`Discovery answer sector ${answerSector} !== resolved ${expectedSector}`);
    }
  }

  const mods = request.requestedModules.map((m) => m.moduleKey);
  ok(`Modules: ${mods.join(", ") || "(none)"}`);

  const blueprint = request.enterpriseBlueprint;
  if (flagEnabled("blueprint") && !blueprint) {
    fail("--expect-blueprint set but no enterpriseBlueprint on request");
  }
  if (blueprint) {
    ok(`Blueprint ${blueprint.id} status ${blueprint.status}`);
    const orgSector = request.discoveryProfile?.orgIntelligence?.sectorTemplateKey;
    if (orgSector && orgSector !== expectedSector) {
      fail(`Blueprint org sector ${orgSector} !== resolved ${expectedSector}`);
    }
  }

  const expectSector = flagValue("sector");
  if (expectSector && expectedSector !== expectSector) {
    fail(`--expect-sector=${expectSector} but resolved ${expectedSector}`);
  } else if (expectSector) {
    ok(`Sector matches --expect-sector=${expectSector}`);
  }

  const planKey = request.requestedPlans[0]?.planKey;
  const expectPlan = flagValue("plan");
  if (expectPlan && planKey !== expectPlan) {
    fail(`--expect-plan=${expectPlan} but request plan is ${planKey ?? "(none)"}`);
  } else if (expectPlan && planKey) {
    ok(`Plan matches --expect-plan=${expectPlan}`);
  }

  const bpSlug = blueprint?.tenant?.slug;
  if (flagEnabled("tenant") && !bpSlug) {
    fail("--expect-tenant set but blueprint has no tenant");
  }
  if (bpSlug) {
    ok(`Blueprint tenant ${bpSlug}`);
    if (bpSlug === MEEM_TENANT_SLUG && referenceCode !== MEEM_REFERENCE_CODE) {
      fail("Organic request blueprint points at MEEM tenant");
    }
    if (bpSlug === RIMAL_TENANT_SLUG && referenceCode !== RIMAL_REFERENCE_CODE) {
      console.log("  NOTE: Blueprint on Rimal tenant (expected for Rimal seed only)");
    }
    const dupCount = await prisma.tenant.count({ where: { slug: bpSlug } });
    if (dupCount > 1) {
      fail(`Duplicate tenant rows for slug ${bpSlug} (${dupCount})`);
    } else {
      ok(`Tenant slug ${bpSlug} unique in DB`);
    }
  }

  if (blueprint) {
    if (blueprint.requestId !== request.id) {
      fail("Blueprint requestId mismatch");
    } else {
      ok("Blueprint requestId matches request");
    }
  }

  const lighthouseSlugs = [MEEM_TENANT_SLUG, RIMAL_TENANT_SLUG];
  if (
    bpSlug &&
    !lighthouseSlugs.includes(bpSlug) &&
    request.discoveryProfile &&
    blueprint
  ) {
    ok("Organic path reached blueprint on non-lighthouse tenant");
  }

  return failed;
}

async function main() {
  const dry = isDryOnly();
  const reference = parseReference();

  const flags = [
    flagEnabled("blueprint") ? "blueprint" : null,
    flagEnabled("tenant") ? "tenant" : null,
    flagValue("sector") ? `sector=${flagValue("sector")}` : null,
    flagValue("plan") ? `plan=${flagValue("plan")}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  console.log(
    `F8/F9 organic E2E verify (dry=${dry}, reference=${reference ?? "(none)"}${flags ? `, expect: ${flags}` : ""})`
  );

  const packsFailed = verifyTemplatePacks();
  let chainFailed = false;

  if (!dry) {
    if (reference) {
      chainFailed = await verifyRequestByReference(reference);
    } else {
      console.log(
        "\n=== DB chain skipped ===\n  Pass --reference=CROW-YYYY-XXXXXX after a live /request submission,\n  or run npm run request:pipeline:verify for MEEM + Rimal seeds."
      );
    }
  }

  if (packsFailed || chainFailed) {
    console.error("\nOrganic request E2E verification FAILED.");
    process.exit(1);
  }
  console.log("\nOrganic request E2E verification PASSED.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
