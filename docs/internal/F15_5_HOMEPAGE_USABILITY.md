# F15.5 — Homepage usability audit

**Date:** 25 May 2026  
**Route:** `/` (`src/app/(public)/page.tsx`, `src/components/public/hero-section.tsx`)

## Five-second test (before changes)

| Question | Pre-F15.5 assessment |
|----------|------------------------|
| What is this? | Partially clear — “Crow Ecosystem Platform” is visible, but the brand reads as product name + architecture jargon before outcome. |
| Who is it for? | Weak — no dedicated “built for” block; industries live on a separate page. |
| What problem does it solve? | Buried — long `PLATFORM_HERO_STATEMENT` (single dense sentence) requires careful reading. |
| What can I do next? | Moderate — “Start your ecosystem” exists, but competes with hero engine cards and an 8-step chip row. |
| Why trust it? | Weak — stats show tier/module counts (internal catalog sizing), not validation proof; case studies are “coming soon.” |

## Section-by-section findings

### Hero (`hero-section.tsx`)

| Check | Finding |
|-------|---------|
| First headline | “Crow Ecosystem Platform” — recognizable but not outcome-first. |
| Value in 5 seconds | Tagline “Where Organizations Become Intelligent” is strong; supporting paragraph is too long. |
| Primary CTA | Present (`/request`) but label “Start your ecosystem” is slightly abstract. |
| Secondary CTA | Present (`/architecture`). |
| Too abstract / technical | Hero embeds 3 engine cards + full 8-step lifecycle — high cognitive load before scroll. |
| Mobile | Two-column layout works; chip row horizontal scroll is acceptable. |

### Page order (pre-F15.5)

1. Hero (heavy: engines + lifecycle)
2. Crow engines bento (5 cards: Discovery, Blueprint, CEM, CyberCrow, SAREA)
3. Stats (tier/module/package counts)
4. Lifecycle strip
5. Intelligence layer (Discovery + Blueprint again)
6. AI extras
7. Architecture link
8. Case studies coming soon
9. Final CTA

**Issue:** Engines and lifecycle appear twice; discovery/blueprint explained before “how it works”; trust proof late.

### CEM / CyberCrow / SAREA

| Engine | Pre-F15.5 |
|--------|-----------|
| CEM | Identity copy exists but mixed with discovery/blueprint in same grid. |
| CyberCrow | Card + preview — good visual, technical description. |
| SAREA | Same grid — “adaptive role experience” needs plainer ops language. |
| RBAC vs SAREA | Not stated on homepage. |

### CTAs

- Multiple competing paths in hero and engines section.
- Primary path `/request` not reinforced consistently in section labels.

### Trust / proof

- No public-safe validation narrative on homepage.
- Stats (3/12/3) read as product catalog, not customer outcomes.
- No fake compliance claims observed (good).

### UX / accessibility

- Heading hierarchy generally OK (h1 in hero).
- Some `text-[10px]` labels — borderline for readability.
- Glass/dark theme consistent with brand.
- Button classes consistent (`cc-btn-primary`, `cc-btn-secondary`).

### Public / internal boundary

- No internal IDs in public copy (good).
- Mock routes referenced only on other pages, not homepage (good).

## F15.5 remediation plan

1. Simplify hero: outcome headline, short plain explainer, three CTAs (primary/secondary/tertiary).
2. Remove duplicate engine + lifecycle blocks from hero.
3. Add “How it works” (6 steps) immediately after hero.
4. Add focused “Three engines” section with plain language + RBAC line.
5. Add “Built for” audiences / sectors (public-safe).
6. Reorder: Hero → How it works → Three engines → Built for → Lifecycle → Trust → Extras → Case studies → Final CTA.
7. Demote or remove duplicate intelligence layer and catalog stats from above-the-fold flow.
8. Add trust/proof section with honest staging validation wording.

## Post-implementation (25 May 2026)

| Check | Result |
|-------|--------|
| Hero clarity | Outcome-first headline + short explainer; three CTAs |
| How it works | Six-step section added |
| Three engines | Dedicated section with RBAC/SAREA line |
| Built for | Four audience cards + link to `/industries` |
| Trust | Public-safe proof bullets + honest scope line |
| IA order | Hero → How it works → Engines → Built for → Lifecycle → Trust → … |
| Validation | `typecheck`, `lint`, `build`, `public:mirror-manifest` pass |
| Screenshots | `homepage-hero.png` — recapture recommended (F12 checklist) |

## Acceptance

**F15.5 — PASSED** (25 May 2026). See [`PROJECT_STATUS.md`](PROJECT_STATUS.md) and [`MILESTONES.md`](MILESTONES.md).
