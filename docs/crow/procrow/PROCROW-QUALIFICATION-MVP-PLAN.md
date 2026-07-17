# ProCrow Qualification MVP Plan

| Field | Value |
|-------|-------|
| **Title** | ProCrow qualification outcome UX — MVP plan |
| **Status** | CANONICAL plan — **CROW.PROCROW.1 executed (local-first)** |
| **Authority** | Owner decision to proceed local-first |
| **Date** | 2026-07-18 |
| **Issue** | [#19](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/19) |
| **Audit** | [`PROCROW-QUALIFICATION-AUDIT.md`](PROCROW-QUALIFICATION-AUDIT.md) |
| **Milestone** | [`milestones/CROW-PROCROW-1.md`](../milestones/CROW-PROCROW-1.md) |

## Goal

Let a ProCrow operator review submitted requests and record a **safe product-layer qualification outcome** without creating tenant authority or advancing runtime incorrectly.

## In scope (executed)

1. Admin queue / list clarity for submitted → qualification → Discovery language
2. Request workspace: journey, org context, product status, verification summary, decision guidance
3. Qualification panel: more-info / qualified / declined (+ reset to needs review) with operator note
4. Persist outcomes in brief notes JSON (`procrowQualification`) — **no migration**
5. Discovery handoff guard (UI disable + server check)
6. Decline preserves brief JSON and request record
7. Authority + mapping tests

## Out of scope

- DB enum / schema migrations
- Hosted business writes / Preview certify (GAP-004)
- Production deploy / `main` push / PR #10 merge
- Authz model changes
- Payment, CroAI, Blueprint generation, tenant provisioning
- Automatic Discovery start from submission
- Client Portal “needs more information” messaging UX (later)

## Handoff to Discovery

```
PENDING_REVIEW + qualified_for_discovery
  → operator Start Discovery (adminStartDiscovery)
  → UNDER_DISCOVERY + DiscoveryProfile IN_PROGRESS
  → operator /discovery/[requestId]/* and client discovery workspaces
  → Discovery MVP stages 1–7 (CROW.DISCOVERY.1 plan)
  → ready-for-modeling signal
  → STOP (no Blueprint generate in Discovery MVP success)
```

Start Discovery remains a **controlled ProCrow action**, not an intake side effect. See [`discovery/DISCOVERY-MVP-PLAN.md`](../discovery/DISCOVERY-MVP-PLAN.md) phases D0–D6.

## Success criteria

| Criterion | Evidence |
|-----------|----------|
| Outcomes visible and recordable locally | Qualification panel + brief JSON |
| No authority grant | Static authority tests |
| Discovery gated | `adminStartDiscovery` + UI |
| No migration | Schema unchanged |
| Gates green | typecheck / lint / build / targeted tests |

## Next after this MVP

- CROW.DISCOVERY.1 **complete** (audit + plan) — next: owner-approved Discovery MVP **build**
- Hosted Preview certify after GAP-004
- Optional client-facing more-info messaging
