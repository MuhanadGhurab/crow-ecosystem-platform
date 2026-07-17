import { createHash } from "node:crypto";

export const PROCROW_OWNER_ADMIN_TRANSFER_CORRELATION_ID =
  "procrow-owner-admin-transfer-authoritative-v1";

export const PROCROW_OWNER_ADMIN_TRANSFER_REASON =
  "PROCROW personal owner-admin authoritative transfer";

export const PROCROW_OWNER_ADMIN_TRANSFER_SOURCE =
  "procrow_owner_admin_transfer";

export function procrowOwnerAdminTargetFingerprint(platformAccountId: string): string {
  return createHash("sha256")
    .update(`procrow-owner-admin-target:${platformAccountId}`)
    .digest("hex")
    .slice(0, 16);
}

export function procrowOwnerAdminAssignmentFingerprint(assignmentId: string): string {
  return createHash("sha256")
    .update(`procrow-pa-assignment:${assignmentId}`)
    .digest("hex")
    .slice(0, 16);
}
