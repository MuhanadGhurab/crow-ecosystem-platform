# C3 — Crow Brand & Homepage Identity

**Status:** Brand reference prototype — **CONDITIONAL PASS — HERO ART DIRECTION APPROVAL REQUIRED** (pending product-owner visual review)  
**Audience:** Engineering, design, product ownership  
**Verifier:** `npm run crow-brand-identity:verify` · `npm run crow-motion-identity:verify`  
**Architecture Lab:** `/admin/architecture-lab` → **Crow Brand Identity** section

---

## Purpose

Complete the C3 visual identity pass by making the Crow the unmistakable focal symbol of the Crow Ecosystem Platform **without** redesigning the approved public homepage architecture.

Visual continuity chain:

```text
Crow Motion Loader → Crow Hero Identity → Crow Background Atmosphere → Crow Portal Language → Crow Ecosystem Brand
```

---

## Brand principles

| Principle | Application |
|-----------|-------------|
| **One Crow identity** | Single SVG geometry source; contextual surface treatment per portal — not separate bird logos |
| **Intelligence, not aggression** | Calm, premium, observant — enterprise GCC software, not gaming or cyberpunk |
| **Structure preserved** | Nav, hero hierarchy, CTAs, lifecycle, engine cards, spacing, and responsive breakpoints unchanged |
| **Decorative vs semantic** | Hero crow is `aria-hidden`; product name and CTAs remain semantic and highest-contrast |
| **Performance first** | Inline SVG + CSS; no video, WebGL, or large raster heroes |
| **Reduced motion** | Static complete mark; ambient animation disabled under `prefers-reduced-motion` |

### Crow symbolism (product language)

The Crow represents: intelligence, observation, coordination, protection, adaptability, memory, and enterprise orchestration — not a mascot or sports mark.

---

## Mark anatomy (design language)

| Element | Brand use | Avoid |
|---------|-----------|-------|
| **Beak** | Directional lines, CTA sweep hints, route transitions | Literal beak-shaped buttons |
| **Eye** | Subtle status dot, CyberCrow observation metaphor | Large staring eye, glowing red |
| **Crown / head curve** | Section arcs, loader fill direction, card highlight masks | — |
| **Feather geometry** | Sparse separators, empty states | Feather wallpaper |

---

## Asset architecture

Canonical components under `src/components/brand/`:

| File | Role |
|------|------|
| `crow-svg-paths.ts` | **Single geometry source** — profile, motion outline, network nodes |
| `crow-mark-svg.tsx` | SVG renderer with variant styling |
| `crow-mark.tsx` | `CrowMark` — primary, motion, hero, monochrome, watermark, high-contrast |
| `crow-wordmark.tsx` | Text lockup |
| `crow-hero-background.tsx` | Reusable hero atmosphere (`intensity`, `position`, `motion`, `showNetwork`, `showGlow`) |
| `crow-brand-surface.tsx` | Portal identity examples |
| `crow-loading-mark.tsx` | `CrowLoadingMark` + `CrowStartupLoader` |
| `crow-app-shell.tsx` | Session-gated startup loader wrapper |

Public navigation reuses canonical SVG via `src/components/public/brand/crow-mark.tsx` (backward-compatible API).

### Variants

```ts
type CrowMarkVariant =
  | "primary"
  | "motion"
  | "hero"
  | "monochrome"
  | "watermark"
  | "high-contrast";
```

### Default homepage hero configuration

```text
intensity: balanced
position: center-right
motion: ambient
showNetwork: true
showGlow: true
```

---

## Loader-to-homepage continuity

1. First session visit: `CrowStartupLoader` draws motion outline (`crow-motion-stroke`), progress bar, soft glow.
2. On complete: fade out; `sessionStorage` key `crow-startup-loader-seen` prevents replay on ordinary navigation.
3. Homepage hero reveals the same geometry at larger scale via `CrowHeroBackground`.
4. **Reduced motion:** shorter timing (~280ms load + 200ms fade); static stroke; no ambient CSS.

