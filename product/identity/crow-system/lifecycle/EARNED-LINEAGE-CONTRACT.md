# EARNED LINEAGE CONTRACT

| Field | Value |
|-------|-------|
| **Document** | Earned Lineage Contract |
| **Gate** | GHV.CROW-IDENTITY.1C |
| **Starting HEAD** | `e098440661ba023a1e523a9cf7b4ae46e0533d27` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** · Lifecycle Baseline v1.0.0 |


## Definition

```text
Earned Lineage
=
A governed identity claim supported by
valid Evidence, applicable Mastery,
capability coverage, freshness,
integrity and a recorded decision.
```

Binding equation:

```text
Earned Lineage
=
valid Evidence
+ applicable Mastery
+ capability coverage
+ freshness
+ integrity
+ governed decision
```

## Cardinality

| Item | Rule |
|------|------|
| Earned Lineages | **0 to many** |
| Earning one | does **not** remove another |
| Same ID as Chosen | allowed; records remain **separate** |
| Cross-Wing parents (future) | requires multiple distinct earned parents later |

## Lifecycle states

| State | Entry (summary) | Public projection | Lineage Mark |
|-------|-----------------|-------------------|--------------|
| `UNCLAIMED` | No claim path started | None | No |
| `CANDIDATE` | Rule evaluation identifies eligibility interest | None | No |
| `EVIDENCE_BUILDING` | Approved Evidence references accumulating | None | No |
| `DECISION_PENDING` | Coverage met; awaiting governed decision | None | No |
| `EARNED_ACTIVE` | Governed award decision recorded | Opt-in if eligible | Eligible |
| `REVALIDATION_DUE` | Freshness policy grace opened | Must show review status | Policy-defined |
| `LAPSED` | Freshness insufficient; **not misconduct** | Historical wording only | No active mark |
| `SUSPENDED` | Integrity/correction/review hold | Restricted | Hidden/disabled |
| `REVOKED` | Governed invalidation | Must not appear active | No |
| `SUPERSEDED` | Taxonomy evolution mapping | Historical + successor path | Per policy |
| `UNDER_APPEAL` | Appeal opened on material decision | Restricted | Restricted |
| `CORRECTED` | Privileged correction applied; history append-only | Per corrected state | Per resulting state |

## Allowed / prohibited transitions (material)

**Allowed examples:** UNCLAIMED→CANDIDATE; CANDIDATE→EVIDENCE_BUILDING; EVIDENCE_BUILDING→DECISION_PENDING; DECISION_PENDING→EARNED_ACTIVE; EARNED_ACTIVE→REVALIDATION_DUE→LAPSED or →EARNED_ACTIVE; *→SUSPENDED→* cleared; *→UNDER_APPEAL; EARNED_ACTIVE→REVOKED (governed); *→CORRECTED (privileged); *→SUPERSEDED (taxonomy).

**Prohibited examples:**

- Suggested → Earned (direct)
- Chosen → Earned (silent)
- Payment / Nest score / Trust / popularity → Earned
- Raw Evidence Object → Earned (must be approved opaque reference)
- Revocation solely for inactivity, payment cancellation, or popularity

## Decision requirements (Earned activation)

1. Active `CRW-*` taxonomy ID  
2. Applicable taxonomy version  
3. Required capability-center coverage  
4. Valid approved Evidence references  
5. Applicable Mastery state (cite Progression baseline / FRM-MST-*)  
6. Evidence and Mastery freshness  
7. No unresolved integrity hold  
8. Recorded decision authority  
9. Decision timestamp  
10. Decision reason codes  
11. Revalidation conditions  
12. Correction and appeal routes  

## State distinctions

| Concept | Meaning |
|---------|---------|
| Revalidation Due | Still governed under policy-defined grace; **duration not invented here** |
| Lapsed | Freshness insufficient; not misconduct; not automatic revocation |
| Suspended | Temporary investigation/correction hold |
| Revoked | Decision invalidated through governed process |
| Superseded | Taxonomy rename/deprecation/split/merge/supersede mapping |
| Corrected | Administrative/adjudicated fix without rewriting history |

## Audit & notification

Every material earned-state change requires provenance (see LINEAGE-DECISION-PROVENANCE-AND-REASON-CODES.md), user-appropriate notification, and correction/appeal path where the decision is material.
