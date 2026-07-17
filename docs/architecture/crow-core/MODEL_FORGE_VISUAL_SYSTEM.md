# Model Forge Visual System

**Status:** CURRENT (MODEL.2 refinement)

## Studio components

| Component | Path |
|-----------|------|
| StudioShell | `src/components/procrow/studio/studio-shell.tsx` |
| StudioModeSwitcher | `studio-mode-switcher.tsx` |
| StudioGraphCanvas | `studio-graph-canvas.tsx` |
| StudioScenarioDiff / StudioInspector | `studio-scenario-diff.tsx` |

## Visual language

- Deep neutral backgrounds (`#0d1117`, `#080c12`)
- Controlled glass surfaces, cyan/violet highlights
- Clean borders, soft shadows, strong text contrast

## Motion

`studio-motion.ts` — feedback 140ms, panel 200ms, layout 360ms. `prefers-reduced-motion` respected.

## Workspace modes

Compose, Graph, Personas, Workflows, Entities, Scenario Compare, Validation, Export.
