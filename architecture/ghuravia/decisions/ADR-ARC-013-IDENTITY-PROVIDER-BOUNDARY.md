# ADR-ARC-013 — Identity Provider Boundary

| Field | Value |
|-------|-------|
| **Decision ID** | ADR-ARC-013 |
| **Title** | Identity Provider Boundary |
| **Status** | **DEFERRED WITH ADAPTER LOCKED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Context

GHURAVIA requires authentication without coupling domain logic to a single IdP vendor. Activation remains app-owned (SPK-ARC-003). Saudi identity integration may arrive later with **OFFICIAL ACCESS NOT VERIFIED**.

## Options Considered

- **A.** Single SaaS IdP owns sessions end-to-end (Clerk/Auth0).
- **B.** Hybrid: app-owned sessions + replaceable `IdentityProviderPort` adapter.
- **C.** Fully app-native credentials only (no external IdP).

## Quality Attributes

Interoperability and exit flexibility prioritized over fastest vendor integration.

## Security

App must validate IdP tokens and maintain revocation authority. No trust of client-side IdP callbacks without server exchange.

## Privacy

IdP receives minimum claims. Private legal identity stays in app vault, not IdP profile.

## Accessibility

IdP-hosted widgets (if used) must support RTL and not block custom Arabic flows.

## Localization

Arabic-first login flows must remain achievable whether IdP UI is embedded or app-rendered.

## Cost

Managed IdP per-MAU pricing deferred to provider comparison; adapter pattern avoids rewrite on change.

## Operability

Founder must operate session revocation and audit without IdP console for all security actions.

## Spike Evidence

- SPK-ARC-003 (activation authority independent of IdP)
- IDENTITY-PROVIDER-COMPARISON.md

## Decision

**DEFERRED WITH ADAPTER LOCKED:** Option B. No production IdP accepted without sandbox validation and contract tests on `IdentityProviderPort`.

## Consequences

- Session store required in application.
- IdP migration path documented via adapter swap.
- Additional integration work vs single-vendor lock-in.

## Conditions

- Sandbox IdP project with OIDC or equivalent test tenant.
- Session fixation and logout tests pass on chosen vendor.
- Saudi IdP path remains **PLANNED CAPABILITY**.

## Migration

Existing sessions revoked on IdP swap; users re-authenticate once.

## Exit

Export user identities from IdP where supported; maintain app account id as canonical key.

## Revision History

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | 1C — adapter locked, vendor deferred |
