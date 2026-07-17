# Operating Model MVP Plan

| Field | Value |
|-------|-------|
| **Title** | Operating Model capture — plan for Discovery MVP stream |
| **Status** | CANONICAL plan — design only; **D0–D2 does not implement OM capture** (CROW.DISCOVERY.2) |
| **Authority** | [`DISCOVERY-MVP-PLAN.md`](DISCOVERY-MVP-PLAN.md) · [`05-ENTERPRISE-BLUEPRINT.md`](../05-ENTERPRISE-BLUEPRINT.md) |
| **Date** | 2026-07-18 |
| **Issue** | [#18](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/18) |
| **Audit** | [`DISCOVERY-AUDIT.md`](DISCOVERY-AUDIT.md) |

**This milestone produces the plan only.** No Operating Model runtime, Blueprint, or tenant activation.

**Boundary (CROW.DISCOVERY.2):** D0–D2 delivers Discovery safety + workspace overview only. Operating Model **capture** remains Phase D4 — do not treat workspace stage labels as OM persistence.

---

## Intent

Discovery collects structured information so ProCrow can later draft an **Operating Model** that describes how the organization should work. That draft informs Blueprint — it does **not** provision a tenant or grant authority.

---

## What Operating Model MVP should eventually capture

| Domain | Discovery stages (primary) | Notes |
|--------|----------------------------|-------|
| Purpose | 1 | Confirm from Request |
| Operating context | 1–2 | Journey, org context, shape |
| People / groups | 2–3 | Departments, teams |
| Responsibilities | 3 | Role / persona candidates |
| Workflows | 3 | Core workflow families |
| Decisions / approvals | 3–4 | Approval chains summary |
| Systems / tools | 3 | Inventory (text) |
| Data / records | 3–4 | Record types / sensitivity |
| Trust / security needs | 4 | MFA/SSO, isolation needs |
| Compliance / evidence needs | 4 + 6 | Refs only in MVP |
| Risks and constraints | 4–5 | Transform pain / constraints |
| Current / future state | 5 | NEW vs TRANSFORM adaptive |
| Capability map candidates | 3 + 5 | Must-have capabilities |
| Role / persona candidates | 3 | Feed CEM later — advisory |

---

## Relationship to existing code

| Existing | Treat as |
|----------|----------|
| `organization.operatingModel` enum | Sparse precursor — map into Stage 2 |
| `DiscoveryDepartment` / Role / Workflow entities | Reusable persistence for Stage 2–3 lists |
| Client enterprise design variants | Parallel track — unify or demote per owner decision |
| CEM / tenant operating model panels | **Out of scope** — post-Blueprint / post-tenant |
| Org intelligence recommendations | Advisory input, not authority |

---

## Capture rules for Discovery MVP

1. All OM fields are **draft inputs** until ProCrow marks ready-for-modeling
2. Maps to Blueprint modules/capabilities are **advisory**
3. No automatic creation of tenant roles or memberships from OM candidates
4. No CroAI-authored OM without human approval (CroAI out of scope)
5. Persist via catalog keys + existing answer/entity tables unless owner approves migration

---

## Phase alignment

| Discovery phase | OM work |
|-----------------|---------|
| D1 | Define OM draft JSON / answer key map |
| D2–D3 | UI capture for people, workflows, trust, risks, current/future |
| D4 | Explicit OM draft summary view (client + operator) |
| D5 | ProCrow completeness against OM checklist |
| D6 | Freeze OM draft for Blueprint handoff (future milestone executes handoff) |

---

## Non-goals

- Runtime CEM Operating Model enforcement
- Tenant dashboard OM panels as Discovery deliverable
- Blueprint generation from OM
- Payment / subscription coupling

---

## Acceptance (future build)

- OM draft can be saved and reviewed without creating tenant authority
- Required OM domains for MVP checklist are either filled or flagged missing
- Blueprint handoff remains blocked until owner-approved future milestone

---

## Owner decisions

1. Confirm MVP OM domain checklist (table above)
2. Unify client enterprise-design OM variants into Discovery stages or keep deferred
3. Whether OM draft needs a dedicated table later (prefer answers first)
