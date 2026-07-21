# ADR-ARC-018 — Encryption Boundaries

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-018 |
| **Title** | Encryption Boundaries |
| **Status** | **ACCEPTED WITH CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Sensitive data spans DB, object store, and application fields (legal identity, Evidence).

## Options Considered

- **A.** TLS + provider default encryption only.
- **B.** TLS + TDE + field-level for highly restricted fields.
- **C.** Client-side encryption for Evidence (E2E).

## Quality Attributes

Operability for founder vs maximum isolation.

## Security

Short-lived presign URLs; KMS-backed DEKs for field encryption; no keys in repo.

## Privacy

Field-level encryption for private legal identity and optional Evidence metadata flags.

## Accessibility

N/A at encryption layer.

## Localization

N/A.

## Cost

KMS operations per decrypt — minimize via envelope caching in request scope only.

## Operability

Key rotation runbooks required before production; provider-managed TDE where available.

## Spike Evidence

- SPK-ARC-007 (presign TTL, isolation)
- ENCRYPTION-KEY-MANAGEMENT-ARCHITECTURE.md

## Decision

**ACCEPTED WITH CONDITIONS:** Option B.

## Consequences

- KMS selection deferred; envelope encryption pattern required in Product Code.
- E2E Evidence rejected for launch (reviewer workflow needs server-side scan).

## Conditions

- KMS provider chosen at deployment gate.
- Key rotation cadence validated operationally.

## Migration

Background re-encrypt job when DEK rotates.

## Exit

Export encrypted blobs with key escrow procedure — legal required.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C accepted with conditions |
