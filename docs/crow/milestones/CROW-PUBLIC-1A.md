# CROW.PUBLIC.1A — Canonical Public Homepage V2 Preview

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.1A |
| **Status** | Complete — pending owner **visual** acceptance |
| **Phase** | Phase 1 — Final Public Service Presentation |
| **Branch** | `feat/first-tenant-golden-path` |
| **Preview route** | `/preview/public-home` |
| **Authority** | [`09-PUBLIC-EXPERIENCE.md`](../09-PUBLIC-EXPERIENCE.md), [`02-CANONICAL-LIFECYCLE.md`](../02-CANONICAL-LIFECYCLE.md) |

## Purpose

Coded, production-intent, **certification-only** preview of the approved public homepage V2 for owner visual review. Not a Production homepage replacement. Not a scroll-story continuation.

## Protected boundaries (confirmed)

- Real `/` homepage unchanged
- Global public navigation unchanged
- Scroll-story experiment frozen — not removed
- No auth, Request, Discovery, Blueprint, tenant, commercial, subscription, or CroAI behavior changes
- No database migrations or hosted business writes

## Certification gating

- `assertPublicV2PreviewEnabled()` → 404 unless `FTGP_CERTIFICATION_MODE=true`
- Metadata: `robots: { index: false, follow: false }`
- Preview navigation isolated to preview route only

## Components created

| Component | Role |
|-----------|------|
| `PublicPageShell` | Max-width shell, overflow containment |
| `PublicPreviewNavigation` | Preview-only v2 navigation |
| `PublicHeroSection` | Hero + CTAs |
| `PublicOperatingDiagram` | Four-stage transformation diagram |
| `PublicBeginsDifferentlySection` | Traditional vs Crow comparison |
| `PublicLifecycleExplorer` | Six-step click/tap lifecycle |
| `PublicJourneySection` / `PublicJourneyCard` | NEW / TRANSFORM journeys |
| `PublicBlueprintToWorkspaceSection` | Product demonstration wrapper |
| `PublicBlueprintPreview` | Five Blueprint tabs |
| `PublicSareaRolePreview` | Five SAREA roles |
| `PublicRuntimePreview` | Five runtime areas |
| `PublicGovernedFoundationSection` | Foundation + trust evidence |
| `PublicFoundationDiagram` | CEM, CyberCrow, SAREA, ProCrow layers |
| `PublicFinalCtaSection` | Final CTA |
| `RepresentativePreviewLabel` | Non-live data disclaimer |

Supporting libs: `src/lib/public-v2/` (routes, navigation, lifecycle, representative-data, certification-gate, motion).

## CTA destinations (preview)

| Action | Destination |
|--------|-------------|
| Build a New Organization | `#public-v2-journey-new` (pending `/new-organization`) |
| Transform an Existing Organization | `#public-v2-journey-transform` (pending `/transform-existing`) |
| See How Crow Works | `#public-v2-how-crow-works` |
| Sign In | `/login` |
| Discuss Your Organization | `/request` (secondary — not primary journey) |

## Verification gates

```bash
npm run public-v2-preview-readiness:test
npm run public-v2-bundle-containment:verify
npm run typecheck
npm run lint
npm run build
```

## Known visual limitations

- Hero CTAs scroll to journey cards until `/new-organization` and `/transform-existing` ship
- Platform submenu links anchor to preview sections (not separate platform pages)
- Representative org name is fictional static data (`Al-Najd Supply Collective`)
- Certification deploy may require Vercel SSO for protected preview URL
- Owner visual acceptance not claimed by automated gates

## Owner visual checklist

- [ ] Professional enterprise homepage — not generic ERP modules
- [ ] Hero readable; four-stage diagram understandable in ~3 seconds
- [ ] Crow Begins Differently balanced and mobile-readable
- [ ] Lifecycle explorer: click/tap only, keyboard works, active state beyond color
- [ ] Build New and Transform feel like one service, two entry paths
- [ ] Blueprint → SAREA → Runtime feels like one product progression
- [ ] Five Blueprint tabs, five SAREA roles, five Runtime areas
- [ ] CEM, CyberCrow, SAREA, ProCrow as one governed foundation (not four products)
- [ ] No flying Crow, no scroll story, no fake live tenant
- [ ] Representative preview labels visible
- [ ] Responsive: desktop, iPad landscape/portrait, mobile
- [ ] `prefers-reduced-motion` acceptable

## Next safe milestone

**CROW.PUBLIC.1B** — Owner visual acceptance record and promotion decision (or homepage replacement planning after acceptance).

Do not replace `/` until owner explicitly authorizes.

## Owner review status

**Pending visual acceptance**
