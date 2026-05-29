# Tenant Runtime / CEM — demo runbook

**Purpose:** Before/after checklist for K1 tenant runtime demos. Staging and mock only.

---

## Before demo

| Step | Command / action |
|------|------------------|
| 1 | `git status -sb` — clean or K1-only changes |
| 2 | `npm run mock:verify` |
| 3 | `npm run typecheck` · `npm run lint` (if time) |
| 4 | `npm run runtime:verify` · `npm run erp:verify` |
| 5 | Optional: `npm run tenant-demo:verify` |
| 6 | Confirm login works for tenant role or platform staff |
| 7 | Open `meem-global` dashboard — verify tenant loads |
| 8 | Optional: `npm run meem:ids:staging` for MEEM deep links |

**Environment:** `.env` / staging — no production keys required for portfolio demo.

---

## Recommended route order (10 min)

See [`K1_TENANT_RUNTIME_DEMO_REHEARSAL_PLAYBOOK.md`](K1_TENANT_RUNTIME_DEMO_REHEARSAL_PLAYBOOK.md).

1. `/meem-global/dashboard`  
2. `/meem-global/modules`  
3. `/meem-global/departments` (+ roles or users)  
4. `/meem-global/tasks` · `/meem-global/workflows`  
5. `/meem-global/reports`  
6. `/meem-global/hr` · `/meem-global/finance` · procurement or logistics  
7. `/meem-global/cybercrow/dashboard`  
8. `/sarea/overview`  
9. `/meem-global/dashboard` (cohesion close)

**Alternate tenant:** `rimal-construction` — construction sector story; thinner MEEM-specific mock ops.

---

## Safe wording

| Use | Avoid |
|-----|-------|
| Tenant Runtime / CEM operates the company | “Production is live” |
| ProCrow prepared and governs | “Auto-provisioned on submit” |
| Advisory readiness / operator-guided | “Fully automated ERP” |
| Rule-based cohesion hints | “AI predicts outcomes” |
| CyberCrow trust posture (advisory) | “Certified compliant” |
| SAREA shapes experience; RBAC controls access | “SAREA grants permissions” |

---

## Forbidden claims

- Live checkout / payment activation  
- Automatic tenant creation from public request  
- Production go-live approved (F23 deferred)  
- Compliance certification / legal audit guarantee  
- Autonomous AI detection or workflow automation  
- Customer production references without evidence  

---

## Fallback routes

| Problem | Fallback |
|---------|----------|
| `meem-global` 404 | `rimal-construction` or admin tenant list |
| Empty CyberCrow | CyberCrow connection panel + “pending init” narrative |
| Empty tasks | Workflows page + MEEM mock catalog mention |
| Reports thin | Reports BI readiness panel only |
| No module depth | Modules grid + cohesion panel on dashboard |

---

## After demo

| Step | Action |
|------|--------|
| 1 | Note gaps in [`K1_TENANT_RUNTIME_DEMO_REHEARSAL.md`](K1_TENANT_RUNTIME_DEMO_REHEARSAL.md) remaining gaps |
| 2 | Capture screenshots per [`K1_TENANT_RUNTIME_SCREENSHOT_CHECKLIST.md`](K1_TENANT_RUNTIME_SCREENSHOT_CHECKLIST.md) |
| 3 | If code changed: `npm run build` · `npm run tenant-demo:verify` |
| 4 | Link playbook from [`OPERATOR_DEMO_INDEX.md`](OPERATOR_DEMO_INDEX.md) |

**Follow-up options:** Pause (K1 complete) · **L4** usability pass · **K2** manual browser smoke.
