# ADR-007: SAREA Adapts Presentation but Never Grants Permission

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | IMPLEMENTED in contracts; UI must not violate |

## Context

Experience layers often blur visibility with authorization.

## Decision

SAREA owns role-aware navigation and presentation only. **SAREA never grants permission.** RBAC and CyberCrow remain authoritative.

## Rationale

Prevents UI-driven privilege escalation and "hidden admin" via experience config.

## Alternatives rejected

- SAREA-managed permissions
- Widget visibility as access control

## Consequences

SAREA changes require composition-only reviews. Permission changes go through CyberCrow/RBAC paths.

## Affected domains

SAREA, CyberCrow, Runtime

## Links

- [`04-IDENTITY-AUTHORITY-TRUST.md`](../04-IDENTITY-AUTHORITY-TRUST.md)
- [`07-SAREA-HUMAN-EXPERIENCE-ORCHESTRATION.md`](../../architecture/crow-core/07-SAREA-HUMAN-EXPERIENCE-ORCHESTRATION.md)
