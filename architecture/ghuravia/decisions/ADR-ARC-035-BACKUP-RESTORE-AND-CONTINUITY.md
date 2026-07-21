# ADR-ARC-035 — Backup Restore and Continuity

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-035 |
| **Title** | Backup Restore and Continuity |
| **Status** | **ACCEPTED WITH OPERATIONAL CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Critical domains restore without rewriting progression formula history.

## Options Considered

- **A.** Full DB snapshot only
- **B.** Targeted restore + formula preservation
- **C.** No backups

## Quality Attributes

Formula version integrity from SPK-ARC-011 must survive restore.

## Security

Backup encryption; restore dual control.

## Privacy

Evidence restored to quarantine.

## Accessibility

N/A

## Arabic-first / Localization

N/A

## Cost

Storage cost for object + DB backups.

## Operability

**DRAFT RPO/RTO** — BACKUP-RESTORE runbook.

## Spike Evidence

- **SPK-ARC-020 PASS WITH CONDITIONS**

## Decision

**ACCEPTED WITH OPERATIONAL CONDITIONS:** Option B with **DRAFT RPO/RTO** documented.

## Consequences

- No silent formula rewrite on restore

## Conditions

- Production restore NOT executed

## Migration

Point-in-time recovery when platform supports.

## Exit

Manual export if automated restore fails.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
