# LINEAGE EVIDENCE–MASTERY ELIGIBILITY CONTRACT

| Field | Value |
|-------|-------|
| **Document** | Evidence-before-Mastery Eligibility Contract |
| **Gate** | GHV.CROW-IDENTITY.1C |
| **Starting HEAD** | `e098440661ba023a1e523a9cf7b4ae46e0533d27` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** |
| **Progression refs** | FRM-MST-001 · FRM-MST-002 · FRM-MST-003 (Progression Design Baseline v1.0.0) — **no new formulas** |
| **Evidence refs** | IDENTITY-SECURITY-DATA-EVIDENCE architecture · quarantine / opaque reference |


## Binding chain

```text
Raw Evidence Object
    ↓ quarantine / scan / review
Approved Evidence Claim
    ↓ opaque reference only
Progression / Mastery evaluation
    ↓ applicable valid Mastery state
Lineage capability coverage
    ↓ governed identity decision
Earned Lineage
```

## Binding rules

```text
Raw Evidence Object ↛ Lineage decision directly
Raw Evidence Object ↛ Progression Ledger directly
Approved opaque Evidence reference → permitted
Evidence before Mastery
Mastery before Earned Lineage decision
```

## Required elements for an Earned decision

| # | Requirement |
|---|-------------|
| 1 | Active `CRW-*` ID |
| 2 | Taxonomy version |
| 3 | Capability-center coverage for that Lineage |
| 4 | Valid approved Evidence references |
| 5 | Applicable Mastery state from locked Progression baseline |
| 6 | Evidence + Mastery freshness |
| 7 | No unresolved integrity hold |
| 8 | Decision authority |
| 9 | Decision timestamp |
| 10 | Reason codes |
| 11 | Revalidation conditions |
| 12 | Correction + appeal routes |

## Explicit non-claims

- No new numeric Mastery formulas or thresholds in this Gate  
- No duplication of locked Progression equations  
- Generic Route completion alone is **insufficient** for any Lineage  
- Nest readiness score is **not** Mastery and **not** Lineage proof  
