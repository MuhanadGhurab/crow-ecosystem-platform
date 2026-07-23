# VISUAL ASSET AND MOTION TECHNOLOGY DECISION MATRIX

| Field | Value |
|-------|-------|
| **Document** | Technology Decision Matrix |
| **Gate** | GHV.CROW-IDENTITY.1D |
| **Starting HEAD** | `5c6f2f4aa18e438eafdcebf05f917d9d9b5de5ca` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **RECOMMENDATION LOCKED · NOT IMPLEMENTED** |


| Option | Semantic | A11y | Reduced-motion | Determinism | Perf | Diffability | Security | Offline | Size | 3D future | Maintain | License | Complexity | Decision |
|--------|----------|------|----------------|-------------|------|-------------|----------|---------|------|-----------|----------|---------|------------|----------|
| SVG | Excellent | Excellent | Excellent | Excellent | High | High | High | Yes | Low | Deriv | High | Open | Low | **Adopt static SoT** |
| CSS/WAAPI | Good | Good | Good | Good | High | High | High | Yes | Low | N/A | High | Open | Low | **Adopt near-term motion** |
| Canvas | Medium | Harder | Medium | Medium | Med | Low | Med | Yes | Med | Med | Med | Open | Med | Not primary |
| WebGL | Medium | Harder | Medium | Medium | Var | Low | Med | Yes | High | High | Low | Open | High | Later spike only |
| Lottie | Medium | Medium | Medium | Medium | Med | Low | Med | Yes | Med | Low | Med | Check | Med | Not adopted without spike |
| Rive | Medium | Medium | Medium | Medium | Med | Low | Med | Yes | Med | Low | Med | Check | Med | Not adopted without spike |
| Sprite sheets | Low | Medium | Medium | High | Med | Low | High | Yes | Med | Low | Med | Open | Med | Optional fallback |
| glTF 3D | Future | Harder | Medium | Medium | Var | Low | Med | Yes | High | Excellent | Low | Check | High | Optional derivative later |

## Direction

```text
Static identity source of truth: SVG vector assets
Near-term motion: SVG + CSS/WAAPI-compatible motion grammar
3D: Future optional derivative, not authoritative source
Lottie/Rive/WebGL: Not adopted without later technical spike and authorization
```

This Gate does **not** install or implement a renderer.
