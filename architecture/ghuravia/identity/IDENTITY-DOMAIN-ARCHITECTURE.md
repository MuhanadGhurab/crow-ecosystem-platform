# Identity Domain Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-ID-DOM-001 |
| **Version** | 1.0.0 |
| **Status** | **DOMAIN ARCHITECTURE ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

```text
DOMAIN ARCHITECTURE ACCEPTED
Product Code: BLOCKED
Provider and external validation conditions remain
NO compliance claims
```

## 1. Purpose

Define the Identity domain boundaries for GHURAVIA: what the platform owns, what it delegates, and how Crow Identity differs from Private Legal Identity.

## 2. Locked separations

| Concern | Owns | Does not own |
|---------|------|--------------|
| **Authentication** | Credential verification, session issuance | Activation completion, entitlements |
| **Activation** | Account readiness formula (email, terms, risk) | Learning eligibility, Trust eligibility |
| **Authorization** | Policy evaluation for actions | Progression standing, commercial entitlement |
| **Crow Identity** | Public-facing handle, display, approved artifacts | Legal name, government identifiers |
| **Private Legal Identity** | Minimal legal fields when required | Public profile projection |

```text
Auth ≠ Activation ≠ Authorization ≠ Entitlement ≠ Learning Eligibility ≠ Trust Eligibility
Crow Identity ≠ Private Legal Identity
Deny by default
```

## 3. Domain components

| Component | Responsibility | Authority |
|-----------|----------------|-----------|
| Account aggregate | Lifecycle, activation formula, recovery hooks | Server |
| Credential store | Password/OAuth subject binding (via IdP adapter) | Server + IdP |
| Session service | Token lifecycle, rotation, revocation | Server |
| Contact verification | Email (in scope); mobile (adapter locked, deferred) | Server + provider adapter |
| Identity assurance | Step-up, assurance level for sensitive actions | Server |
| Crow profile projection | Public-safe fields only | Server |
| Private identity vault | Legal/age fields; restricted access | Server |

## 4. Activation formula (controlled launch)

Per Scope and SPK-ARC-003 (1B reuse):

| Field | Required for activation |
|-------|-------------------------|
| `email_verified` | Yes |
| `current_terms_accepted` | Yes |
| `account_risk_status` = acceptable | Yes (ACT-013) |
| Mobile verification | **Deferred** — not in baseline formula unless future gate adds |

Screens: ACT-003, ACT-011, ACT-012, ACT-013 map to server state only (see ACTIVATION-STATE-ARCHITECTURE.md).

## 5. Trust boundaries

```text
[Browser] ──► [App API / Identity module] ──► [Primary DB]
                    │
                    ├──► IdP adapter (replaceable, sandbox required)
                    ├──► Email/SMS adapter (replaceable, deferred)
                    └──► Audit (append-only, no PII bodies)
```

## 6. Data minimization

- Collect legal identity only when a governed flow requires it.
- Age category preferred over date-of-birth on public surfaces (SPK-ARC-025).
- No Trust signals, moderation internals, or raw Evidence in Identity public reads.

## 7. Arabic-first and accessibility

- Activation and recovery flows must support RTL layout and screen-reader labels.
- Error messages and legal copy require Arabic-primary authoring with English parity where product policy demands.
- Identity forms must not rely on color alone for verification outcome (ACT-011).

## 8. Related documents

- [ACTIVATION-STATE-ARCHITECTURE.md](./ACTIVATION-STATE-ARCHITECTURE.md)
- [AUTHENTICATION-SESSION-ARCHITECTURE.md](./AUTHENTICATION-SESSION-ARCHITECTURE.md)
- [AUTHORIZATION-ARCHITECTURE.md](./AUTHORIZATION-ARCHITECTURE.md)
- ADR-ARC-013, ADR-ARC-014, ADR-ARC-016

## 9. Non-claims

```text
Domain architecture does not select production IdP or email provider
Domain architecture does not authorize Product Code
Saudi/Nafath integration: PLANNED CAPABILITY / OFFICIAL ACCESS NOT VERIFIED
```
