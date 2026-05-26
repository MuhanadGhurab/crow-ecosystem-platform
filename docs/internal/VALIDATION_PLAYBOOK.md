# Validation Playbook

Purpose: standard pre-push and pre-deploy confidence checks without paid tooling.

---

## Validation layers

## A) Basic code health (required)

```powershell
Set-Location D:\CYBERCROW
npm run typecheck
npm run lint
npm run build
```

Use this for every code/doc phase touching app behavior.

---

## B) Public boundary safety (required for docs/public changes)

```powershell
npm run public:mirror-manifest
```

Confirms public mirror manifest generation and reinforces internal/public boundary.

---

## C) Mock/demo integrity (required for mock-related work)

```powershell
npm run mock:verify
```

Checks:
- required mock files
- discovery template JSON presence
- key SAREA/CyberCrow support files
- critical mock imports
- mock request -> discovery -> blueprint chain assumptions

---

## D) Staging/business safety checks (recommended for phase sign-off)

```powershell
npm run meem:ids:staging
npm run tenant:verify:rimal
npm run request:pipeline:verify
npm run request:e2e:dry
```

Use when phase impacts onboarding, tenant/runtime behavior, discovery, or blueprint flow.

---

## E) Deployment simulation (optional but high confidence)

```powershell
npm run simulate:vercel-build:staging
```

Use before release-like pushes, especially after build/runtime incidents.

---

## Failure interpretation

- `typecheck` fails: type mismatch/regression; fix before continuing.
- `lint` fails: rule violations or unsafe patterns; resolve or justify.
- `build` fails: route/module/runtime break; treat as blocker.
- `mock:verify` fails: mock data drift, missing files, or broken assumptions.
- staging verify scripts fail: business-flow mismatch in staging data.

---

## Required before push (default)

At minimum:

```powershell
npm run mock:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

Add staging/business checks when the phase touches onboarding/runtime flows.

---

## Windows Prisma EPERM handling

If `prisma generate` or build path throws file lock errors:

1. Stop active Node/dev-server processes.
2. Re-run `npx prisma generate`.
3. If needed, clear `.prisma` generated folder:

```powershell
Remove-Item -Recurse -Force .\node_modules\.prisma -ErrorAction SilentlyContinue
npm install
npx prisma generate
```

If `npm run build` is already green, isolated simulate-only EPERM can be treated as local environment noise.
