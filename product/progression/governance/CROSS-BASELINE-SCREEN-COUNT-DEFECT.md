# Cross-Baseline Screen-Count Defect

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-SCR-DEF-001 |
| **Version** | 1.2.0 |
| **Status** | **RESOLVED BY GHV.BASELINE-CORRECTION.1** · alias-safe recount **CR-002** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §30 · resolved GHV.BASELINE-CORRECTION.1 · amended CR-002 |
| **Last updated** | 2026-07-21 |
| **Risk ID** | **RISK-PRG-057** — **RESOLVED** · **RISK-PRG-058** alias inflation — **RESOLVED** |
| **Dependency ID** | **DEP-075** — **SATISFIED** |
| **Blocks** | *(former)* **GHV.ARCHITECTURE.1A** — **UNBLOCKED** for screen-count · alias-inflation preflight **PASS** |
| **Correction Gate** | **GHV.BASELINE-CORRECTION.1 — PASS** · CR-001 · DEC-152 · **CR-002 · DEC-153** |

```text
RESOLVED BY GHV.BASELINE-CORRECTION.1 (+ CR-002 alias-safe amendment)
Master Screen Registry v1.2.0 = 92 ACTIVE / 7 shells / 0 aliases in inventory
ACT-004 HISTORICAL_REFERENCE — does NOT count
ACT-013 Accept Account Risk — ACTIVE
Learning Design Baseline UNCHANGED
Progression Design Baseline UNCHANGED
Product Code BLOCKED
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
| Current `MASTER-SCREEN-REGISTRY.md` | **90** | Pre-existing undercount *(historical — corrected)* |
| Current `AUTHORITATIVE-SOURCE-MAP.md` | **90** | Mirrors registry claim *(historical — corrected)* |
| Wireframe registry language | **90** | Aligned to defective count *(historical — corrected)* |

This was a **governance defect**, not a Progression formula defect.

### Resolution (2026-07-21)

| Source | Count after correction | Evidence |
|--------|----------------------:|---------|
| MASTER-SCREEN-REGISTRY v1.2.0 | **92 ACTIVE** (0 aliases) | CR-001 · **CR-002** · DEC-152 · **DEC-153** |
| AUTHORITATIVE-SOURCE-MAP v1.7.0 | **92 ACTIVE** | ACTIVE AUTHORITATIVE |
| WIREFRAME-REGISTRY v1.2.0 | **92 ACTIVE** | PD.2 Amendment-02 |

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

Resolution does not authorize Product Code, does not complete technical or usability validation, and does not change Learning or Progression design baselines.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D §30 — record cross-baseline 90 vs 92 screen-count defect |
| 1.1.0 | 2026-07-21 | **RESOLVED BY GHV.BASELINE-CORRECTION.1** — CR-001 · DEC-152 · registry v1.1.0 |
| 1.2.0 | 2026-07-21 | Alias-safe amendment — CR-002 · DEC-153 · registry v1.2.0 · ACT-013 · ACT-004 appendix |
| 1.2.0 | 2026-07-21 | Alias-safe amendment — CR-002 · DEC-153 · registry v1.2.0 · ACT-013 · ACT-004 appendix |
