# Troubleshooting

Common failure patterns seen in this repository and practical fixes.

---

## 1) Vercel `npm ci` lockfile mismatch

Symptoms:
- Vercel fails during dependency install
- lockfile/package mismatch errors

Fix:
- update dependencies via npm so `package-lock.json` stays in sync

```powershell
npm install <package> --save-exact
```

Re-run validation:
- `npm run typecheck`
- `npm run build`

---

## 2) Missing module on Vercel, works locally

Symptoms:
- `Module not found` in Vercel build
- file exists locally

Likely cause:
- file was never committed/tracked

Fix:
1. Check `git status`
2. Stage exact file path
3. Verify staged list with `git diff --cached --name-only`

---

## 3) TypeScript mock shape errors

Symptoms:
- include-shape type errors
- missing relation fields in mock objects

Fix:
- align mock object with expected Prisma payload shape
- use explicit `null` where relation is absent
- avoid broad `any` casts
- run:

```powershell
npm run mock:verify
npm run typecheck
```

---

## 4) Windows Prisma EPERM / DLL lock

Symptoms:
- `EPERM` touching Prisma generated artifacts

Fix:
1. Stop Node/dev server
2. Re-run generate:

```powershell
npx prisma generate
```

3. If still failing:

```powershell
Remove-Item -Recurse -Force .\node_modules\.prisma -ErrorAction SilentlyContinue
npm install
npx prisma generate
```

---

## 5) Supabase pooler/build connection noise

Symptoms:
- intermittent pooler warnings during static generation

Guidance:
- can be non-fatal when build completes successfully
- confirm with `npm run build` / deployment result
- reduce build-time DB pressure in future refinements if needed

---

## 6) Google OAuth mismatch

Symptoms:
- callback/redirect errors in sign-in flow

Fix:
- ensure Google OAuth redirect URI points to Supabase callback
- ensure app callback is included in Supabase redirect URLs
- re-test login flow after URL updates

---

## 7) Staging vs production confusion

Reality:
- F23 explicitly defers production launch by strategy
- current mode is staging/demo/portfolio-safe

Rule:
- do not claim production launch/live commercial operations unless decision gate is reopened and passed
