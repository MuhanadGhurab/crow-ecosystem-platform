# ADR-ARC-034 — Observability and Diagnostics

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-034 |
| **Title** | Observability and Diagnostics |
| **Status** | **ACCEPTED WITH CONDITIONS; provider deferred** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Operations need telemetry without leaking PII or Trust internals.

## Options Considered

- **A.** Verbose client logs
- **B.** Privacy-safe server telemetry + adapter
- **C.** No observability

## Quality Attributes

Fail-safe diagnostics required for gated launch.

## Security

Secrets never logged; structured redaction.

## Privacy

Trust values redacted; minor identifiers hashed.

## Accessibility

Accessible error pages; no diagnostic detail to users.

## Arabic-first / Localization

Arabic user messages; neutral ops logs.

## Cost

Vendor cost scales with ingest.

## Operability

Provider deferred; structured logs mandatory.

## Spike Evidence

- **SPK-ARC-022 PASS WITH CONDITIONS**

## Decision

**ACCEPTED WITH CONDITIONS; provider deferred:** Option B — **provider deferred**; redaction rules locked.

## Consequences

- Correlation ID end-to-end

## Conditions

- Vendor not selected; no production SLOs

## Migration

Add vendor adapter without changing redaction schema.

## Exit

Revert to log-only if vendor outage.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
