# C1.1 — Blueprint Persistence Migration Approval Gate

**Branch:** `feat/c1-1-blueprint-persistence-gate` (stacked on C1 at `12edf8d`)  
**Status:** Architecture approval board — **no migration implemented**  
**Gate date:** 14 Jun 2026  
**Audience:** Product owner, security, engineering leads

---

## Executive summary

C1 delivered a working **Enterprise Blueprint Studio** prototype with deterministic ROI, SOW generation, version comparison, hashing, and traceability — all **persistence-neutral** (in-memory maps + Path A Prisma adapter reads).

C1.1 reconciles seven parallel architecture workstreams and selects **exactly one** persistence strategy before any `prisma/schema.prisma` or migration file is created.

| Outcome | Value |
|---------|-------|
| **Selected strategy** | **Option 2 — Hybrid persistence** |
| **Path C readiness** | **Approved — C2 migration implementation may proceed** |
| **C1 gate status** | Superseded by C1.1 product-owner sign-off |
| **Final C1.1 decision** | **APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION** |
| **PO sign-off date** | 14 Jun 2026 |

---

## Precheck (Section 1)

| Check | Result |
|-------|--------|
| Current branch | `feat/c1-1-blueprint-persistence-gate` |
| Branch tip | `12edf8d` — `feat(procrow): add Enterprise Blueprint Studio` |
| Working tree | Clean before C1.1 doc work |
| Stacked on C1 | Yes (`feat/c1-enterprise-blueprint-studio` same tip) |
| PR #3 (C0 → main) | OPEN, MERGEABLE |
| PR #4 (C1 → C0) | OPEN, MERGEABLE — https://github.com/MuhanadGhurab/crow-ecosystem-platform/pull/4 |
| PR #2 (M4D) | OPEN — **not modified** |
| `prisma/schema.prisma` | **Not modified in C1.1** |
| Migration count | **13** (unchanged) |

---

## Parallel workstream synthesis (Section 3)

### Agent A — Existing schema source-of-truth

**Canonical identity today:** `EnterpriseBlueprint` (1:1 with `ImplementationRequest` via `requestId`).

**Canonical content today:** Normalized child tables (`BlueprintModule`, `BlueprintWorkflow`, `BlueprintRole`, `BlueprintSecurityBaseline`, `BlueprintSareaProfile`, `BlueprintIntegration`, etc.) plus `DiscoveryProfile` evidence.

**Gaps:**

- `EnterpriseBlueprint.version` is a mutable `Int` on the identity row — **not** immutable version history.
- `tenantId` is optional on `EnterpriseBlueprint`.
- `listEnterpriseBlueprints()` has **no tenant filter** (IDOR risk at read layer).
- `CybercrowAuditLog` is tenant-scoped but generic — not blueprint-version keyed.
- No `Proposal` / `SOW` tables; commercial state lives in `ProposalStatus` enum on blueprint row.
- C1 snapshot/ROI/SOW/trace live in **in-memory `Map`s** — lost on restart.

**Source-of-truth map:** See [`C1_EXISTING_BLUEPRINT_PERSISTENCE_MAPPING.md`](C1_EXISTING_BLUEPRINT_PERSISTENCE_MAPPING.md) and [`C1_1_SCHEMA_DESIGN_PREVIEW.md`](C1_1_SCHEMA_DESIGN_PREVIEW.md).

**Recommendation:** Keep existing normalized blueprint children for **operational/runtime** configuration; introduce **new** version/approval/trace/commercial tables for Studio lifecycle. Do not scatter C1 snapshots into child `configJson` (Path B rejected).

### Agent B — Identity, versioning, immutability

**Rules (C2 must enforce):**

1. `EnterpriseBlueprint` = long-lived program identity (tenant-scoped).
2. `EnterpriseBlueprintVersion` = one complete content snapshot + lifecycle state.
3. Drafts (`draft`, `pending_review`, `changes_requested`) are mutable with optimistic concurrency.
4. Approved versions (`approved`) are **immutable** — updates require new version row.
5. `versionNumber` unique per blueprint; monotonic allocation in transaction.
6. `parentVersionId` forms lineage; superseded approved version marked `superseded`.
7. **One current approved version** per blueprint (partial unique index on `isCurrentApproved`).
8. Content hash calculated at save/submit/approve boundaries; approval binds exact hash.

