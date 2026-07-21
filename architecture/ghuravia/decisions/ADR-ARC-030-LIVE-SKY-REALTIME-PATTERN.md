# ADR-ARC-030 — Live Sky Realtime Pattern

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-030 |
| **Title** | Live Sky Realtime Pattern |
| **Status** | **ACCEPTED WITH CONDITIONS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Context

Live Sky requires participant vs spectator separation with reconnect safety.

## Options Considered

- **A.** Single shared channel
- **B.** Role-separated channels + adapter-locked provider
- **C.** Custom WebSocket cluster day one

## Quality Attributes

**Spectator ↛ participant mutation**; **Reconnect ↛ duplicate contribution** locked.

## Security

Channel tokens scoped to role; short TTL.

## Privacy

Spectator view excludes private participant metadata.

## Accessibility

Live announcements must not rely on color alone.

## Arabic-first / Localization

Arabic Live UI strings; RTL chat overlays.

## Cost

Provider cost scales with concurrent rooms.

## Operability

LIVE-SKY-DEGRADATION runbook.

## Spike Evidence

- **SPK-ARC-014 PASS WITH CONDITIONS**
- **SPK-ARC-015 PASS**

## Decision

**ACCEPTED WITH CONDITIONS:** Option B — **realtime provider DEFERRED WITH ADAPTER LOCKED**.

## Consequences

- Reconnect dedupe via session fence

## Conditions

- Realtime vendor not selected

## Migration

Adapter swap without channel semantics change.

## Exit

Degrade to polling spectator mode if provider hard-down.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1D acceptance per spike evidence |
