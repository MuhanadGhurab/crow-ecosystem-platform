# CROW VISUAL ASSET ID AND VERSIONING POLICY

| Field | Value |
|-------|-------|
| **Document** | Visual Asset ID and Versioning |
| **Gate** | GHV.CROW-IDENTITY.1D |
| **Starting HEAD** | `5c6f2f4aa18e438eafdcebf05f917d9d9b5de5ca` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** |


## Namespace

```text
VIS-MF-OPR-001 … VIS-MF-LED-001
VIS-CRW-OPR-01-MARK-001 / FORM-001 / MOTION-001
```

Visual IDs never replace taxonomy `CRW-*` IDs.

Every visual record references: CRW-* (when applicable), taxonomy version, lifecycle baseline version, visual baseline version, asset version, provenance, status.

## Statuses

CONCEPT · CONTROLLED PROTOTYPE · **REFERENCE LOCKED** · PRODUCTION CANDIDATE · PRODUCTION APPROVED · DEPRECATED · SUPERSEDED · REJECTED

This Gate uses **REFERENCE LOCKED** only — **not** PRODUCTION APPROVED.

## Change classes

PATCH geometry clarification · MINOR optional format/motion · MAJOR Mother Form / Mark identity / semantic reassignment.

Never reuse a retired visual ID for different meaning.
