# ADR-ARC-021 — Evidence Scanning Pipeline

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-021 |
| **Title** | Evidence Scanning Pipeline |
| **Status** | **PIPELINE ACCEPTED · PROVIDER DEFERRED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

Evidence uploads may contain malware or secrets. Review must not proceed until scanning completes. Architecture mandates **fail-closed** behavior.

## Options Considered

- **A.** Scan optional / best-effort.
- **B.** Scan with fail-open on outage.
- **C.** Scan with fail-closed pipeline; provider via adapter.

## Quality Attributes

Safety over availability for review release path.

## Security

Malware + secret detection; no release on INCONCLUSIVE; quarantine until pass.

## Privacy

Scan diagnostics restricted; not on public surfaces.

## Accessibility

User notified if upload blocked pending scan (Arabic messaging).

## Localization

Scan failure reasons user-safe in Arabic; no raw vendor signatures exposed.

## Cost

Per-scan vendor pricing deferred.

## Operability

Async job queue for scan; dead-letter for repeated failures.

## Spike Evidence

- **SPK-ARC-008 PASS** — fail-closed on outage; failOpen flag cannot bypass

## Decision

**PIPELINE ACCEPTED; PROVIDER DEFERRED:** Option C. Scanner vendor selection deferred to SCANNING-PROVIDER-COMPARISON.md.

## Consequences

- Review workflow blocked during scanner outages (by design).
- Dual scan types (malware + secrets) required at implementation.

## Conditions

- Production scanner sandbox with harmless test vectors only in CI.
- SLA monitoring for scan queue depth.

## Migration

Swap `ScannerPort` adapter; re-scan policy for existing objects TBD legally.

## Exit

Export scan job format; retain quarantine objects if vendor export unsupported.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C pipeline accepted per SPK-ARC-008 |
