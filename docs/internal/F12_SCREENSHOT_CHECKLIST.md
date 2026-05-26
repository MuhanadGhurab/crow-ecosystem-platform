# F12 — Screenshot checklist

**Purpose:** Capture portfolio-ready visuals for README, CV, and talks.  
**Rule:** Dark theme, no secrets in DevTools, no real customer PII, no internal cuid IDs in filenames or captions.

**Storage:** [`docs/public/assets/screenshots/`](../public/assets/screenshots/)  
**Capture guide:** [`docs/public/assets/screenshots/README.md`](../public/assets/screenshots/README.md)

**Do not** auto-generate screenshots in CI unless existing tooling is explicitly run by an operator.

---

## Pre-capture

- [x] Staging or local with `AUTH_DISABLED` + `USE_MOCK_DATA` chosen intentionally (F13 local mock)
- [ ] Platform Admin session for admin/blueprint shots (staging live demo — still pending)
- [x] Window 1440×900, browser zoom 100%
- [x] Hide bookmarks bar; close unrelated tabs
- [x] Confirm no `.env` values visible on screen

**F13 capture:** [`scripts/capture-f13-screenshots.mjs`](../../scripts/capture-f13-screenshots.mjs) · Notes: [`F13_DEMO_REHEARSAL_NOTES.md`](F13_DEMO_REHEARSAL_NOTES.md)

---

## Shots

| # | Suggested filename | Route | What it proves | Public-safe | F13 status |
|---|-------------------|-------|----------------|-------------|------------|
| 1 | `homepage-hero.png` | `/` | Public positioning, hero + story clarity (F15.5) | **Yes** | **Recapture recommended** after F15.5 hero/IA change |
| 2 | `public-request.png` | `/request` | Governed intake | **Yes** | **Captured** → public |
| 3 | `architecture.png` | `/architecture` | Lifecycle + surfaces | **Yes** | **Captured** → public |
| 4 | `admin-operator-console.png` | `/admin/overview` | Pipeline buckets, operator command center | **Yes** | **Captured** → public |
| 5 | `admin-request-detail.png` | `/admin/requests/mock-req-meem` | Reference, next action, pipeline links | **No** (internal doc paths in UI) | **Captured** → **internal only** |
| 6 | `discovery-summary.png` | `/discovery/mock-req-meem-discovery/summary` | Sector discovery, handoff | **Yes** | **Captured** → public |
| 7 | `blueprint-overview.png` | `/blueprints/mock-bp-meem/overview` | Blueprint contract | **Yes** | **Captured** → public |
| 8 | `blueprint-readiness.png` | `/blueprints/mock-bp-meem/readiness` | Readiness gates | **Yes** | **Captured** → public |
| 9 | `blueprint-go-live.png` | `/blueprints/mock-bp-meem/go-live` | Go-live bridge (no provision clicked) | **Yes** | **Captured** → public |
| 10 | `meem-dashboard.png` | `/meem-global/dashboard` | Lighthouse CEM runtime | **Yes** | **Captured** → public |
| 11 | `cybercrow-dashboard.png` | `/meem-global/cybercrow/dashboard` | Trust orchestration on tenant | **Yes** | **Captured** → public |
| 12 | `sarea-preview.png` | `/sarea/preview` | Persona / adaptive UX | **Yes** | **Captured** → public |
| 13 | `rimal-dashboard.png` | `/rimal-construction/dashboard` | Second tenant, construction | **Yes** | **Not captured** (Entra on staging) |
| 14 | `admin-notifications.png` | `/admin/notifications` | Operator notification inbox | **Yes** | **Captured** → public |
| 15 | `najm-request-detail.png` | `/admin/requests/{requestId}` for `CROW-2026-ARAX9K` | Organic aviation pipeline (optional) | Staging only | **Not captured** (optional) |
| 16 | `login-sign-in.png` | `/login` | F18 auth UX: Microsoft + Google + email, RBAC footer | **Yes** | **F22 target** — run capture script |
| 17 | `pricing-advisory.png` | `/pricing` | F19 advisory tiers; no live checkout | **Yes** | **F22 target** |
| 18 | `cybercrow-evidence.png` | `/meem-global/cybercrow/evidence` | F21 evidence readiness catalog | **Yes** | **F22 target** |
| 19 | `cybercrow-grc.png` | `/meem-global/cybercrow/grc` | F21 GRC control mapping | **Yes** | **F22 target** |
| 20 | `sarea-studio-overview.png` | `/sarea/overview` | F20 SAREA studio home | **Yes** | **F22 target** |

**F22 master:** [`F22_PORTFOLIO_PUBLIC_DEMO_POLISH.md`](F22_PORTFOLIO_PUBLIC_DEMO_POLISH.md)

---

## Caption templates (public)

| Shot | Caption |
|------|---------|
| Homepage | Crow Ecosystem — adaptive enterprise orchestration platform |
| Request | Structured implementation request intake |
| Admin overview | Platform operator console with onboarding pipeline buckets |
| Blueprint readiness | Readiness gates before go-live |
| MEEM dashboard | CEM tenant workspace (logistics lighthouse scenario) |
| CyberCrow | Security and trust orchestration on the tenant |
| SAREA preview | Role-adaptive experience preview |

---

## Public-safe vs internal-only

| Public-safe | Internal-only (do not publish) |
|-------------|-------------------------------|
| Slugs `meem-global`, `rimal-construction` | Full URL with `{requestId}` / `{blueprintId}` cuid |
| Reference `CROW-2026-*` on staging | Database connection strings, Supabase keys |
| Sector labels (logistics, construction, aviation) | Najm/MEEM/Rimal contract or pricing |
| “Staging validation” wording | Operator runbook screenshots with CLI output |

---

## After capture

- [ ] Optimize PNG/WebP (reasonable file size) — `homepage-hero.png` still large
- [x] Embed in root [`README.md`](../../README.md) per screenshots README (subset linked)
- [ ] Update [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md) if routes changed
- [x] Check [`npm run public:mirror-manifest`](../../package.json) still excludes `docs/internal`

---

## Related

- [`F12_DEMO_ROUTE_INDEX.md`](F12_DEMO_ROUTE_INDEX.md)
- [`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md)
