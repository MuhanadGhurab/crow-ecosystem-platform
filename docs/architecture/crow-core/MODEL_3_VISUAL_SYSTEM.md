# MODEL.3 Visual System

**Status:** CURRENT

## Design tokens

Deep neutral surfaces, controlled glass, cyan/violet highlights, compact chips, high-contrast text, quiet gradients, precise borders — aligned with Model Forge / Tenant Studio.

## Animations

| Context | Duration |
|---------|----------|
| Small feedback | 120–160ms |
| Section transition | 180–240ms |
| Graph/layout | 280–420ms |

Compilation timeline reflects real local compute stages (not fake long-running jobs). `prefers-reduced-motion` skips stepped timeline animation.

## Components

- `StudioCompilationTimeline` — phase progression
- `StudioProvenanceDrawer` — path highlight on focus
- `StudioGraphCanvas` — layer entrance via `studioMotion`
- Blueprint Studio section transitions

## Avoided

Permanent moving backgrounds, infinite edge animation, decorative loading delays, motion-only authority meaning.

## Accessibility

Keyboard-accessible controls, reduced-motion support, no blocked interactions.
