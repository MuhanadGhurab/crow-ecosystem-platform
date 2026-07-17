import { createHash } from "node:crypto";

export const CANDIDATE_07_LABEL = "FTGP-REQUEST-CANDIDATE-07";
export const CANDIDATE_07_FINGERPRINT = "9439dd8cc806696e";
export const CANDIDATE_07_OWNER_FINGERPRINT = "faf26007ce4a55b9";

export function ownerFingerprint(platformAccountId: string): string {
  return createHash("sha256")
    .update(`ftgp-owner:${platformAccountId}`)
    .digest("hex")
    .slice(0, 16);
}

export function requestFingerprint(requestId: string): string {
  return createHash("sha256")
    .update(`ftgp-request:${requestId}`)
    .digest("hex")
    .slice(0, 16);
}
