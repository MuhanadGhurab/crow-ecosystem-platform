# Certification Route Manifest (CROW.CERT.1)

**Status:** PASS · **Active routes:** 159 (auto-discovered from `src/app`)

Source: `src/lib/certification/discover-routes.ts` · Gate: `npm run certification-route-manifest:verify`

## Route classes

| Class | Count (approx) | Audience |
|-------|----------------|----------|
| public | 12+ | Anonymous visitors |
| auth | 8+ | Sign-in / OAuth |
| activation | 6+ | Email / phone verification |
| legal | 4+ | Agreement acceptance |
| account | 4+ | Authenticated account shell |
| client | 15+ | Client portal |
| request | 6+ | Service request wizard |
| discovery | 5+ | Client Discovery |
| blueprint-client | 4+ | Client blueprint views |
| admin | 20+ | ProCrow console |
| studio | 4+ | Model Forge, Tenant Studio, Blueprint Studio |
| tenant-runtime | 30+ | Tenant ERP modules |
| api | 10+ | Server handlers |
| legacy | 10+ | Redirect / compatibility |

Every discovered route module exists; `BROKEN_ACTIVE_ROUTE_COUNT=0`.

## Required loading boundaries

All patterns in `requiredLoadingPatterns()` verified with parent `loading.tsx` inheritance. `MISSING_REQUIRED_LOADING_STATE_COUNT=0`.

## Canonical new-user paths

`/` → `/signup|/login` → verification → `/register/legal` → `/client` → `/client/requests/new` → confirmation → optional Discovery.

Legacy `/request` redirects to canonical flow. Legacy `/discovery/[requestId]` redirects to client Discovery.
