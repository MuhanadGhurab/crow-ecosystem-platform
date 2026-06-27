# DISCOVERY.2B Manual Test Runbook

Deploy target: `crow-ftgp-certification` on branch `feat/first-tenant-golden-path`.

## URLs (replace host after deploy)

1. Homepage `/`
2. Login `/login` — confirm Back to Home
3. Client landing `/client`
4. Quick intake `/client/requests/{id}/discovery/design?flow=quick&step=field`
5. Field finder same route `?step=field`
6. Guided design — select Guide Me at mode step
7. Request summary `/client/requests/{id}/discovery/summary`
8. ProCrow review `/admin/requests/{id}`

## Critical checks

- [ ] Normal path: 6 steps only (field → review)
- [ ] Search friend's actual business field
- [ ] Alias and misspelling search
- [ ] Category browse
- [ ] Primary + secondary hybrid
- [ ] I cannot find my business — continue without wrong field
- [ ] Recommend Everything + ProCrow decides
- [ ] No Blueprint created on submit
- [ ] Loading/pending on every major click
- [ ] Phone/tablet/keyboard/reduced motion

## Stop conditions

Stop if forced inaccurate field, OAuth breaks, unauthorized side effects, or Vercel build fails.
