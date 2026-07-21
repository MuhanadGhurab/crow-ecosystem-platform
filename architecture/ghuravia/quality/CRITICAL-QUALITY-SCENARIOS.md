# Critical Quality Scenarios

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-QAS |
| **Version** | 0.1.0 |
| **Status** | **VALIDATION PLAN** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §13 |
| **Last updated** | 2026-07-21 |
| **Limitations** | Scenarios define **what to prove** · spikes/tests **NOT RUN** · pass/fail evidence **DECISION PENDING** · not production SLOs |

```text
QAS REGISTER — VALIDATION PLAN
NOT RUN
NOT TECHNICALLY VALIDATED
```

Each scenario: stimulus, environment, response, draft measure, domains, principles, gate, blocking.

---

## QAS-001 — Resume Active Mission

| Field | Content |
|-------|---------|
| **Stimulus** | Learner returns after interruption mid-mission |
| **Environment** | Authenticated; prior checkpoint accepted |
| **Expected response** | Resume from valid saved state; accepted progress retained |
| **Draft measure** | 0 loss of accepted checkpoints after resume (**DRAFT · NOT SLO**) |
| **Domains** | Mission Runtime, Nest, Flight Log |
| **Principles** | P-08, P-10 |
| **Gate** | 1D/1E |
| **Blocking** | Hard before Mission Product Code |
| **Status** | **NOT RUN** |

## QAS-002 — Evidence Upload Failure

| Field | Content |
|-------|---------|
| **Stimulus** | Large Evidence artifact fails mid-upload; client retries |
| **Environment** | Object storage + Evidence module; at-least-once client |
| **Expected response** | Retry does not duplicate artifact or approval workflow |
| **Draft measure** | Single Evidence ID / single review item after N retries (**DRAFT · NOT SLO**) |
| **Domains** | Evidence, Integration Gateway, Review |
| **Principles** | P-11, P-18 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-003 — Evidence Revocation

| Field | Content |
|-------|---------|
| **Stimulus** | Accepted Evidence revoked |
| **Environment** | Downstream Mastery / Route-Proven derived |
| **Expected response** | Only affected Mastery and Route-Proven recalculated |
| **Draft measure** | Unrelated learner graphs unchanged; scoped invalidation log exists (**DRAFT · NOT SLO**) |
| **Domains** | Evidence, Learning Graph, Progression, Achievements |
| **Principles** | P-02, P-13 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-004 — Duplicate Progression Event

| Field | Content |
|-------|---------|
| **Stimulus** | Same progression event delivered twice |
| **Environment** | Idempotent consumer required |
| **Expected response** | No duplicate XP, Momentum, or Achievements |
| **Draft measure** | Second apply is no-op; ledger shows one effect (**DRAFT · NOT SLO**) |
| **Domains** | Progression, Achievements |
| **Principles** | P-11, P-10 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-005 — Email Verification Delay

| Field | Content |
|-------|---------|
| **Stimulus** | Email provider delay after signup |
| **Environment** | ACT-003 Pending visible; activation incomplete |
| **Expected response** | Pending state remains understandable; no fake “activated” |
| **Draft measure** | UI/state = Pending until server verification result; resend path available (**DRAFT · NOT SLO**) |
| **Domains** | Identity and Activation, Notifications |
| **Principles** | P-08, P-17 |
| **Screens** | ACT-003 · ACT-011 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-006 — Activation Recovery

| Field | Content |
|-------|---------|
| **Stimulus** | Learner enters recovery after partial activation friction |
| **Environment** | Some gates already satisfied (e.g., email verified, terms, risk) |
| **Expected response** | Completed valid gates preserved; resume remaining gates only |
| **Draft measure** | No reset of satisfied `email_verified` / terms / `account_risk_status` without audit (**DRAFT · NOT SLO**) |
| **Domains** | Identity and Activation, Support |
| **Principles** | P-08, P-10 |
| **Screens** | ACT-012 · ACT-005 · ACT-013 · ACT-006 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-007 — Payment Success, Webhook Delay

