# Threat Model Programme

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-SEC-TMP-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §32 |
| **Last updated** | 2026-07-21 |
| **Related** | [SECURITY-ARCHITECTURE-VALIDATION-PLAN.md](./SECURITY-ARCHITECTURE-VALIDATION-PLAN.md) |

```text
VALIDATION PLAN / PROGRAMME REGISTER
NOT RUN
DECISION PENDING
Future threat models listed — detailed exploit instructions NOT included
NO Product Code
```

## 1. Purpose

Register future threat models required before production readiness. Each model will document assets, actors, trust boundaries, threats, abuse cases, controls, validation evidence, residual risk, owner, and required Gate. **None are executed in 1A.**

## 2. Future threat model catalogue

| ID | Model | Assets (summary) | Actors | Trust boundaries | Threat themes (non-exhaustive) | Abuse cases | Controls (conceptual) | Validation evidence | Residual risk | Owner | Required Gate |
|----|-------|------------------|--------|------------------|--------------------------------|-------------|-------------------------|---------------------|---------------|-------|---------------|
| TM-01 | Identity and Activation | Credentials, tokens, activation state | Attacker, user, support | Public ↔ IdP ↔ app | Account takeover, token replay, activation skip | Fake verify; support social engineering | Server activation; step-up; audit | SPK-ARC-003 | Medium until spike | Founder | 1C / identity |
| TM-02 | Learning and Mission Runtime | Mission state, eligibility | Learner, cheater | Client ↔ API ↔ catalogue | Eligibility bypass, state tampering | Skip prerequisites via API | Server eligibility; explainable locks | SPK-ARC-005 · 006 | Medium | Founder | 1D runtime |
| TM-03 | Evidence Upload and Review | Objects, metadata, reviews | Learner, malware, rogue reviewer | Browser ↔ API ↔ object store ↔ scanners | Malware, secret exfil, reviewer leak | Upload malware; steal peer Evidence | Scan; quarantine; signed URL; SoD | SPK-ARC-007 · 008 | High until proven | Founder | Evidence spike Gate |
| TM-04 | Progression and Formula Decisions | Events, ledgers, formulas | Cheater, insider | API ↔ event log ↔ ledgers | Double XP, formula tamper | Duplicate events; silent FRM rewrite | Idempotency; versioned formulas; audit | SPK-ARC-010 · 011 | Medium | Founder | Progression tech |
| TM-05 | Community and Moderation | Posts, cases, Trust | Abuser, rogue mod | Public ↔ API ↔ mod tools | Spam, harassment, mod abuse | Mass report; silent ban without audit | Rate limits; audited actions; appeals | SPK-ARC-013 | Medium | Founder | Community |
| TM-06 | Live Sky | Live state, contributions | Participant, spectator, bot | Client ↔ realtime ↔ API | Spoof results, flood, spectate leak | Duplicate credit; phase desync | Server clock; dedupe; spectator filters | SPK-ARC-014 · 015 | Medium–High | Founder | Live |
| TM-07 | Payments and Entitlements | Webhooks, entitlements, invoices | Attacker, payer | Provider ↔ webhook ↔ entitlement | Replay webhook, privilege via pay | Buy Mastery (must fail) | Signature verify; entitlement-only | SPK-ARC-012 | High if weak | Founder | Commercial |
| TM-08 | Administration | Admin powers, config | Insider, compromised admin | Admin UI ↔ APIs | Break-glass abuse | Silent standing edit | SoD; dual control; audit | SPK-ARC-019 | Medium | Founder | Admin |
| TM-09 | Integrations | Adapter creds, Saudi readiness connectors | Third party | Integration ↔ core | Over-scoped tokens | Data siphon | Least privilege adapters; mocks | Integrations plan | Unknown | Founder | Post-readiness |
| TM-10 | Observability and Support | Logs, traces, support views | Insider, attacker | Telemetry pipeline | PII leakage via logs | Support over-access | Redaction; access control | SPK-ARC-022 | Medium | Founder | Ops |

## 3. Execution rules

* Produce each model in a later Gate with evidence — do not invent exploit PoCs.
* Residual risk must be explicit; “unknown” is allowed.
* Link controls to spikes; do not claim mitigated without evidence.

## 4. Limitations

```text
PROGRAMME ONLY · ALL MODELS NOT RUN · DECISION PENDING
```

## 5. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §32 — threat model programme register |
