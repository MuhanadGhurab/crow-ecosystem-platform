# Discovery MVP Plan

| Field | Value |
|-------|-------|
| **Title** | Discovery and Operating Model MVP — Delivery Plan |
| **Status** | CANONICAL plan — **D0–D7 local-first complete (Stages 1–7 depth); MVP-CERT.1 package prepared** |
| **Authority** | Owner decisions in CROW.DISCOVERY.1–7 · MVP-CERT.1 |
| **Date** | 2026-07-18 |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **Audit** | [`DISCOVERY-AUDIT.md`](DISCOVERY-AUDIT.md) |
| **Operating Model plan** | [`OPERATING-MODEL-MVP-PLAN.md`](OPERATING-MODEL-MVP-PLAN.md) |
| **Milestone** | [`milestones/CROW-DISCOVERY-7.md`](../milestones/CROW-DISCOVERY-7.md) · cert [`milestones/CROW-DISCOVERY-MVP-CERT-1.md`](../milestones/CROW-DISCOVERY-MVP-CERT-1.md) |
| **Certification** | [`DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md`](DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md) · [`DISCOVERY-MVP-OWNER-ACCEPTANCE-CHECKLIST.md`](DISCOVERY-MVP-OWNER-ACCEPTANCE-CHECKLIST.md) |
| **Field architecture** | FIELD.1 @ `e90fcda` · [`DISCOVERY-FIELD-ARCHITECTURE.md`](DISCOVERY-FIELD-ARCHITECTURE.md) |
| **Prior** | CROW.DISCOVERY.4 · CROW.DISCOVERY.3 · CROW.DISCOVERY.2 |

---

## Implementation progress (CROW.DISCOVERY.2)

| Phase | Status | Notes |
|-------|--------|-------|
| D0 Safety | **Done** (local-first) | Qualification gate, route protection, non-authority tests, Blueprint complete quarantined |
| D1 Data alignment | **Done** (no migration) | Product status vocabulary in `discovery-product-status.ts`; existing profile/brief fields |
| D2 Workspace UX | **Done** (foundation) | `DiscoveryMvpWorkspaceShell` — linked request, JourneyKind, OrganizationContext, Stages 1–7 overview, evidence refs-only |
| D3 Adaptive fields | **Done** (Stages 1–3 foundation) | Typed catalog, NEW/TRANSFORM + org-context visibility, localStorage drafts, validation, ProCrow prep summary |
| D4 Operating Model capture | **Done** (local input draft) | `OperatingModelInputDraft` from D3 answers; preview UX; `readyForBlueprintDraft` always false |
| D5 ProCrow modeling review | **Done** (local readiness) | `evaluateProCrowModelingReadiness`; review panel; `readyForModeling` may be true; Blueprint still blocked |
| D6 Blueprint handoff | **Done** (local contract) | `DiscoveryBlueprintHandoffPackage`; handoff panel; `readyForBlueprintHandoff` may be true; draft/generation remain false |
| D7 Stages 4–7 depth | **Done** (local-first) | Trust/risk, build/transform intent, evidence refs-only, ProCrow review prep; D4–D6 enriched; `npm run discovery-mvp-d7:test` |
| MVP-CERT.1 | **Package prepared** | Local-first certification + owner checklist; acceptance not auto-applied |

Evidence: [`DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md`](DISCOVERY-MVP-LOCAL-FIRST-CERTIFICATION.md) · [`milestones/CROW-DISCOVERY-7.md`](../milestones/CROW-DISCOVERY-7.md) · `npm run discovery-mvp-d7:test`

---

## Product intent

Discovery begins **only** after a Request is `qualified_for_discovery`. It is **structured learning about the organization** to support an Operating Model draft later.

Discovery is **not** Blueprint, tenant provisioning, payment, CroAI, or authority.

---

## Recommended MVP scope

```
Qualified request
  → controlled Discovery start
  → adaptive stages 1–7 (MVP field groups)
  → client workspace + operator review
  → ProCrow completeness / clarification
  → ready-for-modeling signal
  → STOP (no Blueprint generate, no tenant, no payment, no CroAI)
```

### Must support

- Qualified request required (linked request + journey kind + org context)
- Structured sections + answer payload + status
- Evidence **references only** (no file uploads)
- Operator / client ownership + missing-information flags
- ProCrow review summary
- Progressive disclosure by journey + org context
- Field → Operating Model maps (advisory)
- Field → Blueprint maps (advisory only — no generation)

### Explicit non-goals

- Production deploy · `main` push · PR #10 merge
- Migrations / DB enum changes / hosted business writes / seed hosted data
- Tenant membership · platform roles · tenant provision
- Blueprint generation as MVP success
- Payment / subscription runtime
- CroAI runtime
- Auth / authorization behavior changes (beyond Discovery route discipline)
- Industry packs (Later) · evidence uploads

---

## Delivery model

| Mode | Recommendation |
|------|----------------|
| **Planning (this milestone)** | Docs + Issue #18 only |
| **Build (future)** | Local-first, same pattern as REQUEST.2 / PROCROW.1 |
| **Hosted certify** | Blocked until GAP-004 path |
| **Production** | Forbidden without explicit owner authorization |

---

## Implementation phases

### Phase D0 — Discovery safety baseline

