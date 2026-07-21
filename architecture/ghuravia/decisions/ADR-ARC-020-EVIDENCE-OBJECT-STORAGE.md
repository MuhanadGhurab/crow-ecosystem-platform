# ADR-ARC-020 — Evidence Object Storage

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-020 |
| **Title** | Evidence Object Storage |
| **Status** | **DEFERRED WITH S3-COMPATIBLE ADAPTER LOCKED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Evidence binaries require durable, encrypted object storage with quarantine isolation. Provider choice affects cost and residency.

## Options Considered

- **A.** AWS S3
- **B.** Cloudflare R2
- **C.** Self-hosted MinIO
- **D.** App filesystem (production)

## Quality Attributes

S3 API interoperability for exit flexibility.

## Security

SSE required; IAM-scoped credentials; no admin API credential leak (SPK-ARC-007).

## Privacy

Regional residency **LEGAL VALIDATION REQUIRED**.

## Accessibility

N/A.

## Localization

N/A.

## Cost

Provider comparison deferred; egress minimization favors direct upload (ADR-019).

## Operability

Lifecycle rules for quarantine purge; versioning optional for Evidence.

## Spike Evidence

- SPK-ARC-007 (local filesystem simulates object store port)
- OBJECT-STORAGE-COMPARISON.md

## Decision

**DEFERRED WITH S3-COMPATIBLE ADAPTER LOCKED:** Options A/B/C remain candidates; Option D **REJECTED** for production.

## Consequences

- `ObjectStoragePort` required before Product Code Evidence flows.
- Provider selection gate blocks production deploy.

## Conditions

- Sandbox bucket with SSE and presign tests.
- Residency decision with legal input.

## Migration

Adapter swap copies objects via batch migration tool — out of 1C scope.

## Exit

S3-compatible API enables provider migration with copy tooling.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C adapter locked, provider deferred |
