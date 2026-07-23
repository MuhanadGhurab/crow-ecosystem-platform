# SUGGESTED LINEAGE CONTRACT

| Field | Value |
|-------|-------|
| **Document** | Suggested Lineage Contract |
| **Gate** | GHV.CROW-IDENTITY.1C |
| **Starting HEAD** | `e098440661ba023a1e523a9cf7b4ae46e0533d27` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** · Lifecycle Baseline v1.0.0 |


## Definition

```text
Suggested Lineage
=
A private, explainable and dismissible
system recommendation intended to help exploration.

It is not an award and not a prediction of destiny.
```

## Cardinality

| Item | Rule |
|------|------|
| Concurrent suggestions | **0 to many** |
| Public projection | **Never** |
| Symbol authorization | **None** |

## Internal states

| State | Meaning |
|-------|---------|
| `GENERATED` | Created by rule evaluation; not yet shown |
| `PRESENTED` | Shown privately to the user |
| `ACCEPTED_AS_CHOICE` | User explicitly converted suggestion → Chosen (Chosen record separate) |
| `DISMISSED` | User dismissed; retain minimal private history |
| `EXPIRED` | Past expiry/review condition |
| `SUPERSEDED` | Replaced by newer suggestion or taxonomy change |

## Transitions

| From | To | Authority |
|------|----|-----------|
| GENERATED | PRESENTED | RULE_EVALUATION |
| PRESENTED | ACCEPTED_AS_CHOICE | USER (creates/updates Chosen; suggestion closes) |
| PRESENTED | DISMISSED | USER |
| PRESENTED / GENERATED | EXPIRED | RULE_EVALUATION |
| * | SUPERSEDED | RULE_EVALUATION / TAXONOMY |

**Prohibited transitions:** Suggested → Earned (direct); Suggested → public projection; Suggested → Lineage Mark.

## Allowed suggestion input classes (conceptual)

- explicit interest choices made for recommendation purposes
- selected Horizon exploration
- Route browsing or learning activity
- user-requested guidance
- approved capability metadata
- active, valid Evidence **metadata** (opaque references only — not raw files)
- existing Mastery state (by Progression baseline reference)
- explicit feedback on prior suggestions

## Prohibited suggestion inputs

```text
Origin region / background / goals (0D boundary)
Nest score as Lineage proof
private legal identity, nationality, ethnicity, tribe, religion
health / disability / gender inference / age profiling beyond safety rules
Trust standing
payment plan / subscription / Merit Access as identity signal
leaderboard / popularity / social graph / private messages
device fingerprint / raw Evidence files / secrets / credentials
```

## Required suggestion payload fields

- suggested Lineage ID (`CRW-*`)
- taxonomy version
- reason codes
- signal categories used
- generation timestamp
- expiry or review condition
- explanation
- dismiss action
- choose action
- correction route

Algorithms are **not implemented** in this Gate.