**Product rule (PO approved):** **One active draft** per blueprint; creating a new draft while another exists returns conflict.

### Agent C — ROI persistence

**Relational:** `RoiAssumption` + `RoiAssumptionRevision` (identity + immutable revisions).

**Snapshot:** `RoiSnapshot` — immutable record with engine version, formula version, assumption revision IDs, scenario inputs, normalized annualized outputs, warnings, advisory label, `blueprintVersionId`.

**Never persist only final ROI %** — full reproducibility required.

### Agent D — SOW persistence

**Relational:** `SowDocument` (identity) + `SowVersion` (immutable approved / mutable draft) + `SowSection` rows or validated section snapshot.

**Section provenance:** `generated` | `manual` | `generated_edited` | `locked`.

**Regeneration:** Never silently overwrite `manual` or `generated_edited` or `locked` sections; conflicts surfaced to UI; prior version preserved.

### Agent E — Authorization and tenant security

See [`C1_1_THREAT_MODEL.md`](C1_1_THREAT_MODEL.md) and [`C1_1_AUTHORIZATION_MATRIX.md`](C1_1_AUTHORIZATION_MATRIX.md).

**Critical findings:**

- Studio actions use `requireActionDiscoveryWrite()` only — insufficient for production matrix.
- Client-safe projection **must be server-enforced** (new read service layer).
- SAREA never grants access (invariant preserved).

### Agent F — Query patterns and indexes

See [`C1_1_SCHEMA_DESIGN_PREVIEW.md`](C1_1_SCHEMA_DESIGN_PREVIEW.md) index section.

High-frequency paths: list by tenant, current approved version, active draft, version compare, trace timeline (paginated), latest ROI snapshot per version/scenario, SOW versions by document.

### Agent G — Migration, backfill, rollout

See [`C1_1_BACKFILL_AND_ROLLOUT_PLAN.md`](C1_1_BACKFILL_AND_ROLLOUT_PLAN.md).

**Principles:** Additive only in C2 migration wave 1; no destructive drops; dual-read adapter period; provenance classification for legacy rows; no invented approvals.

---

## Persistence strategy comparison (Section 4)

| Criterion | Option 1 Fully normalized | **Option 2 Hybrid (SELECTED)** | Option 3 Minimal extension |
|-----------|---------------------------|--------------------------------|--------------------------|
| Queryability | Excellent | Good (metadata relational, content snapshot) | Poor for version history |
| Immutability enforcement | Strong (row-level) | Strong (approved snapshot rows + service) | Weak (mutable `EnterpriseBlueprint`) |
| ROI reproducibility | Strong | Strong (immutable `RoiSnapshot`) | Weak |
| SOW manual-edit protection | Strong | Strong (section provenance + locks) | Not enforceable |
| Migration burden | High | Medium | Low |
| Schema rigidity | High | Medium | Low |
| Industry extensibility | High | High (schemaVersion in snapshots) | Low |
| C1 prototype alignment | Requires full rewrite | **Aligns with `BlueprintVersionSnapshot` pattern** | Conflicts with C1 contracts |

**Rejected:** Option 3 — cannot enforce invariants 3–14 without parallel version store.  
**Deferred nuance:** Option 1 slice-level tables — may evolve from hybrid snapshots in C3+ if query demand requires.

---

## Required invariants (Section 5)

All 22 invariants from the gate brief are **explicitly adopted** in C1.1 design docs:

1. Tenant-scoped records  
2. Identity ≠ version content  
3. Drafts editable only in editable states  
4. Approved versions immutable  
5. Post-approval changes → new version  
6. Unique version number per blueprint  
7. One current approved version (where product requires)  
8. Valid parent-version chain  
9. Approval binds version + content hash  
10. Approval records actor, role, time, rationale, assurance, evidence  
11. ROI references exact assumptions + engine version  
12. SOW references exact Blueprint + ROI versions  
13. Generated vs manual SOW distinguishable  
14. Trace actors typed (human/AI/automation/service/system)  
15. Historical imports do not invent approval  
16. Evidence not deletable via ordinary UI  
17. Client-safe views exclude internal commercial/security detail  
18. Cross-tenant relations rejected  
19. SAREA never grants access  
20. Configuration proposal ≠ runtime deployment  
21. Hashes = integrity reference only  
22. AI cannot approve, sign, or authorize  

---

## Transaction boundaries (Section 14)

| Operation | Atomic steps |
|-----------|--------------|
| Create initial Blueprint | Auth → validate tenant/request → create identity → create v1 draft → trace event |
| Create next version | Auth → verify source → lock/compare revision → allocate version → copy snapshot → parent ref → trace |
| Save draft | Auth → reject approved/superseded → validate snapshot → optimistic concurrency → update → trace if material |
| Submit review | Completeness check → review state → optional draft lock → trace |
| Approve | Auth → verify reviewed version + hash → SoD checks → approval evidence row → mark approved → supersede prior → trace |
| Create ROI snapshot | Validate assumption revisions → run engine → persist immutable snapshot → link version → trace |
| Create SOW version | Validate blueprint/ROI refs → generate with provenance → persist → trace |

**No transaction performs runtime deployment.**

---

## Concurrency (Section 15)

- **Optimistic locking:** `revision` Int on draft version rows; client sends `expectedRevision` on save.
- **Expected hash on approve:** Reject if content changed since review.
- **Unique constraints:** `(blueprintId, versionNumber)`, one `isCurrentApproved` per blueprint, one `isActiveDraft` (if product confirms).
- **Conflict responses:** `409 CONFLICT` with `{ code, expectedRevision, currentRevision, currentHash }` — no silent last-write-wins.

---

## Content hashing (Section 9)

- **Algorithm:** SHA-256  
- **Canonical payload:** Normalized `BlueprintSnapshotEnvelope` per [`blueprint-hash.service.ts`](../../../../src/lib/crow-core/blueprint-studio/blueprint-hash.service.ts) rules extended in C2: stable key order, slices only (organizational, operational, securityTrust, experienceSarea, integrations, commercial), sorted assumptions/exclusions/acceptanceCriteria; **exclude** `updatedAt`, actor metadata, approval timestamps from hash input.  
- **Storage:** `contentHash` on `EnterpriseBlueprintVersion`; approval row duplicates hash at decision time.  
- **Claims limited to:** Content integrity reference for a specific normalized snapshot at a point in time. **Not** legal signature or non-repudiation alone.

---

## Product-owner decision board (Section 26) — **SIGNED**

**Sign-off:** Product owner architecture approval recorded **14 Jun 2026**.  
**Approved strategy:** **Option 2 — Hybrid persistence** (normalize lifecycle/metadata; immutable validated snapshots for content).

| # | Decision | Recorded PO decision |
|---|----------|---------------------|
| 1 | One active draft per Blueprint | **Approved** |
| 2 | Current approved version uniqueness | **Exactly one** current approved version per Blueprint |
| 3 | Who may approve Blueprints | **`platform_admin`** or an **explicitly authorized implementer** |
| 4 | Separation of duties | **Must block** inappropriate self-approval |
| 5 | Client approval authority | **Advisory acknowledgment only** |
| 6 | Client acknowledgment vs deployment | **Does not authorize** runtime deployment |
| 7 | Sales and ROI assumptions | Sales may **propose and edit**; **may not approve** |
| 8 | ROI assumption approval | Initially requires **`platform_admin`** or authorized implementer |
| 9 | Approved version immutability | **Approved** — changes after approval create a **new version** |
| 10 | Retention | **Policy-driven** model; **seven-year operational default**; subject to legal/contract review and legal hold |
| 11 | Max snapshot size | **2 MB** initially |
| 12 | Snapshot validation | **Depth, structure, and schema** must be validated |
| 13 | Generated SOW status | **Advisory draft** only |
| 14 | SOW contractual use | Requires **authorized commercial and legal review** before contractual use |
| 15 | E-signature in C2 | **Not included** |
| 16 | Historical provenance | **Explicit provenance states** required |
| 17 | Historical imports | **Must never invent** authors, approvals, or assurance evidence |
| 18 | Hybrid JSON snapshots | Allowed only as **validated, schema-versioned immutable envelopes** |
| 19 | Digital signatures | **Deferred**; preserve optional `externalSignatureRef` for future integration |
| 20 | SHA-256 scope | **Content-integrity reference only** — not legal signature or blockchain proof |

