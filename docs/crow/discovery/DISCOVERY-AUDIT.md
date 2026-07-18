# Discovery and Operating Model — Implementation Audit

| Field | Value |
|-------|-------|
| **Title** | Discovery MVP audit (verified repository truth) |
| **Status** | CANONICAL audit — CROW.DISCOVERY.1 · **implementation note CROW.DISCOVERY.2** |
| **Authority** | Owner decisions + [`00-CROW-CONSTITUTION.md`](../00-CROW-CONSTITUTION.md) |
| **Date** | 2026-07-18 |
| **Branch / HEAD** | `feat/first-tenant-golden-path` (see CURRENT-STATE for tip) |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **Milestone** | [`milestones/CROW-DISCOVERY-1.md`](../milestones/CROW-DISCOVERY-1.md) · [`milestones/CROW-DISCOVERY-2.md`](../milestones/CROW-DISCOVERY-2.md) |
| **Field architecture** | [`DISCOVERY-FIELD-ARCHITECTURE.md`](DISCOVERY-FIELD-ARCHITECTURE.md) (FIELD.1 @ `e90fcda`) |
| **Plan** | [`DISCOVERY-MVP-PLAN.md`](DISCOVERY-MVP-PLAN.md) · [`OPERATING-MODEL-MVP-PLAN.md`](OPERATING-MODEL-MVP-PLAN.md) |

**Original scope of this document:** Audit only. Product implementation for D0–D2 landed under CROW.DISCOVERY.2 (see below).

---

## Executive summary

Crow already has a **functional Discovery runtime shell** (operator workspace, client wizard, enterprise-design journey, Prisma persistence, FTGP catalog plumbing, ProCrow review panels) **and** an **approved adaptive field architecture** (FIELD.1/1A). They are **not yet fully aligned**.

**CROW.DISCOVERY.2 (D0–D2)** added: safety baseline certification, migration-free product status mapping, workspace foundation shell (Stages 1–7 overview), and **default quarantine** of `completeDiscovery` → Blueprint create (`assertDiscoveryBlueprintCompleteAllowed`; override only via `CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE=1`).

Three surfaces still share one `DiscoveryProfile` with **fragmented field keys** for D3+. Request → Discovery handoff remains **qualified and gated**.

**GAP-017** remains **partial**: D0–D6 local-first Discovery MVP is implemented (`readyForBlueprintHandoff` possible; draft/generation still blocked). Still open: Stages 4–7 field depth, dual client tracks, hosted persistence, owner-authorized Blueprint drafting.

---

## 1. Current Discovery route map

### Operator `/discovery/[requestId]/*`

| Route | File | Role |
|-------|------|------|
| `/discovery/[requestId]` | `src/app/discovery/[requestId]/page.tsx` | Redirect → organization |
| `.../organization` | `organization/page.tsx` | Org form + template apply |
| `.../organization-model` | `organization-model/page.tsx` | Sector org intelligence |
| `.../modules` | `modules/page.tsx` | CEM module confirmation |
| `.../security` | `security/page.tsx` | Compliance / security entities |
| `.../departments` | `departments/page.tsx` | Departments + branches |
| `.../branches` | `branches/page.tsx` | Redirect → departments |
| `.../roles` | `roles/page.tsx` | Role entities |
| `.../workflows` | `workflows/page.tsx` | Workflow entities |
| `.../identity` | `identity/page.tsx` | IdP / MFA / SSO answers |
| `.../integrations` | `integrations/page.tsx` | Integration entities |
| `.../experience` | `experience/page.tsx` | SAREA package + experience |
| `.../summary` | `summary/page.tsx` | Readiness + **Complete Discovery** |

**Layout:** `src/app/discovery/[requestId]/layout.tsx` — `requirePermission(platform.discovery.view)`; requires existing `discoveryProfile`.

### Client `/client/requests/[requestId]/discovery*`

| Route | File | Role |
|-------|------|------|
| `.../discovery` | `discovery/page.tsx` | Guided wizard (`ClientDiscoveryWizard`) |
| `.../discovery/design` | `design/page.tsx` | Enterprise design journey |
| `.../discovery/compare` | `compare/page.tsx` | Advisory variant compare |
| `.../discovery/summary` | `summary/page.tsx` | Lean design summary |

**Layout:** `src/app/client/layout.tsx` — `requireClientAccess`.

### Admin entry

| Route | Role |
|-------|------|
| `/admin/discovery` | Lists active discovery/blueprint-build requests |
| `/admin/requests/[requestId]` | Start Discovery, qualification, ProCrow discovery review |
| `/admin/queue` | Review queue (qualification language) |

---

## 2. Current Discovery UI map

### Operator — `src/components/discovery/`

Organization / modules / security / identity / SAREA forms; entity panel; org-model panel; intelligence rail; progress nav; completeness; blueprint bridge/gate panels; **complete button** (creates Blueprint).

