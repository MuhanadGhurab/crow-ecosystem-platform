# Cost and Capacity Assumptions

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-CAP-001 |
| **Version** | 1.1.0 |
| **Status** | **PARTIAL — SELECTED STACK BASELINE ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1B |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-007 · SPK-ARC-014 · SPK-ARC-023 · SPK-ARC-024 |
| **Related** | Evidence objects growth · Live Sky burst · Skyboard composition · [PLATFORM-STACK-BASELINE.md](../governance/PLATFORM-STACK-BASELINE.md) |

```text
PARTIAL — selected stack baseline active
P0 core spikes complete; P1–P3 NOT RUN
Qualitative only — do not invent precise provider prices without verified sourcing
Scale: LOW · MODERATE · HIGH · UNKNOWN · VALIDATION REQUIRED
```

## 1. Launch tiers

| Tier | Intent |
|------|--------|
| Founder Development | Solo/small; synthetic |
| Private Alpha | Limited invited users |
| Controlled Launch | Saudi controlled public |
| Early Growth | Post-launch expansion |
| Growth Trigger | Thresholds that force re-architecture / cost review |

## 2. Cost driver matrix (qualitative)

| Driver | Founder Dev | Private Alpha | Controlled Launch | Early Growth | Growth Trigger signal |
|--------|-------------|---------------|--------------------|--------------|----------------------|
| Application hosting | LOW | LOW–MOD | MODERATE | HIGH | Sustained CPU/RPS ceiling — **single Next.js modular monolith deployable** |
| Database | LOW | MODERATE | MODERATE–HIGH | HIGH | **PostgreSQL-family relational primary** · storage + IOPS |
| Cache | LOW | LOW | **LOW–MOD** (no shared distributed cache at launch) | HIGH | Hit-rate collapse — ADR-ARC-010 deferral |
| Queue | LOW | LOW–MOD | MODERATE | HIGH | **Transactional outbox + local/worker jobs** · DLQ growth |
| Realtime | LOW | MODERATE | HIGH (burst) | HIGH | Concurrent Live Sky |
| Object storage | LOW | MODERATE | **HIGH** | **HIGH** | Evidence volume |
| Bandwidth | LOW | MODERATE | HIGH | HIGH | Media egress |
| Scanning (malware/secret) | LOW | MODERATE | HIGH | HIGH | Upload rate |
| Email | LOW | MODERATE | MODERATE–HIGH | HIGH | Activation + transactional |
| Mobile verification | LOW | LOW–MOD | MODERATE | UNKNOWN | OTP price spikes |
| Payments | LOW | LOW | MODERATE | MODERATE | Take-rate + disputes |
| Search | LOW | LOW–MOD | MODERATE | HIGH | Index size |
| Observability | LOW | MODERATE | MODERATE–HIGH | HIGH | Cardinality explosion |
| Backups | LOW | MODERATE | MODERATE–HIGH | HIGH | Retain × storage |
| Support tooling | LOW | LOW | MODERATE | HIGH | Ticket volume |
| AI usage (if any) | UNKNOWN | UNKNOWN | VALIDATION REQUIRED | VALIDATION REQUIRED | Token spend |

## 3. Cost-explosion triggers

1. Unbounded Evidence object retention without lifecycle.
2. Live Sky fan-out without spectator/participant separation.
3. Full progression recalculation on every event (need targeted recalc — SPK-ARC-009).
4. Verbose PII-heavy telemetry cardinality.
5. Search indexing of restricted corpora “just in case.”
6. Append-only progression ledger growth without retention/archival policy (ADR-ARC-008).

## 4. Selected-stack notes (1B)

- **Modular monolith** keeps founder-dev hosting at **LOW–MODERATE** through controlled launch versus early multi-service sprawl.
- **No shared distributed cache at launch** reduces cache spend but shifts read load to PostgreSQL — monitor IOPS before introducing cache.
- **Transactional outbox** adds modest queue/worker cost early; external broker deferred.
- **Relational Learning Graph** avoids separate graph-database license/ops until scale triggers fire.

## 5. Limitations

```text
ASSUMPTIONS ONLY · PARTIAL VALIDATION (P0 ONLY) · NO PRICE QUOTES · PROVIDER CHOICES DEFERRED
```

## 6. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.1.0 | 2026-07-21 | GHV.ARCHITECTURE.1B — selected-stack cost driver update |
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §38 — cost/capacity assumptions |
