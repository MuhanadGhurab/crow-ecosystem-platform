/**
 * Legacy read adapters — historical BlueprintApproval / BlueprintChangeRequest / normalized C1 rows.
 * BLUEPRINT.1B canonical versions use immutable contentSnapshot JSON only.
 */
import type { EnterpriseBlueprintVersion } from "@prisma/client";
import { projectClientBlueprint } from "./client-projection";
import { mapVersion } from "./persistence/prisma-mappers";
import type { PersistentBlueprintVersionSnapshot } from "./types";

export type BlueprintProjectionSource = "LEGACY_NORMALIZED" | "CANONICAL_JSON";

export function resolveBlueprintProjectionSource(version: EnterpriseBlueprintVersion): BlueprintProjectionSource {
  if (version.compilerVersion && version.sourceModelHash && version.validationJson) {
    return "CANONICAL_JSON";
  }
  return "LEGACY_NORMALIZED";
}

export function projectBlueprintForClient(version: EnterpriseBlueprintVersion) {
  const source = resolveBlueprintProjectionSource(version);
  if (source === "CANONICAL_JSON") {
    const mapped = mapVersion(version);
    return {
      source,
      projection: projectClientBlueprint(mapped.snapshot, version.versionNumber),
    };
  }
  return {
    source,
    projection: null,
    legacyNote: "Use legacy blueprint-runtime projection for normalized C1 records",
  };
}

export function isCanonicalSnapshot(snapshot: PersistentBlueprintVersionSnapshot): boolean {
  return Boolean(snapshot.compilerVersion && snapshot.sourceModelHash);
}
