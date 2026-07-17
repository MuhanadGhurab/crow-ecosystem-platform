# CROW.STORY — Responsive Implementation

## Breakpoints (`resolveStoryDeviceMode`)

| Mode | Condition |
|------|-----------|
| REDUCED_MOTION | OS preference or manual toggle |
| COMPACT | width ≤ 639px OR narrow split (width ≤ 899 && aspect < 0.85) |
| IPAD_PORTRAIT | portrait, width 768–1023 |
| IPAD_LANDSCAPE_STICKY | landscape, width 1024–1279 |
| DESKTOP_STICKY | width ≥ 1280 |

Not all viewports below 900px use Compact — iPad portrait uses interactive map card.

## Layout

- **Sticky:** map left ~52–58vw, copy scrolls right
- **Portrait:** map card 34–40dvh, copy below, full-width buttons
- **Compact:** mini-map 28dvh, minimal Crow motion, no parallax

## Chapter heights (desktop)

- Ch1: 120vh
- Ch2: 140vh

Mobile uses natural content height without forced desktop vh.