| Field | Content |
|-------|---------|
| **Stimulus** | Provider charges successfully; webhook delayed |
| **Environment** | Payments + Entitlements |
| **Expected response** | Entitlement eventually reconciled; **no** progression value granted |
| **Draft measure** | Entitlement true after reconcile; XP/Crests delta = 0 from payment path (**DRAFT · NOT SLO**) |
| **Domains** | Payments, Entitlements, Progression |
| **Principles** | P-03, P-11, P-18 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-008 — Live Sky Reconnect

| Field | Content |
|-------|---------|
| **Stimulus** | Participant disconnects and reconnects during live session |
| **Environment** | Live Sky realtime candidate |
| **Expected response** | Session continuity without duplicate contribution credit |
| **Draft measure** | Contribution credit count += 0 on reconnect-only (**DRAFT · NOT SLO**) |
| **Domains** | Live Sky, Progression (if credited) |
| **Principles** | P-11, P-17 |
| **Gate** | 1D/1E |
| **Blocking** | Hard for credit integrity |
| **Status** | **NOT RUN** |

## QAS-009 — Spectator Load

| Field | Content |
|-------|---------|
| **Stimulus** | Large spectator traffic on Live Sky |
| **Environment** | Shared infrastructure candidate |
| **Expected response** | Participant-critical actions stay within draft latency budget |
| **Draft measure** | Participant action p95 inflation **≤ 20%** under spectator spike lab (**DRAFT · NOT SLO**) |
| **Domains** | Live Sky |
| **Principles** | P-17, P-22 |
| **Gate** | 1D/1E |
| **Blocking** | Soft |
| **Status** | **NOT RUN** |

## QAS-010 — Arabic RTL Mission

| Field | Content |
|-------|---------|
| **Stimulus** | Arabic UI mission containing LTR code, IPs, commands |
| **Environment** | Arabic-first client |
| **Expected response** | Layout remains readable; tokens not mangled |
| **Draft measure** | Checklist pass on N representative missions (**DRAFT · NOT SLO**) |
| **Domains** | Mission Runtime, Public/Nest UI |
| **Principles** | P-06 |
| **Gate** | 1B/1D |
| **Blocking** | Hard for Arabic surfaces |
| **Status** | **NOT RUN** |

## QAS-011 — Reduced Motion

| Field | Content |
|-------|---------|
| **Stimulus** | User prefers reduced motion |
| **Environment** | Core shells |
| **Expected response** | Equivalent functionality without motion-heavy transitions |
| **Draft measure** | No information solely in animation; controls remain operable (**DRAFT · NOT SLO**) |
| **Domains** | Frontend experience (all shells) |
| **Principles** | P-07 |
| **Gate** | 1B/1D |
| **Blocking** | Soft→Hard pre-launch |
| **Status** | **NOT RUN** |

## QAS-012 — Trust Restriction

| Field | Content |
|-------|---------|
| **Stimulus** | Moderator applies restriction |
| **Environment** | Trust / Community |
| **Expected response** | Restriction applied, explained to user, appealable; internals not leaked |
| **Draft measure** | User sees reason class + appeal entry; admin rationale in audit only (**DRAFT · NOT SLO**) |
| **Domains** | Moderation and Trust, Audit, Support |
| **Principles** | P-08, P-12 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-013 — Progression Formula Version Change

| Field | Content |
|-------|---------|
| **Stimulus** | New formula version published |
| **Environment** | Historical events stamped with prior version |
| **Expected response** | Historical records reproducible under original formula version |
| **Draft measure** | Replay of old events with vN yields identical derived fields (**DRAFT · NOT SLO**) |
| **Domains** | Progression |
| **Principles** | P-13, P-25 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-014 — Object Storage Compromise Boundary

