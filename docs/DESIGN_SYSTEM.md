# Crow design system — North-star theme

**Status:** Applied across public site, app shells, admin lists, discovery, tenant modules, and request form.

---

## Brand idea

- **North star** — amber (`cc-star`) accent, constellation backgrounds, guidance metaphor.
- **Crow** — deep midnight surfaces (`cc-deep`, `cc-elevated`), sharp glass cards, cyan navigation glow.
- **Engines** — distinct entity color systems used consistently:
  - **CEM** — cyan / teal (`cc-entity-cem`, `entity-cem`)
  - **CyberCrow** — violet / indigo (`cc-entity-cybercrow`, `entity-cybercrow`)
  - **SAREA** — rose / amber (`cc-entity-sarea`, `entity-sarea`)

---

## Tokens

Defined in `src/app/globals.css` and `tailwind.config.ts`:

| Token | Use |
|-------|-----|
| `cc-deep` | Page background |
| `cc-elevated` | Cards, sidebars |
| `cc-star` | North-star highlights, step numbers |
| `cobalt` / cyan / teal | Primary actions, links |
| `font-display` (Syne) | Headings |
| `font-sans` (Plus Jakarta Sans) | Body |

---

## Utility classes

| Class | Purpose |
|-------|---------|
| `cc-glass-card` | Primary content panel |
| `cc-btn-primary` | Gradient CTA |
| `cc-btn-secondary` | Outlined action |
| `cc-btn-microsoft` | Entra sign-in |
| `cc-nav-link` / `cc-nav-link-active` | Sidebar & nav |
| `cc-starfield` / `cc-noise` | Background atmosphere |
| `cc-public-section` | Marketing page content width |
| `cc-nca-badge` / `cc-star-badge` | Labels |
| `cc-entity-cem` / `cc-entity-cybercrow` / `cc-entity-sarea` | Shell & card tint per engine |
| `cc-entity-badge--*` | Entity-colored badges |
| `cc-entity-hub` | CEM · CyberCrow · SAREA switcher in app header |
| `cc-engine-card--cem` / `--cybercrow` / `--sarea` | Homepage engine bento cards |

---

## Components

| Component | Path |
|-----------|------|
| Brand mark | `src/components/brand/crow-mark.tsx` |
| App shell (admin, tenant, discovery, blueprint) | `src/components/ui/area-shell.tsx` |
| Public header / footer | `src/components/public/public-header.tsx` |
| Public page hero band | `src/components/public/public-page-header.tsx` |
| Page header (app areas) | `src/components/ui/page-header.tsx` |
| Stat card | `src/components/ui/stat-card.tsx` |
| Entity hub | `src/components/ui/entity-hub.tsx` |
| Entity theme map | `src/lib/entity-theme.ts` |
| Placeholder shell | `src/components/ui/page-placeholder.tsx` |

---

## Public page checklist

Marketing routes use `PublicPageHeader` + `cc-public-section`. Entity tints: CEM cyan on `/modules`, CyberCrow violet on `/security`, mixed catalog on `/pricing`. Wireframes: [`PAGE_DESIGNS.md`](PAGE_DESIGNS.md) · phases: [`PHASES.md`](PHASES.md).

## Usage in new pages

**Public marketing:**

```tsx
<PublicPageHeader badge="..." title="..." description="..." />
<div className="cc-public-section">{/* content */}</div>
```

**Authenticated app:**

```tsx
<PageHeader title="..." description="..." badge="..." />
<div className="cc-glass-card">...</div>
```

Layouts (`admin`, `[tenant]`, `discovery`, `blueprint`, `sarea`) already wrap children in `AreaShell`.

---

## CSS utilities (pass 2)

| Class | Purpose |
|-------|---------|
| `cc-list-card` | Admin / tenant list rows |
| `cc-list-item` | Inline entity rows (discovery, HR) |
| `cc-form-section` / `cc-form-legend` | Grouped form fields |
| `cc-meta-dl` | Key-value grids |
| `cc-subnav-panel` | CyberCrow (and module) sub-navigation |
| `cc-table` / `cc-table-wrap` | Tabular data (use on dense admin views) |

## Responsive (pass 3)

| Breakpoint | Behavior |
|------------|----------|
| **Mobile** (`< lg`) | App **drawer menu**, horizontal **scroll chips** for nav, stacked list cards, 44px touch targets |
| **Tablet** (`md`) | Public nav bar, two-column meta grids |
| **Desktop** (`lg+`) | Persistent sidebar in `AreaShell` |

Utilities: `cc-safe-x` (notch padding), `cc-scroll-chips`, `cc-drawer-panel`, `100dvh` login shell.

Test: `npm run dev` then `npm run test:routes`.

## Next UI passes

- Dense admin tables (requests export, audit filters)
- SAREA studio pages
- Light mode (optional) — not planned for v1
