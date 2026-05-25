# F12 — Demo route index

**Purpose:** Safe, repeatable routes for staging demos and portfolio capture.  
**Rule:** Do **not** paste live database IDs into public README, CV, or slides. Use **reference codes**, **slugs**, and **admin navigation** to resolve `{requestId}` and `{blueprintId}`.

**Last updated:** 25 May 2026

---

## Resolve IDs before a live demo

| Goal | Command / UI |
|------|----------------|
| MEEM reference + staging URLs | `npm run meem:ids:staging` |
| Rimal pipeline health | `npm run tenant:verify:rimal` |
| MEEM + Rimal request chains | `npm run request:pipeline:verify` |
| Organic Najm row + blueprint | `npm run onboarding:verify -- --reference=CROW-2026-ARAX9K --expect-blueprint --expect-sector=aviation` |
| Open any request by reference | `/admin/requests` → search/filter → open row → copy `requestId` from URL |
| Blueprint from request | Request detail → pipeline links → **Blueprint** |

Script output may print internal IDs for **operator use only** — do not publish those IDs.

---

## Platform (operator)

| Route | Auth | Demo use |
|-------|------|----------|
| `/` | Public | Homepage, positioning |
| `/request` | Public | Intake wizard |
| `/architecture` | Public | Public architecture narrative |
| `/admin/overview` | Platform Admin | Operator console, pipeline buckets |
| `/admin/requests` | Platform Admin | Request queue |
| `/admin/requests/{requestId}` | Platform Admin | Request detail, pipeline, next action |
| `/admin/notifications` | Platform Admin | Notification inbox |
| `/admin/tenants` | Platform Admin | Tenant registry |
| `/admin/tenants/{tenantId}` | Platform Admin | Tenant detail (resolve via slug in admin) |
| `/admin/audit` | Platform Admin | Platform audit (optional; query `?category=logistics&tenant=meem-global`) |

---

## Discovery (per request)

Pattern: `/discovery/{requestId}/…` — get `{requestId}` from admin request detail.

| Route | Typical state |
|-------|----------------|
| `/discovery/{requestId}` | Entry / redirect |
| `/discovery/{requestId}/organization` | Org profile |
| `/discovery/{requestId}/modules` | Module selection context |
| `/discovery/{requestId}/security` | Security answers |
| `/discovery/{requestId}/summary` | **Primary demo stop** — completion, handoff |

---

## Blueprint (per blueprint)

Pattern: `/blueprints/{blueprintId}/…` — open from request detail pipeline links.

| Route | Demo use |
|-------|----------|
| `/blueprints/{blueprintId}/overview` | Blueprint contract |
| `/blueprints/{blueprintId}/readiness` | Readiness gates |
| `/blueprints/{blueprintId}/go-live` | Go-live bridge (**avoid Provision** unless intentional) |
| `/blueprints/{blueprintId}/pricing` | Commercial framing |
| `/blueprints/{blueprintId}/sarea` | SAREA acceptance tab (MEEM lighthouse) |
| `/blueprints/{blueprintId}/cybercrow` | CyberCrow blueprint slice |

---

## MEEM lighthouse (logistics)

| Constant | Value |
|----------|--------|
| Tenant slug | `meem-global` |
| Reference (staging) | `CROW-2026-MEEM` |

| Route | Notes |
|-------|--------|
| `/meem-global/dashboard` | CEM Command Center |
| `/meem-global/cybercrow/dashboard` | CyberCrow posture |
| `/meem-global/cybercrow/audit-logs` | Audit (optional `?category=logistics`) |
| `/meem-global/settings/plan` | Plan / advisory package |
| `/meem-global/logistics` | Logistics module (sector proof) |
| `/meem-global/workflows` | Workflows |
| `/sarea/preview` | SAREA studio preview (platform) |
| `/sarea/overview` | SAREA admin overview (Platform Admin) |

**Blueprint routes:** Resolve `{blueprintId}` from `/admin/requests` (MEEM request) or `npm run meem:ids:staging` output — **internal use only**.

---

## Rimal (construction, second tenant)

| Constant | Value |
|----------|--------|
| Tenant slug | `rimal-construction` |
| Reference (staging) | `CROW-2026-RIMAL` |

| Route | Notes |
|-------|--------|
| `/rimal-construction/dashboard` | CEM dashboard |
| `/rimal-construction/cybercrow/dashboard` | CyberCrow |
| `/rimal-construction/settings/plan` | Plan settings |

Verify before demo: `npm run tenant:verify:rimal`

---

## Najm (organic aviation — no tenant)

| Constant | Value |
|----------|--------|
| Company | Najm Aviation Services |
| Reference (staging) | `CROW-2026-ARAX9K` |
| Tenant | **None** (intentional — F11 policy) |

| Step | Route |
|------|--------|
| Find request | `/admin/requests` → locate `CROW-2026-ARAX9K` |
| Request detail | `/admin/requests/{requestId}` |
| Discovery | `/discovery/{requestId}/summary` (when discovery complete) |
| Blueprint | `/blueprints/{blueprintId}/overview` · `.../readiness` · `.../go-live` |

**Do not** demo `/najm-…` tenant paths — tenant was not provisioned.

---

## Client / portal (optional)

| Route | Auth |
|-------|------|
| `/portal` | Client / staff preview |
| `/portal/requests` | Request list |
| `/portal/requests/{requestId}` | Sponsor view |

Use only if demo needs sponsor perspective; not required for F12 core flow.

---

## Mock mode (local portfolio only)

| Setting | Routes |
|---------|--------|
| `AUTH_DISABLED=true` + `USE_MOCK_DATA=true` | `/admin/requests/mock-req-meem`, `/blueprints/mock-bp-meem/*` |

**Do not** present mock IDs as staging proof. Use for GitHub screenshot capture per [`docs/public/assets/screenshots/README.md`](../public/assets/screenshots/README.md).

---

## Health & smoke

| Command | Purpose |
|---------|---------|
| `GET /api/health` | Deploy readiness (no secrets in response) |
| `npm run staging:ready` | Staging host + MEEM URL hints (if configured) |

---

## Related

- [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md)
- [`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md)
- [`F12_SCREENSHOT_CHECKLIST.md`](F12_SCREENSHOT_CHECKLIST.md)