### Client — `src/components/client-portal/` + `client-enterprise-design/`

- `client-discovery-wizard.tsx` — multi-step client wizard
- `client-design-journey.tsx` — enterprise design flow

### Admin

- `admin-procrow-discovery-review-panel.tsx`
- `admin-discovery-intelligence-panel.tsx`
- `admin-client-discovery-panel.tsx`
- `request-admin-actions.tsx` — Start Discovery

---

## 3. Current Discovery data model map

**Schema:** `prisma/schema.prisma` — `DiscoveryProfile` (1:1 request), `DiscoveryAnswer` (`sectionKey` + `questionKey` → `valueJson`), entity tables (departments, branches, roles, workflows, security, integrations, experience), `DiscoveryOrgIntelligence`, `SectorTemplate`.

### Answer namespaces in use

| `sectionKey` | Writer |
|--------------|--------|
| `organization`, `modules`, `security`, `identity`, `experience` | Operator |
| `org_intelligence` | System / start |
| `client_discovery` | Client wizard + ProCrow review metadata |
| `client_enterprise_design` | Design journey snapshot |
| `implementer_discovery` | FTGP catalog (minimal UI) |
| `ftgp_lifecycle_audit` | FTGP transitions |

### Request brief overlays (not Discovery tables)

`ImplementationRequest.notes` → Request brief including `journeyKind`, `organizationContext`, `procrowQualification`. Gate: `briefIsQualifiedForDiscovery()`.

**No migration required for MVP plan** if work continues on existing `DiscoveryAnswer` + brief overlays + catalog keys (owner may later approve schema only if needed).

---

## 4. Request-to-Discovery handoff map

```
Request PENDING_REVIEW
  → ProCrow sets procrowQualification.outcome = qualified_for_discovery
  → adminStartDiscovery (UI + server)
       requireActionRequestReview
       briefIsQualifiedForDiscovery
       status === PENDING_REVIEW
  → startDiscovery → UNDER_DISCOVERY + DiscoveryProfile IN_PROGRESS
  → redirect /discovery/[id]/organization
```

**Alternate:** FTGP `transitionImplementationRequestToProCrowReview` (`PENDING_REVIEW` → `UNDER_DISCOVERY`).

**Parallel client paths:** `ensureClientDiscoveryProfile` / design-save ensure can create a profile **before** operator handoff (authority-safe for tenant/Blueprint, but fragmenting lifecycle — see unsafe pieces).

---

## 5. Current Discovery authorization map

| Surface | Guard | Write |
|---------|-------|-------|
| `/discovery/*` | `platform.discovery.view` | `platform.discovery.write` via actions; editable only `UNDER_DISCOVERY` / `BLUEPRINT_BUILD` |
| `/client/.../discovery*` | `requireClientAccess` | Client owner; blocks platform staff on client write paths |
| Admin start / review | Platform staff + request manage / discovery write | Qualification + review actions |
| Middleware | Session only | RBAC in layouts/actions |

**Public users** cannot reach client or operator Discovery without auth + appropriate access.

---

## 6. Field / question catalog map

| Catalog | Location | Notes |
|---------|----------|-------|
| FTGP discovery questions | `src/lib/ftgp/ftgp-discovery-question-catalog.ts` | ~37 keys; v1.0.0; richest seed |
| Client wizard registry | `src/lib/client-portal/client-discovery-contract.ts` | 10 steps; not stage-aligned |
| Operator sparse keys | `src/lib/actions/discovery.ts` + entities | Fixed sections |
| Business field catalog | `src/lib/business-field-catalog/` | Request intake / prefill — not Discovery stages |
| Field architecture | `docs/crow/discovery/*` | L1–L10 + stages 1–7 — design truth |

**Gap:** Catalog richness ≫ wired UI; three UIs do not share one adaptive visibility engine.

---

## 7. Operating Model concept map

| Layer | Location | Status |
|-------|----------|--------|
| Operator `organization.operatingModel` enum | Discovery answers | Sparse |
| Org intelligence recommendations | `DiscoveryOrgIntelligence` | Advisory |
| Client enterprise design variants | `client-enterprise-design` | Parallel track |
| Runtime CEM operating model | Tenant CEM contracts / panels | **Post-tenant — out of Discovery MVP** |
| Canonical OM draft capture | Stages 1–5 field groups | **Planned** ([`OPERATING-MODEL-MVP-PLAN.md`](OPERATING-MODEL-MVP-PLAN.md)) |

Discovery must **collect structured inputs** for an Operating Model draft later — not ship a finished runtime Operating Model.

---

## 8. Blueprint boundary map

| Action | Creates Blueprint? |
|--------|-------------------|
| `completeDiscovery` → `completeDiscoveryAndCreateBlueprint` | **Yes** (DRAFT) — operator summary |
| `acceptClientDiscoveryIntoBlueprint` | **No** — status/metadata only |
| Client submit for review | **No** |
| Tenant provision | Separate `platform.blueprint.provision` | **Not Discovery** |

