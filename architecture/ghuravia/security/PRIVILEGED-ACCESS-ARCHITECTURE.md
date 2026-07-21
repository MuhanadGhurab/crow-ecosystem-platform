# Privileged Access Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-SEC-PRIV-001 |
| **Version** | 1.0.0 |
| **Status** | **DOMAIN ARCHITECTURE ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-019 |

```text
Deny by default
Break-glass requires dual control
Product Code: BLOCKED
```

## 1. Purpose

Define privileged access patterns for admin, support, moderation, and break-glass operations.

## 2. Privilege tiers

| Tier | Examples | Controls |
|------|----------|----------|
| Standard admin | User lookup, config read | RBAC + audit |
| Sensitive admin | Trust view, moderation decide | RBAC + assurance A2 |
| Privileged correction | Progression/evidence correction | A3 + reason + audit |
| Break-glass | Emergency override | Dual control + post-action review |

## 3. Dual control (SPK-ARC-019)

Break-glass corrections require `dualControlApprover` distinct from `actorId`. Single-actor break-glass rejected at architecture boundary.

## 4. Just-in-time elevation

- No standing break-glass roles.
- Elevation time-boxed; auto-expires.
- All privileged sessions tagged in audit with `authority` field.

## 5. Separation

| Privilege | Must not grant |
|-----------|----------------|
| Moderator | Progression write |
| Reviewer | Trust raw signals |
| Support | Evidence object download without policy |
| Admin | Bypass scanning fail-closed |

## 6. Non-claims

```text
Operational runbooks not complete
PAM tooling vendor not selected
```
