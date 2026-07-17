# ADR-004: Blueprint Approval Precedes Tenant Build

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | PARTIAL — approval models exist; enforcement varies by path |

## Context

Tenant provisioning from unreviewed designs risks authority and commercial misalignment.

## Decision

**Blueprint approval must precede tenant build.** No tenant provisioning from draft or unapproved blueprint.

## Rationale

Blueprint is the contractual and organizational design source of truth.

## Alternatives rejected

- Parallel tenant sandbox before approval
- Auto-provision on Request submit

## Consequences

Go-live and onboarding gates depend on `BlueprintApproval` evidence.

## Affected domains

Blueprint, Tenant, ProCrow, Commercial

## Links

- [`05-ENTERPRISE-BLUEPRINT.md`](../05-ENTERPRISE-BLUEPRINT.md)
- `EnterpriseBlueprintVersion`, `BlueprintApproval` in Prisma schema
