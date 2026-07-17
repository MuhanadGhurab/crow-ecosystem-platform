# Client Design Operator Runbook

> **Status:** CURRENT — CROW.DISCOVERY.2 certification

## Deployment target

- Project: `crow-ftgp-certification`
- Branch: `feat/first-tenant-golden-path`
- **Do not deploy Production `main`**

## Pre-deploy verification

```bash
npm run client-enterprise-design:test
npm run client-enterprise-design-authority:test
npm run client-enterprise-design-containment:test
npm run client-enterprise-design-routes:verify
npm run typecheck
npm run lint
npm run build
```

## Deploy

```bash
npm run ftgp-certification-production:deploy
```

## Post-deploy (non-browser)

- Protected host anonymous → Vercel SSO
- Public alias → denied
- `/login` exists
- Client design routes exist under `/client/requests/[requestId]/discovery/design`

## Supabase redirect URLs

When certification host changes, add:

```text
https://<protected-host>/auth/callback
https://<protected-host>/auth/resolving
```

Preserve all existing redirect entries.

## Manual owner acceptance

Owner performs full client journey with verified test account. Cursor must **not** create requests, Discovery answers, or Blueprint rows.

## Hosted-state preservation checks

```text
CANDIDATE_07_UNCHANGED=true
DISCOVERY_STATE_UNCHANGED=true
BLUEPRINT_STATE_UNCHANGED=true
HOSTED_BUSINESS_STATE_UNCHANGED=true
```

## What client submission does NOT do

- Provision tenant
- Grant roles or memberships
- Create Blueprint or BlueprintVersion rows
- Open review cycles automatically
