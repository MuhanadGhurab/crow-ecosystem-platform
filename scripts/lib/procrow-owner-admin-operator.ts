/**
 * PROCROW.ADMIN.1 — Operator designation input (gitignored file only).
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { procrowOwnerAdminTargetFingerprint } from "../../src/lib/platform/procrow-owner-admin-transfer.constants";

export const PROCROW_OWNER_ADMIN_OPERATOR_ENV = ".env.procrow-owner-admin.operator";

export const PROCROW_OWNER_ADMIN_DESIGNATION_ARTIFACT =
  ".procrow-owner-admin-designation.local.json";

export { procrowOwnerAdminTargetFingerprint };

export type ProcrowOwnerAdminOperatorConfig = {
  email: string;
  emailNormalized: string | null;
  provider: string;
  transferAuthorized: boolean;
};

function parseEnvFile(content: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    map.set(trimmed.slice(0, eq), value);
  }
  return map;
}

export function normalizeOperatorEmail(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) return null;
  return trimmed;
}

export function redactEmailForReport(email: string): string {
  const at = email.indexOf("@");
  if (at <= 1) return "***@***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const localRedacted =
    local.length <= 2 ? `${local[0] ?? "*"}*` : `${local.slice(0, 2)}***`;
  const domainParts = domain.split(".");
  const domainRedacted =
    domainParts.length >= 2
      ? `${domainParts[0]?.slice(0, 1) ?? "*"}***.${domainParts.at(-1)}`
      : "***";
  return `${localRedacted}@${domainRedacted}`;
}

export function procrowOwnerAdminAssignmentFingerprint(assignmentId: string): string {
  return createHash("sha256")
    .update(`procrow-pa-assignment:${assignmentId}`)
    .digest("hex")
    .slice(0, 16);
}

export function operatorEmailFingerprint(normalizedEmail: string): string {
  return createHash("sha256")
    .update(`procrow-owner-admin-email:${normalizedEmail}`)
    .digest("hex")
    .slice(0, 16);
}

export function loadProcrowOwnerAdminOperatorConfig(
  repoRoot = process.cwd()
): ProcrowOwnerAdminOperatorConfig {
  const path = join(repoRoot, PROCROW_OWNER_ADMIN_OPERATOR_ENV);
  if (!existsSync(path)) {
    throw new Error(`${PROCROW_OWNER_ADMIN_OPERATOR_ENV} missing`);
  }
  const map = parseEnvFile(readFileSync(path, "utf8"));
  const email = map.get("PROCROW_OWNER_ADMIN_EMAIL") ?? "";
  const provider = (map.get("PROCROW_OWNER_ADMIN_PROVIDER") ?? "google").trim().toLowerCase();
  const transferAuthorized =
    (map.get("PROCROW_OWNER_ADMIN_TRANSFER_AUTHORIZED") ?? "false").trim().toLowerCase() ===
    "true";
  return {
    email,
    emailNormalized: normalizeOperatorEmail(email),
    provider,
    transferAuthorized,
  };
}

export function designationArtifactIntegrity(payload: Record<string, unknown>): string {
  return createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex")
    .slice(0, 16);
}

export function verifyDesignationArtifactIntegrity(
  artifact: Record<string, unknown>
): boolean {
  const { integrityHash, databaseFingerprint: _db, ...payload } = artifact;
  if (typeof integrityHash !== "string") return false;
  return designationArtifactIntegrity(payload) === integrityHash;
}
