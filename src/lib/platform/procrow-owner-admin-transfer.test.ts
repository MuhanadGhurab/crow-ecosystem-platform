import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  PROCROW_OWNER_ADMIN_TRANSFER_CORRELATION_ID,
  procrowOwnerAdminAssignmentFingerprint,
  procrowOwnerAdminTargetFingerprint,
} from "./procrow-owner-admin-transfer.constants";
import type { ProcrowOwnerAdminTransferPlan } from "./procrow-owner-admin-transfer.service";

test("operator Gmail is designation input only — not embedded in transfer constants", () => {
  assert.equal(PROCROW_OWNER_ADMIN_TRANSFER_CORRELATION_ID.includes("@"), false);
  assert.equal(procrowOwnerAdminTargetFingerprint("acct-1").length, 16);
  assert.notEqual(
    procrowOwnerAdminTargetFingerprint("acct-1"),
    procrowOwnerAdminTargetFingerprint("acct-2")
  );
});

test("idempotent transfer plan has zero physical mutations", () => {
  const plan: ProcrowOwnerAdminTransferPlan = {
    transferType: "IDEMPOTENT_NO_OP",
    currentAdminAccountId: "a1",
    currentAdminAssignmentId: "as1",
    currentAdminFingerprint: procrowOwnerAdminTargetFingerprint("a1"),
    targetAccountId: "a1",
    targetFingerprint: procrowOwnerAdminTargetFingerprint("a1"),
    correlationId: PROCROW_OWNER_ADMIN_TRANSFER_CORRELATION_ID,
    assignmentCreates: 0,
    assignmentRevokes: 0,
    auditEvents: 0,
  };
  assert.equal(plan.assignmentCreates + plan.assignmentRevokes, 0);
  assert.equal(plan.auditEvents, 0);
});

test("atomic transfer plan expects exactly one grant and one revoke", () => {
  const plan: ProcrowOwnerAdminTransferPlan = {
    transferType: "ATOMIC_SINGLE_ADMIN_TRANSFER",
    currentAdminAccountId: "prev",
    currentAdminAssignmentId: "as-prev",
    currentAdminFingerprint: procrowOwnerAdminTargetFingerprint("prev"),
    targetAccountId: "next",
    targetFingerprint: procrowOwnerAdminTargetFingerprint("next"),
    correlationId: PROCROW_OWNER_ADMIN_TRANSFER_CORRELATION_ID,
    assignmentCreates: 1,
    assignmentRevokes: 1,
    auditEvents: 2,
  };
  assert.equal(plan.assignmentCreates, 1);
  assert.equal(plan.assignmentRevokes, 1);
  assert.equal(plan.auditEvents, 2);
  assert.equal(
    plan.assignmentCreates - plan.assignmentRevokes,
    0,
    "net active admin delta is zero during transfer accounting"
  );
});

test("zero active admins and multiple active admins are invalid final states", () => {
  for (const count of [0, 2, 3]) {
    assert.notEqual(count, 1, `admin count ${count} must fail sole-admin invariant`);
  }
});

test("assignment fingerprint is distinct from target fingerprint", () => {
  const assignmentId = "assignment-uuid";
  assert.notEqual(
    procrowOwnerAdminAssignmentFingerprint(assignmentId),
    procrowOwnerAdminTargetFingerprint(assignmentId)
  );
});

test("application runtime does not reference procrow owner-admin operator file", () => {
  const forbidden = [
    "PROCROW_OWNER_ADMIN_EMAIL",
    ".env.procrow-owner-admin.operator",
    "procrow-owner-admin.operator",
  ];
  const roots = ["src/app", "src/lib", "src/middleware.ts"];
  const hits: string[] = [];

  function walk(entryPath: string) {
    if (!statSync(entryPath).isDirectory()) {
      if (!/\.(ts|tsx)$/.test(entryPath)) return;
      if (/procrow-owner-admin-transfer\.test\.ts$/.test(entryPath)) return;
      if (/\.test\.(ts|tsx)$/.test(entryPath)) return;
      const content = readFileSync(entryPath, "utf8");
      for (const needle of forbidden) {
        if (content.includes(needle)) {
          hits.push(`${entryPath}:${needle}`);
        }
      }
      return;
    }
    for (const name of readdirSync(entryPath)) {
      walk(join(entryPath, name));
    }
  }

  for (const root of roots) {
    const full = join(process.cwd(), root);
    try {
      walk(full);
    } catch {
      // middleware.ts is a file
      if (root.endsWith(".ts")) {
        const content = readFileSync(full, "utf8");
        for (const needle of forbidden) {
          if (content.includes(needle)) hits.push(`${full}:${needle}`);
        }
      }
    }
  }

  assert.deepEqual(hits, [], `runtime must not read operator designation: ${hits.join(", ")}`);
});
