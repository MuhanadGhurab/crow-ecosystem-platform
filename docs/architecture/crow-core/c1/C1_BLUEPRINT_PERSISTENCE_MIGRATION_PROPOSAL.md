# C1 — Blueprint persistence migration proposal (Path C)

**Status:** Architecture proposal — **C1.1 approval gate complete**  
**C1.1 gate:** [`C1_1_MIGRATION_APPROVAL_GATE.md`](C1_1_MIGRATION_APPROVAL_GATE.md)  
**Schema preview (non-executable):** [`C1_1_SCHEMA_DESIGN_PREVIEW.md`](C1_1_SCHEMA_DESIGN_PREVIEW.md)  
**Existing mapping:** [`C1_EXISTING_BLUEPRINT_PERSISTENCE_MAPPING.md`](C1_EXISTING_BLUEPRINT_PERSISTENCE_MAPPING.md)

**Do not run `prisma migrate` from this document.** Implementation belongs to **C2** after product-owner approval.

---

## Executive summary

| Decision | Value |
|----------|-------|
| **Selected strategy** | **Option 2 — Hybrid persistence** |
| **Rejected** | Option 3 (minimal extension) — cannot enforce immutability, reproducible ROI, SOW preservation |
| **Not selected** | Option 1 (fully normalized) — excessive first-migration burden |
| **C1.1 gate outcome** | **APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION** (PO sign-off 14 Jun 2026) |

**Path A** (existing `EnterpriseBlueprint` + normalized children) remains the **read adapter** during transition. **Path C** (new tables below) becomes the **canonical write/read path** after backfill and cutover.

---

## Persistence strategy comparison

### Option 1 — Fully normalized

Separate relational tables for every Blueprint slice, ROI line item, SOW section, and trace field.

| Pros | Cons |
|------|------|
| Strong SQL constraints | High migration + adapter cost |
| Fine-grained queries | Schema rigidity for evolving slices |
| Clear FK graph | Duplicates existing normalized children awkwardly |

**Verdict:** Deferred — not first migration.

### Option 2 — Hybrid (SELECTED)

| Normalized | Immutable JSON snapshots |
|------------|--------------------------|
| Blueprint identity & lifecycle | Blueprint slice content (`BlueprintSnapshotEnvelope`) |
| Version metadata & status | ROI calculation inputs/results |
| Approvals & trace events | SOW section bodies & source maps |
| ROI assumptions & revisions | |

| Pros | Cons |
|------|------|
| Enforces lifecycle + tenant FKs | Snapshot validation discipline required |
| Preserves C1 deterministic engines | Size limits needed |
| Supports version compare & audit | JSON schema evolution process |
| Practical backfill from Path A | |

**Verdict:** **Recommended for C2.**

### Option 3 — Minimal extension

Extend `EnterpriseBlueprint` with `contentJson`, `roiJson`, `sowJson`.

| Pros | Cons |
|------|------|
| Smallest diff | **Cannot** enforce approved-version immutability |
| | **Cannot** bind approval to content hash |
| | **Cannot** preserve manual SOW edits across regeneration |
| | **Cannot** reproduce ROI from stored assumptions |
| | Mutable `version` Int on identity row remains |

**Verdict:** **REJECTED.**

---

## Source-of-truth map (current → target)

| Concern | Current (Path A) | Target (Path C) |
|---------|------------------|-----------------|
| Blueprint identity | `EnterpriseBlueprint` (1:1 `ImplementationRequest`) | `EnterpriseBlueprint` (program row) — **adapt**, stop using row as version |
| Version content | Normalized children + mutable identity | `EnterpriseBlueprintVersion` + validated snapshot |
| Lifecycle status | `ImplementationRequest.status` + ad hoc | `EnterpriseBlueprintVersion.status` enum |
| ROI | In-memory engine only | `RoiAssumption` + `RoiAssumptionRevision` + `RoiSnapshot` |
| SOW | In-memory generator only | `SowDocument` + `SowVersion` + `SowSection` |
| Approvals | None persisted | `BlueprintApproval` |
| Trace | `CybercrowAuditLog` (generic) + in-memory Map | `BlueprintTraceEvent` (append-only service contract) |
| Discovery link | `DiscoveryProfile` via request | FK on identity |
| Tenant scope | `tenantId` on blueprint (optional) | **Required tenant-scoped** records on all C1.1 tables |

---

## Proposed models (C1.1 hybrid design)

Full field-level preview: [`C1_1_SCHEMA_DESIGN_PREVIEW.md`](C1_1_SCHEMA_DESIGN_PREVIEW.md).

