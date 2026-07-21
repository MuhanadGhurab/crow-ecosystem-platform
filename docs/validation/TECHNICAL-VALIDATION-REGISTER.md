# Technical Validation Register

| Field | Value |
|-------|-------|
| **Status** | ACTIVE |
| **Version** | 1.2.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1A |

Items remain **NOT RUN** for runtime readiness unless noted. No final vendors selected. Screen-registry **documentation** checks below may be COMPLETE without authorizing Product Code.

```text
GHV.ARCHITECTURE.1A — Core Technical Validation Plan PASS / LOCKED
Technical Spikes Run = 0 (SPK-ARC-001…025 PLANNED · NOT RUN)
Technical Validation = NOT RUN
Product Code = BLOCKED
No stack ACCEPTED
```

Spike programme: [TECHNICAL-SPIKE-REGISTRY.md](../../architecture/ghuravia/validation/TECHNICAL-SPIKE-REGISTRY.md)

| ID | Topic | Candidate notes | Blocking for | Status |
|----|-------|-----------------|--------------|--------|
| TECH-001 | Identity provider and Keycloak | Keycloak-first candidate | Auth implementation | NOT RUN |
| TECH-002 | Passkeys and recovery | Passkey-first direction | A2 flows | NOT RUN |
| TECH-003 | Email and SMS providers | TBD | Activation | NOT RUN |
| TECH-004 | Payment provider | TBD; mada+wallets targets | Checkout | NOT RUN |
| TECH-005 | Recurring mada and wallet payments | Provider capability | Annual/monthly | NOT RUN |
| TECH-006 | Learning Graph query performance | Typed graph | Route unlock engine | NOT RUN |
| TECH-007 | Prisma and typed-SQL strategy | Candidates only | Data access | NOT RUN |
| TECH-008 | Save and Sync | Flight State | Resume | NOT RUN |
| TECH-009 | Offline drafts | Evidence/Mission drafts | Offline UX | NOT RUN |
| TECH-010 | Realtime participant channels | WS/SSE candidates | Live participate | NOT RUN |
| TECH-011 | Spectator scalability | Cap strategy | Live spectate | NOT RUN |
| TECH-012 | Object-storage security | S3-compatible candidate | Evidence uploads | NOT RUN |
| TECH-013 | AI-provider governance | Optional reco only | Reco engine | NOT RUN |
| TECH-014 | Saudi hosting | Pending residency guidance | Production hosting | NOT RUN |
| TECH-015 | Observability | OpenTelemetry candidate | Ops readiness | NOT RUN |
| TECH-016 | Backup and recovery | TBD | Launch readiness | NOT RUN |
| TECH-017 | RTO and RPO | TBD targets | Launch readiness | NOT RUN |
| TECH-018 | Preview database readiness | `DATABASE_URL`/`DIRECT_URL` absent for generic Preview and `feat/ghuravia-foundation`; Production present | GHV.ARCHITECTURE.1 Preview runtime | NOT RUN — inventoried in 1B |
| TECH-019 | Production/Preview env value isolation | Names inventoried; shared-scope secret names need professional value-level review without display | Safe Preview reuse | NOT RUN |
| SCR-001 | Screen-registry count validation | Active inventory = **92**; shells = **7** | Architecture planning integrity | **COMPLETE** (docs) — GHV.BASELINE-CORRECTION.1 |
| SCR-002 | Canonical-ID uniqueness | Duplicate IDs = 0 | Registry integrity | **COMPLETE** (docs) |
| SCR-003 | Shell-total reconciliation | 8+12+14+39+6+6+7=92 | Registry integrity | **COMPLETE** (docs) |
| SCR-004 | Activation-flow review (docs) | FLOW-001 uses ACT-003 → ACT-011; ACT-012 recovery | Journey integrity | **COMPLETE** (docs) · usability NOT RUN |
| SCR-005 | Email-verification state review (docs) | Pending + Result outcome set documented | Activation integrity | **COMPLETE** (docs) · tech NOT RUN |
| SCR-006 | Activation-recovery UX review | ACT-012 low-fi specified | Activation integrity | **COMPLETE** (docs) · usability NOT RUN |
| SCR-007 | Accessibility review (implementation) | ACT-003/011/012 | Controlled launch | **NOT RUN** |
| SCR-008 | Arabic RTL review (implementation) | ACT-003/011/012 | Controlled launch | **NOT RUN** |
| SCR-009 | Security review (runtime auth/email) | Activation assurance | Implementation | **NOT RUN** |
| SCR-010 | Usability review (activation) | Pending/Result/Recovery | Implementation waves | **NOT RUN** |
| SPK-ARC-001…025 | Architecture technical spikes (programme) | Priority P0=6 · P1=8 · P2=8 · P3=3 | Stack lock / implementation / launch | **PLANNED · NOT RUN** — code/db/deploy **DENIED** in 1A |

Evidence: [VERCEL-PRE-PUSH-VERIFICATION.md](../operations/VERCEL-PRE-PUSH-VERIFICATION.md) · [SCREEN-BASELINE-VALIDATION-REPORT.md](../../governance/corrections/SCREEN-BASELINE-VALIDATION-REPORT.md) · [GHV.ARCHITECTURE.1A.md](../../governance/gates/GHV.ARCHITECTURE.1A.md)
