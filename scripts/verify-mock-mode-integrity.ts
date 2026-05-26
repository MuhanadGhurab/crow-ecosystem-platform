import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { MEEM_TENANT_SLUG } from "../src/lib/constants/meem";
import { RIMAL_MODULE_KEYS, RIMAL_TENANT_SLUG } from "../src/lib/constants/rimal";
import { getMockEnterpriseBlueprint } from "../src/lib/mock/blueprint";
import { getMockDiscoveryContext } from "../src/lib/mock/discovery";
import { isUseMockData } from "../src/lib/mock/env";
import { getMeemMockTenant } from "../src/lib/mock/meem-global";
import { MOCK_PIPELINE_REQUESTS } from "../src/lib/mock/pipeline";

type CheckResult = { ok: boolean; message: string };

const root = process.cwd();

function fileExists(relativePath: string): CheckResult {
  const fullPath = path.join(root, relativePath);
  const ok = existsSync(fullPath);
  return {
    ok,
    message: `${ok ? "OK" : "FAIL"} file ${relativePath}`,
  };
}

async function importResolves(relativePath: string): Promise<CheckResult> {
  try {
    const url = pathToFileURL(path.join(root, relativePath)).href;
    await import(url);
    return { ok: true, message: `OK import ${relativePath}` };
  } catch (error) {
    return {
      ok: false,
      message: `FAIL import ${relativePath}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function validateMockPipelineChain(): CheckResult[] {
  const results: CheckResult[] = [];

  for (const row of MOCK_PIPELINE_REQUESTS) {
    if (!row.discoveryAvailable) continue;
    const discovery = getMockDiscoveryContext(row.id);
    if (!discovery) {
      results.push({
        ok: false,
        message: `FAIL chain ${row.id}: discoveryAvailable=true but discovery context is null`,
      });
      continue;
    }

    if (!discovery.discoveryProfile?.answers?.length) {
      results.push({
        ok: false,
        message: `FAIL chain ${row.id}: discovery profile answers missing`,
      });
    } else {
      results.push({
        ok: true,
        message: `OK chain ${row.id}: discovery profile has ${discovery.discoveryProfile.answers.length} answers`,
      });
    }

    if (!row.blueprintId) continue;
    const blueprint = getMockEnterpriseBlueprint(row.blueprintId);
    if (!blueprint) {
      results.push({
        ok: false,
        message: `FAIL chain ${row.id}: blueprintId=${row.blueprintId} but mock blueprint not found`,
      });
      continue;
    }

    if (blueprint.requestId !== row.id) {
      results.push({
        ok: false,
        message: `FAIL chain ${row.id}: blueprint.requestId=${blueprint.requestId} mismatch`,
      });
    } else {
      results.push({
        ok: true,
        message: `OK chain ${row.id}: blueprint ${row.blueprintId} links request correctly`,
      });
    }
  }

  return results;
}

function validateTenantAssumptions(): CheckResult[] {
  const results: CheckResult[] = [];
  const meem = getMeemMockTenant(MEEM_TENANT_SLUG);

  if (!meem) {
    results.push({ ok: false, message: "FAIL tenant: MEEM mock tenant is missing" });
  } else {
    results.push({ ok: true, message: `OK tenant: ${MEEM_TENANT_SLUG} mock tenant present` });
    if (meem.blueprint?.request?.referenceCode && meem.blueprint?.request?.organizationName) {
      results.push({
        ok: true,
        message: `OK tenant: ${MEEM_TENANT_SLUG} blueprint request summary fields available`,
      });
    } else {
      results.push({
        ok: false,
        message: `FAIL tenant: ${MEEM_TENANT_SLUG} blueprint request summary fields are incomplete`,
      });
    }
  }

  if (RIMAL_MODULE_KEYS.some((key) => key === "logistics" || key === "warehouse")) {
    results.push({
      ok: false,
      message: `FAIL tenant: ${RIMAL_TENANT_SLUG} module keys contain logistics leakage`,
    });
  } else {
    results.push({
      ok: true,
      message: `OK tenant: ${RIMAL_TENANT_SLUG} module keys remain construction-scoped`,
    });
  }

  return results;
}

async function main() {
  const checks: CheckResult[] = [];

  checks.push(
    fileExists("src/lib/mock/env.ts"),
    fileExists("src/lib/mock/pipeline.ts"),
    fileExists("src/lib/mock/discovery.ts"),
    fileExists("src/lib/mock/blueprint.ts"),
    fileExists("src/lib/mock/meem-global.ts"),
    fileExists("src/lib/discovery-templates/logistics.json"),
    fileExists("src/lib/discovery-templates/construction.json"),
    fileExists("src/lib/discovery-templates/retail.json"),
    fileExists("src/lib/discovery-templates/healthcare.json"),
    fileExists("src/lib/discovery-templates/aviation.json"),
    fileExists("src/lib/sarea/studio-helpers.ts"),
    fileExists("src/lib/services/sarea-materialization.service.ts"),
    fileExists("src/lib/services/discovery-completion-gate.service.ts"),
    fileExists("src/lib/services/cybercrow-seed.service.ts"),
    fileExists("src/components/studio/sarea/sarea-tenant-health-panel.tsx")
  );

  checks.push(
    await importResolves("src/lib/mock/pipeline.ts"),
    await importResolves("src/lib/mock/discovery.ts"),
    await importResolves("src/lib/mock/blueprint.ts")
  );

  checks.push(...validateMockPipelineChain());
  checks.push(...validateTenantAssumptions());

  const mockModeEnabled = isUseMockData();
  checks.push({
    ok: true,
    message: `OK env: USE_MOCK_DATA=${mockModeEnabled ? "true" : "false"} (integrity check is environment-agnostic)`,
  });

  for (const check of checks) {
    console.log(check.message);
  }

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error(`\nMock mode integrity FAILED (${failed.length} checks failed).`);
    process.exit(1);
  }

  console.log(`\nMock mode integrity PASSED (${checks.length} checks).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
