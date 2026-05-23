# MEEM Global — Omar sign-off (Discovery · Blueprint · SAREA)

**Lighthouse tenant:** **MEEM Global** (`meem-global`) — first and largest customer on Crow; template for every future tenant.

**Twin admins (same tenant, different engine):**

| Admin | Engine | Tenant surfaces | Sign-off scope |
|-------|--------|-----------------|----------------|
| **Omar (MEEM)** | **SAREA** — adaptive experience | `/sarea/*`, `/{tenant}/dashboard`, blueprint **SAREA** tab, discovery **experience** | Personas, nav, widgets, density, mobile |
| **Muhanad (Crow)** | **CyberCrow** — security & compliance | `/{tenant}/cybercrow/*`, platform `/admin/audit` | Posture, audit, GRC, identity narrative |

Both are **integrated inside each tenant** — not separate products. On MEEM Global, Omar owns how roles *feel*; Muhanad owns what security *shows*. ERP/CEM is shared platform (Muhanad seeds; Omar validates SAREA layer only).

**Reference:** `CROW-2026-MEEM` · **Milestone:** M5 — MEEM SAREA acceptance

---

## Omar’s walkthrough (5 steps — ~15 min)

Use **platform admin** login (same class as Muhanad). MEEM Global is live after `npm run db:seed:meem`.

