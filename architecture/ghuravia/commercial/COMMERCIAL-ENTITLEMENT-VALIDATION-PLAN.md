# Commercial and Entitlement Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-COM-ENT-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §25 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-012 |
| **Related** | SCOPE commercial baseline · TRANSACTION-CONSISTENCY-MAP · AUTHORIZATION-VALIDATION-PLAN |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO payment provider brand lock without evidence
NO Product Code
```

## 1. Hard lock (non-negotiable)

```text
Commercial Event  →  Entitlement change only
Commercial Event  ↛  Progression value
```

Payment, webhook, refund, chargeback, Merit Grant issuance, and plan changes must **never** write XP, Momentum, Mastery, Breadth, Prestige, Trust standing, or Learning Graph prerequisite satisfaction.

## 2. Plans and commercial surfaces to validate

| Surface | Notes |
|---------|-------|
| Open Flight | Base access |
| Flight Pass / Wing Pass / Expedition Pass | Tiered access concurrency |
| Annual plans | Renewal / expiry |
| VAT-inclusive presentation | Display rules; legal TBD |
| Merit Grants | Entitlement only |
| Route access / concurrency | Entitlement gates |
| Expiry / renewal / grace / cancellation | State machine |
| Payment success / failure | UX + reconcile |
| Webhook delay / duplicate webhook | Idempotent reconcile |
| Refund / chargeback | Entitlement revoke/adjust |
| Invoice | Finance records |
| Entitlement recalculation | Access projection rebuild |

## 3. Consistency expectations

| Case | Behavior |
|------|----------|
| Payment success, webhook delay | Pending reconcile; no silent entitlement; no progression side effects |
| Duplicate webhook | Single entitlement effect (`pay_reconcile:{provider_event_id}`) |
| Refund | Entitlement downshift; progression unchanged |
| QAS-007 | Explicit quality scenario — must pass in later Gates |

## 4. Provider substitution

Evaluate Saudi payment requirements and provider substitution via adapter boundary. Brands remain **CANDIDATE** until spike evidence (see BUILD-VS-BUY-REGISTER).

## 5. Spike

| Spike | Focus |
|-------|-------|
| SPK-ARC-012 | Webhook idempotency + entitlement reconciliation + progression neutrality test |

## 6. Limitations

```text
VALIDATION PLAN ONLY · SPIKES NOT RUN · DECISION PENDING
Not tax/legal advice
```

## 7. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §25 — commercial entitlement validation plan |
