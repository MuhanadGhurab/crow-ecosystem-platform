# GHV.IMPLEMENTATION.0E — Product Code Authorization

| Field | Value |
|-------|-------|
| **Authorization ID** | **GHV-IMP-AUTH-005** |
| **Gate** | GHV.IMPLEMENTATION.0E |
| **Date** | 2026-07-22 |
| **Branch** | `feat/ghuravia-foundation` |
| **Starting HEAD** | `e28b43a4451da9188069fdc630d52f8c8c1c4f31` |
| **Status** | **GRANTED** for Nest intro and readiness decision vertical slice |

## Authorized screens

| Screen | Scope |
|--------|-------|
| ONB-003 Nest Intro | **FULL** |
| ONB-004 Nest Assessment | **FULL LOCAL VERTICAL SLICE** |
| ONB-005 Nest Result | **FULL** |
| ONB-006 Nest Learning Path | **HANDOFF ONLY** |
| ONB-007 Choose Horizon | **HANDOFF ONLY** |

## Authorized technical scope

- Additive onboarding domain states and Nest readiness commands
- Additive contracts / API commands and resources
- Additive PostgreSQL migration (`0003_nest_readiness.sql` or equivalent)
- Deterministic synthetic readiness fixture catalogue v0.1.0 (local/test only)
- Assessment attempt/answer persistence; server-computed score and band
- Capability-gap calculation from incorrect items
- Server-authoritative screen guards; save/resume
- English and Arabic internal/test copy; accessibility
- Tests and implementation evidence; governance/baseline updates

## Explicitly not authorized

ONB-006 Missions · ONB-007 Horizon selection logic · Routes · eligibility/entitlements · Flight Plans · Evidence · Mastery · XP · Rank · Prestige · Trust calculations · Core Crow Lineage award/runtime · Cross-Wing Major · production content publication · real providers · AI-generated assessment at runtime · Preview/Staging/Production/deployment

## Consumption

This authorization is **consumed** only for the completed 0E Nest readiness slice. Broader Nest curriculum and Horizon selection require later Gates.