| # | Step | URL (MEEM live IDs) |
|---|------|---------------------|
| **1** | Discovery — **experience brief** | [`/discovery/cmpge193x0000vhws8nclouoi/experience`](http://localhost:3000/discovery/cmpge193x0000vhws8nclouoi/experience) |
| **2** | Blueprint — **SAREA acceptance tab** | [`/blueprints/cmpge196o0015vhws2r7akekx/sarea`](http://localhost:3000/blueprints/cmpge196o0015vhws2r7akekx/sarea) |
| **3** | SAREA studio — **preview hub** | [`/sarea/preview`](http://localhost:3000/sarea/preview) |
| **4** | Click **three persona buttons** → MEEM dashboard | Executive · Manager · Frontline (each opens `/meem-global/dashboard` with cookie-driven runtime) |
| **5** | **Sign at bottom** of this doc | Part D — M5 acceptance |

**Optional context (same session):** Blueprint pricing [`/blueprints/.../pricing`](http://localhost:3000/blueprints/cmpge196o0015vhws2r7akekx/pricing) — confirm SAREA Executive line (~5,799 SAR/mo) matches discovery package.

---

## Step 1 — Discovery experience (the brief)

**URL:** `/discovery/{requestId}/experience`

Omar confirms the **workshop record** for SAREA — what MEEM bought and what each persona needs.

| Check | Expected on MEEM Global |
|-------|-------------------------|
| SAREA package | **Executive** (5,799 SAR/mo) |
| Persona `executive` | Fleet KPIs, SLA breaches, regional hub map |
| Persona `manager` | Dispatch board, warehouse throughput |
| Persona `frontline` | Mobile-first shipment scan and POD |
| AI extras | Route optimization, demand forecast, anomaly detection, document intelligence |

- [ ] Discovery experience step matches MEEM workshop  
- [ ] Three persona requirement rows present  

*Full discovery depth (org, modules, Entra, security):* Appendix A below.

---

## Step 2 — Blueprint SAREA tab (acceptance)

**URL:** `/blueprints/{blueprintId}/sarea`

Blueprint is the **commercial + provision contract**. This tab proves discovery SAREA answers became tenant config.

| Check | Expected |
|-------|----------|
| Tenant linked | `meem-global` provisioned |
| Three profiles | executive · manager · frontline (with layout counts) |
| Names align with studio | MEEM Group CIO view · Hub operations manager · Dispatcher mobile |
| Studio link | “SAREA studio →” opens `/sarea/profiles` |

- [ ] Blueprint SAREA tab matches discovery Step 1  
- [ ] All three personas seeded on MEEM Global  

**Traceability:** Discovery package **Executive** → Blueprint pricing SAREA line → Blueprint SAREA tab → Runtime preview (Step 4).

---

## Step 3 & 4 — SAREA preview → three buttons

**URL:** `/sarea/preview`

Omar uses the **MEEM persona preview** block (platform staff — same admin access as Muhanad for studio).

| Button | What Omar validates on `/meem-global/dashboard` | Pass |
|--------|--------------------------------------------------|------|
| **Preview executive** | Fleet KPIs, reports nav, cybercrow posture widget, operational load | [ ] |
| **Preview manager** | Ops board, dispatch feel; no executive-only clutter | [ ] |
| **Preview frontline** | Compact layout, **POD mobile** widget, minimal nav (dashboard + tasks) | [ ] |
| **Clear preview** | Returns to default view | [ ] |

**Mobile spot-check:** With **frontline** preview active, narrow the browser — compact nav, POD visible, no reports/structure widgets.

**Role mapping (discovery → live tenant):**

| MEEM role | CEM slug | SAREA persona |
|-----------|----------|---------------|
| Group CIO | `tenant-admin` | executive |
| Hub Manager | `hub-manager` | manager |
| Dispatcher | `dispatcher` | frontline |

- [ ] Executive experience acceptable for MEEM demo  
- [ ] Manager / hub ops acceptable  
- [ ] Dispatcher / mobile acceptable  
- [ ] CyberCrow posture widget on exec/manager dashboard is OK in tone (Muhanad owns data; Omar signs UX fit)

*Studio deep-dive (optional):* `/sarea/profiles`, `/sarea/navigation`, `/sarea/widgets`, `/sarea/rules`, `/sarea/device-rules` — Appendix C.

---

## Step 5 — Sign-off (M5)

| Item | Omar |
|------|------|
| Discovery experience brief | [ ] Approved · [ ] Changes requested |
| Blueprint SAREA acceptance tab | [ ] Approved · [ ] Changes requested |
| Live personas on `meem-global` (preview buttons) | [ ] Approved · [ ] Changes requested |

**MEEM acceptance — SAREA (Omar)**

| Field | Value |
|-------|--------|
| Name | _________________________ |
| Title | SAREA experience owner, MEEM Holding |
| Date | _________________________ |
| Signature / email | _________________________ |

**Change requests:**

1. _______________________________________________
2. _______________________________________________

---

## Muhanad parallel (CyberCrow — same tenant)

Not Omar’s sign-off, but same **MEEM Global** integration pattern:

| Step | URL |
|------|-----|
| CyberCrow dashboard | `/meem-global/cybercrow/dashboard` |
| Logistics audit | `/meem-global/cybercrow/audit-logs?category=logistics` |
| Platform audit strip | `/admin/audit?category=logistics&tenant=meem-global` |

Future tenants: **Omar** repeats Steps 1–5 for SAREA; **Muhanad** for CyberCrow — both inside `/{tenant}/`.

---

## Before you start (local)

```bash
npm run db:seed:meem
npm run db:seed:meem:ops
npm run sarea:meem-upgrade   # if tenant pre-dates latest SAREA seeds
```

| Artifact | Live ID |
|----------|---------|
| Request | `cmpge193x0000vhws8nclouoi` |
| Blueprint | `cmpge196o0015vhws2r7akekx` |
| Tenant | `meem-global` |

**Mock path:** `mock-req-meem-discovery` → `mock-bp-meem` (same flow, mock IDs).

---

## Appendix A — Full discovery (optional)

| Step | URL | Expected (MEEM) |
|------|-----|-----------------|
| Organization | `/discovery/.../organization` | Logistics · 50–250 · multi-hub |
| Modules | `/discovery/.../modules` | Sales, logistics, warehouse, inventory, finance, CRM, HR |
| Roles | `/discovery/.../roles` | Hub Manager, Dispatcher |
| Identity | `/discovery/.../identity` | Microsoft Entra ID |
| Security | `/discovery/.../security` | Crow Sentinel + Crow Fortress |
| Summary | `/discovery/.../summary` | Multi-hub logistics, Entra, AI dispatch |

---

## Appendix B — Blueprint tabs (optional)

| Tab | URL |
|-----|-----|
| Overview | `/blueprints/cmpge196o0015vhws2r7akekx/overview` |
| Pricing | `/blueprints/cmpge196o0015vhws2r7akekx/pricing` |
| Readiness | `/blueprints/cmpge196o0015vhws2r7akekx/readiness` |
| Go-live | `/blueprints/cmpge196o0015vhws2r7akekx/go-live` |

---

## Appendix C — SAREA studio routes (optional)

| Route | Omar checks |
|-------|-------------|
| `/sarea/profiles` | MEEM display names |
| `/sarea/navigation` | Exec vs frontline nav keys |
| `/sarea/widgets` | Fleet KPIs / POD visibility matrix |
| `/sarea/rules` | Density per persona |
| `/sarea/device-rules` | Frontline mobile compact |

---

## Out of scope for Omar

Pipeline provision, Prisma, CyberCrow GRC catalog, ERP module data, Stripe, Azure deploy, `/admin/audit` implementation.

---

**Related:** [`SAREA_OMAR_SCOPE.md`](../SAREA_OMAR_SCOPE.md) · [`MEEM_GLOBAL.md`](MEEM_GLOBAL.md) · [`TEAM_OWNERSHIP.md`](../TEAM_OWNERSHIP.md) · M5 in [`MILESTONES.md`](../MILESTONES.md)
