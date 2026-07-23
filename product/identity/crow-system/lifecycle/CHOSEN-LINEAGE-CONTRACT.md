# CHOSEN LINEAGE CONTRACT

| Field | Value |
|-------|-------|
| **Document** | Chosen Lineage Contract |
| **Gate** | GHV.CROW-IDENTITY.1C |
| **Starting HEAD** | `e098440661ba023a1e523a9cf7b4ae46e0533d27` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** · Lifecycle Baseline v1.0.0 |


## Definition

```text
Chosen Lineage
=
A reversible user-selected focus indicating
what the user wishes to explore or emphasize.

It is self-expression and direction,
not proof of capability.
```

Internal formal noun remains **Core Crow Lineage**; concise user-facing noun **Crow Lineage**.

## Cardinality

| Item | Rule |
|------|------|
| Active Chosen Lineage | **0 or 1** |
| Requirement to choose | **Never required** |
| Eligible targets | Any **active** Core Crow Lineage (`CRW-*`) under taxonomy v1.0.0+ |
| Eligibility gates | **None** (no Evidence, Mastery, Nest, Trust, payment, readiness) |
| History | Prior choices remain **private history** |

## Internal states

| State | Meaning |
|-------|---------|
| `NONE` | No active chosen focus |
| `ACTIVE` | Exactly one active chosen `CRW-*` |
| `WITHDRAWN` | User cleared the focus; history retained |
| `SUPERSEDED` | Taxonomy rename/deprecation/supersession mapping applied to the chosen record |

## Transitions

| From | To | Authority | Notes |
|------|----|-----------|-------|
| NONE | ACTIVE | USER | Explicit selection |
| ACTIVE | ACTIVE (other Lineage) | USER | Replaces focus; prior becomes history |
| ACTIVE | WITHDRAWN | USER | Clear focus |
| ACTIVE | SUPERSEDED | TAXONOMY policy | ID may remain; labels update per ID policy |
| WITHDRAWN | ACTIVE | USER | New choice |
| SUPERSEDED | ACTIVE | USER | May re-choose mapped active ID |

**Prohibited:** silent conversion to Suggested or Earned; auto Route unlock; auto entitlement; auto Mark.

## Required properties

- user initiated; user reversible
- no eligibility / payment / Nest / Trust / Mastery / Evidence claim
- no permanent career implication
- no automatic Route access or entitlement
- no Lineage Mark, Evidence Seal, or Fusion Signature authorization

## Public projection (optional, opt-in)

Allowed language examples:

```text
Exploring: Rhythm Keeper
Current focus: Rhythm Keeper
```

**Prohibited** unless an independent **Earned Active** record exists for the same ID:

```text
Earned … / Verified … / Proven …
```

Default privacy: **PRIVATE**.
