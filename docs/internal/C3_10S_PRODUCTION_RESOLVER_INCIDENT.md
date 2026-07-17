# C3.10S — Production post-auth resolver incident (C3.10R)

## Classification

```text
FAILED — PRODUCTION POST-AUTH RESOLVER DEFECT
Root cause: PRODUCTION_DATABASE_ENV_MISMATCH
```

## Failed deployment

| Field | Value |
|-------|-------|
| Deployment ID | `dpl_EJiL9z1NnfvneHCR72JfoGE5NXmh` |
| Canonical origin | `https://crow-ecosystem-platform.vercel.app` |

## Observed route chain

```text
/login → /auth/google → Google → Supabase callback
→ GET /auth/callback (307 — session established)
→ GET /auth/resolving (200)
→ POST runPostAuthResolutionAction (500 — C2 database mutation guard)
→ resolver failure UI
```

Callback and Supabase SSR session were operational. Resolver mutations failed before PlatformAccount reconciliation.

## Root cause

Production Vercel environment for the failed deployment lacked required C2 database guard variables:

- `DATABASE_ENVIRONMENT`
- `EXPECTED_DATABASE_FINGERPRINT` (runtime pooler)
- `EXPECTED_DIRECT_DATABASE_FINGERPRINT`

Any path calling `assertC2DatabaseEnvironmentSafe()` during OAuth reconciliation threw `BlueprintAuthorizationError`, producing HTTP 500 on the resolver server action. All tested identity classes failed for this shared reason.

Runtime pooler fingerprint: `b7f801cfe5e30009` (port 6543). Direct fingerprint: `0355c17692e2a90d` (port 5432). Supabase project ref: `wbwnsndcxrgyqwppurms`.

## Rollback

Production restored to last known-good deployment:

```text
dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4
```

Production lockdown applied (Google off, generation gate 1) until repaired release is separately authorized.

## Repairs (C3.10S commits)

1. **Resolver / reconciliation** — guard error mapping, fail-closed configuration failures, legacy generation reconciliation after legal completion.
2. **Authoritative authorization** — Supabase metadata `crow_role` cannot authorize portals without database-backed proof.
3. **Resolver UI** — stages reflect server-confirmed outcomes only; failed stage marker and support reference.
4. **Verification tooling** — production database guard sync scripts and static parity / persistence verifiers.

## Static test coverage gap

Local and CI verifiers did not simulate Production Vercel env missing C2 guard variables. Added `c3-production-backend-parity:verify` and guard sync scripts.

## Preview re-proof requirements (C3.10S)

Before Production redeploy:

- Deploy repaired branch HEAD to immutable Preview with Google proof flags and database guard env.
- Operator adds Preview `/auth/callback` to Supabase redirect allowlist.
- Ordinary requester OAuth journey: reconciliation → legal → activation → session lifecycle.
- Existing account-class matrix after ordinary requester passes.
- Full Preview verification suite and browser/server corroboration.

## Production redeployment gate

Do not redeploy Production until Preview proves browser identity bound, backend parity, PlatformAccount persistence, legal persistence, generation-2 activation, session lifecycle, and authorization regression.

Fresh backup and callback allowlist verification required before Production promotion.
