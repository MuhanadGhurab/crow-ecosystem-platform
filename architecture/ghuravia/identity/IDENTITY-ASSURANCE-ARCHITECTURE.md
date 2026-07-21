# Identity Assurance Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-ID-IAS-001 |
| **Version** | 1.0.0 |
| **Status** | **DOMAIN ARCHITECTURE ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## 1. Purpose

Define assurance levels and step-up authentication for sensitive actions without conflating assurance with Activation or Trust.

## 2. Assurance levels (conceptual)

| Level | Typical proof | Use cases |
|-------|---------------|-----------|
| A0 | None | Public reads |
| A1 | Valid session | Standard authenticated actions |
| A2 | Recent re-auth or verified contact | Email change, export request |
| A3 | Step-up + privileged approval | Break-glass, privileged correction |
| A4 | External identity (future) | Saudi/Nafath — **PLANNED CAPABILITY / OFFICIAL ACCESS NOT VERIFIED** |

## 3. Step-up pattern

```text
request sensitive action → evaluate required assurance → if insufficient, challenge → on success, short-lived elevation → audit
```

- Step-up elevation TTL: **5 minutes** (CANDIDATE SECURITY VALUE PENDING USABILITY).
- Elevation does not grant admin roles; only satisfies assurance for the requested action.

## 4. Sensitive actions (non-exhaustive)

| Action | Minimum assurance |
|--------|-------------------|
| Account email change | A2 |
| Data export | A2 |
| Evidence upload finalize | A1 + activation |
| Privileged correction | A3 + dual control |
| Trust/moderation decision | A2 + role |
| Private legal identity view | A3 + role + need-to-know |

## 5. Saudi identity readiness

Nafath and government identity flows are **PLANNED CAPABILITY / OFFICIAL ACCESS NOT VERIFIED**. Architecture reserves adapter boundary only (see SAUDI-IDENTITY-DATA-READINESS.md).

## 6. Non-claims

```text
No production Nafath integration
Assurance levels do not imply legal identity verification at launch
```
