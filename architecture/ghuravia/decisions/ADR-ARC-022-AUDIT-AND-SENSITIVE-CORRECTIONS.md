# ADR-ARC-022 — Audit and Sensitive Corrections

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-022 |
| **Title** | Audit and Sensitive Corrections |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Privileged corrections to progression, Evidence status, and Trust require accountability without leaking sensitive payloads into audit logs.

## Options Considered

- **A.** Ad-hoc admin logs in application logger.
- **B.** Append-only audit ledger with schema enforcement.
- **C.** External SIEM only.

## Quality Attributes

Integrity, reversibility, dual control for break-glass.

## Security

Reject evidence bodies and secrets in audit; dual control for BREAK_GLASS; reversal entries correlated.

## Privacy

Audit sensitivity tags; restricted read roles.

## Accessibility

Admin audit UI keyboard navigable (future Product Code).

## Localization

Reason codes support Arabic entry for operator locale.

## Cost

DB-backed audit at launch; SIEM optional later.

## Operability

Post-action review flag on privileged corrections.

## Spike Evidence

- **SPK-ARC-019 PASS** — actor/reason/authority required; dual control; reversal; content prohibitions

## Decision

**ACCEPTED:** Option B — append-only audit ledger with privileged correction API.

## Consequences

- Audit table growth; retention per ADR-017.
- All sensitive corrections must pass audit append before commit.

## Conditions

Tamper-evident storage (WORM) optional enhancement pre-production.

## Migration

N/A greenfield.

## Exit

Audit export to SIEM via adapter; immutable backup snapshots.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C accepted per SPK-ARC-019 |
