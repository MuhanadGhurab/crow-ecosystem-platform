# Identity, Authority, and Trust

| Field | Value |
|-------|-------|
| **Title** | Identity, Authority, and Trust |
| **Status** | CANONICAL |
| **Authority** | Owner decision — CROW.GOVERNANCE.1 |
| **Last reviewed** | 2026-07-04 |
| **Supersedes** | — (detail: [`06-IDENTITY-TRUST-SECURITY-CONSTITUTION.md`](../architecture/crow-core/06-IDENTITY-TRUST-SECURITY-CONSTITUTION.md)) |
| **Related decisions** | [ADR-005](decisions/ADR-005-payment-status-does-not-grant-authority.md), [ADR-006](decisions/ADR-006-tenant-entitlements-separate-from-identity.md), [ADR-007](decisions/ADR-007-sarea-never-grants-permission.md) |
| **Implementation state** | C3 account verification PARTIAL; FTGP authority foundation in progress |

## Canonical separations

```
Authentication ≠ Verification ≠ Identity ≠ Platform role ≠ Tenant membership
≠ Authorized tenant role ≠ Work Persona ≠ SAREA presentation ≠ Payment status ≠ CroAI access
```

## Work Persona vs role

> A job title says what you are called.
> An authorized role defines what you are allowed to do.
> A Work Persona explains what you are responsible for in a specific operational context.

**A Work Persona must never be treated as an authorization grant.**

## Account activation requirements

Both required:

- Verified email address
- Verified mobile phone number (OTP)

Neither grants tenant membership, client ownership, tenant administration, Platform Admin, ProCrow access, workflow approval, or elevated authority.

## External identity

- Supabase Auth / Google OAuth may authenticate
- Crow Prisma models own **authorization** (`Role`, `Permission`, `TenantMembership`, platform roles)
- Government identity (Nafath, Absher, GOSI) — **planned**; identity assurance only when implemented; requires official support, consent, security review

## CyberCrow

Owns trust enforcement: identity trust signals, authorization enforcement, tenant isolation, decision protection, approval integrity, evidence, auditability, risk signals, information boundaries.

CyberCrow is **not** a SIEM, EDR, or autonomous SOC. Shield, Sentinel, Fortress are **entitlement bundles** — not separate security products.

## Implementation evidence

| Concern | Location |
|---------|----------|
| Session and auth | `src/lib/auth/` |
| FTGP authority tests | `src/lib/auth/ftgp-authority-boundaries.test.ts` |
| Portal access contract | `src/lib/portal/portal-access-contract.ts` |
| C3 registration/verification | `docs/architecture/crow-core/c3/` |
| Prisma identity models | `Profile`, `Role`, `TenantMembership`, `UserRole` |

## Related documents

- [`06-IDENTITY-TRUST-SECURITY-CONSTITUTION.md`](../architecture/crow-core/06-IDENTITY-TRUST-SECURITY-CONSTITUTION.md)
- [`WORK_PERSONA_MODEL.md`](../architecture/crow-core/WORK_PERSONA_MODEL.md)
- [`FTGP_0B_AUTHORITY_FOUNDATION.md`](../architecture/crow-core/first-tenant/FTGP_0B_AUTHORITY_FOUNDATION.md)
