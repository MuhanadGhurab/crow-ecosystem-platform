# Source layout

Next.js 15 app at repo root. Path alias: `@/*` → `src/*`.

```
src/
  app/                    # App Router routes (public, admin, discovery, blueprint, portal, sarea, [tenant])
  components/
    public/               # Marketing + brand
    portal/               # Client portal + auth chrome
    admin/                # Crow Admin UI
    tenant/               # CEM workspace + cybercrow + crm + hr
    discovery/            # Discovery workspace
    blueprint/            # Blueprint tabs + commercial/pricing panels
    pipeline/             # Lifecycle, dept chips, engine badges
    studio/               # SAREA experience studio
    ui/                   # Shared shells, cards, forms
  lib/
    auth/                 # Roles, session guards, post-login redirect
    constants/            # Catalogs (modules, tiers, security, marketing)
    domains/              # Domain-driven modules (01–10)
    mock/                 # UI-only pipeline, MEEM lighthouse, env helpers
    services/             # Prisma business logic (*.service.ts)
    actions/              # Server actions
    supabase/             # Auth clients + middleware helpers
```

**Scripts:** `scripts/` (dev, demo, auth grants, smoke).  
**Docs:** `docs/` · **Legacy:** `archive/HTML_proc/`.
