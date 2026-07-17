import type { EnterpriseBlueprintDocument } from "../blueprint";

const INTERNAL_SLICE_TYPES = new Set([
  "internal_notes",
  "security_operator",
  "implementation_notes",
  "platform_config",
]);

const REDACTED_KEYS = new Set([
  "marginPercent",
  "internalRisk",
  "operatorNotes",
  "privilegedRoleNotes",
  "implementationOnly",
  "evidenceRefs",
  "platformConfiguration",
]);

export type ClientSafeBlueprintProjection = {
  blueprintId: string;
  version: string;
  tenantId: string | null;
  slices: EnterpriseBlueprintDocument["slices"];
  assumptions: string[];
  exclusions: string[];
  acceptanceCriteria: string[];
  advisoryOnly: true;
};

/** Server-side client-safe projection — never rely on UI hiding alone. */
export function projectClientSafeBlueprint(
  document: EnterpriseBlueprintDocument
): ClientSafeBlueprintProjection {
  const slices = document.slices
    .filter((slice) => {
      const type = (slice as { type?: string }).type;
      return type ? !INTERNAL_SLICE_TYPES.has(type) : true;
    })
    .map((slice) => redactSlice(slice));

  return {
    blueprintId: document.ref.blueprintId,
    version: document.ref.version,
    tenantId: document.ref.tenantId,
    slices,
    assumptions: document.assumptions.filter((a) => !a.toLowerCase().includes("internal")),
    exclusions: [...document.exclusions],
    acceptanceCriteria: [...document.acceptanceCriteria],
    advisoryOnly: true,
  };
}

function redactSlice(slice: EnterpriseBlueprintDocument["slices"][number]) {
  if (!slice || typeof slice !== "object") return slice;
  const copy = { ...slice } as Record<string, unknown>;
  for (const key of Object.keys(copy)) {
    if (REDACTED_KEYS.has(key)) delete copy[key];
  }
  return copy as EnterpriseBlueprintDocument["slices"][number];
}
