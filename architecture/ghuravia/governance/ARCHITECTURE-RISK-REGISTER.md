# Architecture Risk Register

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-RISK-001 |
| **Version** | 1.1.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Last updated** | 2026-07-21 |

```text
Architecture ADRs do NOT fully mitigate these risks
Technical Spikes Run = 12 / 25 (P0 6 + 1C 6)
Technical Validation = PARTIAL — CORE AND 1C DOMAIN SPIKES COMPLETE
```

## Status vocabulary

```text
OPEN
MONITORED
ACCEPTED WITH CONDITION
BLOCKING DECISION
BLOCKING IMPLEMENTATION
BLOCKING LAUNCH
```

## Risks (Gate §47 minimum set)

| ID | Risk | Status | Related spike / control | Notes |
|----|------|--------|-------------------------|-------|
| RISK-ARC-001 | Premature stack lock | **BLOCKING DECISION** | DEC-165 · ADR-REGISTER empty of ACCEPTED stack | Stack deferred to 1B |
| RISK-ARC-002 | Inherited-technology bias | **OPEN** | SPK-ARC-001 · DEC-158 | CyberCrow presence ≠ approval |
| RISK-ARC-003 | Modular boundaries collapsing | **OPEN** | Domain catalogue · shape options | Monitor through 1B–1E |
| RISK-ARC-004 | Database coupling | **OPEN** | SPK-ARC-005 · DEC-159 | No graph-DB-by-name |
| RISK-ARC-005 | Event duplication | **BLOCKING IMPLEMENTATION** | SPK-ARC-010 · DEC-160 | Until idempotency evidenced |
| RISK-ARC-006 | Event ordering defects | **OPEN** | SPK-ARC-010 · 009 | Ordering rules pending |
| RISK-ARC-007 | Formula-version drift | **BLOCKING IMPLEMENTATION** | SPK-ARC-011 · DEC-161 | Until version preservation evidenced |
| RISK-ARC-008 | Evidence-object exposure | **BLOCKING IMPLEMENTATION** | SPK-ARC-007 · DEC-162 | Isolation unproven |
| RISK-ARC-009 | Upload malware | **OPEN** | SPK-ARC-008 | Pipeline NOT RUN |
| RISK-ARC-010 | Secret leakage | **OPEN** | SPK-ARC-008 · 021 · 022 | Env + scan |
| RISK-ARC-011 | Provider outage | **MONITORED** | SPK-ARC-018 · QAS-015 | Graceful degradation planned |
| RISK-ARC-012 | Provider lock-in | **OPEN** | DEC-163 · adapters | Adapter principle only |
| RISK-ARC-013 | Live Sky cost | **OPEN** | SPK-ARC-014 | Cost model pending |
| RISK-ARC-014 | Live Sky complexity | **OPEN** | SPK-ARC-014 · 015 | Service sprawl risk |
| RISK-ARC-015 | Spectator load | **OPEN** | SPK-ARC-014 · QAS-009 | Caps pending |
| RISK-ARC-016 | Arabic search failure | **OPEN** | SPK-ARC-016 | Launch discovery risk |
| RISK-ARC-017 | RTL implementation drift | **OPEN** | SPK-ARC-002 | Arabic-first |
| RISK-ARC-018 | Inaccessible Labs | **OPEN** | SPK-ARC-017 | A11y |
| RISK-ARC-019 | Offline conflict | **OPEN** | SPK-ARC-006 | Save/resume |
| RISK-ARC-020 | Entitlement/progression coupling | **BLOCKING IMPLEMENTATION** | SPK-ARC-012 · DEC-160/163 | Pay-to-win path |
| RISK-ARC-021 | Trust privacy leakage | **BLOCKING LAUNCH** | SPK-ARC-013 · 024 · 025 | Non-public Trust |
| RISK-ARC-022 | Admin abuse | **OPEN** | SPK-ARC-019 | Privileged correction |
| RISK-ARC-023 | Moderation scaling | **OPEN** | SPK-ARC-013 | Ops capacity |
| RISK-ARC-024 | Reviewer scaling | **OPEN** | Evidence review deps | Org dependency |
| RISK-ARC-025 | Backup failure | **OPEN** | SPK-ARC-020 | Drill NOT RUN |
| RISK-ARC-026 | Restore failure | **OPEN** | SPK-ARC-020 | Drill NOT RUN |
| RISK-ARC-027 | Observability cost | **MONITORED** | SPK-ARC-022 | Cost watch |
| RISK-ARC-028 | Telemetry privacy | **OPEN** | SPK-ARC-022 | PII in logs |
| RISK-ARC-029 | Preview/production isolation failure | **BLOCKING IMPLEMENTATION** | SPK-ARC-021 · TECH-018 | Preview DB absent |
| RISK-ARC-030 | Migration safety | **OPEN** | SPK-ARC-011 · 020 | Schema later Gates |
| RISK-ARC-031 | Founder operational overload | **MONITORED** | Capacity assumptions | WIP constraint |
| RISK-ARC-032 | 92-screen routing sprawl | **OPEN** | SPK-ARC-004 | Shell composition |
| RISK-ARC-033 | Stale architecture documentation | **MONITORED** | Source map · freeze policies | Doc drift |
| RISK-ARC-039 | Identity-provider lock-in | **OPEN** | ADR-013 adapter | Vendor embed |
| RISK-ARC-040 | Recovery abuse / assurance bypass | **OPEN** | Recovery boundary | Support shortcut |
| RISK-ARC-041 | Session theft | **OPEN** | ADR-014 | Stolen cookie |
| RISK-ARC-042 | Privilege escalation | **OPEN** | ADR-015 | Role-only grants |
| RISK-ARC-043 | Malware/secret upload | **ACCEPTED WITH CONDITION** | SPK-ARC-008 fail-closed | Provider quality open |
| RISK-ARC-045 | Signed-URL / storage credential compromise | **OPEN** | Short TTL · isolation | Leak |
| RISK-ARC-046 | Audit tampering / excess PII | **OPEN** | SPK-ARC-019 | Mutable audit |
| RISK-ARC-047 | Minor public-profile leakage | **ACCEPTED WITH CONDITION** | SPK-ARC-025 · legal open | Private fields |
| RISK-ARC-048 | Saudi integration assumption | **OPEN** | OFFICIAL ACCESS NOT VERIFIED | False availability |
| RISK-ARC-049 | Legal retention uncertainty | **OPEN** | ADR-017 DRAFT | Wrong periods |
| RISK-ARC-050 | Spike confidence exceeding evidence | **OPEN** | PARTIAL gate messaging | False prod readiness |

## Explicit rule

Do **not** mark a risk **mitigated** merely because an ADR or spike PASS exists.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.1.0 | 2026-07-21 | GHV.ARCHITECTURE.1C — identity/evidence risks added; spike counts updated |
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §47 — architecture risks opened/monitored |
