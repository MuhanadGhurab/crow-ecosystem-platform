# GHV.IMPLEMENTATION.0B — Product Code Authorization Record

| Field | Value |
|-------|-------|
| **Authorization ID** | **GHV-IMP-AUTH-002** |
| **Authorized Gate** | **GHV.IMPLEMENTATION.0B** |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Starting HEAD** | `ca9fa84a056c9ba6bc03a1e9de6c082cbb82cd33` |
| **Authorized Branch** | `feat/ghuravia-foundation` |
| **Preflight** | [IMPLEMENTATION-0B-ACTIVATION-AUTHORITY-PREFLIGHT.md](./IMPLEMENTATION-0B-ACTIVATION-AUTHORITY-PREFLIGHT.md) — **PASS** |

## Pre-code verdict

```text
PASS — LIMITED GHURAVIA ACTIVATION VERTICAL SLICE AUTHORIZED
```

## Authorization

```text
Authorization ID:
GHV-IMP-AUTH-002

Authorized Gate:
GHV.IMPLEMENTATION.0B

Authorization Scope:
Foundation runtime and activation vertical slice

Authorized Branch:
feat/ghuravia-foundation

Authorized Data:
Synthetic only

Authorized Database:
Disposable local PostgreSQL only

Authorized Providers:
Mocks only

Authorized Deployment:
None
```

## Authorized activation surfaces

```text
ACT-003  Email Verification Pending
ACT-011  Email Verification Result
ACT-005  Accept Mandatory Terms (formula-required)
ACT-013  Accept Account Risk
ACT-012  Activation Recovery
ACT-006  Basic Account Activated (success surface)
```

Path mapping (registry has no URL field; documented for 0B):

| ID | Path |
|----|------|
| ACT-003 | `/activation/email-pending` |
| ACT-011 | `/activation/email-result` |
| ACT-005 | `/activation/terms` |
| ACT-013 | `/activation/account-risk` |
| ACT-012 | `/activation/recovery` |
| ACT-006 | `/activation/complete` |

## Explicitly prohibited Scope

- ACT-007 / ACT-008 (mobile) and all non-listed screens
- Real identity providers, email, SMS, payments, Evidence, Trust, Progression, Live Sky, Community
- Preview / Staging / Production / cloud databases
- New screen IDs · screen-count changes · alias inflation
- Importing runtime from `spikes/` or `validation/`
- Deployment workflows or enabling `vercel.json` for this branch

## Invariants retained

- 7 shells · 92 ACTIVE · 0 aliases · ACT-004 excluded · ACT-013 included
- Learning / Progression / Architecture Design Baselines LOCKED v1.0.0
- Server-authoritative activation · delivery ≠ verification · payment ≠ activation
- GHV-IMP-AUTH-001 bootstrap boundaries remain in force
