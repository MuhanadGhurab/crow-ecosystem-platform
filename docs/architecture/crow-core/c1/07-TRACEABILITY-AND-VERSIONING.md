# 07 — Traceability and Versioning

## Version service (prototype)

**File:** `blueprint-version.service.ts`

- In-memory `Map` store keyed by blueprint ID
- `createBlueprintVersionSnapshot`, `approveBlueprintVersionSnapshot`
- **Immutability:** approved snapshots reject mutation; new draft clones parent

Production persistence requires Path C migration.

## Diff service

**File:** `blueprint-diff.service.ts`

- Section-level diff between two `BlueprintVersionSnapshot` documents
- Impact labels: `NONE` … `CRITICAL`

## Hash service

**File:** `blueprint-hash.service.ts`

- SHA-256 over normalized JSON snapshot (`hashBlueprintDocument`)

## Traceability

**File:** `traceability/blueprint-traceability.service.ts`

- Timeline events with actor attribution
- AI-assisted entries labeled; never attributed as human approval
- Optional read from `cybercrow_audit_logs` when safe (read-only)

## Readiness

**File:** `blueprint-readiness.service.ts`

- Overview completeness score
- ROI / SOW readiness flags for Studio primary actions