| Model | Purpose |
|-------|---------|
| `EnterpriseBlueprint` | Long-lived program **identity**; tenant-scoped; links to request/discovery/client |
| `EnterpriseBlueprintVersion` | One immutable-or-draft snapshot; version number; status; content hash |
| `BlueprintApproval` | Evidence-grade approval binding version + hash + actor |
| `BlueprintTraceEvent` | Append-only lifecycle/commercial trace |
| `BlueprintChangeRequest` | Client/internal change requests |
| `BlueprintConfigurationProposal` | Config proposal ≠ runtime deploy |
| `RoiAssumption` / `RoiAssumptionRevision` | Assumption identity + revision history |
| `RoiSnapshot` | Immutable engine run (inputs, formulas, outputs) |
| `SowDocument` | Long-lived SOW identity |
| `SowVersion` | One reviewable/approved SOW snapshot |
| `SowSection` | Generated vs manual vs locked semantics |

Legacy C1 proposal names (`BlueprintVersion`, `BlueprintCommercialSnapshot`) are superseded by the C1.1 model set above for clarity and alignment with existing `EnterpriseBlueprint` terminology.

---

## Blueprint identity vs version rules

1. **Identity** (`EnterpriseBlueprint`) — stable ID for the program; never holds mutable slice content after cutover.
2. **Version** (`EnterpriseBlueprintVersion`) — monotonic `versionNumber` per identity; unique `(blueprintId, versionNumber)`.
3. **Drafts** — editable only in `DRAFT` / `IN_REVIEW` (exact enum in C2).
4. **Approved** — **immutable**; changes require new version from approved parent.
5. **Current approved** — at most one `isCurrentApproved = true` per identity (PO decision D6).
6. **Simultaneous drafts** — **recommend: one active draft** (PO decision D2).
7. **Parent version** — required for v2+; validates acyclic chain.

---

## Content snapshot (hybrid)

```typescript
/** Design contract — strict Zod schemas in C2, not `unknown`. */
type BlueprintSnapshotEnvelope = {
  schemaVersion: string;
  blueprintVersionId: string;
  generatedAt: string; // ISO-8601 UTC
  organizational: OrganizationalSlice;
  operational: OperationalSlice;
  securityTrust: SecurityTrustSlice;
  experienceSarea: ExperienceSareaSlice;
  integrations: IntegrationsSlice;
  commercial: CommercialSlice;
};
```

| Control | Recommendation |
|---------|----------------|
| Max size | 2 MB per snapshot (PO decision D8) |
| Validation | Zod at write boundary; reject on failure |
| Serialization | Stable key order for hashing |
| Sensitive fields | Server-side **client-safe** projection |

---

## Content hashing

- **Algorithm:** **SHA-256** over canonical JSON of snapshot slices (excludes timestamps, author metadata).
- **Proves:** Integrity reference for a specific version body at approval time.
- **Does not prove:** Legal signature, non-repudiation, human intent without approval evidence chain.
- **Storage:** `contentHash` on `EnterpriseBlueprintVersion`; recalculated on draft save; verified at approve.

---

## ROI persistence

**Must persist for reproducibility:**

- Assumption identity, revision, source, owner, units, currency, frequency, confidence, approval state
- Engine name/version, formula version, scenario inputs
- Normalized annualized values, warnings, advisory label
- Blueprint version ID reference

**Do not persist only** final ROI percentage.

---

## SOW persistence

- `SowSection.contentSource`: `GENERATED` | `MANUAL` | `GENERATED_THEN_EDITED` | `LOCKED`
- Regeneration **never** overwrites `MANUAL` or `LOCKED` without explicit operator action
- Each regeneration creates new `SowVersion`; prior versions retained
- Links to exact `blueprintVersionId` and optional `roiSnapshotId`

---

## Transaction boundaries (summary)

| Operation | Atomic unit |
|-----------|-------------|
| Create Blueprint | identity + v1 draft + trace |
| Create next version | allocate version + copy snapshot + trace |
| Save draft | validate + **optimistic** lock + trace (material only) |
| Approve | hash verify + approval row + status + supersede prior + trace |
| ROI snapshot | validate assumptions + engine run + immutable insert + trace |
| SOW version | generate sections + preserve manual + insert version + trace |

No transaction performs runtime deployment. **AI cannot approve** — approvals require human actor with assured identity.

---

## Authorization

Full matrix: [`C1_1_AUTHORIZATION_MATRIX.md`](C1_1_AUTHORIZATION_MATRIX.md).

**C2 must fix:** `listEnterpriseBlueprints()` missing tenant filter (IDOR). Studio actions must move from `discovery.write` only to resource-scoped matrix.

---

## Client-safe projection

