# ADR-ARC-024 — Runtime Process Topology

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-024 |
| **Title** | Runtime Process Topology |
| **Status** | **ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

GHURAVIA requires a runtime topology supporting 92 governed screens and async side effects without premature microservice sprawl.

## Options Considered

- **A.** Single monolithic process (web only)
- **B.** One web deployable + worker mode / separate worker boundary planned
- **C.** Immediate multi-service split

## Quality Attributes

Modular monolith favors transactional integrity; worker boundary defers split cost.

## Security

Worker uses same secrets rotation; no privileged HTTP on worker ingress.

## Privacy

Correlation IDs only; no PII in worker stdout defaults.

## Accessibility

N/A at process level; shell a11y in ADR-026.

## Arabic-first / Localization

Arabic-first web deployable; locale bundles per session preference.

## Cost

One deployable minimizes baseline cost; worker adds incremental compute when enabled.

## Operability

Single codebase, dual process mode; outbox observability in ADR-034.

## Spike Evidence

- **SPK-ARC-004 PASS** — 92/92 shell routing
- **SPK-ARC-021 PASS (1B)** — environment isolation

## Decision

**ACCEPTED:** Option B — one primary web deployable with planned worker mode for async consumers.

## Consequences

- Route Handlers remain authoritative ingress
- Outbox consumers run in worker mode

## Conditions

- External hosting validation remains
- Product Code BLOCKED

## Migration

Enable worker mode via env flag; no schema migration required.

## Exit

Revert to web-only if worker ops exceed benefit.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
