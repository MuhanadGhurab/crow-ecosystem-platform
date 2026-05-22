# M4 — CyberCrow operations rehearsal (~10 min)

**Scope:** Platform admin overview + audit, MEEM GRC + tenant audit, `auditor_readonly` logistics filter. **Not** the full [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) commercial → go-live walkthrough.

**Prerequisites:** Local Postgres, Supabase Auth, `USE_MOCK_DATA=false`, `AUTH_DISABLED=false`.

```bash
npm run db:seed:meem
npm run db:seed:meem:ops
npm run rehearsal:m4
npm run dev
```

Sign in as `platform_admin` (or grant via `npm run auth:bootstrap` / `auth:grant-role`).

---

## 1. Platform admin — posture & audit (~4 min)

| Step | Route | Pass |
|------|-------|------|
| 1 | [`/admin/overview`](http://localhost:3000/admin/overview) | Cross-tenant CyberCrow strip: events, incidents, controls, logistics audit counts |
| 2 | [`/admin/audit`](http://localhost:3000/admin/audit) | CyberCrow log + notification log; tenant links resolve |
| 3 | [`/admin/audit?category=logistics&tenant=meem-global`](http://localhost:3000/admin/audit) | Logistics filter persists; MEEM logistics rows visible |

---

## 2. MEEM tenant — GRC & logistics audit (~4 min)

| Step | Route | Pass |
|------|-------|------|
| 4 | [`/meem-global/cybercrow/grc`](http://localhost:3000/meem-global/cybercrow/grc) | NCA ECC control labels; 2–3 evidence preview rows per control |
| 5 | [`/meem-global/cybercrow/audit-logs?category=logistics`](http://localhost:3000/meem-global/cybercrow/audit-logs) | E10 logistics ops events (dispatch/OCR/anomaly) |
| 6 | [`/meem-global/cybercrow/dashboard`](http://localhost:3000/meem-global/cybercrow/dashboard) | Risk card from live DB counts (not static mock) |

---

## 3. Auditor read-only (~2 min)

Grant auditor + tenant slug (once per env):

```bash
USER_EMAIL=auditor@example.com CROW_ROLE=auditor_readonly npm run auth:grant-role
USER_EMAIL=auditor@example.com TENANT_SLUG=meem-global npm run auth:grant-tenant
```

| Step | Route | Pass |
|------|-------|------|
| 7 | Sign in as `auditor_readonly` | Read-only banner on tenant CyberCrow pages |
| 8 | [`/admin/audit`](http://localhost:3000/admin/audit) | Platform audit OK; no discovery write / go-live |
| 9 | [`/meem-global/cybercrow/grc`](http://localhost:3000/meem-global/cybercrow/grc) | View GRC + evidence; no destructive actions |
| 10 | [`/admin/audit?category=logistics&tenant=meem-global`](http://localhost:3000/admin/audit) | Logistics filter same as platform admin view |

**Denied:** `/admin/requests` write, `/blueprints/*/go-live`, `/discovery/*/modules` write.

---

## Pass criteria (M4 = 100%)

- [ ] `/admin/overview` posture strip populated from DB
- [ ] `/admin/audit` + logistics + `tenant=meem-global` filter
- [ ] `/meem-global/cybercrow/grc` evidence previews
- [ ] `/meem-global/cybercrow/audit-logs?category=logistics` E10 events
- [ ] `auditor_readonly` read-only GRC + audit paths; writes blocked

**Deferred:** Full MEEM Phase 4 E2E ([`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md)), extended NCA catalog import, Resend (M7).

**Owner:** Muhanad · **Milestone:** [`MILESTONES.md`](MILESTONES.md) M4
