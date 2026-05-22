# Phase 4 — MEEM Holding live E2E rehearsal

**Prerequisites:** Local Postgres, Supabase Auth, `USE_MOCK_DATA=false`, `AUTH_DISABLED=false`.

```bash
npm run db:seed
npm run db:seed:meem
npm run db:seed:meem:ops
npm run dev
```

**Live IDs** (re-seed may change — check console output):

| Artifact | Typical |
|----------|---------|
| Request | `cmpge193x0000vhws8nclouoi` |
| Blueprint | `cmpge196o0015vhws2r7akekx` |
| Tenant | `meem-global` |

---

## Rehearsal script (~20 min)

### 1. Platform admin — commercial → live

1. Sign in as `platform_admin` (or `AUTH_DEV_ROLE=platform_admin` only if bypassing).
2. [`/admin/requests/{requestId}`](http://localhost:3000/admin/requests) — MEEM row, ~23,956 SAR/mo, lifecycle chips.
3. [`/blueprints/{blueprintId}/readiness`](http://localhost:3000/blueprints) — grouped checks green, **tenant-live** banner.
4. [`/blueprints/{blueprintId}/go-live`](http://localhost:3000/blueprints) — **Already live** + dashboard link (not provision form).
5. [`/meem-global/dashboard`](http://localhost:3000/meem-global/dashboard) — tasks, workflows, OCR/AI hints.

### 2. Logistics + workflows

6. [`/meem-global/workflows`](http://localhost:3000/meem-global/workflows) — ≥4 workflows, step counts.
7. [`/meem-global/logistics`](http://localhost:3000/meem-global/logistics) — OCR/AI cards, shipment pipeline.
8. [`/meem-global/sales`](http://localhost:3000/meem-global/sales) · inventory · warehouse — ops seed samples.

### 3. CyberCrow + platform audit

9. [`/meem-global/cybercrow/dashboard`](http://localhost:3000/meem-global/cybercrow/dashboard) — `CYBERCROW_INITIALIZED`.
10. [`/meem-global/cybercrow/audit-logs?category=logistics`](http://localhost:3000/meem-global/cybercrow/audit-logs) — logistics ops events.
11. [`/admin/audit?category=logistics&tenant=meem-global`](http://localhost:3000/admin/audit) — platform feed + **MEEM logistics** filter tab.
12. Confirm **≥4** `platformNotification` rows (`request_received`, `discovery_started`, `blueprint_ready`, `tenant_provisioned`) with status **`skipped`** and reason `RESEND_API_KEY not configured` — **expected** until Phase Cloud.

### 4. RBAC spot-checks (Phase 4)

| Role | Check |
|------|--------|
| `sales` | `/admin/requests` OK; `/admin/audit` → unauthorized; blueprint nav hides **Go live** |
| `client` | `/portal/requests/{requestId}` tracks MEEM request |
| `tenant_user` + `meem-global` | Logistics OK; `/meem-global/users` denied |
| `auditor_readonly` + slug grant | `/admin/audit` OK; no discovery write |

---

## Pass criteria

- [ ] Readiness green + tenant-live banner
- [ ] Go-live shows already provisioned
- [ ] Dashboard + logistics + workflows + ERP samples
- [ ] Admin audit: notifications + `CYBERCROW_INITIALIZED` + logistics filter
- [ ] RBAC: sales/auditor/client/tenant_user boundaries as above
- [ ] Notifications documented as skipped (no Resend)

**Owner:** Muhanad. **Deferred:** MEEM (Omar) SAREA persona acceptance (flow 8 — M5); Resend / Phase Cloud (M7).

**Phase 6 (M4, largely shipped):** `auditor_readonly` UI, data-backed CyberCrow dashboard + GRC shell, E10 logistics audit — **rehearse** steps 9–12 on live seed. Remaining: Entra ops copy on settings/login.

---

## Mock fallback

`USE_MOCK_DATA=true` + `AUTH_DISABLED=true` + `npm run demo:meem` — UI walkthrough only; provision and audit require live DB.
