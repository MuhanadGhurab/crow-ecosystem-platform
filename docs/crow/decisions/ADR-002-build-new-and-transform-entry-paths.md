# ADR-002: Build New and Transform Existing Are Entry Paths, Not Separate Products

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | PARTIAL — types exist; UI unification incomplete (GAP-008) |

## Context

Two client entry paths needed without fragmenting the product.

## Decision

`JourneyKind` values **NEW** and **TRANSFORM** are public entry paths to the **same** core service. `OrganizationContext` remains a separate detailed field.

## Rationale

One lifecycle, one commercial model, two marketing/journey entry points.

## Alternatives rejected

- Separate SKUs or products per path
- Collapsing JourneyKind and OrganizationContext into one field

## Consequences

Public site, Request wizard, and Discovery must respect both fields independently.

## Affected domains

Public Portal, Request, Discovery

## Links

- [`00-CROW-CONSTITUTION.md`](../00-CROW-CONSTITUTION.md)
- [`GLOSSARY.md`](../GLOSSARY.md)
