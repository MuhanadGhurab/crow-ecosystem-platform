import type { EnterpriseBlueprintDraft } from "./blueprint-types";
import { BLUEPRINT_SCHEMA_VERSION } from "./blueprint-types";
import { containsDatabaseIds, containsSecretShapedField } from "./blueprint-hash";

export type BlueprintImportResult =
  | { ok: true; draft: EnterpriseBlueprintDraft }
  | { ok: false; errors: string[] };

export function importBlueprintPreviewJson(raw: string): BlueprintImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, errors: ["Invalid JSON"] };
  }

  const errors = validateImportedBlueprint(parsed);
  if (errors.length > 0) return { ok: false, errors };

  return { ok: true, draft: parsed as EnterpriseBlueprintDraft };
}

export function validateImportedBlueprint(parsed: unknown): string[] {
  const errors: string[] = [];
  if (!parsed || typeof parsed !== "object") return ["Root must be an object"];

  const obj = parsed as Record<string, unknown>;
  const meta = obj.metadata as Record<string, unknown> | undefined;
  if (!meta) errors.push("Missing metadata");
  else {
    if (meta.schemaVersion !== BLUEPRINT_SCHEMA_VERSION) errors.push(`Unsupported schema version: ${meta.schemaVersion}`);
    if (meta.authoritative !== false) errors.push("Import must be non-authoritative");
    if (meta.advisory !== true) errors.push("Import must be advisory");
    if (meta.persistenceState !== "EPHEMERAL_PREVIEW") errors.push("Import must be ephemeral preview");
  }

  const secrets = containsSecretShapedField(parsed);
  if (secrets.length > 0) errors.push(`Secret-shaped fields: ${secrets.join(", ")}`);

  const dbIds = containsDatabaseIds(parsed);
  if (dbIds.length > 0) errors.push(`Database IDs detected: ${dbIds.slice(0, 3).join(", ")}`);

  if (JSON.stringify(parsed).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
    errors.push("Full email values are not allowed in preview imports");
  }

  return errors;
}