Root layout wraps children in `CrowAppShell` (`src/app/layout.tsx`).

---

## Homepage integration

**Preserved:** `HOMEPAGE_HERO_HEADLINE`, primary/secondary CTAs, feature pills, section order, engine cards (CEM / CyberCrow / SAREA), lifecycle strip, footer structure.

**Added:**

- `CrowHeroBackground` inside `cc-hero-panel` (`src/components/public/hero-section.tsx`)
- Footer watermark (`CrowMarkSvg` variant `watermark`)
- Subtle ecosystem accents on engine cards (operational fabric / observation / adaptive intelligence)

**Not changed:** Button shapes, card wall layout, side-card hero regression, full-screen illustration takeover.

---

## Portal identity alignment

One Crow + contextual surface (`CrowBrandSurface`):

| Surface | Emphasis |
|---------|----------|
| Public Website | Ecosystem symbol |
| Account Portal | Guidance and entry |
| Client Portal | Organizational intelligence |
| ProCrow | Orchestration and control |
| Business Portal | Coordinated work |
| CyberCrow | Trust, observation, protection |
| SAREA | Adaptation and human understanding |

---

## Responsive behavior

| Breakpoint | Treatment |
|------------|-----------|
| Desktop | Large side-profile crow; controlled crop; text width protected |
| Tablet | Reduced scale; network detail simplified via CSS |
| Mobile (`≤640px`) | Lower opacity silhouette; network layer hidden; CTA priority |

CSS: `src/app/globals.css` — `.crow-hero-panel-bg`, mobile `@media (max-width: 640px)`.

---

## Accessibility

- Hero background: `aria-hidden="true"`
- Nav logo: `aria-label="Crow Ecosystem home"`
- No information conveyed only by decorative artwork
- `prefers-reduced-motion`: disables parallax, sweeps, node pulses, ambient keyframes
- Contrast overlays preserve headline readability at 200% zoom

---

## Performance

- Vector SVG only in hero (no MP4/WebGL/GIF)
- Server-renderable hero content; client loader isolated to `CrowAppShell`
- No layout shift from background layers (`absolute` positioning)
- Ambient motion uses CSS only (no extra animation libraries)

---

## Architecture Lab

Section **Crow Brand Identity** (`crow-brand-lab-section.tsx`) shows:

- Primary mark, wordmark, loading mark, hero concept
- Dark/light and monochrome variants
- Portal surface examples
- Mobile simplification and reduced-motion states

Labeled **Brand reference prototype** — not final trademark or legal clearance.

---

## Verification

```bash
npm run crow-brand-identity:verify
npm run crow-motion-identity:verify
npm run public-homepage:verify
```

Tests: `src/lib/brand/crow-brand-identity.test.ts`

**Constraints:** No new migrations in this pass; migration baseline remains **16** (C1 + C2 + C3 account + C3 legal). C3 authorization and legal acceptance flows unchanged.

---

## Related C3 documentation

- [`30-C3-ACCOUNT-REGISTRATION-VERIFICATION.md`](30-C3-ACCOUNT-REGISTRATION-VERIFICATION.md)
- [`C3_LEGAL_AGREEMENT_AND_CONSENT_ENGINE.md`](C3_LEGAL_AGREEMENT_AND_CONSENT_ENGINE.md)
- [`C3_EXISTING_ACCOUNT_AUTH_REQUEST_INVITE_MAPPING.md`](C3_EXISTING_ACCOUNT_AUTH_REQUEST_INVITE_MAPPING.md)

---

## Future work

- Product-owner visual sign-off on hero art direction
- Optional trademark / legal brand review
- Extend `CrowBrandSurface` to authenticated portal shells as those surfaces adopt C0/C3 tokens
- Screenshot capture for marketing mirror after PO approval
