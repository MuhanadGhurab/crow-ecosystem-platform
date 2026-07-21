# GHV.VALIDATION.1A — External Technical Validation Workspace

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.VALIDATION.1A |
| **Workspace path** | `validation/ghuravia/external-1a/` |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `6845688c0fd97680075f1d83ae1cd87b5a2d1352` |
| **Upstream baseline** | GHURAVIA Architecture Design Baseline **v1.0.0 — LOCKED** |

## Purpose

This directory is the **governed validation workspace** for Gate **GHV.VALIDATION.1A**. It holds documentation, evidence indexes, condition tracking, and domain report placeholders for **external technical validation** — provider sandboxes, Preview environment proof, legal clearance tracking, user-validation scheduling, and security programme evidence.

This workspace is **NOT Product Code**. It does not implement GHURAVIA features, runtime services, or production configuration.

## NON-PRODUCT CODE declaration

```text
┌─────────────────────────────────────────────────────────────────┐
│  THIS WORKSPACE IS VALIDATION DOCUMENTATION ONLY                │
│                                                                 │
│  ✗ No Product Code (apps/, src/ product implementation)         │
│  ✗ No root package.json for GHURAVIA product                    │
│  ✗ No schemas, migrations, or database DDL                      │
│  ✗ No .env files or committed credentials                       │
│  ✗ No fabricated sandbox PASS results                           │
│                                                                 │
│  ✓ Architecture Design Baseline v1.0.0 remains LOCKED           │
│  ✓ Product Code: BLOCKED                                        │
│  ✓ Implementation Authorization: NOT GRANTED                    │
└─────────────────────────────────────────────────────────────────┘
```

## Safety rules

1. **Do not fabricate evidence.** Where Preview `DATABASE_URL` / `DIRECT_URL` are absent and provider sandbox credentials are unavailable, reports must state **NOT AVAILABLE** or **NOT ESTABLISHED** — never imply PASS from documentation review alone.
2. **Do not mutate the Architecture Design Baseline** without a governed change class under [ARCHITECTURE-CHANGE-FREEZE-POLICY.md](../../architecture/ghuravia/governance/ARCHITECTURE-CHANGE-FREEZE-POLICY.md).
3. **Do not authorize Product Code** from this Gate. Closing validation conditions requires real external proof per [EXTERNAL-VALIDATION-CONDITION-REGISTER.md](./EXTERNAL-VALIDATION-CONDITION-REGISTER.md).
4. **Do not run validation against Production** for exploratory or sandbox purposes. Production **EXISTS** but **VALIDATION PROHIBITED** unless explicitly authorized under operational runbooks.
5. **Adapter locked ≠ vendor chosen.** Provider deferrals remain deferrals until sandbox evidence is filed.
6. **Historical spike harness results** may be cited as architecture-era evidence only; they do not substitute for external validation at scale or on real infra.

## Authoritative inputs

| Document | Role |
|----------|------|
| [GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md](../../architecture/ghuravia/governance/GHURAVIA-ARCHITECTURE-BASELINE-MANIFEST.md) | Locked baseline identity |
| [FINAL-ARCHITECTURE-CONDITION-REGISTER.md](../../architecture/ghuravia/governance/FINAL-ARCHITECTURE-CONDITION-REGISTER.md) | Conditions COND-001…032 |
| [FINAL-PROVIDER-DEFERRAL-REGISTER.md](../../architecture/ghuravia/governance/FINAL-PROVIDER-DEFERRAL-REGISTER.md) | Provider deferral integrity |
| [EXTERNAL-TECHNICAL-VALIDATION-HANDOFF.md](../../architecture/ghuravia/governance/EXTERNAL-TECHNICAL-VALIDATION-HANDOFF.md) | Programme handoff from 1E |
| [IMPLEMENTATION-AUTHORIZATION-BOUNDARY.md](../../architecture/ghuravia/governance/IMPLEMENTATION-AUTHORIZATION-BOUNDARY.md) | Product Code boundary |

## Structure map

```text
validation/ghuravia/external-1a/
├── README.md                              ← This file
├── VALIDATION-EVIDENCE-INDEX.md           ← Master index of domain reports
├── BASELINE-ENTRY-VERIFICATION.md         ← Entry gate: baseline availability
├── OFFICIAL-SOURCE-REGISTER.md            ← Official docs (documentation-only)
├── ENVIRONMENT-AVAILABILITY-MATRIX.md     ← Local / Preview / Staging / Prod
├── PROVIDER-ACCESS-MATRIX.md              ← Provider credential & sandbox status
├── EXTERNAL-VALIDATION-CONDITION-REGISTER.md ← COND-001…032 @ Validation.1A
│
├── database/                 ← Relational datastore host (COND-032, TECH-018)
├── identity/                 ← IdP sandbox (COND-009)
├── contact/                  ← Email / mobile verification (COND-010)
├── payments/                 ← Payment processor pattern validation
├── evidence-storage/         ← Object storage isolation (COND-011)
├── evidence-scanning/        ← Scanner vendor benchmark (COND-012)
├── realtime/                 ← Live Sky transport (COND-016)
├── search/                   ← Search corpus / FTS scale (COND-017)
├── notifications/            ← Notification deliverability (COND-018)
├── observability/            ← APM / telemetry (COND-019)
├── hosting/                  ← Preview/Production isolation (COND-022)
├── security/                 ← Penetration testing (COND-028)
├── accessibility/            ← Manual / user a11y review (COND-008)
├── localization/             ← Arabic typography / mixed-script (COND-007)
├── performance/              ← Skyboard load budget (COND-021)
├── backup-restore/           ← DR drill / RPO-RTO (COND-020)
├── migration-rollback/       ← Production migration ownership (COND-026)
├── privacy-legal/            ← Retention, minor policy, Nafath (COND-013,014,023,029)
└── governance/               ← Programme tracking, gate artefacts
```

Each domain subdirectory contains **VALIDATION-QUESTION.md**, **TEST-PLAN.md**, **RESULT.md**, **commands.txt**, and domain-specific evidence reports — indexed in [VALIDATION-EVIDENCE-INDEX.md](./VALIDATION-EVIDENCE-INDEX.md) and [FINAL-PROVIDER-VALIDATION-MATRIX.md](./FINAL-PROVIDER-VALIDATION-MATRIX.md).

## Programme state at workspace open

| Dimension | State |
|-----------|-------|
| Architecture Design Baseline | **LOCKED v1.0.0** |
| External validation | **FILED (documentation phase)** — domain reports honest NOT AVAILABLE / DOC-ONLY |
| Preview environment | **NOT ESTABLISHED** — `DATABASE_URL` / `DIRECT_URL` absent; TECH-018 OPEN |
| Provider sandboxes | **NOT AVAILABLE** — credentials absent |
| Product Code | **BLOCKED** |
| Implementation Authorization | **NOT GRANTED** |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | GHV.VALIDATION.1A — initial validation workspace scaffold |
