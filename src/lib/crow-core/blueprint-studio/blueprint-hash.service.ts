import { createHash } from "crypto";

import type { EnterpriseBlueprintDocument } from "../blueprint";

/** Normalize document for stable hashing (sorted keys, no volatile fields). */
function normalizeForHash(doc: EnterpriseBlueprintDocument): string {
  const payload = {
    ref: {
      blueprintId: doc.ref.blueprintId,
      version: doc.ref.version,
      tenantId: doc.ref.tenantId,
      status: doc.ref.status,
    },
    slices: doc.slices,
    assumptions: [...doc.assumptions].sort(),
    exclusions: [...doc.exclusions].sort(),
    acceptanceCriteria: [...doc.acceptanceCriteria].sort(),
  };
  return JSON.stringify(payload);
}

export function hashBlueprintDocument(doc: EnterpriseBlueprintDocument): string {
  const normalized = normalizeForHash(doc);
  return createHash("sha256").update(normalized, "utf8").digest("hex");
}

/** Alias for C1 studio / verifier naming. */
export const computeBlueprintContentHash = hashBlueprintDocument;
