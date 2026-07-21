# Live Sky Realtime Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-LIVE-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §24 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-014 · SPK-ARC-015 |
| **Related** | Live Sky product screens · TRANSACTION map (team contribution) |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO realtime provider chosen in 1A
NO Product Code
```

## 1. Purpose

Validate Live Sky realtime needs and compare transport patterns without selecting a vendor.

## 2. Validation surfaces

| Surface | Focus | Spike |
|---------|-------|-------|
| Event discovery | Public/eligible listings | SPK-ARC-014 |
| Participant eligibility | Authz + learning/trust gates | SPK-ARC-014 |
| Spectator access | Spectator-safe projections only | SPK-ARC-014 |
| Role assignment | Participant / spectator / mod | SPK-ARC-014 |
| Presence / ready checks | Ephemeral vs durable | SPK-ARC-014 |
| Clocks and phases | Server authority for phase | SPK-ARC-015 |
| Participant actions | Idempotent contributions | SPK-ARC-015 |
| Spectator-safe updates | No private leakage | SPK-ARC-014 |
| Reconnect | Resume without duplicate credit | SPK-ARC-015 |
| Duplicate contribution prevention | Dedup keys | SPK-ARC-015 |
| Team contribution | Approval boundary | SPK-ARC-015 |
| Finalization / correction | Strong final results | SPK-ARC-015 |
| Moderation / abuse | Rate limits | SPK-ARC-013 · 015 |
| Archival / scoring handoff | Progression emit after finalize | SPK-ARC-009 · 015 |
| Regional latency / capacity | Qualitative targets | capacity plan |
| Provider failure | Degrade / pause event | SPK-ARC-015 |
| Replay / recap | Where Scope allows | SPK-ARC-014 |

## 3. Realtime pattern candidates

| Pattern | Hypothesis | Benefit | Risk | Pass | Reject |
|---------|------------|---------|------|------|--------|
| **Polling** | Simpler ops | Easy fallback | Latency; load | Acceptable for spectator-low rate | Cannot meet phase timing |
| **Server-sent events (SSE)** | One-way server push | Simpler than WS | Limited bidirectional | Spectator OK; actions via HTTP | Need duplex at scale without hybrid |
| **WebSockets** | Bidirectional | Low latency | Ops complexity; sticky sessions | Participant actions reliable | Unbounded cost/complexity for launch |
| **Managed realtime provider** | Outsource fan-out | Faster delivery | Lock-in; data residency | Evidence beats self-host | Brand pick without comparison |
| **Hybrid** | HTTP commands + push projections | Clear authority | Two paths to sync | Server remains source of truth | Client-authoritative scores |

**Decision:** **DECISION PENDING**. No provider brand in 1A.

## 4. Authority rule

```text
Server clock + server phase + server contribution ledger
= source of truth
Client animations ≠ results
```

## 5. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · NO provider selected
```

## 6. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §24 — Live Sky realtime validation plan |
