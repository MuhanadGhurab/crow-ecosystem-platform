# Blueprint Compiler Preview

**Status:** CURRENT (deterministic, non-authoritative)

## Entry point

`compileEnterpriseBlueprintPreview(input)` — `src/lib/model-forge/blueprint/blueprint-compiler.ts`

## Input

Enterprise model composition, scenario variant, draft-only decisions, explicit exclusions, operator notes (no secrets).

## Output

`EnterpriseBlueprintDraft` with stable keys, ordering, `sourceModelHash`, and `contentHash`.

## Hashing

`hashBlueprintContent()` — `src/lib/model-forge/blueprint/blueprint-hash.ts`

Strips `generatedAtDisplay`, `contentHash`, `sourceModelHash`, and `validation` from hash input. Same normalized input → same hashes.

## Pipeline phases (explanatory timeline)

normalize → industry/domains → domain packs → departments → capabilities → entities → personas → workflows → outcomes/KPIs → evidence → authority → SAREA → CyberCrow → integrations → compliance → validate → compile draft

## Related

- `validateEnterpriseBlueprintDraft()`
- `buildBlueprintDecisionRegister()`
- `compareEnterpriseBlueprintDrafts()`
- `buildCompilerReadinessMatrix()` — max status `READY_FOR_HUMAN_BLUEPRINT_REVIEW`

## Not claimed

Tenant provisioning, runtime workflow execution, approved compliance, Production deployability.