**Gate:** `evaluateDiscoveryBlueprintGate` is **advisory** today — Complete can proceed with missing data. MVP plan must treat Blueprint generation as **out of scope** for Discovery success; harden or defer Complete path per owner decision (Phase D6).

---

## 9. Current tests

| Script / file | Role |
|---------------|------|
| `procrow-qualification:test` | Qualification + Discovery start gate |
| `ftgp-discovery-*:test` / audits | Catalog, readiness, write, invariant |
| `client-discovery:verify` | Client discovery flow (hosted-oriented) |
| `procrow-discovery:verify` | ProCrow discovery review |
| `client-enterprise-design*:test` | Design journey + authority |
| `request:pipeline:verify` / `discovery:verify:*` | Pipeline / seed targets |
| `ftgp-procrow-review-transition:test` | Status transition |

No dedicated **adaptive stages 1–7** product tests yet (expected after build phases).

---

## 10. Missing pieces (vs stages 1–7)

| Stage | Gap |
|-------|-----|
| 1 Context | No unified confirm UI; success definition sparse |
| 2 Org shape | Missing legal entity / topology taxonomy fields |
| 3 Operating reality | Free-text entities; weak approvals/systems structure |
| 4 Trust/risk | Partial security forms; no structured sensitivity/SoD |
| 5 Build/Transform intent | Transform block largely missing |
| 6 Evidence refs | Not implemented (refs-only planned) |
| 7 ProCrow review summary | Partial panels; no formal stage summary model |

Plus: catalog unification, handoff invariant for early client profile creation, dual client track consolidation.

---

## 11. Unsafe / blocked pieces

| Item | Risk | Note |
|------|------|------|
| Client profile before `UNDER_DISCOVERY` | Lifecycle fragmentation | Does not grant tenant/Blueprint |
| Advisory Blueprint gate | Operator can Complete with gaps | Defer hard-block to owner |
| `completeDiscovery` creates Blueprint | Authority boundary if treated as Discovery MVP done | **Exclude from MVP success** |
| Naming: “accept into blueprint” | Misleading | Status only — keep copy clear |
| GAP-004 | Hosted certify / migrations blocked | Local-first build |
| GAP-015 | Auto-deploy settings | Unrelated to Discovery content |
| Payment / CroAI / membership | Must not appear in Discovery mutations | Hold |

---

## 12. MVP recommendation (summary)

See [`DISCOVERY-MVP-PLAN.md`](DISCOVERY-MVP-PLAN.md).

**Build:** Phases D0–D6 as **plan now**; implement only after owner approval of scope — local-first, no migration unless authorized, no Blueprint/tenant/payment/CroAI.

**Prefer:** Unify on FTGP + field-architecture keys via `DiscoveryAnswer`; stage-driven client + operator parity; Stage 7 review summary; **block or quarantine** Blueprint Complete from Discovery MVP acceptance criteria.

---

## 13. Required future migrations (if any)

| Candidate | When |
|-----------|------|
| None for plan-only milestone | — |
| Optional later: evidence-ref table, question-version table, OM draft snapshot table | Only with owner + GAP-004 path |
| DB enum changes for Discovery status product mapping | Prefer product-layer first (same pattern as Request/ProCrow) |

**This milestone authorizes zero migrations.**

---

## 14. Test plan (for future build)

See [`DISCOVERY-MVP-PLAN.md`](DISCOVERY-MVP-PLAN.md) § Testing plan.

---

## 15. Owner decisions required

1. Approve CROW.DISCOVERY.1 **build** after this plan (or request plan revisions)
2. Unify vs keep dual client tracks (`client_discovery` vs `client_enterprise_design`) for MVP
3. Harden Blueprint Complete gate now vs defer to CROW.BLUEPRINT.1
4. Whether client may create DiscoveryProfile before `UNDER_DISCOVERY`
5. Local-first certify before any hosted Preview work (GAP-004)
6. MVP field group subset from taxonomy (confirm FIELD.1 MVP list)

---

## Related docs

- [`DISCOVERY-FIELD-ARCHITECTURE.md`](DISCOVERY-FIELD-ARCHITECTURE.md)
- [`DISCOVERY-FIELD-TAXONOMY.md`](DISCOVERY-FIELD-TAXONOMY.md)
- [`DISCOVERY-QUESTION-MODEL.md`](DISCOVERY-QUESTION-MODEL.md)
- [`DISCOVERY-ADAPTIVE-INTAKE-MODEL.md`](DISCOVERY-ADAPTIVE-INTAKE-MODEL.md)
- [`procrow/PROCROW-QUALIFICATION-MVP-PLAN.md`](../procrow/PROCROW-QUALIFICATION-MVP-PLAN.md)
- [`GAP-LEDGER.md`](../GAP-LEDGER.md) GAP-017
