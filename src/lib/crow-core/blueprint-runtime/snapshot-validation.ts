import type { EnterpriseBlueprintDocument } from "../blueprint";

export const BLUEPRINT_SNAPSHOT_SCHEMA_VERSION = "1.0.0";
export const BLUEPRINT_SNAPSHOT_MAX_BYTES = 2 * 1024 * 1024;
export const BLUEPRINT_SNAPSHOT_MAX_DEPTH = 12;
export const BLUEPRINT_SNAPSHOT_MAX_ARRAY = 500;

export type SnapshotValidationError = {
  path: string;
  message: string;
};

export type SnapshotEnvelope = {
  schemaVersion: string;
  document: EnterpriseBlueprintDocument;
};

function measureDepth(value: unknown, depth = 0): number {
  if (depth > BLUEPRINT_SNAPSHOT_MAX_DEPTH + 1) return depth;
  if (value === null || typeof value !== "object") return depth;
  if (Array.isArray(value)) {
    let max = depth;
    for (const item of value) {
      max = Math.max(max, measureDepth(item, depth + 1));
    }
    return max;
  }
  let max = depth;
  for (const v of Object.values(value as Record<string, unknown>)) {
    max = Math.max(max, measureDepth(v, depth + 1));
  }
  return max;
}

function countArrays(value: unknown): number[] {
  const sizes: number[] = [];
  if (Array.isArray(value)) {
    sizes.push(value.length);
    for (const item of value) sizes.push(...countArrays(item));
  } else if (value !== null && typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>)) {
      sizes.push(...countArrays(v));
    }
  }
  return sizes;
}

export function validateSnapshotEnvelope(
  envelope: unknown
): { ok: true; value: SnapshotEnvelope } | { ok: false; errors: SnapshotValidationError[] } {
  const errors: SnapshotValidationError[] = [];

  if (!envelope || typeof envelope !== "object") {
    return { ok: false, errors: [{ path: "$", message: "Snapshot must be an object" }] };
  }

  const record = envelope as Record<string, unknown>;
  if (record.schemaVersion !== BLUEPRINT_SNAPSHOT_SCHEMA_VERSION) {
    errors.push({
      path: "schemaVersion",
      message: `Expected ${BLUEPRINT_SNAPSHOT_SCHEMA_VERSION}`,
    });
  }

  const doc = record.document;
  if (!doc || typeof doc !== "object") {
    errors.push({ path: "document", message: "Blueprint document is required" });
    return { ok: false, errors };
  }

  const docRecord = doc as Record<string, unknown>;
  if (!docRecord.ref || typeof docRecord.ref !== "object") {
    errors.push({ path: "document.ref", message: "Document ref is required" });
  }
  if (!Array.isArray(docRecord.slices)) {
    errors.push({ path: "document.slices", message: "Document slices must be an array" });
  }

  const encoded = JSON.stringify(envelope);
  if (Buffer.byteLength(encoded, "utf8") > BLUEPRINT_SNAPSHOT_MAX_BYTES) {
    errors.push({
      path: "$",
      message: `Encoded snapshot exceeds ${BLUEPRINT_SNAPSHOT_MAX_BYTES} bytes`,
    });
  }

  const depth = measureDepth(envelope);
  if (depth > BLUEPRINT_SNAPSHOT_MAX_DEPTH) {
    errors.push({
      path: "$",
      message: `Nesting depth ${depth} exceeds max ${BLUEPRINT_SNAPSHOT_MAX_DEPTH}`,
    });
  }

  for (const size of countArrays(envelope)) {
    if (size > BLUEPRINT_SNAPSHOT_MAX_ARRAY) {
      errors.push({
        path: "$",
        message: `Array length ${size} exceeds max ${BLUEPRINT_SNAPSHOT_MAX_ARRAY}`,
      });
      break;
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      schemaVersion: BLUEPRINT_SNAPSHOT_SCHEMA_VERSION,
      document: doc as EnterpriseBlueprintDocument,
    },
  };
}

export function buildSnapshotEnvelope(
  document: EnterpriseBlueprintDocument
): SnapshotEnvelope {
  return {
    schemaVersion: BLUEPRINT_SNAPSHOT_SCHEMA_VERSION,
    document,
  };
}
