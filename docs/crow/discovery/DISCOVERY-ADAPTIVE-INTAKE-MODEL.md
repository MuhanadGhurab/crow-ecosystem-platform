# Discovery Adaptive Intake Model

| Field | Value |
|-------|-------|
| **Title** | Adaptive Discovery intake stages and outputs |
| **Status** | CANONICAL design — CROW.DISCOVERY.FIELD.1 |
| **Authority** | [`DISCOVERY-FIELD-ARCHITECTURE.md`](DISCOVERY-FIELD-ARCHITECTURE.md) |
| **Date** | 2026-07-18 |

## Purpose

Define **how** Crow asks for enterprise information over time — progressive, adaptive, reviewable — and **what** Discovery should produce for ProCrow and later Blueprint drafting.

## Preconditions

1. Request submitted (authority-safe)  
2. ProCrow recorded `qualified_for_discovery` (CROW.PROCROW.1)  
3. Controlled Discovery start (no auto-start from mere submission)

## Adaptive rules

| Input | Effect |
|-------|--------|
| `journey_kind = NEW` | Hide Transform current-state block; emphasize target capabilities |
| `journey_kind = TRANSFORM` | Show L8 current/pain/target; emphasize preservation + transition |
| `organization_context = NEW_DIVISION` | Ask parent relationship / shared services |
| `organization_context = MODERNIZATION` | Emphasize legacy systems + compliance drivers |
| Industry pack selected | Unlock L7 pack questions (Later) |
| High data sensitivity | Expand L5 and evidence recommendations |
| Missing required MVP fields | ProCrow missing-information list; block “Discovery complete” |

## Stages

### Stage 1 — Context

**Question:** Who are you and what are you trying to do?

| Include | Source |
|---------|--------|
| Journey, org context, purpose, industry/field, scale, goal | Carry from Request brief |
| Confirm / refine display name | Client or ProCrow |
| Success definition (90 days) | New |

**Exit:** Context confirmed; contradictions flagged if Request vs Discovery conflict.

### Stage 2 — Organization Shape

**Question:** What kind of organization or division is this?

| Include | Notes |
|---------|-------|
| Legal entity type (simple enum) | MVP |
| Locations / branch topology summary | MVP |
| Departments planned | MVP (list or repeatable) |
| Operating shape | single HQ / multi-branch / multi-country / franchise |
| Parent org (if NEW_DIVISION) | Conditional |

### Stage 3 — Operating Reality

**Question:** How does work actually run (or how should it)?

| Include | Notes |
|---------|-------|
| Key roles / work personas | MVP |
| Core workflows / families | MVP |
| Approvals / decisions summary | MVP |
| Systems & tools inventory (text) | MVP |
| Capabilities must-have | MVP |

Transform: capture current and target where different.  
Build New: capture intended target only.

### Stage 4 — Trust and Risk

**Question:** What must be protected?

| Include | Notes |
|---------|-------|
| Identity / MFA / SSO preference | MVP |
| Data sensitivity / regulated types | MVP |
| Compliance drivers | MVP |
| Top risks + SoD need | MVP |
| CyberCrow / hosting expectations | Later |

### Stage 5 — Transformation or Build Intent

**Question:** What changes, and what must stay?

| Journey | Focus |
|---------|-------|
| NEW | Target operating shape, launch horizon, greenfield constraints |
| TRANSFORM | Pain points, preserved elements, transition preference, pilot scope |

### Stage 6 — Evidence

**Question:** What can we point to?

| Include | Notes |
|---------|-------|
| Org chart / policy / process refs (names or URLs) | MVP text refs |
| System inventory docs | Later |
| Binary uploads | Deferred |

### Stage 7 — ProCrow Review Summary

**Question:** Is this ready for Operating Model / Blueprint drafting?

ProCrow sees:

- Completeness by stage  
- Missing required fields  
- Contradictions (e.g., Transform without pain points)  
- Risk hotspots  
- Blueprint readiness signal  
- Explicit **does not** provision tenant / approve Blueprint  

---

## Output model (logical — no DB implementation now)

| Output | Description |
|--------|-------------|
| `DiscoveryProfile` | Container for discovery status, version, timestamps |
| `OrganizationContextProfile` | Journey, org context, identity, shape, locations |
| `OperatingModelInput` | Roles, workflows, responsibilities, systems, capabilities |
| `TrustProfile` | Identity, sensitivity, compliance, risks |
| `TransformationProfile` | Current / target / transition (Transform) or build intent (New) |
| `EvidenceIndex` | List of evidence references |
| `MissingInformationList` | Structured gaps with severity |
| `ProCrowReviewSummary` | Operator-facing readiness narrative + flags |
| `BlueprintReadinessSignal` | `not_ready` \| `needs_more_info` \| `ready_for_draft` (never auto-approves) |

### Authority envelope (required on all outputs)

```text
advisory: true
grantsAuthority: false
provisionsTenant: false
createsBlueprint: false
requiresPayment: false
croAiAutonomous: false
```

---

## ProCrow review approach

1. **Structured first** — summaries by stage, not raw form dump  
2. **Missing information** — `blocking_if_missing` fields drive Needs More Information loop back to client or operator notes  
3. **Contradiction detection** — journey vs answers; org context vs locations; Transform without current state  
4. **Risk triage** — high `riskSensitivity` fields highlighted for CyberCrow later  
5. **Handoff control** — Blueprint drafting only after human readiness signal + existing Blueprint gates  

Qualification (PROCROW.1) remains the gate **into** Discovery; Stage 7 gates **out of** Discovery toward Blueprint drafting.

---

## MVP vs later vs deferred

| Tier | Content |
|------|---------|
| **MVP** | Stages 1–7 with L1–L6 core + L8 for Transform + L9 text refs + Stage 7 review |
| **Later** | Industry packs (L7), deep commercial, CyberCrow/hosting depth, matrix tables, persona catalogs |
| **Deferred** | File upload product, live integrations inventory sync, CroAI auto-fill, schema migrations |

---

## Tests plan (for future implementation milestones)

| Test theme | Must prove |
|------------|------------|
| Journey visibility | Transform-only fields hidden for NEW and vice versa |
| Org context visibility | NEW_DIVISION parent fields appear only when selected |
| Stage required fields | Cannot complete stage without requiredCondition satisfied |
| Validation | Enum/length/minItems enforced |
| Authority safety | Saving answers creates no membership/role/tenant/Blueprint/payment |
| Discovery gate | Start Discovery still requires `qualified_for_discovery` |
| Missing info | ProCrow MissingInformationList populated for blocking gaps |
| Operating model map | Each MVP field has `mapsToOperatingModel` |
| Blueprint map | Each MVP field has `mapsToBlueprintSection` |
| Versioning | Unknown future keys ignored; catalog version recorded |
| Dual surface | Client and operator write same `fieldKey` namespace |

Static tests (file presence / no-authority string checks) are acceptable until integration env exists (GAP-004).

---

## Relationship to CROW.DISCOVERY.1

This document is **field architecture**.  
**CROW.DISCOVERY.1** should turn it into MVP scope, UX flows, evidence plan, and build authorization — still without unauthorized migrations or Production deploy.
