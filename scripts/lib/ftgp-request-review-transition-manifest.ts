import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { fingerprintDatabaseUrl } from "./database-fingerprint";

export const EXPECTED_DATABASE_FINGERPRINT = "0355c17692e2a90d";
export const MANIFEST_PATH = ".ftgp-first-request-review-manifest";

export type FtgpReviewTransitionManifest = {
  correlationId: string;
  requestFingerprint: string;
  ownerFingerprint: string;
  actorFingerprint: string;
  executedAt?: string;
  verifiedAt?: string;
};

export function loadReviewTransitionManifest(): FtgpReviewTransitionManifest | null {
  const path = join(process.cwd(), MANIFEST_PATH);
  if (!existsSync(path)) return null;
  const text = readFileSync(path, "utf8");
  const correlationMatch = text.match(/^Correlation ID: (.+)$/m);
  const requestFpMatch = text.match(/^Request fingerprint: (.+)$/m);
  const ownerFpMatch = text.match(/^Owner fingerprint: (.+)$/m);
  const actorFpMatch = text.match(/^Actor fingerprint: (.+)$/m);
  if (!correlationMatch?.[1]) return null;
  return {
    correlationId: correlationMatch[1].trim(),
    requestFingerprint: requestFpMatch?.[1]?.trim() ?? "",
    ownerFingerprint: ownerFpMatch?.[1]?.trim() ?? "",
    actorFingerprint: actorFpMatch?.[1]?.trim() ?? "",
  };
}

export function assertHostedDatabaseFingerprint(): void {
  const dbUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim() || "";
  if (!dbUrl) throw new Error("DATABASE_URL required");
  const fp = fingerprintDatabaseUrl(dbUrl);
  if (fp.targetHash !== EXPECTED_DATABASE_FINGERPRINT) {
    throw new Error(`database fingerprint mismatch: ${fp.targetHash}`);
  }
}
