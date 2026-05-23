# Public repository checklist (Muhanad Ghurab)

Use before `gh repo edit --visibility public` or publishing a public mirror.

**Identity**

| Field | Value |
|-------|--------|
| Name | Muhanad Ghurab |
| Email (CV / security) | muhanadghurab@gmail.com |
| GitHub | [@MuhanadGhurab](https://github.com/MuhanadGhurab) |
| Repo | `crow-ecosystem-platform` |
| Git commit email (local) | muhanadghurab@proton.me |

---

## Safety

- [ ] `.env` not tracked (`git status`)
- [ ] `rg -i "re_|sk_live|service.role" --glob "!node_modules" .` clean in public paths
- [ ] No `cmpge193`, personal Gmail overrides, or Supabase project refs in `docs/public/`
- [ ] Screenshots use mock routes only
- [ ] `npm run typecheck` && `npm run build` green

---

## Public mirror (`npm run public:mirror-manifest`)

**Copy:** README, `docs/public/`, `docs/README.md`, LICENSE, CONTRIBUTING, SECURITY, `.env.example`, `src/`, `prisma/schema.prisma`

**Never copy:** `docs/internal/`, `.env`, customer files

---

## GitHub metadata

```powershell
gh repo edit MuhanadGhurab/crow-ecosystem-platform --description "SecDevOps · governed AI · multi-tenant platform (Crow Ecosystem). Next.js 15, Prisma, PostgreSQL, Microsoft Entra."
```

Topics: `secdevops` `devsecops` `cybersecurity` `multi-tenant` `nextjs` `typescript` `prisma` `artificial-intelligence` `postgresql` `microsoft-entra-id`
