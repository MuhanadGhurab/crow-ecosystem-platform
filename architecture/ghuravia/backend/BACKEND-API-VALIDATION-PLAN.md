# Backend and API Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-BE-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §15 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-003 · SPK-ARC-009 · SPK-ARC-010 · SPK-ARC-011 · SPK-ARC-012 · SPK-ARC-018 · SPK-ARC-019 |
| **Related** | [TRANSACTION-CONSISTENCY-MAP.md](../data/TRANSACTION-CONSISTENCY-MAP.md) · Progression Design Baseline v1.0.0 |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO Product Code · NO endpoint catalogue · NO schema
≠ TECHNICALLY VALIDATED · ≠ API LOCKED
```

## 1. Purpose

Plan validation of backend modular boundaries and interaction styles so that governed Learning, Progression, Activation, Evidence, Commercial, and Trust rules can be enforced server-side.

## 2. Interaction styles to evaluate

| Style | Typical use | Consistency expectation |
|-------|-------------|-------------------------|
| Synchronous request/response | Activation steps, reads, commands needing immediate ACK | Strong where mapped in consistency map |
| Asynchronous events | Progression publication, notifications fan-out | Eventual with idempotent consumers |
| Background jobs | Scanning, recalculation, reconciliation | Idempotent · retry · dead-letter |
| Realtime channels | Live Sky participant/spectator | See live plan — provider undecided |
| Administrative commands | Corrections, appeals, break-glass | Strong · audited · human-reviewed where required |

## 3. Assessment surfaces

| Surface | Validation question | Spike |
|---------|---------------------|-------|
| Modular boundaries | Domains isolatable without early microservices | SPK-ARC-001 |
| API style | Resource vs command APIs; versioning strategy | SPK-ARC-001 |
| CQRS where useful | Read models for Skyboard vs write ledgers | SPK-ARC-010 · SPK-ARC-023 |
| Transaction boundaries | Per [TRANSACTION-CONSISTENCY-MAP.md](../data/TRANSACTION-CONSISTENCY-MAP.md) | SPK-ARC-010 |
| Idempotency | Duplicate keys must not double-apply | SPK-ARC-010 · SPK-ARC-012 |
| Event publication / replay | Replay safe; formula version preserved | SPK-ARC-011 |
| Formula-version evaluation | Standing writes carry FRM/POL version | SPK-ARC-011 |
| Authorization | Authn ≠ activation ≠ authz ≠ entitlement ≠ eligibility ≠ trust | SPK-ARC-003 |
| Audit | Privileged corrections queryable | SPK-ARC-019 |
| Rate limiting | Abuse and Live Sky / community | SPK-ARC-013 · SPK-ARC-015 |
| Validation / error contracts | Stable codes; Arabic + English messages | SPK-ARC-002 |
| Background / scheduled work | Jobs vs inline | SPK-ARC-009 |
| Provider webhooks | Commercial idempotency | SPK-ARC-012 |
| Retries / dead-letter | Failure isolation | SPK-ARC-018 |
| Operational tooling | Support diagnostics privacy-safe | SPK-ARC-022 |
| Testing | Contract + property tests for idempotency | SPK-ARC-010 |

## 4. Consistency classification (interaction-level)

| Must be… | Examples (conceptual) |
|----------|------------------------|
| Strongly consistent | Activation completion formula; entitlement grant after payment reconcile; Trust restriction apply |
| Eventually consistent | Notification delivery; search index; Skyboard projection refresh |
| Idempotent | Progression event apply; webhook handle; Evidence scan result write |
| Replayable | Progression events with formula version; audit stream |
| Human-reviewed | Evidence approval (where required); Prestige panel; appeals |
| Audited | Admin correction; entitlement grant; moderation action; Trust change |

## 5. Explicit prohibitions

* Do **not** publish a full endpoint catalogue in 1A.
* Do **not** create runtime services or Product Code.
* Do **not** select API gateway / queue / broker brands without evidence.
* Failed notification or search index lag must **not** rewrite business state (see notifications & search plans).

## 6. Pass / fail (future Spike evidence)

| Criterion | Pass | Fail |
|-----------|------|------|
| Idempotency | Duplicate command/event → single business effect | Double XP / double entitlement |
| Activation authority | Server state drives UI | Client-only activation |
| Commercial neutrality | Commercial event → entitlement only | Commercial event alters XP/Mastery |
| Formula history | Historical standing reproducible | Silent rewrite on FRM bump |

## 7. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
```

## 8. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §15 — initial validation plan |
