# Architecture Dependency Register

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-DEP-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §48 |
| **Last updated** | 2026-07-21 |
| **Project mirror** | Also mirrored into `governance/dependencies/DEPENDENCY-REGISTER.md` as DEP-079+ |

```text
Dependencies remain Planned / Blocked as noted
Satisfying a plan document does NOT satisfy technical dependencies
```

## Dependencies (Gate §48)

| ID | Dependency | Status | Blocks | Related |
|----|------------|--------|--------|---------|
| DEP-ARC-001 | Stack selection (1B) | Planned | Implementation shape | DEC-165 · ADR-ARC-001/002 |
| DEP-ARC-002 | Identity provider evaluation | Planned | Auth implementation | SPK-ARC-003 · TECH-001 |
| DEP-ARC-003 | Payment provider evaluation | Planned | Paid plans | SPK-ARC-012 · TECH-004 |
| DEP-ARC-004 | Object storage | Planned | Evidence uploads | SPK-ARC-007 · TECH-012 |
| DEP-ARC-005 | Scanning (malware/secrets) | Planned | Evidence acceptance | SPK-ARC-008 |
| DEP-ARC-006 | Email provider | Planned | Activation | TECH-003 · SPK-ARC-003 |
| DEP-ARC-007 | Mobile verification provider | Planned | Optional mobile path | TECH-003 |
| DEP-ARC-008 | Realtime capability | Planned | Live Sky depth | SPK-ARC-014 · 015 |
| DEP-ARC-009 | Search capability | Planned | Discovery | SPK-ARC-016 |
| DEP-ARC-010 | Observability stack | Planned | Ops readiness | SPK-ARC-022 · TECH-015 |
| DEP-ARC-011 | Privacy review | Planned | Launch | Privacy baseline |
| DEP-ARC-012 | Legal age review | Planned | Minor surfaces | SPK-ARC-025 |
| DEP-ARC-013 | Accessibility review | Planned | Controlled launch | SPK-ARC-017 |
| DEP-ARC-014 | Arabic technical review | Planned | Launch UX | SPK-ARC-002 · 016 |
| DEP-ARC-015 | Security threat models | Planned | Sensitive ADRs | Security validation plans |
| DEP-ARC-016 | Preview database (TECH-018) | Blocked | Preview runtime | SPK-ARC-021 · RISK-ARC-029 |
| DEP-ARC-017 | Deployment-environment approval | Planned | Safe Preview/Prod | SPK-ARC-021 |
| DEP-ARC-018 | Technical-spike authorization | Planned | Running SPK-ARC-* | DEC-164 · 1E |
| DEP-ARC-019 | Later Product Code authorization | Blocked | Implementation | DEC-166 · after 1E |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §48 — architecture dependencies |

## 1C additions

See global DEPENDENCY-REGISTER DEP-090..094. Source Gate GHV.ARCHITECTURE.1C.

## 1D additions

See global registers updated under Source Gate GHV.ARCHITECTURE.1D. Spikes 25/25 complete; external validation open.
