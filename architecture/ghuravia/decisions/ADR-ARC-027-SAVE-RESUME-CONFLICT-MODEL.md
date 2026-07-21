# ADR-ARC-027 — Save Resume Conflict Model

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-027 |
| **Title** | Save Resume Conflict Model |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Mission progress must survive interrupt with server-authoritative merge under QAS-001.

## Options Considered

- **A.** Client-last-write-wins
- **B.** Server version vector + explicit conflict surfaces
- **C.** Realtime CRDT

## Quality Attributes

Server authority matches activation/progression patterns.

## Security

Save tokens bound to session.

## Privacy

Draft payloads exclude Evidence binary.

## Accessibility

Conflict UI must be keyboard reachable.

## Arabic-first / Localization

Arabic conflict copy required in Product Code phase.

## Cost

Version metadata storage negligible.

## Operability

Conflict metrics in observability.

## Spike Evidence

- **SPK-ARC-006 PASS**

## Decision

**ACCEPTED:** Option B — server-authoritative with version vectors.

## Consequences

- Resume restores authoritative Mission state

## Conditions

None blocking architecture acceptance.

## Migration

Backfill version=1 on first save in Product Code.

## Exit

Disable offline draft if conflict rate exceeds threshold.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
