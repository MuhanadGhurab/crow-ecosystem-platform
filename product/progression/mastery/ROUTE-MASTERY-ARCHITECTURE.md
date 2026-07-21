# Route Mastery Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-MST-RTE-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md) · [CAPABILITY-ROUTE-MASTERY-SEPARATION.md](./CAPABILITY-ROUTE-MASTERY-SEPARATION.md) · [MASTERY-FRESHNESS-ARCHITECTURE.md](./MASTERY-FRESHNESS-ARCHITECTURE.md) · [EVIDENCE-RUBRIC-STANDARD.md](../../learning/evidence/EVIDENCE-RUBRIC-STANDARD.md) · [EVIDENCE-REVIEW-MODEL.md](../../learning/evidence/EVIDENCE-REVIEW-MODEL.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Unresolved** | Aggregation rules, freshness intervals, numeric standing blends → **GHV.PROGRESSION.1B** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.PROGRESSION.1A Route Mastery Architecture |

## Purpose

Define **Mastery** as **demonstrated capability** established through Evidence, assessments, and related authenticity signals — **not** as Mission completion, Flight XP, Momentum standing, or payment.

This document aligns with the Learning Design Baseline **Route-Proven** qualitative standard and must **not contradict** [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md).

```text
STATUS: ARCHITECTURE RECOMMENDED
Mastery = demonstrated capability via Evidence / assessments
Mission completion / XP / Momentum / payment ≠ Mastery
Aggregation pending GHV.PROGRESSION.1B
Aligned with Route-Proven qualitative conditions
No Product Code · No numeric formulas
```

## Binding definition

| Principle | Statement |
|-----------|-----------|
| **What Mastery is** | A governed standing that a learner has **demonstrated** capability for a defined Route (or capability scope) through reviewable Evidence and assessments. |
| **What Mastery is not** | A streak, a purchase, a league placement, or an XP total. |
| **Rubric levels vs user Mastery** | Rubric levels **NOT_DEMONSTRATED / DEVELOPING / MEETS_STANDARD / STRONG / EXCEPTIONAL** are **Evidence quality levels** on artifacts — **not** automatic user Mastery levels. |
| **Route-Proven** | Route-Proven uses **locked learning qualitative conditions** (mandatory Stages, assessments, Evidence, Capstone, remediation, integrity, Trust placeholder). Mastery standing may relate to Proven eligibility but is not a numeric substitute invented here. |

---

## Evidence rubric levels (artifact-scoped)

These labels describe **Evidence artifacts / review outcomes**, not a learner’s Mastery state machine:

| Rubric level | Meaning (Evidence) |
|--------------|--------------------|
| **NOT_DEMONSTRATED** | Artifact does not show the claimed capability. |
| **DEVELOPING** | Partial demonstration; gaps remain. |
| **MEETS_STANDARD** | Meets the governed standard for the Evidence anchor. |
| **STRONG** | Exceeds baseline clarity / rigor while remaining within scope. |
| **EXCEPTIONAL** | Outstanding demonstration relative to the Evidence standard — still artifact-scoped. |

Mapping from rubric levels into user Mastery states is **aggregation pending 1B** and must never silently equate one EXCEPTIONAL artifact with global Route Mastery.

---

## Mastery signal sources

| Source | Role |
|--------|------|
| **Approved Evidence** | Primary demonstration material; quality is authoritative for capability claims. |
| **Assessment** | Governed assessment outcomes contribute demonstration signals; assessment alone does not invent Mastery without required Evidence where the Route demands it. |
| **Capstone** | Capstone approval is a major Route-level demonstration signal and is required for Route-Proven eligibility per Learning Baseline. |
| **Revision history** | Meaningful revisions show self-correction; they inform confidence without erasing prior audit trail. |
| **Authenticity** | Integrity and authenticity signals gate whether Evidence can support Mastery. |
| **Route-Proven** | When awarded under Learning qualitative conditions, Route-Proven is a strong Route-level achievement related to demonstrated completion of the governed bundle — still distinct from Horizon-Proven. |
| **Freshness** | Current vs historical demonstration is governed by [MASTERY-FRESHNESS-ARCHITECTURE.md](./MASTERY-FRESHNESS-ARCHITECTURE.md). |

---

## User Mastery states

