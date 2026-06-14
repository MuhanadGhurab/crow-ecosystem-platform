import { createHash } from "crypto";

import type { EnterpriseBlueprintDocument } from "../blueprint";
import { hashBlueprintDocument } from "../blueprint-studio/blueprint-hash.service";

import {
  BLUEPRINT_SNAPSHOT_SCHEMA_VERSION,
  buildSnapshotEnvelope,
  type SnapshotEnvelope,
} from "./snapshot-validation";

/** Stable SHA-256 over normalized snapshot content (schema version + document slices). */
export function hashSnapshotEnvelope(envelope: SnapshotEnvelope): string {
  const normalized = JSON.stringify({
    schemaVersion: envelope.schemaVersion,
    document: normalizeDocumentForHash(envelope.document),
  });
  return createHash("sha256").update(normalized, "utf8").digest("hex");
}

export function hashBlueprintSnapshotDocument(
  document: EnterpriseBlueprintDocument
): string {
  return hashSnapshotEnvelope(buildSnapshotEnvelope(document));
}

function normalizeDocumentForHash(doc: EnterpriseBlueprintDocument) {
  return {
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
}

/** Document-only hash (C1 compatibility). */
export function hashDocumentOnly(doc: EnterpriseBlueprintDocument): string {
  return hashBlueprintDocument(doc);
}