| Field | Content |
|-------|---------|
| **Stimulus** | Attacker obtains Evidence object-storage credentials |
| **Environment** | Separated secret domains |
| **Expected response** | Credentials cannot authorize core application administration |
| **Draft measure** | Threat review: storage principal lacks admin/API mutate on ledgers (**DRAFT · NOT SLO**) |
| **Domains** | Evidence, Integration Gateway, Administration |
| **Principles** | P-04, P-16 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-015 — Provider Outage

| Field | Content |
|-------|---------|
| **Stimulus** | Non-critical external provider outage |
| **Environment** | Launch dependencies |
| **Expected response** | Graceful degradation; no invented progress/approvals |
| **Draft measure** | Degraded banner/mode; integrity invariants hold (**DRAFT · NOT SLO**) |
| **Domains** | Integration Gateway + dependent UX |
| **Principles** | P-17 |
| **Gate** | 1D/1E |
| **Blocking** | Soft (Hard if integrity breaks) |
| **Status** | **NOT RUN** |

## QAS-016 — Database Unavailable

| Field | Content |
|-------|---------|
| **Stimulus** | Primary datastore unreachable |
| **Environment** | Write paths |
| **Expected response** | Writes fail safely; no fabricated progress or approvals |
| **Draft measure** | API returns controlled failure; no client-side “success” awards (**DRAFT · NOT SLO**) |
| **Domains** | All writers |
| **Principles** | P-10, P-17 |
| **Gate** | 1D/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-017 — Search Degraded

| Field | Content |
|-------|---------|
| **Stimulus** | Search index/provider down |
| **Environment** | Nest / Catalogue browsing |
| **Expected response** | Core journey remains usable without search |
| **Draft measure** | Browse/continue paths succeed; search shows degraded state (**DRAFT · NOT SLO**) |
| **Domains** | Search, Nest, Catalogue |
| **Principles** | P-17 |
| **Gate** | 1D/1E |
| **Blocking** | Soft |
| **Status** | **NOT RUN** |

## QAS-018 — Notification Failure

| Field | Content |
|-------|---------|
| **Stimulus** | Notification provider fails to deliver |
| **Environment** | After a real domain state change |
| **Expected response** | Underlying business state unchanged by delivery failure |
| **Draft measure** | State machine independent of notify ack (**DRAFT · NOT SLO**) |
| **Domains** | Notifications vs source domains |
| **Principles** | P-17, P-11 |
| **Gate** | 1D/1E |
| **Blocking** | Hard for state coupling bugs |
| **Status** | **NOT RUN** |

## QAS-019 — Minor Public Profile

| Field | Content |
|-------|---------|
| **Stimulus** | Public view of a minor learner’s progression |
| **Environment** | Public / Community surfaces |
| **Expected response** | Crow identity only; no private identity or exact age |
| **Draft measure** | Public DTO field allowlist audit pass (**DRAFT · NOT SLO**) |
| **Domains** | Account and Assurance, Community, Nest |
| **Principles** | P-05 |
| **Gate** | 1C |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

## QAS-020 — Moderator or Admin Correction

| Field | Content |
|-------|---------|
| **Stimulus** | Privileged correction to user state or awards |
| **Environment** | Admin / Moderation tools |
| **Expected response** | Requires authorization, reason, and audit trail |
| **Draft measure** | Missing reason ⇒ reject; audit has actor/reason/before/after (**DRAFT · NOT SLO**) |
| **Domains** | Administration, Moderation, Audit, Progression/Evidence as targets |
| **Principles** | P-12, P-04 |
| **Gate** | 1C/1E |
| **Blocking** | Hard |
| **Status** | **NOT RUN** |

---

## Coverage map

| Theme | QAS |
|-------|-----|
| Mission / save | 001 |
| Evidence | 002, 003, 014 |
| Progression integrity | 004, 013 |
| Activation | 005, 006 |
| Commercial vs progression | 007 |
| Live Sky | 008, 009 |
| Arabic / a11y | 010, 011 |
| Trust / privacy / admin | 012, 019, 020 |
| Degradation / durability | 015, 016, 017, 018 |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Complete QAS-001…020 under GHV.ARCHITECTURE.1A |
