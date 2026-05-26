# F27 — Admin quality & reliability pass (no paid infra)

**Date:** 26 May 2026  
**Status:** **PASSED** (validated 26 May 2026; commit pending)  
**Constraint:** No paid infrastructure, no external APIs/AI services, no schema changes, no destructive admin tooling.

**Context:** F26 passed. A Vercel build incident surfaced missing tracked files and type alignment drift; deployment is now healthy. F27 tightens the admin console as a calm operator control room.

---

## Objective

Improve admin quality and reliability across:

- Navigation consistency
- Broken-link / route reliability
- Empty + error + loading states
- Operator “next safe action” clarity
- Request → discovery → blueprint → tenant flow reliability
- Tenant control room reliability
- Notifications/audit clarity

This phase is a **quality pass**, not feature expansion.

---

## Part 1 — Admin surface audit (routes reviewed)

Audited admin routes:

- `/admin/overview`
- `/admin/requests`
- `/admin/requests/[requestId]`
- `/admin/tenants`
- `/admin/tenants/[tenantId]`
- `/admin/notifications`
- `/admin/audit`
- `/admin/subscriptions`
- `/admin/blueprints`
- `/admin/discovery`
- `/admin/integrations`
- `/admin/domains`
- `/admin/security-baselines`

### What works well

- **Overview** already presents a strong operator “command center” layout: platform health, operator console, notification summary, tenant grid, CyberCrow/SAREA status blocks.
- **Request detail** already has operator panels: next action, pipeline links, E2E checklist, discovery intelligence panel when available.
- **Tenant control room** is already deep: posture, lifecycle, plan advisories, CEM ops snapshot, CyberCrow metrics, SAREA studio health.
- **Notifications** supports filtering by tenant/category/severity/status/date and provides digest preview hooks.
- **Audit** provides cross-tenant CyberCrow audit + notification log with stable filters.
- **Discovery / Blueprints** indexes provide clear list cards and safe deep links.

### Weak / placeholder / inconsistent surfaces

- **Integrations**: lightweight list; needed a “truthful operator” empty state + safe next steps.
- **Security baselines**: lightweight list; needed explicit “catalog only” framing and links to where enforcement lives.
- **Subscriptions**: needed stronger “advisory only / activation deferred” language and operator next actions.
- **Admin nav label casing**: minor inconsistency (e.g. “Security baselines”).

---

## Part 2 — Admin overview quality

**Decision:** Sufficient. No business logic changes required; overview already aligns with operator console requirements.

---

## Part 3 — Admin request flow reliability

**Decision:** Sufficient. Existing request list + detail already provide status clarity, lifecycle strip, and next actions.

---

## Part 4 — Tenant control room reliability

**Decision:** Sufficient. Existing tenant control room already exposes deep links, module posture, and readiness/advisories.

---

## Part 5 — Notifications / audit quality

**Decision:** Sufficient. Filters, summaries, and empty states are present; scope kept to documentation and link reliability checks.

---

## Part 6 — Blueprint / discovery index quality

**Decision:** Sufficient. Both indexes provide clear list cards, status badges, and safe deep links.

---

## Part 7 — Placeholder pages made honest & useful (changes)

Implemented small UX quality upgrades without new features:

- **Integrations**: consistent header, honest empty state, safe next actions (requests / discovery).
- **Security baselines**: consistent header, operator notes, explicit “catalog only” framing, safe links.
- **Subscriptions**: consistent header, explicit “activation deferred” language, operator next actions.
- **Admin nav label**: normalized casing for “Security Baselines”.

---

## Part 8 — Route / link reliability review

Reviewed that admin pages rely on:

- `routes.*` helpers for internal links (preferred)
- requestId / tenantId / tenantSlug presence before rendering deep links
- non-destructive “not configured / no data yet” empty states on placeholder pages

**Note:** Recent Vercel incident root cause was **untracked support files** (handled in hotfix commits). F28 will add stronger mock/build safety checks to prevent repeats.

---

## Part 9 — Permission and auth safety

No auth/middleware changes in F27. Admin continues to require platform console access and permission-gated nav items.

---

## Part 10 — MEEM / Rimal / Najm validation

Validation commands are listed below. Results will be recorded after the run.

---

## Validation commands

```powershell
Set-Location D:\CYBERCROW

npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run meem:ids:staging
npm run tenant:verify:rimal
npm run request:pipeline:verify
npm run request:e2e:dry
```

Optional:

```powershell
npm run simulate:vercel-build:staging
```

---

## Validation results

| Command | Result |
|---------|--------|
| `npm run typecheck` | PASS *(after `npm run build` regenerated `.next/types`)* |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run public:mirror-manifest` | PASS |
| `npm run meem:ids:staging` | PASS |
| `npm run tenant:verify:rimal` | PASS *(warn: workflows exist but tasks not seeded — acceptable)* |
| `npm run request:pipeline:verify` | PASS |
| `npm run request:e2e:dry` | PASS |

---

## Acceptance

F27 is **PASSED** — admin surfaces audited, placeholder pages honest/useful, validations green, and no paid infra / forbidden scope added.

