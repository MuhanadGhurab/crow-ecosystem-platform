# C1.1 — Schema Design Preview (Prisma-like)

> **NON-EXECUTABLE DESIGN PREVIEW — REQUIRES PRODUCT-OWNER APPROVAL**
>
> This document is **not** applied to `prisma/schema.prisma`.  
> No migration files exist for this design until **C2** after PO approval.

**Selected strategy:** Option 2 — Hybrid persistence  
**Baseline migration count:** 13 (unchanged in C1.1)

---

## Model overview

```text
EnterpriseBlueprint (identity, existing table extended)
  ├── EnterpriseBlueprintVersion[]
  │     ├── BlueprintApproval?
  │     ├── BlueprintTraceEvent[]
  │     ├── RoiSnapshot[]
  │     └── SowVersion[] (via SowDocument)
  ├── BlueprintChangeRequest[]
  ├── BlueprintConfigurationProposal[]
  ├── RoiAssumption[]
  │     └── RoiAssumptionRevision[]
  └── SowDocument[]
        └── SowVersion[]
              └── SowSection[] (or sectionSnapshotJson)
```

---

## EnterpriseBlueprint (identity — extend existing)

| Field | Type | Notes |
|-------|------|-------|
| id | String @id | Existing |
| tenantId | String | **Required in C2** (backfill nullable transition) |
| requestId | String @unique | Existing 1:1 ImplementationRequest |
| discoveryProfileId | String? | Link to discovery |
| title | String | Display name |
| status | Enum | Program-level (active/archived) — distinct from version status |
| currentApprovedVersionId | String? | FK → Version |
| activeDraftVersionId | String? | FK → Version (if single-draft rule) |
| legacyVersionInt | Int? | Deprecated; migrate off `version` field |
| createdAt / updatedAt | DateTime | Existing |

**Indexes:** `(tenantId)`, `(tenantId, status)`, `(requestId)`

---

## EnterpriseBlueprintVersion

| Field | Type | Null | Notes |
|-------|------|------|-------|
| id | String @id | | |
| blueprintId | String | | FK |
| tenantId | String | | Denormalized for query safety |
| versionNumber | Int | | Unique per blueprint |
| parentVersionId | String? | | Lineage |
| status | Enum | | draft, pending_review, changes_requested, approved, superseded, archived |
| schemaVersion | String | | Snapshot contract version |
| contentSnapshot | Json | | Validated `BlueprintSnapshotEnvelope` |
| contentHash | String | | SHA-256 hex |
| revision | Int | | Optimistic lock |
| isCurrentApproved | Boolean | | Default false |
| isActiveDraft | Boolean | | Default false |
| authorId | String? | | |
| createdAt / updatedAt | DateTime | | |
| submittedAt | DateTime? | | |
| approvedAt | DateTime? | | |
| provenance | Enum | | LEGACY_IMPORT, etc. |
| legacyImportBatchId | String? | | |

**Unique:** `@@unique([blueprintId, versionNumber])`  
**Partial unique (app-enforced or PG):** one `isCurrentApproved=true` per blueprintId  
**Indexes:** `(blueprintId, status)`, `(tenantId, blueprintId)`, `(contentHash)`

**Immutability:** On `status=approved`, service rejects UPDATE to `contentSnapshot`, `contentHash`, `versionNumber`.

---

## BlueprintSnapshotEnvelope (TypeScript contract — C2)

