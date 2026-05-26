# Public demo guide

**Audience:** Portfolio viewers, interviewers, contributors exploring the repo without internal runbooks.

**Positioning:** Crow Ecosystem is in **active development** with a **staging-validated** reference implementation — not a production launch or certified compliance product.

---

## What to open first

| Order | Surface | Route (local mock) | What it shows |
|-------|---------|-------------------|---------------|
| 1 | Homepage | `/` | Product story, three engines, lifecycle |
| 2 | Architecture | `/architecture` | Request → Discovery → Blueprint → Tenant |
| 3 | Implementation request | `/request` | Governed intake (no auto-provision) |
| 4 | Sign-in | `/login` | Microsoft, Google, and email paths (F18) |
| 5 | Pricing | `/pricing` | Advisory commercial framing (F19 — no live payments) |
| 6 | Operator console | `/admin/overview` | Pipeline buckets (mock data) |
| 7 | Blueprint readiness | `/blueprints/mock-bp-meem/readiness` | Gates before go-live |
| 8 | Tenant dashboard | `/meem-global/dashboard` | CEM workspace (logistics lighthouse) |
| 9 | CyberCrow | `/meem-global/cybercrow/dashboard` | Trust posture and SOC strip |
| 10 | SAREA Studio | `/sarea/overview` or `/sarea/role-mapping` | Experience orchestration (F20 controls) |

Use **mock slugs only** in public demos: `meem-global`, `mock-req-meem`, `mock-bp-meem`. Do not paste live staging URLs with real database IDs into public materials.

---

## Local mock walkthrough

```bash
cp .env.example .env
# AUTH_DISABLED=true
# USE_MOCK_DATA=true
npm install
npm run dev
```

Open `http://localhost:3000`. Optional scripted IDs: `npm run demo:meem` (prints mock paths only).

Full setup: [`SETUP.md`](SETUP.md)

---

## What screenshots represent

Gallery: [`assets/screenshots/README.md`](assets/screenshots/README.md)

| Image | Represents |
|-------|------------|
| `homepage-hero.png` | Public positioning and hero (refresh after major homepage IA changes) |
| `login-sign-in.png` | Auth UX — enterprise SSO + email (when captured) |
| `pricing-advisory.png` | Commercial tiers — advisory, not checkout (when captured) |
| `architecture.png` | Lifecycle and surface map |
| `cybercrow-dashboard.png` | CyberCrow on tenant — advisory posture |
| `cybercrow-evidence.png` | Evidence readiness catalog (when captured) |
| `sarea-preview.png` / `sarea-studio-overview.png` | Adaptive experience / studio controls |

Screenshots are captured in **dark theme**, **mock mode**, with dev-only banners hidden — never with API keys or customer PII visible.

---

## Demo vs staging vs production

| Mode | Safe for public story? | Notes |
|------|------------------------|-------|
| **Local mock** | Yes | Fastest for GitHub clones; `USE_MOCK_DATA=true` |
| **Staging** | Operators only | Real auth and DB; do not publish URLs with cuids |
| **Production** | Not claimed | Launch is a future phase when budget and client exist |

---

## What not to assume

- **Not** NCA or ISO certified from this UI alone
- **Not** a full GRC or SIEM replacement
- **Not** AI-driven security detection or compliance scoring
- **Not** live Saudi payment (Mada, Apple Pay, Tabby) — architecture documented, activation deferred
- **Not** file upload evidence vault — CyberCrow evidence is a **readiness catalog** (F21)
- **Not** every metric on screen is live telemetry — demo labels apply where mock data is used

---

## Product story (30 seconds)

1. A prospect submits a **structured request**.
2. Crow runs **Discovery** to understand sector, modules, identity, and experience.
3. A **Blueprint** contracts readiness before provision.
4. After go-live, **CEM** runs operations, **CyberCrow** surfaces trust and evidence readiness, and **SAREA** adapts the UI per role.

```text
Discovery understands.  Blueprint defines.
CEM runs.  CyberCrow protects.  SAREA adapts.
```

---

## Related public docs

- [`PORTFOLIO_BLURB.md`](PORTFOLIO_BLURB.md) — CV and interview copy
- [`PLATFORM_ENGINES.md`](PLATFORM_ENGINES.md) — CEM · CyberCrow · SAREA
- [`LIFECYCLE.md`](LIFECYCLE.md) — Pipeline phases
- [`ROADMAP.md`](ROADMAP.md) — Public strategic direction

Internal operator playbooks and staging IDs stay in `docs/internal/` (excluded from public mirror).
