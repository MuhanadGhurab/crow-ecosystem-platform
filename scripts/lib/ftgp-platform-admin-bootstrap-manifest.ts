import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const EXPECTED_MANIFEST_CORRELATION_ID =
  "ftgp-first-platform-admin-abac3f9b-9032-4412-a0c5-6f6f786e3312";

export const EXPECTED_TARGET_FINGERPRINT = "b3ee2ec185cf9893";

export const EXPECTED_PROJECT_REF = "wbwnsndcxrgyqwppurms";

export const EXPECTED_DATABASE_FINGERPRINT = "0355c17692e2a90d";

export type ParsedBootstrapManifest = {
  targetFingerprint: string;
  correlationId: string;
  dryRunPassed: boolean;
  executionAuthorized: boolean;
  grantExecuted: boolean;
  selectedCandidateLabel: string;
};

function parseManifestLine(content: string, key: string): string | null {
  const pattern = new RegExp(`^${key}:\\s*(.+)$`, "im");
  const match = content.match(pattern);
  return match?.[1]?.trim() ?? null;
}

export function targetFingerprintFromAccountId(accountId: string): string {
  return createHash("sha256").update(`ftgp-pa-target:${accountId}`).digest("hex").slice(0, 16);
}

export function loadBootstrapManifest(repoRoot = process.cwd()): ParsedBootstrapManifest {
  const path = join(repoRoot, ".ftgp-platform-admin-bootstrap-manifest");
  if (!existsSync(path)) {
    throw new Error("Bootstrap manifest missing: .ftgp-platform-admin-bootstrap-manifest");
  }
  const content = readFileSync(path, "utf8");
  const targetFingerprint = parseManifestLine(content, "Target fingerprint");
  const correlationId = parseManifestLine(content, "Correlation ID");
  const selectedCandidateLabel = parseManifestLine(content, "Selected candidate label");
  const dryRunPassed = parseManifestLine(content, "Dry run passed")?.toLowerCase() === "true";
  const executionAuthorized =
    parseManifestLine(content, "Execution authorized")?.toLowerCase() === "true";
  const grantExecuted = parseManifestLine(content, "Grant executed")?.toLowerCase() === "true";

  if (!targetFingerprint || !correlationId || !selectedCandidateLabel) {
    throw new Error("Bootstrap manifest missing required fields");
  }

  return {
    targetFingerprint,
    correlationId,
    dryRunPassed,
    executionAuthorized,
    grantExecuted,
    selectedCandidateLabel,
  };
}

export function isPostBootstrapInternalRoleState(): boolean {
  const expected = Number(
    process.env.FTGP_EXPECTED_ACTIVE_INTERNAL_ASSIGNMENTS?.trim() || "0"
  );
  if (expected > 0) return true;
  try {
    const manifest = loadBootstrapManifest();
    return manifest.grantExecuted;
  } catch {
    return false;
  }
}

export function assertManifestPreflight(
  manifest: ParsedBootstrapManifest,
  targetAccountId: string
): void {
  if (manifest.targetFingerprint !== EXPECTED_TARGET_FINGERPRINT) {
    throw new Error("Manifest target fingerprint mismatch");
  }
  if (targetFingerprintFromAccountId(targetAccountId) !== manifest.targetFingerprint) {
    throw new Error("Operator target ID does not match manifest fingerprint");
  }
  if (manifest.correlationId !== EXPECTED_MANIFEST_CORRELATION_ID) {
    throw new Error("Manifest correlation ID mismatch");
  }
  if (!manifest.dryRunPassed) {
    throw new Error("Manifest dry run not marked passed");
  }
  if (manifest.grantExecuted) {
    throw new Error("Manifest indicates grant already executed");
  }
  if (manifest.selectedCandidateLabel !== "FTGP-PA-CANDIDATE-02") {
    throw new Error("Manifest candidate label mismatch");
  }
}
