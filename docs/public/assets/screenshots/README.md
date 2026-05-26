# Screenshot gallery

PNG captures for the public GitHub README and portfolio use. Baseline captured in F13 (25 May 2026); **F22** adds refresh targets for homepage, login, pricing, CyberCrow evidence/GRC, and SAREA studio — see [`scripts/capture-f13-screenshots.mjs`](../../../../scripts/capture-f13-screenshots.mjs).

**Rules:** dark theme, no API keys in DevTools, no real customer PII, mock routes only (`mock-req-meem`, `mock-bp-meem`). Do not publish captures that show `docs/internal/` paths or unstaged `CROW-2026-*` references.

---

## Public assets (in this folder)

| File | Route | Caption hint |
|------|-------|----------------|
| `homepage-hero.png` | `/` | Crow Ecosystem — adaptive enterprise orchestration |
| `architecture.png` | `/architecture` | Lifecycle and platform surfaces |
| `public-request.png` | `/request` | Governed implementation intake |
| `admin-operator-console.png` | `/admin/overview` | Operator pipeline buckets |
| `discovery-summary.png` | `/discovery/mock-req-meem-discovery/summary` | Discovery handoff |
| `blueprint-overview.png` | `/blueprints/mock-bp-meem/overview` | Blueprint contract |
| `blueprint-readiness.png` | `/blueprints/mock-bp-meem/readiness` | Readiness gates |
| `blueprint-go-live.png` | `/blueprints/mock-bp-meem/go-live` | Go-live bridge (no provision clicked) |
| `meem-dashboard.png` | `/meem-global/dashboard` | CEM tenant workspace (logistics lighthouse) |
| `cybercrow-dashboard.png` | `/meem-global/cybercrow/dashboard` | Trust orchestration on tenant |
| `sarea-preview.png` | `/sarea/preview` | Role-adaptive experience preview |
| `admin-notifications.png` | `/admin/notifications` | Operator notification inbox |

### F22 refresh targets (capture when UI changed)

| File | Route | When to refresh |
|------|-------|-----------------|
| `homepage-hero.png` | `/` | After F15.5 homepage IA |
| `login-sign-in.png` | `/login` | After F18 sign-in polish |
| `pricing-advisory.png` | `/pricing` | After F19 advisory commercial line |
| `cybercrow-evidence.png` | `/meem-global/cybercrow/evidence` | After F21 evidence catalog |
| `cybercrow-grc.png` | `/meem-global/cybercrow/grc` | After F21 GRC mapping |
| `sarea-studio-overview.png` | `/sarea/overview` | After F20 studio controls |

Until recaptured, README may still show F13 baseline images for overlapping routes.

**Internal-only (not in this folder):** `admin-request-detail.png` → [`docs/internal/assets/screenshots/admin-request-detail.png`](../../../internal/assets/screenshots/admin-request-detail.png). Optional future: `rimal-dashboard.png`, `najm-request-detail.png` (staging + playbook).

---

## Recapture

```bash
# .env.local: AUTH_DISABLED=true  USE_MOCK_DATA=true
npm run dev
# separate terminal:
node scripts/capture-f13-screenshots.mjs
```

Requires one-time: `npm install playwright --no-save` and `npx playwright install chromium`.

---

## Embed in README

```markdown
![Crow Ecosystem homepage](./docs/public/assets/screenshots/homepage-hero.png)
![Platform architecture](./docs/public/assets/screenshots/architecture.png)
![Implementation request intake](./docs/public/assets/screenshots/public-request.png)
```