- Enforce: Discovery product entry only from qualified request + controlled start
- Document/test: no tenant membership, roles, tenant, Blueprint, payment, CroAI from Discovery MVP paths
- Clarify client pre-handoff profile creation (block or quarantine per owner decision)
- No hosted writes unless authorized

**Exit:** Safety matrix + tests green for non-authority claims.

### Phase D1 — Discovery data model design

Logical model (persist via existing tables unless owner later approves migration):

| Concept | Storage approach |
|---------|------------------|
| Discovery session | `DiscoveryProfile` + status |
| Linked request | `requestId` 1:1 |
| Journey kind / org context | Request brief (source of truth) + Stage 1 confirm answers |
| Sections / questions | Catalog keys → `DiscoveryAnswer` |
| Answer payload | `valueJson` |
| Evidence refs | Answer keys or structured JSON refs (no uploads) |
| Ownership | Client vs ProCrow metadata on answers / profile |
| Missing-info flags | Stage 7 / review summary JSON |

**Exit:** Written data contract; **no migration applied**.

### Phase D2 — Discovery workspace UX

- Client-facing workspace aligned to stages 1–6 (MVP subset)
- Operator-facing review + deepen
- Section progress, save draft, submit section, request more information
- Preserve existing `/discovery/*` and `/client/.../discovery` shells where possible

**Exit:** Dual-surface write to shared logical keys.

### Phase D3 — Adaptive field implementation

Apply MVP field groups from FIELD.1 / taxonomy:

| Stage | Focus |
|-------|-------|
| 1 | Context |
| 2 | Organization shape |
| 3 | Operating reality |
| 4 | Trust and risk |
| 5 | Build / Transform intent |
| 6 | Evidence references |
| 7 | ProCrow review summary |

Include: progressive disclosure, conditional questions, validation, question versioning strategy, field→OM and field→Blueprint **maps** (advisory).

**Exit:** Catalog-driven visibility; journey/org conditionals verified in tests.

### Phase D4 — Operating Model capture plan

See [`OPERATING-MODEL-MVP-PLAN.md`](OPERATING-MODEL-MVP-PLAN.md). Capture draft-oriented fields only; no runtime CEM activation.

### Phase D5 — ProCrow review

- Completeness review
- Contradiction review (Request vs Discovery)
- Request clarification
- Mark **ready for modeling**
- **No** Blueprint generation

### Phase D6 — Blueprint handoff boundary

**Done (local-first):** `DiscoveryBlueprintHandoffPackage` with section coverage, required gates (ProCrow + owner + future milestone + GAP-004), and UI boundary panel.

- `readyForBlueprintHandoff` may be true when D5 `readyForModeling` holds
- `readyForBlueprintDraft` and `blueprintGenerationAllowed` remain **false**
- Future milestone may create Blueprint draft only after owner gate
- No automatic tenant build
- `completeDiscovery` remains quarantined; override not enabled

---

## Acceptance criteria (for future build)

1. Unqualified request cannot start Discovery (UI + server)
2. Qualified request can access controlled start path
3. Client and admin Discovery routes remain protected; public cannot access
4. Discovery mutations do not create membership, platform roles, tenant, Blueprint, payment, or CroAI invocation
5. Status / stage mapping works; handoff remains explicit
6. Field visibility respects journey + organization context
7. Required fields by stage enforced for “ready for modeling”
8. Evidence refs do not upload files
9. Operating Model capture remains draft
10. Blueprint handoff blocked until future milestone / owner gate

---

## Testing plan

| Case | Expect |
|------|--------|
| Unqualified start | Blocked |
| Qualified start | Allowed |
| Client routes | Auth + client access |
| Admin/operator routes | Platform permissions |
| Public Discovery | Denied |
| Membership / roles / tenant | Not created |
| Blueprint | Not generated by Discovery MVP success path |
| Payment / CroAI | Not required / not invoked |
| Status mapping | Product-visible |
| Handoff | Explicit `adminStartDiscovery` (or approved equivalent) |
| Journey / org visibility | Conditionals pass |
| Stage required fields | Validated |
| Evidence refs | No upload |
| OM draft | Non-authoritative |
| Blueprint handoff | Blocked |

Reuse / extend: `procrow-qualification:test`, `ftgp-discovery-*`, `client-enterprise-design-authority:test`, add Discovery MVP authority suite when build starts.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Dual client tracks diverge further | Owner decision: unify for MVP |
| Operator Complete creates Blueprint | Phase D6 quarantine |
| Early client profile creation | Phase D0 invariant |
| Scope creep into Blueprint/CEM | Hard non-goals |
| GAP-004 | Local-first only |

---

## Owner decisions

See [`DISCOVERY-AUDIT.md`](DISCOVERY-AUDIT.md) §15 and milestone doc.

---

## Recommended next after this plan

1. **Owner acceptance** of D0–D6 local-first via MVP-CERT.1 wording (Issue #18 stays OPEN until accepted)
2. **GAP-004** then **GAP-015** before hosted persistence, `main` merge, or Production movement
3. Optional later: Stages 4–7 depth, client-track unify, hosted persistence design, Blueprint drafting design

**Do not** close Issue #18 until Discovery MVP outcomes are owner-accepted. Local-first D0–D6 implementation + cert package ≠ hosted/Production authorization.
