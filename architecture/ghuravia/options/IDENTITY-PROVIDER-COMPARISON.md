# Identity Provider Comparison

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-OPT-IDP-001 |
| **Version** | 1.0.0 |
| **Status** | **COMPARISON · DECISION DEFERRED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |
| **ADR** | ADR-ARC-013 |

```text
DEFERRED WITH ADAPTER LOCKED
No production IdP without sandbox validation
```

## Options

| Option | Pros | Cons | Fit |
|--------|------|------|-----|
| **A. Clerk** | Fast OIDC, good DX | Vendor lock, cost at scale | Medium |
| **B. Auth0/Okta** | Enterprise features | Cost, complexity | Medium |
| **C. Keycloak (self)** | Control, residency options | Ops burden | Medium–High ops |
| **D. App-owned + optional OIDC** | Adapter flexibility, session control | More build | **Architecture choice** |
| **E. Supabase Auth** | Integrated if stack aligns | Coupling | Low for modular monolith |

## Architecture stance (ADR-ARC-013)

**Option D** — hybrid app-owned sessions with replaceable IdP adapter. IdP vendor selection **DEFERRED**.

## Evaluation criteria

| Criterion | Weight |
|-----------|--------|
| Arabic UX / RTL emails | High |
| Session control | High |
| Saudi residency path | Medium (unverified) |
| Cost at 10k MAU | Medium |
| Sandbox availability | **Gate** |

## Non-claims

No vendor selected. No compliance certification per option.
