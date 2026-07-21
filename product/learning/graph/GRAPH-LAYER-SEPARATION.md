# Graph Layer Separation

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-LAYER-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [NODE-TYPE-REGISTRY.md](./NODE-TYPE-REGISTRY.md) · [EDGE-TYPE-RULES.md](./EDGE-TYPE-RULES.md) · [GRAPH-INVARIANTS.md](./GRAPH-INVARIANTS.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.7 · §3.9 · §3.12 |
| **Limitations** | Conceptual layer boundaries only — no Product Code, no runtime stores, no numeric XP / Mastery formulas; Learning Eligibility outcomes are architectural labels pending overlay docs; Routes remain **RECOMMENDED — NOT YET LOCKED** |
| **Unresolved** | Progress Graph threshold ownership (GHV.PROGRESSION.1); Entitlement catalogue (commercial gates); Trust Eligibility detail; Final Access Decision runtime composition |
| **Change history** | 1.0.0 (2026-07-21) — Initial ARCHITECTURE RECOMMENDED layer separation for GHV.LEARNING.1B |

## Purpose

Keep **Learning**, **Progress**, and **Entitlement** as three separate conceptual graphs. No graph may silently substitute for another. Learning Graph nodes and edges must not store entitlement data.

---

## Learning Graph

**Owns:** educational structure and relationships.

Answers:

* What connects to what?
* What must be learned first?
* What capabilities combine?
* What Evidence supports capability?

Contains: node types in [NODE-TYPE-REGISTRY.md](./NODE-TYPE-REGISTRY.md); edge types in [EDGE-TYPE-RULES.md](./EDGE-TYPE-RULES.md).

Does **not** contain: subscription tiers, payment plans, Merit Grants, concurrency slots, XP ledgers, Prestige, Trust scores, or professional titles.

---

## Progress Graph

**Owns:** learner-specific completion and Evidence state.

Answers:

* What has this user completed?
* What Evidence is approved?
* What Mastery has been recorded?
* What remediation remains?

May **reference** Learning Graph IDs. Must **not** rewrite Learning Graph prerequisites (Invariant 21). May satisfy learning requirements **only through governed rules** (recognition, approved Evidence, Nest band policy).

Does **not** invent numeric XP / Mastery formulas in this Gate.

---

## Entitlement Graph

**Owns:** commercial and grant-based activation rights.

Answers:

* What may this user currently activate?
* Which plan, Merit Grant or scholarship applies?
* Which concurrency slots are available?

Does **not** redefine educational prerequisites. Entitlement does not modify educational truth (Invariant 20). A paid plan cannot satisfy a `PREREQUISITE`.

---

## Standing separation rules (gate)

Recorded verbatim as architecture law:

```text
Learning eligibility may be required even when entitlement exists.

Entitlement may be available even when learning eligibility is missing.

Progress may satisfy learning requirements only through governed rules.
```

**Implication examples:**

| Situation | Outcome |
|-----------|---------|
| User has plan, Nest readiness below 50% for gated advanced content | Entitlement present; Learning Eligibility may still block |
| User is Nest-ready and Evidence-ready, no plan / Merit | Learning Eligibility may pass; Entitlement may still block activation |
| User completes equivalent Evidence under formal review | Progress + recognition policy may satisfy a Learning prerequisite without changing the Learning Graph structure |

No graph may silently substitute for another.

---

## Learning Eligibility (Learning Architecture ownership)

Learning Architecture owns **only** the Learning Eligibility component of product access. Illustrative outcomes (no subscription plans in this model):

```text
ELIGIBLE
PREREQUISITE_MISSING
COREQUISITE_REQUIRED
BRIDGE_AVAILABLE
REMEDIATION_REQUIRED
EVIDENCE_REQUIRED
INTEGRITY_REVIEW
TEMPORARILY_UNAVAILABLE
```

---

## Final Access Decision (reference only)

Product access later combines multiple systems. This formula is **reference-only** — not implemented in this Gate, not a numeric scoring model, and not owned entirely by Learning Architecture.

```text
Final Access Decision =
Authentication
+ Authorization
+ Entitlement
+ Learning Eligibility
+ Trust Eligibility
+ Context
```

| Component | Owner (conceptual) |
|-----------|-------------------|
| Authentication | Identity / session |
| Authorization | Role / admin policy |
| Entitlement | Entitlement Graph |
| Learning Eligibility | Learning Architecture / Learning Graph + governed Progress satisfaction |
| Trust Eligibility | Trust system (separate) |
| Context | Device, region, Feature Flags, Live Sky mode, etc. |

Cross-Wing commercial-style access in Scope §3.9 remains a **composition** of Entitlement / Merit with Mastery, Evidence, Integration Readiness, and Trust — it must not collapse into a single Learning Graph edge.

---

## Explicit non-goals

- No Product Code or shared database schema for the three graphs.
- No LOCKED Routes via entitlement shortcuts.
- No XP / Mastery numeric formulas.
- No payment-plan edges inside the Learning Graph.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C–1D | Bind eligibility overlays to Mission / Evidence instances; catalogue lock |
| GHV.PROGRESSION.1 | Progress Graph thresholds without rewriting Learning prerequisites |
| Commercial / Trust gates | Entitlement and Trust Eligibility catalogues |
