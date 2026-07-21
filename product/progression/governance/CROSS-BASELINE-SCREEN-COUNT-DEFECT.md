# Cross-Baseline Screen-Count Defect

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-SCR-DEF-001 |
| **Version** | 1.0.0 |
| **Status** | OPEN — PRE-EXISTING GOVERNANCE DEFECT |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §30 |
| **Last updated** | 2026-07-21 |
| **Risk ID** | **RISK-PRG-057** (alias label RISK-BASE-092) |
| **Dependency ID** | **DEP-075** (alias label DEP-BASE-092) |
| **Blocks** | **GHV.ARCHITECTURE.1A** |
| **Recommended correction Gate** | **GHV.BASELINE-CORRECTION.1** — Master Screen Registry 92-screen reconciliation |

```text
This defect does NOT invalidate Progression 1D when recorded as external baseline debt.
Do NOT modify screen IDs or counts inside the Progression 1D commit.
Learning Design Baseline content under product/learning/ is NOT modified.
```

## Purpose

Record a pre-existing cross-baseline discrepancy between the authoritative screen-count decision and current registry / source-map claims, without silently rewriting Product Definition or Learning baselines.

---

## Authoritative decision (unchanged)

```text
Seven interface shells
92 total screens
```

Including, without silent deletion or merge:

* Email Verification Pending
* Email Verification Result
* Activation Recovery
* All existing canonical screen identities

---

## Defect observation

| Source | Claimed count | Notes |
|--------|--------------:|-------|
| Authoritative project decision | **92** | 7 interface shells |
| Current `MASTER-SCREEN-REGISTRY.md` | **90** | Pre-existing undercount |
| Current `AUTHORITATIVE-SOURCE-MAP.md` | **90** | Mirrors registry claim |
| Wireframe registry language | **90** | Aligned to defective count |

This is a **governance defect**, not a Progression formula defect.

---

## Required actions (outside Progression formula lock)

1. Record discrepancy as pre-existing baseline defect (**this document**).
2. Track risk **RISK-PRG-057** and dependency **DEP-075** (alias labels RISK-BASE-092 / DEP-BASE-092).
3. Mark defect as **blocking GHV.ARCHITECTURE.1A**.
4. Recommend dedicated controlled correction Gate before technical architecture validation:
   ```text
   GHV.BASELINE-CORRECTION.1
   MASTER SCREEN REGISTRY 92-SCREEN RECONCILIATION
   ```
5. **Do not** modify screen IDs or counts inside this Progression commit unless an already-approved Change Request exists.

---

## Correction Gate constraints (future)

The correction must preserve:

* Seven interface shells
* Email Verification Pending
* Email Verification Result
* Activation Recovery
* All existing canonical screen identities
* No silent deletion or merge

---

## Relationship to Progression 1D

| Claim | Status |
|-------|--------|
| Progression Design Baseline v1.0.0 lock | Valid when this debt is recorded |
| Screen inventory rewritten by 1D | **Forbidden / not done** |
| Learning Design Baseline changed | **No** |

## Explicit non-claims

Recording this defect does not fix the count, does not authorize Product Code, and does not complete technical validation.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D §30 — record cross-baseline 90 vs 92 screen-count defect |
