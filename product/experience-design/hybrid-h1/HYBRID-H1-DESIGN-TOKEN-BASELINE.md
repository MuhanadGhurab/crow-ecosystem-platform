# Hybrid H1 — Design Token Baseline

| Field | Value |
|-------|-------|
| **Status** | FOUNDER-DIRECTED HYBRID — READY FOR FINAL VISUAL REVIEW |
| **Authority** | Prototype values for Hybrid H1 — not Product Code until authorized |
| **Implementation** | CSS variables + CSS modules / styled-jsx **RECOMMENDED** |
| **Tailwind** | **NOT AUTHORIZED** |
| **Component library** | **NOT AUTHORIZED** |

## Color tokens (prototype values)

```css
--ghv-bg-deep: #05080f;
--ghv-bg-base: #0b1018;
--ghv-bg-elevated: #121a26;
--ghv-bg-overlay: #1a2433;
--ghv-fg-primary: #e8eef6;
--ghv-fg-secondary: #9aa8b8;
--ghv-fg-inverse: #0b1018;
--ghv-accent-signal: #3ec9d6;
--ghv-accent-signal-dim: #1a6f78;
--ghv-accent-ceremony: #c4a35a;
--ghv-border-subtle: #243044;
--ghv-border-strong: #3a4d66;
--ghv-state-success: #5a9e7a;
--ghv-state-warning: #c9a24a;
--ghv-state-risk: #b85c5c;
--ghv-state-info: #6a8fa8;
--ghv-focus-ring: #3ec9d6;
```

## Typography scale

```css
--ghv-font-ar: "IBM Plex Sans Arabic", "Segoe UI", Tahoma, "Noto Sans Arabic", sans-serif;
--ghv-fs-display: clamp(2rem, 4vw, 3.25rem);
--ghv-fs-title: 1.5rem;
--ghv-fs-section: 1.15rem;
--ghv-fs-body: 1rem;
--ghv-fs-decision: 1.05rem;
--ghv-fs-signal: 0.9rem;
--ghv-fs-meta: 0.8rem;
--ghv-lh-body: 1.65;
--ghv-lh-tight: 1.35;
```

Font files: **not committed**. Loading = implementation debt.

## Spacing / layout

```css
--ghv-space-1: 0.25rem; /* 4px base */
--ghv-space-2: 0.5rem;
--ghv-space-3: 0.75rem;
--ghv-space-4: 1rem;
--ghv-space-6: 1.5rem;
--ghv-space-8: 2rem;
--ghv-measure-content: 42rem;
--ghv-measure-portal: 72rem;
--ghv-measure-topology: min(100%, 52rem);
--ghv-radius-none: 0;
--ghv-radius-sm: 2px;
--ghv-radius-md: 4px;
```

## Shadows / glow / motion

```css
--ghv-shadow-soft: 0 1px 0 rgba(0,0,0,0.35);
--ghv-glow-signal: 0 0 24px rgba(62,201,214,0.22); /* max one per view */
--ghv-motion-micro: 120ms;
--ghv-motion-functional: 220ms;
--ghv-motion-ceremony: 480ms;
--ghv-ease: cubic-bezier(0.22, 1, 0.36, 1);
```

## Breakpoints / z-index

```css
/* 640 / 960 / 1200 */
--ghv-z-base: 1;
--ghv-z-stage: 10;
--ghv-z-ribbon: 20;
--ghv-z-drawer: 40;
--ghv-z-overlay: 50;
--ghv-z-focus: 60;
```

## Hard rules

Max one soft cyan glow/view · gold ceremony-only · ≤4 depth levels · borders > heavy shadows · visible focus · reduced-motion kills continuous movement · no critical meaning in opacity alone.
