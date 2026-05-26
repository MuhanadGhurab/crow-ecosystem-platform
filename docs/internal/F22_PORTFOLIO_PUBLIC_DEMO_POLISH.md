# F22 — Portfolio / public demo polish

**Date:** 25 May 2026  
**Constraint:** No paid infrastructure · no schema changes · no production launch claim  
**Decision:** **PASSED**

---

## Part 1 — Public portfolio audit

### Professional today

| Asset | Assessment |
|-------|------------|
| Root [`README.md`](../../README.md) | Strong positioning, engines table, lifecycle, tech stack, mock quick start, no production overclaim |
| [`docs/public/README.md`](../public/README.md) | Clear index; now links demo guide and portfolio blurb |
| [`ARCHITECTURE.md`](../public/ARCHITECTURE.md) | Lifecycle and surfaces map — still accurate |
| [`PLATFORM_ENGINES.md`](../public/PLATFORM_ENGINES.md) | CEM / CyberCrow / SAREA separation |
| [`LIFECYCLE.md`](../public/LIFECYCLE.md) | Request → go-live narrative |
| [`MULTI_TENANT.md`](../public/MULTI_TENANT.md) | Slug model without live cuids |
| F13 screenshot gallery (12 PNGs) | Consistent dark enterprise captures |

### Outdated or stale (addressed in F22)

| Item | Issue | F22 action |
|------|-------|------------|
| [`ROADMAP.md`](../public/ROADMAP.md) | “In flight” listed Discovery/Blueprint/CyberCrow/SAREA as if not delivered | Rewritten — recent themes + F23 gate |
| Homepage hero PNG | Predates F15.5 IA | Listed F22 recapture target |
| No `login-sign-in.png` | F18 login not in gallery | Added to capture script + checklist |
| CyberCrow public copy | Missing evidence/GRC advisory surfaces | Updated [`CYBERCROW.md`](../public/CYBERCROW.md) |
| SAREA public copy | F20 studio depth under-explained | Updated [`SAREA.md`](../public/SAREA.md) |
| No demo walkthrough doc | Interviewers need route order | Created [`DEMO_GUIDE.md`](../public/DEMO_GUIDE.md) |
| No CV copy doc | Scattered one-liner in README only | Created [`PORTFOLIO_BLURB.md`](../public/PORTFOLIO_BLURB.md) |

### Over-explains (trimmed)

- Internal phase numbers (F17–F21) remain **internal only** — not added to public roadmap body.

### Under-explains (fixed)

- Evidence/GRC = **advisory readiness**, not certification
- Saudi payments = **architecture**, not live checkout
- Demo vs staging vs production positioning in demo guide

### Public / internal boundary risks

| Check | Result |
|-------|--------|
| `docs/internal` in public mirror | **Excluded** — `prepare-public-mirror.mjs` |
| Secrets in `docs/public` | **None** — rg for service_role / long cuids: clean |
| Mock IDs in public docs | Only `mock-req-meem`, `mock-bp-meem`, `meem-global` — intentional |
| `admin-request-detail.png` | **Internal only** — unchanged |

---

## Part 2 — Screenshot refresh

| Target | Status | Notes |
|--------|--------|-------|
| `homepage-hero.png` | **Skipped (documented)** | F22 capture script includes route; Playwright not installed in workspace |
| `login-sign-in.png` | **Skipped (documented)** | New file; run capture when Playwright available |
| `pricing-advisory.png` | **Skipped (documented)** | New file |
| `cybercrow-evidence.png` | **Skipped (documented)** | New file |
| `cybercrow-grc.png` | **Skipped (documented)** | New file |
| `sarea-studio-overview.png` | **Skipped (documented)** | New file |
| F13 baseline (12 PNGs) | **Retained** | Still valid for portfolio; README embeds subset |

**Operator recapture (no paid tools):**

```bash
# Terminal 1
AUTH_DISABLED=true USE_MOCK_DATA=true npm run dev

# Terminal 2 (one-time)
npm install -D playwright && npx playwright install chromium
node scripts/capture-f13-screenshots.mjs
```

Script: [`scripts/capture-f13-screenshots.mjs`](../../scripts/capture-f13-screenshots.mjs) — extended with F22 routes.

Checklist: [`F12_SCREENSHOT_CHECKLIST.md`](F12_SCREENSHOT_CHECKLIST.md) rows 17–20.

---

## Part 3 — README polish

- Portfolio one-liner aligned with [`PORTFOLIO_BLURB.md`](../public/PORTFOLIO_BLURB.md)
- Links to demo guide and CV blurb
- CyberCrow row mentions evidence readiness
- Status table: cost-controlled note, F23 production gate, no launch overclaim

---

## Part 4 — Public docs polish

| File | Change |
|------|--------|
| `docs/public/README.md` | Portfolio & demos section |
| `docs/public/ROADMAP.md` | Recent delivery + F23 gate |
| `docs/public/CYBERCROW.md` | Evidence/GRC routes + advisory section |
| `docs/public/SAREA.md` | Studio controls + demo guide link |
| `docs/public/assets/screenshots/README.md` | F22 target table |

---

## Part 5 — Public demo guide

Created: [`docs/public/DEMO_GUIDE.md`](../public/DEMO_GUIDE.md)

---

## Part 6 — Portfolio blurb

Created: [`docs/public/PORTFOLIO_BLURB.md`](../public/PORTFOLIO_BLURB.md)

---

## Part 7 — Public / internal boundary

| Control | Pass |
|---------|------|
| `docs/internal` excluded from mirror | Yes |
| No `.env` in mirror | Yes |
| Public screenshots mock-only slugs | Yes |
| No fake AI / compliance / production claims in new copy | Yes |
| No private customer details | Yes |

---

## Part 8 — Validation

| Command | Result |
|---------|--------|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** |
| `npm run public:mirror-manifest` | **PASS** |
| `npm run simulate:vercel-build:staging` | Not re-run (optional; passed in prior phases) |

No migrations · no seeds · no paid services activated.

---

## Part 9 — Acceptance

| # | Criterion | Met |
|---|-----------|-----|
| 1 | Public portfolio audit documented | Yes — this doc §1 |
| 2 | Screenshots refreshed or documented skipped | Yes — §2 |
| 3 | README polished | Yes |
| 4 | Public docs polished | Yes |
| 5 | Public demo guide exists | Yes |
| 6 | Portfolio blurb exists | Yes |
| 7 | Public/internal boundary clean | Yes |
| 8 | typecheck / lint / build | Yes |
| 9 | public mirror | Yes |
| 10 | No paid infra / forbidden scope | Yes |

**F22:** **PASSED**

---

## Remaining portfolio gaps

1. Run Playwright capture locally to refresh F22 PNGs (especially homepage, login, pricing).
2. Embed new PNGs in root README when files exist on disk.
3. Optional: `simulate:vercel-build:staging` re-run before external demo day.
4. F23 — production launch remains gated on budget/client.

---

## Related

- F13: [`F13_DEMO_REHEARSAL_NOTES.md`](F13_DEMO_REHEARSAL_NOTES.md)
- F21: [`F21_CYBERCROW_EVIDENCE_GRC_DEPTH.md`](F21_CYBERCROW_EVIDENCE_GRC_DEPTH.md)
- Status: [`PROJECT_STATUS.md`](PROJECT_STATUS.md) · [`MILESTONES.md`](MILESTONES.md)
