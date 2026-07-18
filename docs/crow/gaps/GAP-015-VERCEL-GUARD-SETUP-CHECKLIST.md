# GAP-015 — Vercel Ignored Build Step Setup Checklist

| Field | Value |
|-------|-------|
| **Status** | Instructions only — **do not apply** until owner authorizes CROW.GAP015.3 (or equivalent) |
| **Date** | 2026-07-18 |
| **Guard script** | `node scripts/safety/vercel-production-deploy-guard.mjs` |
| **Prerequisite** | Guard package merged/pushed on a branch Vercel can see (FTGP or later `main` under owner auth) |

## Preconditions (before touching Vercel)

- [ ] Owner authorizes: `AUTHORIZE: Vercel Ignored Build Step (GAP-015 Option D/E)`
- [ ] Guard script exists at `scripts/safety/vercel-production-deploy-guard.mjs`
- [ ] `npm run vercel-production-deploy-guard:test` PASS on the commit to be deployed
- [ ] Confirm this checklist is for **settings only** — not Instant Promote
- [ ] Instant Promote of `dpl_8xT92…` remains **not** authorized unless separately stated

## Exact Vercel setting

1. Open Vercel → team `muhanadghurabs-projects` → project `crow-ecosystem-platform`
2. **Settings → Git → Ignored Build Step**
3. Enable Ignored Build Step / custom command
4. Set command exactly:

```text
node scripts/safety/vercel-production-deploy-guard.mjs
```

5. Save settings
6. **Do not** change Production env vars for authorization yet unless running a deliberate authorized Production deploy
7. **Do not** Instant Promote anything as part of this setup

## Verification after configuration

| Step | Expected |
|------|----------|
| Push/docs commit on feature branch | Preview build **runs** (`ALLOW_NON_PRODUCTION_BUILD`) |
| Unauthorized `main` Production-target attempt | Build **skipped** (`BLOCK_UNAUTHORIZED_PRODUCTION_BUILD`, exit 0) |
| Live public domain | Still `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` unless Instant Promote authorized |
| GAP-004A Preview DB-disabled | Still fail-closed when isolation unproven |

## Authorizing a Production build later (separate owner action)

1. Choose exact commit SHA to allow
2. In Vercel **Production** environment variables (temporary):

| Key | Value |
|-----|-------|
| `CROW_PRODUCTION_DEPLOY_AUTHORIZED` | `true` |
| `CROW_PRODUCTION_DEPLOY_SHA` | exact commit SHA |
| `CROW_PRODUCTION_DEPLOY_REASON` | short owner reason (non-empty) |

3. Trigger the authorized Production Git deploy / rebuild for that SHA only
4. Verify decision `ALLOW_AUTHORIZED_PRODUCTION_BUILD`
5. **Clear/remove** the three authorization vars immediately after
6. Instant Promote / public domain change remains a **separate** owner authorization

## Rollback of Ignored Build Step

If Preview breaks because of a misconfigured command:

1. Owner authorizes settings rollback
2. Clear or disable Ignored Build Step command
3. Record evidence in Issue #15 / milestone note

## This milestone (CROW.GAP015.2)

| Action | Done? |
|--------|-------|
| Document checklist | Yes |
| Apply Ignored Build Step in Vercel | **No** (`VERCEL_IGNORED_BUILD_STEP_CONFIGURED_COUNT=0`) |
| Change Production env | **No** |
| Deploy Production | **No** |