### Hybrid persistence scope (approved)

**Normalize:**

- Tenant ownership
- Blueprint identity
- Version lifecycle and metadata
- Approvals
- Trace events
- Change requests
- Configuration proposals
- ROI assumptions and revisions
- SOW identity/version metadata

**Immutable validated snapshots:**

- Complete Blueprint slice content
- ROI calculation inputs and results
- Generated SOW content and source maps

**Transition:** Existing normalized Blueprint child tables remain the **operational/runtime configuration** source during dual-read.

---

## Mandatory C2 security gates (PO required)

C2 implementation **must not** be considered complete until these gates are satisfied:

| Gate | Requirement |
|------|-------------|
| G1 | Fix tenant scoping in `listEnterpriseBlueprints()` |
| G2 | Replace coarse Blueprint Studio authorization with **explicit action-level** authorization |
| G3 | Enforce **server-side** client-safe projections |
| G4 | Prevent cross-tenant relationships |
| G5 | Prevent stale-version approval |
| G6 | Enforce expected revision/hash checks |
| G7 | Reject silent last-write-wins behavior |
| G8 | Keep **SAREA** separate from authorization |
| G9 | Keep Blueprint approval separate from **runtime deployment** |
| G10 | **AI may assist** but may not approve, sign, authorize, or invent ROI values |

---

## Final C1.1 decision (Section 27)

```
APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION
```

**Rationale:** Product owner has signed the hybrid persistence architecture and all 22 policy decisions. C1.1 remains **documentation and verification only** — no Prisma schema or migration files in this branch. **C2** may implement additive migrations per [`C1_1_SCHEMA_DESIGN_PREVIEW.md`](C1_1_SCHEMA_DESIGN_PREVIEW.md) subject to mandatory security gates above.

**Not selected:**

- `CONDITIONAL APPROVAL — PRODUCT DECISIONS REQUIRED` — superseded by PO sign-off  
- `REJECT PATH C — EXISTING SCHEMA` — Option 3 fails immutability/reproducibility gates  
- `REJECT — DUPLICATE OR UNSAFE` — architecture is coherent; risks documented with C2 mitigations

---

## Related documents

| Document | Purpose |
|----------|---------|
| [`C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md`](C1_BLUEPRINT_PERSISTENCE_MIGRATION_PROPOSAL.md) | Updated Path C proposal |
| [`C1_1_SCHEMA_DESIGN_PREVIEW.md`](C1_1_SCHEMA_DESIGN_PREVIEW.md) | Non-executable schema preview |
| [`C1_1_AUTHORIZATION_MATRIX.md`](C1_1_AUTHORIZATION_MATRIX.md) | Role × action matrix |
| [`C1_1_THREAT_MODEL.md`](C1_1_THREAT_MODEL.md) | STRIDE-style threats |
| [`C1_1_BACKFILL_AND_ROLLOUT_PLAN.md`](C1_1_BACKFILL_AND_ROLLOUT_PLAN.md) | Backfill + rollout + rollback |
| [`../../internal/C1_1_BLUEPRINT_PERSISTENCE_MIGRATION_APPROVAL_GATE.md`](../../internal/C1_1_BLUEPRINT_PERSISTENCE_MIGRATION_APPROVAL_GATE.md) | Internal operator summary |

**Verifier:** `npm run c1-migration-gate:verify`
