import { createHash } from "node:crypto";

export {
  FTGP_PROCROW_REVIEW_FROM_STATUS,
  FTGP_PROCROW_REVIEW_TO_STATUS,
  FTGP_PROCROW_REVIEW_AUDIT_SECTION,
  FTGP_PROCROW_REVIEW_AUDIT_KEY,
} from "../../src/lib/ftgp/ftgp-procrow-review-transition.constants";

export function requestFingerprint(requestId: string): string {
  return createHash("sha256")
    .update(`ftgp-request:${requestId}`)
    .digest("hex")
    .slice(0, 16);
}

export function actorFingerprint(platformAccountId: string): string {
  return createHash("sha256")
    .update(`ftgp-actor:${platformAccountId}`)
    .digest("hex")
    .slice(0, 16);
}
