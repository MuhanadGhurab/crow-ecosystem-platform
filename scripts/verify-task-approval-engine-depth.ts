/**
 * G8 — Tasks / Approvals engine depth (read-only).
 *
 *   npm run tasks-approvals:verify
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ERP_MODULE_CATALOG } from "../src/lib/constants/erp-module-catalog";
import {
  MODULE_TASK_APPROVAL_MAP,
  TASK_APPROVAL_FORBIDDEN_CLAIM_PHRASES,
  TASK_APPROVAL_RECOMMENDED_WORKFLOWS,
  TASK_APPROVAL_SAREA_PERSONAS,
  TASK_APPROVAL_SECTOR_NOTES,
} from "../src/lib/constants/task-approval-engine-depth";

const ROOT = join(import.meta.dirname, "..");

const DEEPENED_MODULE_KEYS = [
  "hr",
  "finance",
  "crm",
  "sales",
  "procurement",
  "inventory",
  "warehouse",
  "logistics",
] as const;

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main() {
  let passed = true;
  const check = (cond: boolean, passMsg: string, failMsg: string) => {
    if (cond) ok(passMsg);
    else {
      fail(failMsg);
      passed = false;
    }
  };

  console.log("\n=== G8 Tasks / Approvals engine depth ===\n");

  const tasksEntry = ERP_MODULE_CATALOG.find((e) => e.erpKey === "tasks");
  const workflowsEntry = ERP_MODULE_CATALOG.find((e) => e.cemModuleKey === "workflows");

  check(Boolean(tasksEntry), "Tasks / Approvals catalog entry exists", "missing tasks in catalog");
  check(Boolean(workflowsEntry), "Workflows catalog entry exists", "missing workflows in catalog");

  if (tasksEntry) {
    check(
      tasksEntry.dependencies.includes("workflows") &&
        tasksEntry.dependencies.includes("hr") &&
        tasksEntry.dependencies.includes("finance") &&
        tasksEntry.dependencies.includes("logistics") &&
        tasksEntry.dependencies.includes("cybercrow"),
      "Tasks dependencies span workflows, modules, and CyberCrow",
      "Tasks dependencies incomplete"
    );
    check(
      (tasksEntry.cyberCrowRisks?.length ?? 0) >= 4 &&
        (tasksEntry.sareaExperienceHints?.length ?? 0) >= 3,
      "Tasks catalog has CyberCrow and SAREA hints",
      "Tasks catalog missing posture hints"
    );
    check(
      (tasksEntry.futureOnlyCapabilities?.length ?? 0) >= 5,
      "Tasks catalog lists future-only capabilities (no BPM/RPA claims)",
      "Tasks futureOnlyCapabilities thin"
    );
  }

  if (workflowsEntry) {
    check(
      workflowsEntry.dependencies.includes("tasks"),
      "Workflows depends on tasks",
      "Workflows missing tasks dependency"
    );
  }

  check(
    MODULE_TASK_APPROVAL_MAP.length >= 9,
    "Module task/approval map covers ERP modules",
    "MODULE_TASK_APPROVAL_MAP too small"
  );

  for (const key of DEEPENED_MODULE_KEYS) {
    check(
      MODULE_TASK_APPROVAL_MAP.some((m) => m.moduleKey === key && m.approvals.length >= 2),
      `Approval map includes ${key}`,
      `Missing or thin approval map for ${key}`
    );
  }

  check(
    TASK_APPROVAL_RECOMMENDED_WORKFLOWS.length >= 6,
    "Engine recommended workflows defined",
    "TASK_APPROVAL_RECOMMENDED_WORKFLOWS thin"
  );
  check(
    TASK_APPROVAL_SAREA_PERSONAS.length >= 8,
    "SAREA task/approval personas defined",
    "SAREA personas thin"
  );
  check(
    TASK_APPROVAL_SECTOR_NOTES.length >= 5,
    "Sector notes for tasks/approvals",
    "Sector notes thin"
  );

  const constantsPath = "src/lib/constants/task-approval-engine-depth.ts";
  check(
    fileText(constantsPath).includes("MODULE_TASK_APPROVAL_MAP"),
    `${constantsPath} exists`,
    "task-approval-engine-depth constants missing"
  );

  const servicePath = "src/lib/services/task-approval-readiness.service.ts";
  check(
    fileText(servicePath).includes("getTaskApprovalEngineReadinessSnapshot"),
    `${servicePath} exports snapshot`,
    "task-approval-readiness.service missing"
  );

  const panelPath = "src/components/tenant/tasks/task-approval-operations-readiness-panel.tsx";
  check(
    fileText(panelPath).includes("TaskApprovalOperationsReadinessPanel"),
    `${panelPath} exists`,
    "readiness panel missing"
  );

  const tasksPage = fileText("src/app/[tenant]/tasks/page.tsx");
  check(
    tasksPage.includes("TaskApprovalOperationsReadinessPanel") &&
      tasksPage.includes("getTaskApprovalEngineReadinessSnapshot"),
    "Tasks page wires G8 readiness",
    "Tasks page missing G8 panel"
  );

  const workflowsPage = fileText("src/app/[tenant]/workflows/page.tsx");
  check(
    workflowsPage.includes("TaskApprovalOperationsReadinessPanel"),
    "Workflows page wires G8 readiness",
    "Workflows page missing G8 panel"
  );

  const forbiddenLower = TASK_APPROVAL_FORBIDDEN_CLAIM_PHRASES.map((p) => p.toLowerCase());
  const userFacingBundle = [tasksPage, workflowsPage, fileText(panelPath)].join("\n");
  const catalogPurpose =
    (tasksEntry?.businessPurpose ?? "") + (workflowsEntry?.businessPurpose ?? "");

  function hasPositiveForbiddenClaim(text: string, phrase: string): boolean {
    const lower = text.toLowerCase();
    const p = phrase.toLowerCase();
    let idx = 0;
    while ((idx = lower.indexOf(p, idx)) !== -1) {
      const before = lower.slice(Math.max(0, idx - 72), idx);
      if (/\b(not|no|without|nor)\b[^.]{0,68}$/i.test(before)) {
        idx += p.length;
        continue;
      }
      if (/\bor\s+$/.test(before.slice(-4))) {
        idx += p.length;
        continue;
      }
      return true;
    }
    return false;
  }

  for (const phrase of forbiddenLower) {
    if (phrase === "workflow automation engine") continue;
    check(
      !hasPositiveForbiddenClaim(userFacingBundle, phrase) &&
        !hasPositiveForbiddenClaim(catalogPurpose, phrase),
      `No positive forbidden claim: "${phrase}"`,
      `Possible overclaim: "${phrase}"`
    );
  }

  const docPath = "docs/internal/G8_TASKS_APPROVALS_ENGINE_DEPTH.md";
  try {
    const doc = fileText(docPath);
    check(doc.includes("G8"), `${docPath} documents G8`, "G8 doc missing title");
    check(doc.includes("audit"), `${docPath} includes audit`, "G8 doc missing audit section");
  } catch {
    fail(`${docPath} not found — create before marking G8 passed`);
    passed = false;
  }

  console.log(passed ? "\nG8 tasks-approvals verify: PASSED\n" : "\nG8 tasks-approvals verify: FAILED\n");
  process.exit(passed ? 0 : 1);
}

main();
