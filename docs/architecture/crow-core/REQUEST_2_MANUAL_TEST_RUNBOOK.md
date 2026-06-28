# REQUEST.2 Manual Test Runbook

Deploy target: `crow-ftgp-certification` only. Do not create hosted business rows during automated runs.

## Preconditions

- Branch `feat/first-tenant-golden-path` deployed to certification host
- Supabase redirect URLs include certification host `/auth/callback` and `/auth/resolving`
- Test client account activated with legal acceptance

## Smoke URLs

- `/` — homepage CTAs (logged out: login preserves `/client/requests/new`; logged in: Start / View / Discovery)
- `/request` — public entry (redirect when authenticated)
- `/client/requests/new` — canonical wizard
- `/client/requests` — list
- `/client/requests/{id}/confirmation` — post-submit
- `/client/requests/{id}` — status + brief summary
- `/client/requests/{id}/discovery/design` — prefill banner
- `/admin/requests/{id}` — ProCrow brief panel

## Checklist (abbreviated)

1. Complete five-step wizard with catalog search, alias, Arabic, typo, category browse, secondary field, custom field fallback.
2. Submit once; duplicate click creates one request.
3. Confirm no tenant/Blueprint created.
4. Continue to Discovery; verify prefilled values and banner.
5. ProCrow admin: client vs Crow recommendation distinct; custom field text preserved.
6. Mobile/tablet layout, keyboard, loading/pending states.
7. Unrelated client cannot view request.

## Regression gates

```bash
npm run client-service-request:test
npm run business-field-catalog:test
npm run client-quick-intake:test
npm run client-loading-feedback:test
npm run typecheck
npm run lint
npm run build
```
