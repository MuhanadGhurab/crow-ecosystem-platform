import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const EXPECTED_PROJECT_REF = "wbwnsndcxrgyqwppurms";
export const EXPECTED_DATABASE_FINGERPRINT = "0355c17692e2a90d";
export const EXPECTED_GRANTOR_FINGERPRINT = "b3ee2ec185cf9893";
export const PLATFORM_ADMIN_BOOTSTRAP_CORRELATION =
  "ftgp-first-platform-admin-abac3f9b-9032-4412-a0c5-6f6f786e3312";

export type ParsedImplementerGrantManifest = {
  targetFingerprint: string;
  grantorFingerprint: string;
  correlationId: string;
  dryRunPassed: boolean;
  executionAuthorized: boolean;
  grantExecuted: boolean;
};

function parseManifestLine(content: string, key: string): string | null {
  const pattern = new RegExp(`^${key}:\\s*(.+)$`, "im");
  const match = content.match(pattern);
  return match?.[1]?.trim() ?? null;
}

export function implementerTargetFingerprint(accountId: string): string {
  return createHash("sha256")
    .update(`ftgp-implementer-target:${accountId}`)
    .digest("hex")
    .slice(0, 16);
}

export function loadImplementerGrantManifest(
  repoRoot = process.cwd()
): ParsedImplementerGrantManifest {
  const path = join(repoRoot, ".ftgp-implementer-grant-manifest");
  if (!existsSync(path)) {
    throw new Error("Implementer grant manifest missing: .ftgp-implementer-grant-manifest");
  }
  const content = readFileSync(path, "utf8");
  const targetFingerprint = parseManifestLine(content, "Target fingerprint");
  const grantorFingerprint = parseManifestLine(content, "Grantor fingerprint");
  const correlationId = parseManifestLine(content, "Correlation ID");
  const dryRunPassed = parseManifestLine(content, "Dry run passed")?.toLowerCase() === "true";
  const executionAuthorized =
    parseManifestLine(content, "Execution authorized")?.toLowerCase() === "true";
  const grantExecuted = parseManifestLine(content, "Grant executed")?.toLowerCase() === "true";

  if (!targetFingerprint || !grantorFingerprint || !correlationId) {
    throw new Error("Implementer grant manifest missing required fields");
  }

  return {
    targetFingerprint,
    grantorFingerprint,
    correlationId,
    dryRunPassed,
    executionAuthorized,
    grantExecuted,
  };
}

export function isPostImplementerGrantState(): boolean {
  const expected = Number(
    process.env.FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS?.trim() || "0"
  );
  if (expected >= 2) return true;
  try {
    const manifest = loadImplementerGrantManifest();
    return manifest.grantExecuted;
  } catch {
    return false;
  }
}

export function assertImplementerManifestPreflight(
  manifest: ParsedImplementerGrantManifest,
  targetAccountId: string,
  grantorAccountId: string
): void {
  if (manifest.grantorFingerprint !== EXPECTED_GRANTOR_FINGERPRINT) {
    throw new Error("Manifest grantor fingerprint mismatch");
  }
  if (implementerTargetFingerprint(targetAccountId) !== manifest.targetFingerprint) {
    throw new Error("Operator target ID does not match manifest fingerprint");
  }
  if (manifest.correlationId === PLATFORM_ADMIN_BOOTSTRAP_CORRELATION) {
    throw new Error("IMPLEMENTER correlation must not reuse Platform Admin bootstrap correlation");
  }
  if (!manifest.dryRunPassed) {
    throw new Error("Manifest dry run not marked passed");
  }
  if (manifest.grantExecuted) {
    throw new Error("Manifest indicates grant already executed");
  }
  if (!grantorAccountId) {
    throw new Error("Grantor PlatformAccount.id required");
  }
}
