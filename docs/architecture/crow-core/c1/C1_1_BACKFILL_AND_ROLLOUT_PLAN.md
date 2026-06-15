# C1.1 — Backfill, Rollout, and Rollback Plan

**Status:** Design-only — execution in **C2** after PO approval  
**Principle:** Additive migrations only in wave 1; no destructive cleanup

---

## Backfill strategy (Section 18)

### Per legacy `EnterpriseBlueprint` row

| Step | Action |
|------|--------|
| 1 | Resolve `tenantId` from blueprint row, linked `ImplementationRequest`, or `DiscoveryProfile` chain |
| 2 | If tenant unresolvable → mark `PROVENANCE_UNKNOWN`; quarantine from Studio write path |
| 3 | Create or map `EnterpriseBlueprint` identity (existing row = identity) |
| 4 | Build `BlueprintSnapshotEnvelope` from normalized children via `blueprint-adapter` |
| 5 | Create `EnterpriseBlueprintVersion` v1 with status mapped from legacy `status` enum |
| 6 | Preserve `createdAt` / `updatedAt` / known `createdBy` |
| 7 | Unknown author → `authorId: null`, provenance note in trace |
| 8 | Validate snapshot against C2 schema; reject malformed → `PROVENANCE_PARTIAL` |
| 9 | Compute `contentHash` with C2 canonical rules |
| 10 | Link `requestId`, `discoveryProfileId`, `proposalId` if present |
| 11 | **Do not create `BlueprintApproval`** unless historical evidence exists |
| 12 | Emit `BlueprintTraceEvent` `legacy_import` with migration batch ID |

### Provenance states

| State | Meaning |
|-------|---------|
| `LEGACY_IMPORT` | Successfully imported snapshot |
| `UNAPPROVED_LEGACY` | Legacy status was draft/review but never approved in new model |
| `PROVENANCE_COMPLETE` | Author, timestamps, links all resolved |
| `PROVENANCE_PARTIAL` | Snapshot valid but missing author or discovery link |
| `PROVENANCE_UNKNOWN` | Tenant or ownership ambiguous |

### Malformed / orphaned data

- **Orphan blueprint** (no request): attach to synthetic holding request only with PO approval; else archive read-only.
- **Invalid child rows:** Omit from snapshot; log in migration report.
- **Duplicate version ints on identity:** Collapse to single v1 snapshot; reset identity `version` field usage (deprecated in C2).

---

## Rollout sequence (Section 19)

| Phase | Activity | Environment |
|-------|----------|-------------|
| R1 | Deploy C2 migration: new tables + indexes (additive) | Preview |
| R2 | Deploy application code with dual-read adapter (Path A + Path C) | Preview |
| R3 | Run backfill job (idempotent) | Preview |
| R4 | Validation queries (counts, tenant ownership, hash sample) | Preview |
| R5 | Enable new write path for Studio (feature flag) | Staging |
| R6 | Operator smoke: create draft → approve → ROI → SOW | Staging |
| R7 | Compare old adapter view vs new version snapshot (sample) | Staging |
| R8 | Switch canonical read path to versions | Staging |
| R9 | Repeat R1–R8 | Production (maintenance window optional) |
| R10 | Stabilization period (30d): keep legacy children writable for runtime only | Prod |
| R11 | Defer destructive cleanup / column drops to **C3** approved phase | — |

### Validation queries (post-backfill)

```sql
-- Example checks (C2 runbook)
-- 1. Every version has tenantId
SELECT COUNT(*) FROM "EnterpriseBlueprintVersion" v
JOIN "EnterpriseBlueprint" b ON b.id = v."blueprintId"
WHERE b."tenantId" IS NULL;

-- 2. At most one current approved per blueprint
SELECT "blueprintId", COUNT(*) FROM "EnterpriseBlueprintVersion"
WHERE "isCurrentApproved" = true GROUP BY "blueprintId" HAVING COUNT(*) > 1;

-- 3. No approval without matching hash
SELECT * FROM "BlueprintApproval" a
JOIN "EnterpriseBlueprintVersion" v ON v.id = a."blueprintVersionId"
WHERE a."contentHash" <> v."contentHash";
```

---

## Rollback strategy (Section 20)

| Layer | Rollback capability |
|-------|---------------------|
| Application | Revert deploy; feature flag off → Path A reads only |
| New write path | Stop writes to version tables; legacy children unchanged |
| Additive DB tables | **Can remain empty** — harmless if app reverted |
| Backfilled data | **Not deleted** on rollback — forward-fix preferred |
| After production approvals in new tables | **Destructive down-migration forbidden** — corrupts evidence |

**Invalid rollback:** Deleting `BlueprintApproval` rows to "undo" release.

**Valid rollback:** Disable feature flag; serve Path A adapter; fix forward; re-enable when ready.

---

## Dual-read period

- **Read:** Prefer `EnterpriseBlueprintVersion` where `isCurrentApproved` or active draft exists; else fall back to normalized children (Path A).
- **Write:** Studio writes only to version tables when flag on; runtime config may still patch legacy children until C3 convergence.

---

## Release checklist

- [ ] PO signed decision board
- [ ] Migration count incremented only in C2 PR (not C1.1)
- [ ] `c1-migration-gate:verify` green on C1.1 branch
- [ ] `enterprise-blueprint-studio:verify` green after C2
- [ ] Backfill dry-run report reviewed
- [ ] Security integration tests pass
- [ ] Rollback runbook acknowledged by ops
