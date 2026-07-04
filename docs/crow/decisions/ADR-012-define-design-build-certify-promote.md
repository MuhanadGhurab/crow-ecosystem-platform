# ADR-012: Development Uses Define → Design → Build → Certify → Promote

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Implementation status** | Process — effective immediately |

## Context

Ad-hoc coding without lifecycle discipline caused authority and migration incidents.

## Decision

All development follows **Define → Design → Build → Certify → Promote**. No skip to Build without defined scope and boundaries.

## Rationale

Aligns engineering with governance milestones and certification evidence requirements.

## Alternatives rejected

- Direct-to-production agent changes
- Report-only acceptance without certify step

## Consequences

Milestones must document each phase. Certify uses verification scripts and environment-appropriate evidence.

## Affected domains

All engineering milestones

## Links

- [`11-DEVELOPMENT-OPERATING-MODEL.md`](../11-DEVELOPMENT-OPERATING-MODEL.md)
- [`milestones/MILESTONE-TEMPLATE.md`](../milestones/MILESTONE-TEMPLATE.md)
