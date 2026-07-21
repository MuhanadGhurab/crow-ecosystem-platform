# ADR-ARC-031 — Search and Discovery Pattern

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-031 |
| **Title** | Search and Discovery Pattern |
| **Status** | **ACCEPTED PATTERN; provider DEFERRED WITH ADAPTER** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Discovery must support Arabic queries with authZ and privacy enforcement.

## Options Considered

- **A.** Client-side filter
- **B.** Relational FTS first + external adapter
- **C.** External search day one

## Quality Attributes

**Search must enforce authZ + privacy** locked.

## Security

Search rate limited; query text redacted in logs where possible.

## Privacy

Minor and Trust fields never in index.

## Accessibility

Accessible search results; sanitized snippets.

## Arabic-first / Localization

Arabic normalization in relational FTS path.

## Cost

Relational FTS cheaper at launch.

## Operability

SEARCH-INDEX-DEGRADATION runbook.

## Spike Evidence

- **SPK-ARC-016 PASS WITH CONDITIONS**

## Decision

**ACCEPTED PATTERN; provider DEFERRED WITH ADAPTER:** Option B — **relational FTS first**; vendor deferred with adapter.

## Consequences

- Server-side authZ on every query

## Conditions

- Dedicated search vendor not selected

## Migration

Dual-write when external adapter enabled.

## Exit

Fallback to relational-only if external index stale.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
