# Scope Traceability Matrix

| Field | Value |
|-------|-------|
| **Status** | REVIEWED AT CAPABILITY LEVEL — GHV.FOUNDATION.1B |
| **Version** | 1.1.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.FOUNDATION.1B |

## Traceability chain

```text
Product Pillar
→ User Type
→ Journey Phase
→ Screen or State
→ Capability
→ Domain
→ Requirement
→ Test
→ Evidence
```

This Gate populates through **Capability**. Requirement placeholders appear only where already locked. Engineering tests are **not** invented here.

No Feature enters implementation without this chain.

## CONTROLLED LAUNCH Capability coverage

Every CONTROLLED LAUNCH Capability below maps to ≥1 Pillar, ≥1 user type, ≥1 journey phase, ≥1 screen family.

| Capability | Pillar | User type | Journey | Screen family | Domain | Locked requirement placeholder | Test | Evidence |
|------------|--------|-----------|---------|---------------|--------|--------------------------------|------|----------|
| CAP-ONB-001 | Learning | Visitor | Discover | PUB | Public | Present Constitution definition | TBD | Constitution |
| CAP-ONB-002 | Identity | Visitor/A0 | Activate | ACT | Identity | Registration creates A0 | TBD | Constitution §7 summary |
| CAP-ONB-003 | Trust | A0 | Activate | ACT | Identity | Email verify required for A1 | TBD | Constitution |
| CAP-ONB-004 | Trust | Email-verified | Activate | ACT | Trust | Current terms for activation | TBD | Constitution |
| CAP-ONB-005 | Trust | A1 | Activate | ACT | Trust | Mobile optional for ordinary learning | TBD | Constitution |
| CAP-ONB-006 | Identity | A1 | Personalize | IDN | Wingprint | Visual Identity ≠ Knowledge | TBD | Constitution |
| CAP-ONB-007 | Identity | A1 | Origin | ONB | Onboarding | Origin recorded | TBD | Journey |
| CAP-ONB-008 | Learning | A1 | Nest | ONB/LRN | Nest | 70/50 bands | TBD | Scope §3.5 |
| CAP-ONB-009 | Learning | A1 | Horizon/Route | ONB/WLD | Learning | Five Horizons visible | TBD | Scope |
| CAP-ONB-010 | Learning | Eligible | Flight Plan | ONB | Learning | Eligibility ≠ entitlement | TBD | Constitution integrity |
| CAP-LRN-003 | Learning | Learner | Missions | LRN | Learning | Mission progress + save | TBD | Scope MLGW |
| CAP-LRN-004 | Evidence | Learner | Missions | LRN | Learning | Assessment integrity direction | TBD | Scope |
| CAP-LRN-005 | Evidence | Learner | Evidence | LRN | Evidence | Evidence before Mastery | TBD | Constitution |
| CAP-LRN-006 | Learning | Eligible | Learning | LRN | Cross-Wing | One launch Cross-Wing; Atlas | TBD | Scope |
| CAP-LRN-007 | Trust/Learning | Eligible | Learning | LRN | Secure Ext | One launch Secure Extension | TBD | Scope |
| CAP-PRG-001–004,009,010 | Identity/Evidence | A1+ | Progression/Wings | PRG | Progression | Separation architecture | TBD | Constitution |
| CAP-EBUX-007 | Learning | A1+ | Skyboard | SKY | EBUX | Six modules; degraded mode | TBD | Scope Skyboard |
| CAP-EBUX-006 | Learning | Learner | Return | LRN/SKY | State | Recover saved work | TBD | MLGW #19 |
| CAP-SOC-001–004,007,008 | Community/Trust | A1+ | Community | COM/TRU | Rookery | No unrestricted DMs | TBD | Scope |
| CAP-SOC-005–006 | Community | Eligible | Live | LIV | Live Sky | One controlled Live experience | TBD | MLGW #16 |
| CAP-PAY-001–003,005,009 | Trust (enabling) | A1+ | Commercial | PAY | Commercial | Anti-pay-to-win | TBD | Constitution |
| CAP-TRU-001–005,011–013 | Trust | A1+/Admin | Activate/Return/Ops | TRU/ADM | Platform | Hidden UI ≠ authorization | TBD | Constitution |

Full Capability list and Scope statuses: [CAPABILITY-REGISTRY.md](./CAPABILITY-REGISTRY.md).

## Gaps intentionally open

| Item | Status |
|------|--------|
| Exact Route names | PENDING GHV.LEARNING.1 |
| Progression formulas | PENDING GHV.PROGRESSION.1 |
| Payment provider | PENDING TECHNICAL VALIDATION |
| Detailed engineering tests | Deferred to implementation Gates |
