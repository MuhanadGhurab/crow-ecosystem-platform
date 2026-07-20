# Scope Traceability Matrix

| Field | Value |
|-------|-------|
| **Status** | REVIEWED AT CAPABILITY + WIREFRAME LEVEL — GHV.PRODUCT-DEFINITION.3 |
| **Version** | 1.2.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.PRODUCT-DEFINITION.3 |
| **Related** | [CAPABILITY-REGISTRY.md](./CAPABILITY-REGISTRY.md) · [WIREFRAME-REGISTRY.md](./wireframes/WIREFRAME-REGISTRY.md) · [CRITICAL-FLOWS.md](./interactions/CRITICAL-FLOWS.md) |

## Traceability chain

```text
Product Pillar
→ User Type
→ Journey Phase
→ Screen or State
→ Wireframe
→ Capability
→ Domain
→ Requirement
→ Test
→ Evidence
```

PD.3 populates through **Wireframe**. Engineering tests remain TBD.

## CONTROLLED LAUNCH → Wireframe mapping (summary)

| Capability group | Screens | Wireframe pack | Critical flows |
|------------------|---------|----------------|----------------|
| CAP-ONB-* | PUB/ACT/IDN/ONB | public, activation, identity, onboarding | FLOW-001 |
| CAP-LRN-* | LRN/WLD | learning, core/world | FLOW-002/003 |
| CAP-PRG-* | PRG | progression | FLOW-002 |
| CAP-EBUX-* | SKY | core + Skyboard variants | FLOW-006/007 |
| CAP-SOC-* | COM/LIV | community, live | FLOW-009–012 |
| CAP-PAY-* | PAY | commercial | FLOW-004/005/013/014 |
| CAP-TRU-* | TRU/IDN-005 | account | FLOW-015/016 |

Every controlled-launch user-facing Capability maps to ≥1 Pillar, user type, journey, screen family, and wireframe (or family). See Capability Registry + Wireframe Registry for IDs.

## Gaps intentionally open

| Item | Status |
|------|--------|
| Exact Route names | PENDING GHV.LEARNING.1 |
| Progression formulas | PENDING GHV.PROGRESSION.1 |
| Payment provider | PENDING TECHNICAL VALIDATION |
| Usability tests | PLANNED — NOT RUN |
| Detailed engineering tests | Deferred to implementation Gates |
