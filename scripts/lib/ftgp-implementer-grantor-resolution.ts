import { createHash } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

import { EXPECTED_GRANTOR_FINGERPRINT } from "./ftgp-implementer-grant-manifest";
import { targetFingerprintFromAccountId } from "./ftgp-platform-admin-bootstrap-manifest";

export type ResolvedImplementerGrantor = {
  platformAccountId: string;
  fingerprint: string;
  opaqueRef: string;
};

function opaqueRef(stableId: string): string {
  return createHash("sha256")
    .update(`ftgp-implementer-grantor:${stableId}`)
    .digest("hex")
    .slice(0, 16);
}

/** Resolve the single active PLATFORM_ADMIN as IMPLEMENTER grantor. */
export async function resolveImplementerGrantor(
  prisma: PrismaClient
): Promise<ResolvedImplementerGrantor | null> {
  const assignments = await prisma.platformInternalRoleAssignment.findMany({
    where: { role: "PLATFORM_ADMIN", status: "ACTIVE" },
    select: { platformAccountId: true },
  });

  if (assignments.length !== 1) return null;

  const platformAccountId = assignments[0]!.platformAccountId;
  const fingerprint = targetFingerprintFromAccountId(platformAccountId);
  if (fingerprint !== EXPECTED_GRANTOR_FINGERPRINT) return null;

  return {
    platformAccountId,
    fingerprint,
    opaqueRef: opaqueRef(platformAccountId),
  };
}
