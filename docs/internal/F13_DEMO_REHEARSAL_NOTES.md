# F13 — Demo rehearsal & screenshot capture

**Date:** 25 May 2026  
**Prerequisite:** F12 passed ([`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md))  
**Capture tooling:** [`scripts/capture-f13-screenshots.mjs`](../../scripts/capture-f13-screenshots.mjs) (Playwright, 1440×900, dark scheme)

---

## Environment

| Item | Value |
|------|--------|
| Base URL | `http://localhost:3000` |
| Auth | `AUTH_DISABLED=true` |
| Data | `USE_MOCK_DATA=true` |
| Health | `GET /api/health` OK before capture |
| Browser MCP | Unavailable (`browse ENOENT`) — Playwright script used instead |

**Not run:** staging Entra session, tenant provisioning, schema/seed changes, or Najm organic row navigation.

---

## What worked

- Full F12 short-path rehearsal against mock routes (`mock-req-meem`, `mock-bp-meem`, `mock-req-meem-discovery`) — all target pages returned HTTP 200.
- Automated capture produced **12 public-safe PNGs** under [`docs/public/assets/screenshots/`](../public/assets/screenshots/).
- Post-capture DOM polish (capture-time only) removed dev banners (`Auth bypass`, `USE_MOCK_DATA`), staging reference codes (`CROW-2026-*`), E2E smoke cards, and `docs/internal/` path strings where text-node hiding was sufficient.
- Homepage, architecture, request intake, discovery summary, blueprint trio, MEEM/CyberCrow dashboards, SAREA preview, and admin notifications are portfolio-ready without URL-bar mock IDs.

---

## What needs polish later (non-blocking)

| Item | Notes |
|------|--------|
| **Request detail public shot** | Mock request page still renders **Organic E2E checklist** with `docs/internal/…` paths; aggressive section-hide blanked the page. Keep **internal-only** capture until UI crop or a dedicated “demo capture” flag exists. |
| **Rimal dashboard** | `/rimal-construction/dashboard` requires Entra Platform Admin on staging; not captured in F13. Manual capture per playbook §3 step 8. |
| **Najm request detail** | Optional `CROW-2026-ARAX9K` shot — **not captured** (staging-only, caption discipline). |
| **File size** | `homepage-hero.png` ~2 MB full-page — consider WebP or hero-only crop for README. |
| **Operator console** | Lighthouse copy still names MEEM/Rimal; acceptable for demo, crop if portfolio wants zero tenant names. |
| **Live demo** | Re-run [`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md) on staging with Entra before investor-facing demo. |

---

## Screenshots captured

| File | Route | Location | Public-safe |
|------|-------|----------|-------------|
| `homepage-hero.png` | `/` | `docs/public/assets/screenshots/` | Yes |
| `architecture.png` | `/architecture` | public | Yes |
| `public-request.png` | `/request` | public | Yes |
| `admin-operator-console.png` | `/admin/overview` | public | Yes (no staging refs after polish) |
| `admin-request-detail.png` | `/admin/requests/mock-req-meem` | **`docs/internal/assets/screenshots/`** | **No** — internal doc paths visible |
| `discovery-summary.png` | `/discovery/mock-req-meem-discovery/summary` | public | Yes |
| `blueprint-overview.png` | `/blueprints/mock-bp-meem/overview` | public | Yes |
| `blueprint-readiness.png` | `/blueprints/mock-bp-meem/readiness` | public | Yes |
| `blueprint-go-live.png` | `/blueprints/mock-bp-meem/go-live` | public | Yes |
| `meem-dashboard.png` | `/meem-global/dashboard` | public | Yes |
| `cybercrow-dashboard.png` | `/meem-global/cybercrow/dashboard` | public | Yes |
| `sarea-preview.png` | `/sarea/preview` | public | Yes |
| `admin-notifications.png` | `/admin/notifications` | public | Yes |

**Not captured:** `rimal-dashboard.png`, `najm-request-detail.png` (see above).

---

## Screenshots excluded from public

| Asset | Reason |
|-------|--------|
| `docs/internal/assets/screenshots/admin-request-detail.png` | Surfaces `docs/internal/F8_…` and `F10_…` file paths in Organic E2E checklist |
| (missing) `rimal-dashboard.png` | Auth gate on staging — no mock tenant route |
| (missing) `najm-request-detail.png` | Real staging reference; optional and intentionally skipped |

---

## Demo readiness decision

| Gate | Result |
|------|--------|
| F12 playbook route order exercised (mock) | Pass |
| Public screenshot set for README/portfolio | Pass (12 files) |
| No secrets / no provision / no schema | Pass |
| MEEM / Rimal / Najm policies respected | Pass (no Najm tenant; Rimal not screenshotted) |
| Staging live demo | **Pending** — operator sign-in rehearsal not repeated in F13 |

**F13 acceptance:** **PASSED** — visual asset pack ready for internal review and public-safe portfolio embeds; live staging rehearsal remains a pre-demo operator step.

---

## Validation (F13 closeout)

```text
npm run typecheck          — pass
npm run lint               — pass
npm run public:mirror-manifest — pass (docs/public includes assets/screenshots/)
```

---

## Related

- [`F12_SCREENSHOT_CHECKLIST.md`](F12_SCREENSHOT_CHECKLIST.md) — status updated
- [`docs/public/assets/screenshots/README.md`](../public/assets/screenshots/README.md) — gallery index
