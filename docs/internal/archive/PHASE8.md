# Phase 8 — Operations & acceleration

**Status:** In progress  
**Prerequisite:** Phases 1–7 complete  
**North star:** [`ARCHITECTURE_DIAGRAM.md`](ARCHITECTURE_DIAGRAM.md)

---

## Sprint map

| Sprint | Target | Deliverable | Status |
|--------|--------|-------------|--------|
| **8.1** | Layer 10 | GitHub Actions CI (typecheck, audit, build) | Done |
| **8.2** | Step 11 | Pre-provision readiness gate (env flag) | Done |
| **8.3** | Layer 03 | Industry templates (logistics, retail, healthcare) | Done |
| **8.3b** | Layer 07 | Tenant CEM role assignment (`cem.roles.manage`) | Done |
| **8.4** | Layer 05 | Stripe billing | In progress (scaffold) |
| **8.5** | Layer 09 | Microsoft Entra SSO | Done |
| **8.6** | Layer 01 | Public marketing CMS | Backlog |

---

## 8.1 — CI/CD

- [x] `.github/workflows/ci.yml` — `npm ci`, `audit:src`, `typecheck`, `build`
- Build uses placeholder env + `AUTH_DISABLED=true` (no live DB in CI)

---

## 8.2 — Readiness gate (pre-provision)

**Env:** `GO_LIVE_READINESS_GATE=true` enables blocking checks before provision.

Pre-provision blockers:
- Request status `BLUEPRINT_BUILD`
- Discovery profile `COMPLETED`
- Blueprint has ≥1 module
- If proposal `SENT` → must be `CLIENT_APPROVED`; `DECLINED` blocks

**Env:** `GO_LIVE_READINESS_STRICT=true` also requires manual items: performance validated, support ready.

---

## 8.3 — Industry templates

- [x] `discovery-templates/logistics.json`
- [x] `discovery-templates/retail.json`
- [x] `discovery-templates/healthcare.json`
- [x] Apply from discovery organization when `industry` matches template key

---

## 8.3b — Tenant CEM role assignment

- [x] `tenant-role.service.ts` — assign/remove `UserRole` with tenant scope
- [x] `tenant-roles.ts` actions — `cem.roles.manage` policy + audit (`ROLE_ASSIGNED`, `ROLE_REMOVED`)
- [x] `/[tenant]/users` — assign form + per-role remove chips

---

## 8.5 — Microsoft Entra SSO

- [x] `entra-sso.ts` — `AZURE_SSO_ENABLED`, optional `NEXT_PUBLIC_AZURE_TENANT_ID`
- [x] `/login` — Sign in with Microsoft (Azure OAuth)
- [x] `GET /auth/entra` — server redirect to IdP
- [x] Callback validates `crow_role` in app_metadata
- [x] Tenant settings — Entra discovery hint + sign-in link
- [x] [`ENTRA_SSO.md`](ENTRA_SSO.md) — Azure + Supabase setup guide

---

## 8.4 — Stripe billing (scaffold)

- [x] `src/lib/billing/env.ts`, `money.ts` — config + SAR → halala
- [x] `src/lib/services/billing.service.ts` — `createSubscriptionCheckout` (no-op when unconfigured)
- [x] [`STRIPE_BILLING.md`](STRIPE_BILLING.md) — env + implementation order
- [ ] Prisma subscription fields on tenant
- [ ] Checkout API route + admin UI
- [ ] Webhook handler

---

## Verify

```bash
npm run typecheck && npm run build && npm run audit:src
```

Enable gate locally:
```
GO_LIVE_READINESS_GATE=true
```
