# L5 — Access Gateway & Portal Role Model

**Status:** Shipped (29 May 2026)  
**Route:** `/access`

## Concept

Crow is a multi-portal ecosystem with a single **access gateway** that routes users to the correct workspace:

| Portal | Audience | Purpose |
|--------|----------|---------|
| **Client Portal** | Request owners | Request, discovery, proposal, approval, onboarding |
| **Business Portal** | Tenant employees | Day-to-day CEM operations |
| **ProCrow** | Internal operators | Discovery review, blueprint, trust, runtime prep, Go/No-Go |

CyberCrow and SAREA remain engines inside Business Portal / ProCrow — not separate public portals.

## Implementation

- `src/lib/portal/portal-access-contract.ts` — typed portal options
- `src/lib/services/portal-access.service.ts` — role → portal resolution
- `src/app/access/page.tsx` — gateway UI
- `post-login-redirect.ts` — multiple portals → `/access`; single portal → direct route
- Public header — **Open workspace** when multiple portals available

## Rules

- `client` → Client Portal only; ProCrow hidden
- `tenant_admin` / `tenant_user` + `tenant_slugs` → Business Portal
- Platform console roles → ProCrow; Business only if tenant role + slug (not for staff alone)
- Signed-out users see conceptual cards + sign-in; no unauthorized deep links

## Verification

```bash
npm run access-gateway:verify
npm run auth-landing:verify
```

## Gaps (L6+)

- True multi-role metadata (one user, multiple `crow_role` values) not in schema
- Tenant membership beyond `tenant_slugs` in JWT
- Optional: auto-redirect from `/` when signed in with single portal

## Next

**L6 — Discovery-to-Blueprint ProCrow accept workflow** or **tenant membership hardening**
