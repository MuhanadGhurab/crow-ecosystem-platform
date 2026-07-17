# Discovery MVP Plan

| Field | Value |
|-------|-------|
| **Title** | Discovery and Operating Model MVP — Delivery Plan |
| **Status** | CANONICAL plan — **CROW.DISCOVERY.3 D3 adaptive Stages 1–3 local-first; D4–D6 pending** |
| **Authority** | Owner decisions in CROW.DISCOVERY.1 / .2 / .3 |
| **Date** | 2026-07-18 |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **Audit** | [`DISCOVERY-AUDIT.md`](DISCOVERY-AUDIT.md) |
| **Operating Model plan** | [`OPERATING-MODEL-MVP-PLAN.md`](OPERATING-MODEL-MVP-PLAN.md) |
| **Milestone** | [`milestones/CROW-DISCOVERY-3.md`](../milestones/CROW-DISCOVERY-3.md) · prior [`milestones/CROW-DISCOVERY-2.md`](../milestones/CROW-DISCOVERY-2.md) |
| **Field architecture** | FIELD.1 @ `e90fcda` · [`DISCOVERY-FIELD-ARCHITECTURE.md`](DISCOVERY-FIELD-ARCHITECTURE.md) |
| **Prior** | CROW.DISCOVERY.2 · CROW.PR10.2 · CROW.DISCOVERY.1 / 1A |

---

## Implementation progress (CROW.DISCOVERY.2)

| Phase | Status | Notes |
|-------|--------|-------|
| D0 Safety | **Done** (local-first) | Qualification gate, route protection, non-authority tests, Blueprint complete quarantined |
| D1 Data alignment | **Done** (no migration) | Product status vocabulary in `discovery-product-status.ts`; existing profile/brief fields |
| D2 Workspace UX | **Done** (foundation) | `DiscoveryMvpWorkspaceShell` — linked request, JourneyKind, OrganizationContext, Stages 1–7 overview, evidence refs-only |
| D3 Adaptive fields | **Done** (Stages 1–3 foundation) | Typed catalog, NEW/TRANSFORM + org-context visibility, localStorage drafts, validation, ProCrow prep summary |
| D4 Operating Model capture | Pending | See OM plan — still design-only for capture runtime |
| D5 ProCrow modeling review | Pending | |
| D6 Blueprint handoff | Pending | Complete→Blueprint remains blocked by default (`CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE`) |

Evidence: [`milestones/CROW-DISCOVERY-3.md`](../milestones/CROW-DISCOVERY-3.md) · `npm run discovery-mvp-d3:test` · `npm run discovery-mvp-d0-d2:test`

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

- Handoff only after Discovery ready-for-modeling
- Future milestone creates Blueprint draft
- No automatic tenant build
- Quarantine or harden `completeDiscovery` so Discovery MVP acceptance does not require Blueprint create

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

1. **CROW.DISCOVERY.4** (or D4 slice) — Operating Model capture from Discovery answers (still no Blueprint generate)
2. Or triage GAP-004 / GAP-015 if platform risk takes priority

**Do not** close Issue #18 until Discovery MVP product outcomes (through intended D4–D6) are owner-accepted.
