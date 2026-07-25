# Hybrid H1 — Accessibility and Responsive Contract

| Field | Value |
|-------|-------|
| **Status** | FOUNDER-DIRECTED HYBRID — READY FOR FINAL VISUAL REVIEW |
| **Conflict rule** | Direction **B** governs when atmosphere conflicts with usability |

## Required

| Concern | Contract |
|---------|----------|
| RTL landmark order | `banner` → skip link → `main` → complementary (RAVEN/signal) → contentinfo |
| Keyboard focus | Visible cyan ring; logical order; no trap except drawers |
| Skip to primary decision | Link on Mission screens |
| Topology | Textual state summary always present; non-color encoding (shape/density/label) |
| Live regions | Consequence / world-state changes `aria-live=polite` |
| Drawers | Focus trap · Esc closes · restore focus |
| Crowprint boundary | Screen-reader wording mirrors explicit provisional language |
| Touch | ≥44px guidance for primary actions |
| Headings | One `h1` per view; nested sections |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` + prototype toggle |

## Responsive

| Break | Behavior |
|-------|----------|
| ≥1200 | Full Mission split: topology + console |
| 960–1199 | Narrower topology; stacked ribbon |
| ≤640 | Decisions first; topology compact; signal/RAVEN drawers |

No horizontal-only essential interactions. Mobile must preserve world feeling without LMS card stacks.
