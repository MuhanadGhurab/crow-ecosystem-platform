# Blueprint Versioning and Immutability

> **Status:** PROPOSED — NOT APPLIED — OWNER REVIEW REQUIRED

## Version model

`EnterpriseBlueprintVersion` represents one **immutable compiled snapshot**.

### Required guarantees

| Guarantee | Enforcement |
| --------- | ----------- |
| Content never edited after insert | DB trigger (proposed) + repository contract |
| Version number unique per Blueprint | `@@unique([blueprintId, versionNumber])` (exists) |
| Server-side content hash | `buildPersistentSnapshot()` + `verifyServerContentHash()` |
| Browser hash not trusted | `rejectClientProvidedHash()` |
| New content → new version | Lifecycle service |
| Supersession preserves history | `supersededAt` + closed review cycles |

## Snapshot shape

Immutable JSON bundle (extends existing `contentSnapshot`):

- `contentJson` — `EnterpriseBlueprintDraft` (client-safe sections only in projection)
- `validationJson`, `decisionRegisterJson`, `provenanceJson`, `scenarioProfileJson`, `reviewReadinessJson`
- `sourceModelKey`, `sourceModelHash`, `compilerVersion`, `schemaVersion`
- `contentHash` — recomputed from canonical content via `hashBlueprintContent()`

## Hash pipeline

```text
compileEnterpriseBlueprintPreview()
  → buildPersistentSnapshot(draft)
  → verifyServerContentHash(snapshot)  // server authoritative
  → persist version row
```

Strips non-deterministic fields: `generatedAtDisplay`, `generatedAt`, embedded hash fields.

## Forbidden in `contentJson`

- Auth provider IDs
- Full emails
- Operator secrets / tokens
- Real permission or membership assignments

## Append-only enforcement (recommended)

1. **Application:** `BlueprintVersionRepository` exposes only `createImmutableVersion`; `updateVersionUnsupported` / `deleteVersionUnsupported` throw.
2. **Database (proposed):** `BEFORE UPDATE` / `BEFORE DELETE` triggers on `enterprise_blueprint_versions` raising exception.

## Supersession

When version N+1 is created from Studio compile:

- Version N remains readable
- Open review cycles → `SUPERSEDED` or `CLOSED`
- Client acceptance on N does **not** transfer to N+1
- Audit: `BLUEPRINT_VERSION_SUPERSEDED`

## Optimistic concurrency

`EnterpriseBlueprint.rowVersion` (proposed column) incremented on every lifecycle mutation. Mutations require `expectedRowVersion` match or return `BLUEPRINT_CONCURRENCY_CONFLICT`.
