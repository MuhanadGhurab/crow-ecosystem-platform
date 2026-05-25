# F12 — Operator demo playbook

**Purpose:** Repeatable pre-flight and live demo procedure for Platform Admin-led walkthroughs.  
**Companion:** [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md) · [`F12_DEMO_ROUTE_INDEX.md`](F12_DEMO_ROUTE_INDEX.md)

**Last updated:** 25 May 2026

---

## 1. Pre-demo checks (T-30 min)

| Check | Command / action | Pass? |
|-------|------------------|-------|
| Staging URL loads | Open `https://crow-ecosystem-platform.vercel.app` | |
| Health | `GET /api/health` (optional) | |
| Typecheck / build (same commit as deploy) | `npm run typecheck` · `npm run build` | |
| MEEM ids | `npm run meem:ids:staging` | |
| Rimal verify | `npm run tenant:verify:rimal` | |
| Pipeline verify | `npm run request:pipeline:verify` | |
| Najm organic row | `npm run onboarding:verify -- --reference=CROW-2026-ARAX9K --expect-blueprint --expect-sector=aviation` | |
| Entra session | Log in as **Platform Admin** in incognito window | |
| Second browser tab | MEEM dashboard logged-in or admin can open tenant | |

**Do not** run migrations, seeds, or `onboard:tenant` unless this demo explicitly includes provisioning.

---

## 2. Role & login

| Requirement | Detail |
|-------------|--------|
| **Required** | Platform Admin (Microsoft Entra SSO on staging) |
| **Optional** | MEEM tenant user for persona cookie demo |
| **Not required** | Client portal sponsor for core F12 flow |

If redirected to `/login` on `/admin/*`: complete Entra sign-in; confirm user has platform admin role in app metadata.

**Recovery:** Clear cookies → retry login → use staging URL from [`F2_PRODUCTION_CONTROLS.md`](F2_PRODUCTION_CONTROLS.md) if redirects loop.

---

## 3. Recommended route order

Follow [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md) steps 1 → 12, or **short path:**

1. `/` → `/request`
2. `/admin/overview`
3. `/admin/requests` → open Najm or active pipeline request
4. `/discovery/{requestId}/summary`
5. `/blueprints/{blueprintId}/overview` → `readiness` → `go-live` (**no provision**)
6. `/meem-global/dashboard` → `/meem-global/cybercrow/dashboard`
7. `/sarea/preview`
8. `/rimal-construction/dashboard`

---

## 4. What to avoid clicking

| Control | Why |
|---------|-----|
| **Provision tenant** on go-live | Creates real tenant; only if demo script allows |
| **Reject / delete** request | Mutates staging data |
| **Promote** actions without script | May change lifecycle unexpectedly |
| **Stripe checkout** | Advisory scaffold only — not live enforcement |
| **Bulk seed / reset scripts** | Out of demo scope |
| **Settings that expose secrets** | Never open `.env` or Vercel env UI on screen share |

---

## 5. Talking points (advisory honesty)

| Topic | Say | Do not say |
|-------|-----|------------|
| **Billing** | “Package and plan surfaces are advisory; Stripe is integrated as scaffold, not production enforcement.” | “Subscriptions are live and enforced” |
| **Auth** | “Entra SSO on staging; SCIM/group sync is roadmap, not shipped.” | “Full Entra automation is live” |
| **CyberCrow** | “Trust orchestration, audit visibility, NCA-aware narrative on the tenant.” | “Certified compliant / audited production” |
| **SAREA** | “Persona-adaptive UX within RBAC — logistics personas on MEEM.” | “AI generates all layouts with no config” |
| **AI** | “Governed AI extras in blueprint context where configured.” | “Autonomous AI operator” |
| **Najm** | “Organic aviation request validated through operator pipeline on staging.” | “Najm is a production customer” unless commercially true |
| **MEEM / Rimal** | “Lighthouse and second-tenant scenarios on staging.” | Publish internal IDs or contract terms |

---

## 6. If data is missing

| Symptom | Recovery |
|---------|----------|
| Empty `/admin/requests` | Wrong env — confirm `.env.staging` / staging URL; run verify scripts |
| Najm row missing | Re-run F11 scripts only if approved; else use MEEM request for pipeline half |
| Blueprint link 404 | Discovery incomplete — open MEEM blueprint via `meem:ids:staging` |
| MEEM dashboard empty | Tenant inactive — `npm run tenant:verify:rimal` + MEEM scripts |
| 307 to login on tenant | Expected without membership — use admin preview or Platform Admin with tenant access |
| Mock data on staging | **Never** demo with `USE_MOCK_DATA=true` on shared staging |

---

## 7. Post-demo

- [ ] Note questions for backlog (no hotfixes during demo)
- [ ] Capture screenshots per [`F12_SCREENSHOT_CHECKLIST.md`](F12_SCREENSHOT_CHECKLIST.md) if needed
- [ ] Do not share screen recordings with internal cuid IDs visible unless trimmed

---

## 8. Public / internal boundary

| OK to show externally | Keep internal |
|----------------------|---------------|
| Slugs, public routes, engine story | `docs/internal/*` runbooks with IDs |
| Staging URL | Database URLs, API keys |
| Reference codes in live demo | Prisma IDs in slides |

---

## Related

- F11 sign-off — [`F11_ORGANIC_BROWSER_E2E_SIGNOFF.md`](F11_ORGANIC_BROWSER_E2E_SIGNOFF.md)
- F8 manual checklist — [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md)
