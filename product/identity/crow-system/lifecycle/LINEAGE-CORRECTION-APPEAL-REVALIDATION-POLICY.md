# LINEAGE CORRECTION, APPEAL AND REVALIDATION POLICY

| Field | Value |
|-------|-------|
| **Document** | Lineage Correction, Appeal and Revalidation Policy |
| **Gate** | GHV.CROW-IDENTITY.1C |
| **Starting HEAD** | `e098440661ba023a1e523a9cf7b4ae46e0533d27` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** |
| **Appeal deadlines / legal retention periods** | **NOT invented** — marked for later operational/legal validation |

## Principles

- History is **append-only**.
- Errors are **corrected**, not silently overwritten.
- Users may challenge **material** identity decisions.
- System suggestions can be **dismissed** without formal appeal.
- Chosen state changes require **no appeal**.
- Earned denial, suspension, lapse classification, revocation and correction are **explainable**.
- Appeal state is **private**.
- Public projection must not imply validity during a prohibited state.
- Privileged corrections require reason, authority and audit reference.
- Correction never fabricates Evidence or Mastery.
- Taxonomic rename does not erase historical earned records.
- Deprecated IDs remain historically resolvable.
- Split/merge/supersede requires explicit mapping policy (ID/versioning baseline).
- Payment cancellation **cannot** revoke an earned identity.
- Inactivity alone **cannot** be treated as misconduct.
- Freshness **lapse is not revocation**.

## Freshness and revalidation

| State | Meaning |
|-------|---------|
| Revalidation Due | Grace under policy; duration **not set in this Gate** |
| Lapsed | Freshness insufficient; recoverable via revalidation path; not misconduct |
| Revoked | Governed invalidation — distinct from lapse |

## Taxonomy evolution effects (apply locked operations)

| Operation | Lifecycle effect |
|-----------|------------------|
| RENAME | ID unchanged; active earned preserved; old label in history; projection updates safely |
| CLARIFY | ID unchanged; no automatic revocation; reassessment only if protected center materially changes |
| DEPRECATE | No new chosen/suggested/earned activation; historical retained; migration path where available |
| SUPERSEDE | Old ID historically resolvable; successor mapping **does not auto-award**; review may be required |
| SPLIT | Parent earned does **not** automatically become both children; Evidence remapped |
| MERGE | No duplicate award; surviving ID per registry policy; full history preserved |

## Appeal path (conceptual)

1. Material earned denial / suspension / revocation / contested correction → appeal may open (`UNDER_APPEAL`).
2. Appeal authority independent from original decision where practical.
3. Outcomes: upheld, denied, or corrected — each with provenance reason codes.
4. Suggestion dismissal and Chosen changes are **not** formal appeals.
