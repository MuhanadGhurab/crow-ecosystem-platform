# Learning Eligibility Overlay

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ELIG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Review date** | Before GHV.LEARNING.1D |
| **Related** | [PRODUCT-CONSTITUTION.md](../../../governance/constitution/PRODUCT-CONSTITUTION.md) · [EXPLAINABLE-LOCKS.md](../../interactions/EXPLAINABLE-LOCKS.md) · [NEST-TO-ROUTE-BRIDGE-MAP.md](../nest/NEST-TO-ROUTE-BRIDGE-MAP.md) · [REMEDIATION-ARCHITECTURE.md](./REMEDIATION-ARCHITECTURE.md) · [LEARNING-UNLOCK-REGISTRY.md](./LEARNING-UNLOCK-REGISTRY.md) · [SCOPE-BASELINE.md](../../../governance/scope/SCOPE-BASELINE.md) §3.9 |
| **Limitations** | Learning Eligibility only — no commercial plans, no XP/Mastery formulas, no Product Codes |
| **Unresolved** | Exact UI copy per outcome (wireframes refine) · Trust Eligibility detail (PROGRESSION / Trust Gates) · numeric Integration Readiness |
| **Change history** | 1.0.0 (2026-07-21) — Learning Eligibility Overlay for GHV.LEARNING.1B |

## Purpose

Define **Learning Eligibility** outcomes returned by the Learning Graph / readiness layer so locks stay explainable and separate from subscription plans.

Constitution reminder:

```text
Payment controls access and capacity.
Learning eligibility controls readiness.
Evidence controls Mastery.
Trust controls social authority.
Prestige controls distinction.
```

## Final Access Decision (reference — Learning owns one component only)

Product access combines multiple systems. Learning Architecture owns **only** Learning Eligibility.

```text
Final Access Decision =
Authentication
+ Authorization
+ Entitlement
+ Learning Eligibility
+ Trust Eligibility
+ Context
```

| Component | Owns | Not owned by Learning |
|-----------|------|------------------------|
| Authentication | Identity / session | — |
| Authorization | Role / permission checks | — |
| Entitlement | Commercial capacity / Merit Grant | Plans, SKUs, billing |
| **Learning Eligibility** | **This document** | — |
| Trust Eligibility | Trust / moderation systems | — |
| Context | Device, event, Offline, feature flags | — |

**Do not include subscription plans in the Learning Eligibility model.**

Cross-Wing commercial formula (Scope §3.9) remains a separate product-access concern; Learning supplies Mastery/Evidence/Integration readiness *signals* without inventing numeric thresholds here.

---

## Learning Eligibility outcomes

Exhaustive set for launch architecture:

| Outcome | Meaning | Typical learner path |
|---------|---------|----------------------|
| **ELIGIBLE** | Learning prerequisites for the target node are satisfied | Start / Continue |
| **PREREQUISITE_MISSING** | Named prerequisite Nest / Route / Stage / capability missing | Open prerequisite · Nest path · Explainable Lock (Learning Prerequisite) |
| **COREQUISITE_REQUIRED** | Target may start or continue only if corequisite progresses in parallel | Show corequisite · allow paired progress where policy allows |
| **BRIDGE_AVAILABLE** | Gap can be closed via a Bridge (`BRG-*`) without full alternate Route | Offer Bridge · Micro-Mission Bridge |
| **REMEDIATION_REQUIRED** | Specific gap must be remediated before claiming progress | Micro-Mission · guided practice · revision (see Remediation Architecture) |
| **EVIDENCE_REQUIRED** | Learning content done but required Evidence not approved | Submit / revise Evidence |
| **INTEGRITY_REVIEW** | Integrity concern blocks eligibility until review completes | Wait / respond to review · no silent bypass |
| **TEMPORARILY_UNAVAILABLE** | Target node unavailable for non-learner reasons (content UPDATE REQUIRED, maintenance, safety hold) | Explain why · ETA if known · alternate exploration if public |

### Outcome rules

1. Outcomes are **mutually exclusive at decision time** for a single target node (highest-severity / first blocking reason wins; UI may list secondary reasons).
2. Severity order for blocking (highest first): `INTEGRITY_REVIEW` → `TEMPORARILY_UNAVAILABLE` → `PREREQUISITE_MISSING` → `REMEDIATION_REQUIRED` → `EVIDENCE_REQUIRED` → `COREQUISITE_REQUIRED` → `BRIDGE_AVAILABLE` → `ELIGIBLE`.
3. `BRIDGE_AVAILABLE` is a **resolvable** state: after Bridge completion, re-evaluate.
4. Nest bands map into these outcomes; they do not invent new outcome names:
   - Nest Recommended (&lt; 50%) on advanced gated content → typically `PREREQUISITE_MISSING` or `REMEDIATION_REQUIRED` (Nest path).
   - Guided Skip weak caps → `REMEDIATION_REQUIRED` (Micro-Mission) or `BRIDGE_AVAILABLE`.
   - Ready to Fly with optional reviews → `ELIGIBLE` (reviews recommended, not blocking unless policy marks a cap required).

### Explicit exclusions from Learning Eligibility

- Plan names, prices, upgrade CTAs as primary resolution.
- XP, Prestige, titles as eligibility keys.
- Pay-to-skip Nest or Evidence.
- Hidden locks (must remain Explainable).

---

## Mapping to Explainable Lock types

| Eligibility outcome | Primary Explainable Lock |
|---------------------|--------------------------|
| PREREQUISITE_MISSING | Learning Prerequisite |
| COREQUISITE_REQUIRED | Learning Prerequisite (corequisite variant) |
| BRIDGE_AVAILABLE | Learning Prerequisite / Readiness (Bridge path) |
| REMEDIATION_REQUIRED | Readiness Requirement |
| EVIDENCE_REQUIRED | Learning Prerequisite (Evidence path) |
| INTEGRITY_REVIEW | Assurance / integrity messaging (no pay-to-clear) |
| TEMPORARILY_UNAVAILABLE | Context / maintenance messaging |
| ELIGIBLE | No lock |

Commercial Entitlement, Merit Eligible, Trust Requirement, Capacity Lock, Event Lock remain **outside** Learning Eligibility.

---

## Evaluation inputs (conceptual)

Learning Eligibility may consider:

- Nest readiness band and per-capability weaknesses (`NST-CAP-*`).
- Graph edges: `PREREQUISITE`, `COREQUISITE`, `RECOMMENDED`, `BRIDGE`, `EQUIVALENT`, `REMEDIATES`, `EVIDENCE_FOR`, `UNLOCKS`, `SECURE_EXTENSION`, `CONVERGENCE`.
- Evidence approval / revocation state.
- Integrity flags.
- Content lifecycle status (e.g. UPDATE REQUIRED → `TEMPORARILY_UNAVAILABLE`).

It must **not** consider plan tier as a readiness substitute.

## Explicit non-goals

- No plan catalogue in this document.
- No XP / Mastery / Trust numeric formulas.
- No Product Codes.
- No final `LOCKED` Route catalogue.

## Next Gates

| Gate | Expected work |
|------|----------------|
| GHV.LEARNING.1C | Bind outcomes to Mission / Evidence instances |
| GHV.LEARNING.1D | Lock eligibility vocabulary for launch |
| GHV.PROGRESSION.1 | Trust / Mastery numeric inputs to Final Access Decision |
