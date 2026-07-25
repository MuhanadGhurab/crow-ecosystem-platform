# Design-System Token Proposal (Framework-Neutral)

| Field | Value |
|-------|-------|
| **Status** | PROPOSAL ONLY — **do not implement / do not install frameworks** |
| **Visual authority** | Pending Founder direction selection |
| **Current CSS tokens** | Technical starting point only — not visual authority |

## Recommended implementation approach (evidence-based)

| Option | Assessment |
|--------|------------|
| **A. CSS variables + CSS modules / styled-jsx** | **RECOMMENDED** — matches current stack (`globals.css`, Mission styled-jsx); zero new dependency; Preview/CI unchanged; fits Arabic logical properties |
| B. Tailwind with governed tokens | Feasible later but requires install authorization, config governance, and purge discipline; conflicts with “do not install Tailwind” for this design phase |
| C. Other (Emotion, Sass-only, etc.) | Unnecessary complexity vs A |

**Recommendation:** Adopt **Option A** when implementation is authorized. Revisit Tailwind only if Founder explicitly authorizes a styling-framework Gate.

## Proposed semantic token groups

### Color (semantic)

| Token | Role |
|-------|------|
| `--color-bg-deep` | Farthest atmosphere |
| `--color-bg-base` | Page base |
| `--color-bg-elevated` | Panels / chambers |
| `--color-bg-overlay` | Drawers / modals |
| `--color-fg-primary` | Body text |
| `--color-fg-secondary` | Meta / hints |
| `--color-fg-inverse` | Text on dark accent |
| `--color-accent-signal` | Cyan signal / focus ally |
| `--color-accent-ceremony` | Restrained gold |
| `--color-border-subtle` | Dividers |
| `--color-border-strong` | Focus containers |
| `--color-state-success` | Continuity / healthy |
| `--color-state-warning` | Caution |
| `--color-state-risk` | Risk exposure |
| `--color-state-info` | Neutral signal |
| `--color-focus-ring` | Keyboard focus |

Depth levels: `deep` · `base` · `elevated` · `overlay` (never more than four in one view).

### Typography

| Token | Role |
|-------|------|
| `--font-ar` | Arabic primary stack |
| `--font-en` | Latin-compatible stack (may share family) |
| `--fs-display` · `--fs-title` · `--fs-body` · `--fs-meta` · `--fs-signal` | Scale |
| `--lh-tight` · `--lh-body` · `--lh-relaxed` | Line height |
| `--fw-regular` · `--fw-semibold` · `--fw-bold` | Weight |

### Spacing / grid / radius

| Token | Guidance |
|-------|----------|
| `--space-1`…`--space-8` | 4px base scale |
| `--grid-content` | max readable measure (~42–48rem portal content; Mission may widen for topology) |
| `--radius-none` · `--radius-sm` · `--radius-md` | Prefer low radius; avoid pill sprawl |
| Glow | **Hard limit:** one soft cyan glow max per view; no multi-layer neon |

### Borders / shadows

| Token | Guidance |
|-------|----------|
| `--shadow-soft` | Rare elevation |
| `--border-hairline` | Default separation |
| Prefer borders over heavy shadows for Arabic clarity |

### Signal & system states

| State | Visual + text |
|-------|----------------|
| Loading | Quiet pulse or static “…” with `aria-busy` |
| Saving | Meta chip “Saving” |
| Synced | Meta chip “Saved” |
| Conflict | Warning surface + explicit resubmit CTA |
| Live signal | Cyan tick (reduced-motion: opacity step) |

### Motion

| Token | Guidance |
|-------|----------|
| `--motion-fast` ~120ms | Micro |
| `--motion-med` ~240ms | Panel |
| `--motion-slow` ~480ms | Ceremony only |
| `@media (prefers-reduced-motion: reduce)` | Zero continuous animation; instant swaps |

### Breakpoints

| Token | Approx |
|-------|--------|
| `--bp-sm` | 480 |
| `--bp-md` | 768 |
| `--bp-lg` | 1024 |
| `--bp-xl` | 1280 |

### RTL / LTR

- Use logical properties (`margin-inline-start`, `border-inline-start`, `inset-inline-end`).
- Technical LTR islands for codes/paths only in diagnostic UI.
- Mirror directional icons; do not mirror topology meaning incorrectly.

### Focus

Visible 3px ring using `--color-focus-ring`; never remove outlines without replacement.

## Mapping from current technical tokens

| Current | Future semantic |
|---------|-----------------|
| `--bg` / cream stack | May be superseded by direction palette (obsidian family) after selection |
| `--accent` teal | Align to `--color-accent-signal` or ceremony per direction |
| `--focus` | `--color-focus-ring` |
| Mission dark inline hex | Move to shared variables when Mission chrome is authorized |

## Non-goals of this proposal

No component library · no Tailwind install · no token implementation in `apps/web` in this task.