Use only these Mastery states for learner/Route (or capability) standing:

| State | Meaning |
|-------|---------|
| **NOT_ASSESSED** | No meaningful Mastery evaluation yet. |
| **EVIDENCE_IN_PROGRESS** | Learner is producing Evidence / working toward demonstration. |
| **EVIDENCE_UNDER_REVIEW** | Submitted Evidence or Capstone is in review. |
| **DEVELOPING** | Demonstrations exist but do not yet meet standard aggregation for claimed standing. |
| **STANDARD_DEMONSTRATED** | Governed standard demonstration achieved for the scoped claim (aggregation pending 1B). |
| **STRONG_DEMONSTRATION** | Sustained / strong demonstration beyond baseline for the scoped claim (aggregation pending 1B). |
| **ADVANCED_DEMONSTRATION** | Advanced demonstration band for the scoped claim (aggregation pending 1B) — still not employment certification. |
| **REFRESH_RECOMMENDED** | Historical Achievement remains, but Current Demonstration should be refreshed (see Freshness). |
| **REEVALUATION_REQUIRED** | Standing must be reevaluated (e.g. regulatory / integrity / major content shift triggers). |
| **SUSPENDED_PENDING_INTEGRITY** | Mastery claims paused while integrity review is open. |
| **REVOKED** | Prior standing revoked for governed cause; history retained for audit. |

---

## Binding rules

| ID | Rule |
|----|------|
| MST-R1 | **Mission completion ≠ Mastery.** |
| MST-R2 | **Flight XP ≠ Mastery.** |
| MST-R3 | **Momentum ≠ Mastery.** |
| MST-R4 | **Payment ≠ Mastery.** Subscription or purchase never grants Mastery states. |
| MST-R5 | **Evidence quality is authoritative** for capability demonstration claims. |
| MST-R6 | **One artifact may support multiple capabilities** if traceability to each claim is explicit and governed. |
| MST-R7 | **A weak artifact does not invalidate unrelated Evidence.** Failures are scoped. |
| MST-R8 | **Revocation may trigger targeted reevaluation** of dependent Mastery / Proven standing — not silent mass deletion of unrelated history. |
| MST-R9 | **Outdated technology may require refresh** without deleting historical Achievement records (see Freshness). |
| MST-R10 | **Route-Proven uses locked learning qualitative conditions** from the Learning Design Baseline; this Gate must not weaken or invent conflicting Proven shortcuts. |
| MST-R11 | **Aggregation pending GHV.PROGRESSION.1B.** No Mastery percentages or numeric blend formulas here. |

---

## Alignment with Route-Proven (non-contradiction)

Per [ROUTE-PROVEN-STANDARD.md](../../learning/proven/ROUTE-PROVEN-STANDARD.md):

| Learning Baseline rule | Mastery architecture stance |
|------------------------|----------------------------|
| Completion ≠ Proven | Completion ≠ Mastery and ≠ Route-Proven |
| Required Evidence approved + Capstone approved + assessments + remediation + integrity clear | Mastery claims for Route-Proven eligibility must respect this governed bundle |
| Not a subscription benefit | Payment ≠ Mastery / ≠ Proven |
| Evidence revocation may trigger re-evaluation | Maps to REEVALUATION_REQUIRED / SUSPENDED_PENDING_INTEGRITY / REVOKED paths |
| Content updates do not automatically erase historical Proven | Maps to Freshness: history retained; Current Demonstration may need refresh |
| One Route ≠ Horizon-Proven | Mastery on one Route never awards Horizon-Proven |

Trust numeric thresholds remain pending Progression gates and must not be invented as scores in this document.

---

## Explicit non-goals

- No automatic user Mastery level from a single rubric label.
- No XP→Mastery conversion table.
- No paid Mastery unlocks.
- No Horizon-Proven from one Route Mastery.
- No Mastery percentages, decay half-lives, or aggregation weights in this Gate.

## Handoff

| Gate | Receives |
|------|----------|
| **GHV.PROGRESSION.1B** | States, sources, and qualitative rules; must supply aggregation + simulation |
| **Learning Proven baseline** | Remains authoritative for Route-Proven eligibility conditions |
| **Product Code / implementation** | BLOCKED |

```text
FORMULA PENDING
SIMULATION NOT RUN
CALIBRATION NOT RUN
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```
