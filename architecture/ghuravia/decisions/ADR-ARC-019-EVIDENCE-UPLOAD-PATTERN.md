# ADR-ARC-019 — Evidence Upload Pattern

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-019 |
| **Title** | Evidence Upload Pattern |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Evidence files may be large; routing bytes through app server increases cost and attack surface. Resumable uploads needed for unreliable networks (Arabic-first mobile web).

## Options Considered

- **A.** Proxy all bytes through API.
- **B.** Direct-to-storage with server-issued short-lived upload auth.
- **C.** Client-only upload to public bucket.

## Quality Attributes

Integrity, resumability, quarantine isolation, operability.

## Security

Token-bound owner; chunk offset validation; quarantine prefix; no public ACL.

## Privacy

Upload metadata minimized; content not logged.

## Accessibility

Upload progress exposed to AT.

## Localization

Arabic error messages for size/type rejection.

## Cost

Direct upload reduces app egress.

## Operability

Local spike simulates filesystem; production uses S3 adapter (ADR-020).

## Spike Evidence

- **SPK-ARC-007 PASS** — resumable chunks, token expiry, quarantine, admin isolation

## Decision

**ACCEPTED:** Option B — hybrid direct-to-storage with short-lived auth (15-minute token, sequential resume).

## Consequences

- Requires object storage adapter and upload session table.
- Client must implement resume logic.

## Conditions

None blocking pattern acceptance; storage provider still deferred.

## Migration

From proxy upload: dual-write period not needed — greenfield.

## Exit

Upload session format documented; objects remain in quarantine prefix until scan pass.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C accepted per SPK-ARC-007 |