```typescript
// Design preview — strict Zod schemas per slice in C2
type BlueprintSnapshotEnvelope = {
  schemaVersion: "1.0.0";
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

**Limits:** Max 2 MB serialized JSON; max depth 12; max array length 500 per slice.

---

## BlueprintApproval

| Field | Type | Notes |
|-------|------|-------|
| id | String @id | |
| tenantId | String | |
| blueprintId | String | |
| blueprintVersionId | String | Unique per approval decision |
| contentHash | String | Copy at approval time |
| approverId | String | |
| approverRole | String | |
| authAssurance | String? | e.g. mfa, sso |
| decision | Enum | approved, rejected |
| rationale | String? | |
| policyRuleId | String? | |
| evidenceRefs | Json? | Attachment IDs |
| aiAssistanceDisclosed | Boolean | |
| delegatedFrom | String? | |
| createdAt | DateTime | Immutable |

**No UPDATE/DELETE** via application API.

---

## BlueprintTraceEvent

| Field | Type | Notes |
|-------|------|-------|
| id | String @id | |
| tenantId | String | |
| blueprintId | String | |
| blueprintVersionId | String? | |
| actorType | Enum | human, ai, automation, service, integration, system |
| actorId | String? | |
| action | String | |
| reason | String? | |
| previousState | String? | |
| newState | String? | |
| materialImpact | Boolean | |
| evidenceRefs | Json? | |
| correlationId | String? | |
| requestId | String? | HTTP request |
| metadata | Json? | Sanitized — no secrets |
| createdAt | DateTime | |

**Index:** `(tenantId, blueprintId, createdAt DESC)`, `(blueprintVersionId, createdAt)`

---

## BlueprintChangeRequest

| Field | Type | Notes |
|-------|------|-------|
| id | String @id | |
| tenantId | String | |
| blueprintId | String | |
| blueprintVersionId | String | Version under review |
| requestedBy | String | |
| scope | Enum | client, internal |
| comments | Json | Structured threads |
| status | Enum | open, resolved, withdrawn |
| createdAt / resolvedAt | DateTime | |

---

## RoiAssumption / RoiAssumptionRevision

**RoiAssumption:** identity per blueprint (tenantId, blueprintId, key)  
**RoiAssumptionRevision:** immutable revision with value, unit, currency, frequency, annualizedValue, confidence, source, sourceType, ownerId, approvalState, scenarioTags

**RoiSnapshot:**

| Field | Notes |
|-------|-------|
| blueprintVersionId | Required |
| assumptionRevisionIds | String[] |
| engineName / engineVersion | |
| formulaVersion | |
| scenarioInputs | Json |
| results | Json (normalized outputs) |
| warnings | Json |
| advisoryLabel | String |
| contentHash | SHA-256 of inputs+outputs |
| createdAt | Immutable |

**Index:** `(blueprintVersionId, createdAt DESC)`

---

## SowDocument / SowVersion / SowSection

**SowDocument:** tenantId, blueprintId, title, commercialPackageRef  
**SowVersion:** sowDocumentId, versionNumber, status, blueprintVersionId, roiSnapshotId?, contentHash, revision  
**SowSection:** sowVersionId, sectionKey, orderIndex, provenance (generated|manual|generated_edited|locked), generatedContent?, manualContent?, sourceRefs Json, reviewState

**Alternative:** `sectionSnapshotJson` on SowVersion if section count is bounded — PO may choose in C2.

---

## Deletion behavior

| Entity | Delete policy |
|--------|---------------|
| Approved version | Soft archive only |
| Approval evidence | No hard delete |
| Trace events | Append-only; archive after retention |
| Draft versions | Soft delete if never approved |
| ROI/SOW snapshots | Retain with blueprint program |

---

## Relationship to legacy models

| Legacy | C1.1 role after C2 |
|--------|-------------------|
| EnterpriseBlueprint child tables | Runtime configuration (Path A); synced from approved snapshot on release (C3) |
| DiscoveryProfile | Evidence source; linked from identity |
| ImplementationRequest | Canonical engagement link |
| CybercrowAuditLog | Platform audit; supplemental to BlueprintTraceEvent |
| ProposalStatus enum on blueprint | Superseded by version status + approvals |

---

## Index summary (Section 21)

See model sections above. Pagination defaults: trace timeline 50/page; version list 20/page; compare max 2 versions per request.
