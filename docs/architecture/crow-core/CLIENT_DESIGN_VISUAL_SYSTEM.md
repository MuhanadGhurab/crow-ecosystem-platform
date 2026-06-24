# Client Design Visual System

> **Status:** PARTIAL — CROW.DISCOVERY.2 certification  
> **Components:** `src/components/client-enterprise-design/`

## Intent

Client-facing experience is related to Crow but lighter and more welcoming than ProCrow control-tower density.

## Tokens and patterns

- Clean dark / adaptive neutral surfaces
- Controlled purple and cyan accents (`client-design-journey.tsx`)
- Large readable selection cards
- Compact comparison tables
- Recommendation badges (`Recommended`, `Optional`, `Advanced`)
- Semantic stepper with progress indication

## Motion (`prefers-reduced-motion`)

| Interaction | Duration |
| ----------- | -------- |
| Small feedback | 120–160ms |
| Step / panel | 180–260ms |
| Model comparison / workflow | 280–420ms |

Motion communicates state change only — no motion-only information, no blocked interactions, no permanent decorative animation.

## Responsive

- Mobile: one primary step at a time, collapsed live summary
- Workflow graph replaced with focused cards on narrow viewports
- Comparison tables scroll within container — no page overflow

## Accessibility

Semantic stepper, keyboard-operable cards, visible focus rings, non-color-only recommendation states, screen-reader-friendly summaries.
