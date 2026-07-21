# Threat Model — Identity and Activation

| Field | Value |
|-------|-------|
| **Document ID** | GHV-TM-1C-IDENTITY-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-003 |

## Assets

Credentials, sessions, activation state, email verification tokens, recovery tokens.

## Actors

External attacker, malicious client, compromised user, support insider.

## Trust boundaries

Browser ↔ API ↔ IdP adapter ↔ contact verification adapter ↔ primary DB.

## Threats and controls

| ID | Threat | Control | Residual |
|----|--------|---------|----------|
| T-IA-01 | Client forges activation | Server-authoritative aggregate | Low (spike proven) |
| T-IA-02 | Token replay | Single-use, TTL, hashed storage | Medium pending provider |
| T-IA-03 | Account enumeration | Generic recovery responses | Medium |
| T-IA-04 | Session fixation | Rotation on login | Low |
| T-IA-05 | IdP misconfiguration | Adapter boundary + sandbox gate | Medium until IdP chosen |
| T-IA-06 | Support social engineering | Dual control on sensitive recovery | Medium |

## Abuse cases

- Skip ACT-013 risk acceptance via API tampering → **denied** by server formula.
- Mark email verified without token → **denied**.

## Validation

SPK-ARC-003 PASS. Production IdP and email provider remain deferred.

## Non-claims

No exploit PoCs in production. No compliance certification.