Server-enforced projection layer — not UI hiding. Excludes internal security weaknesses, margin, implementation-only notes. See gate doc §17.

---

## Backfill & rollout

Detail: [`C1_1_BACKFILL_AND_ROLLOUT_PLAN.md`](C1_1_BACKFILL_AND_ROLLOUT_PLAN.md).

| Provenance state | Meaning |
|------------------|---------|
| `LEGACY_IMPORT` | Migrated from Path A |
| `UNAPPROVED_LEGACY` | No approval evidence |
| `PROVENANCE_COMPLETE` | Author + timestamps known |
| `PROVENANCE_PARTIAL` | Partial metadata |
| `PROVENANCE_UNKNOWN` | Orphaned / incomplete |

**Never invent historical approvals.**

---

## Indexes (recommended)

- `(tenantId, implementationRequestId)` on identity
- `(blueprintId, versionNumber)` unique
- `(blueprintId, status)` where status in draft/approved
- `(blueprintId, isCurrentApproved)` partial unique
- `(tenantId, resourceType, createdAt)` on trace
- `(blueprintVersionId)` on ROI snapshot and approvals

---

## Threat model

[`C1_1_THREAT_MODEL.md`](C1_1_THREAT_MODEL.md) — STRIDE catalog including IDOR, approval spoofing, stale approval, SOW overwrite, hash replacement.

---

## Rollback strategy

1. **Application rollback:** Disable C2 write path; continue Path A reads via adapter.
2. **Database rollback:** Additive tables remain harmless if empty; **do not** destructive down-migrate after production writes.
3. **Dual-read period:** Compare old/new views before canonical cutover.
4. **After approvals exist:** Forward-fix only — deleting new rows is not valid rollback.

---

## Product-owner decisions — **RECORDED** (14 Jun 2026)

All decisions below are **signed**. See [`C1_1_MIGRATION_APPROVAL_GATE.md`](C1_1_MIGRATION_APPROVAL_GATE.md) Section 26 for full text.

1. **Hybrid persistence** — approved  
2. **One active draft** per Blueprint  
3. **Exactly one** current approved version per Blueprint  
4. Blueprint approval: **`platform_admin`** or explicitly authorized **implementer**  
5. **SoD** blocks inappropriate self-approval  
6. Client approval: **advisory acknowledgment only**; does not authorize runtime deployment  
7. Sales: may propose/edit ROI assumptions; **may not approve**  
8. ROI assumption approval: **`platform_admin`** or authorized implementer (initially)  
9. Approved versions **immutable**; post-approval changes → new version  
10. Retention: policy-driven; **7-year operational default**; legal hold capable  
11. Max snapshot: **2 MB**; depth/structure/schema validated  
12. SOW: advisory draft; commercial + legal review before contractual use  
13. **No e-signature** in C2  
14. Historical provenance states required; **no invented** authors/approvals/evidence  
15. Hybrid JSON snapshots: validated, schema-versioned immutable envelopes only  
16. Digital signatures **deferred**; optional `externalSignatureRef` reserved  
17. SHA-256: integrity reference only — not legal signature or blockchain proof  

---

## Mandatory C2 security gates

| Gate | Requirement |
|------|-------------|
| Tenant list scoping | Fix `listEnterpriseBlueprints()` |
| Action-level auth | Replace coarse Studio authorization |
| Client projection | Server-enforced client-safe views |
| Cross-tenant | Reject cross-tenant relationships |
| Stale approval | Prevent approving stale versions |
| Concurrency | Expected revision/hash checks; no last-write-wins |
| SAREA | Separate from authorization |
| Deployment | Blueprint approval ≠ runtime deployment |
| AI boundary | AI may assist; may not approve/sign/authorize/invent ROI |

---

## C2 implementation checklist (PO sign-off received)

- [ ] Prisma models per schema preview  
- [ ] Additive migration only (no drops in first migration)  
- [ ] Dual-read adapter (Path A + Path C)  
- [ ] Backfill job + validation queries  
- [ ] Tenant-scoped list/query fixes  
- [ ] Authorization matrix enforcement in actions  
- [ ] Client projection service  
- [ ] Verifier extensions for persisted ROI/SOW round-trip tests  

---

## Related C1 docs

- [`04-BLUEPRINT-ADAPTER-AND-LIFECYCLE.md`](04-BLUEPRINT-ADAPTER-AND-LIFECYCLE.md)
- [`07-TRACEABILITY-AND-VERSIONING.md`](07-TRACEABILITY-AND-VERSIONING.md)
- [`10-C1-OPEN-QUESTIONS-AND-FUTURE-MIGRATION.md`](10-C1-OPEN-QUESTIONS-AND-FUTURE-MIGRATION.md)
