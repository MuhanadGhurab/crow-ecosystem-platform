# Developer Quickstart

Audience: engineers contributing to Crow Ecosystem on local/staging-safe workflows.

---

## 1) Prerequisites

- Node.js `24.x` (see `package.json` engines)
- npm (bundled with Node)
- Git for this machine:
  - `C:\Program Files\Git\cmd\git.exe`
- PowerShell terminal

---

## 2) Repository setup (PowerShell)

```powershell
Set-Location D:\CYBERCROW
npm install
npx prisma generate
```

---

## 3) Environment files (no secrets in docs)

- Copy `.env.example` to `.env` for local development.
- Optional staging validation uses `.env.staging`.
- Never commit real secrets or private endpoints.

Typical safe local toggles:

```env
AUTH_DISABLED=true
USE_MOCK_DATA=true
```

---

## 4) Start local app

```powershell
Set-Location D:\CYBERCROW
npm run dev
```

---

## 5) Core validation before push

```powershell
Set-Location D:\CYBERCROW
npm run typecheck
npm run lint
npm run build
```

Recommended additional checks:

```powershell
npm run mock:verify
npm run public:mirror-manifest
```

---

## 6) Mock mode workflow

- `USE_MOCK_DATA=true` enables demo/mock data paths.
- Use `npm run mock:verify` to catch mock shape drift and missing support files.
- Keep mock mode honest: advisory/demo behavior only, no fake production claims.

See:
- `MOCK_MODE_GUIDE.md`
- `F28_DEMO_DATA_MOCK_MODE_EXCELLENCE.md`

---

## 7) Staging-safe verification set

```powershell
Set-Location D:\CYBERCROW
npm run meem:ids:staging
npm run tenant:verify:rimal
npm run request:pipeline:verify
npm run request:e2e:dry
```

Optional local confidence:

```powershell
npm run simulate:vercel-build:staging
```

---

## 8) Windows Prisma EPERM quick fix

If Prisma generate/build fails with DLL/file lock (`EPERM`):

1. Stop active Node processes / dev server.
2. Re-run:

```powershell
Set-Location D:\CYBERCROW
npx prisma generate
```

3. If still blocked, remove Prisma generated cache and reinstall deps:

```powershell
Remove-Item -Recurse -Force .\node_modules\.prisma -ErrorAction SilentlyContinue
npm install
npx prisma generate
```

---

## 9) Git command path note

Use this explicit Git path if shell path resolution is inconsistent:

```powershell
& "C:\Program Files\Git\cmd\git.exe" status -sb
```

---

## 10) Safe operating mode reminder

- Production launch is deferred by F23 strategy gate.
- Current safe mode: local + staging + portfolio.
- No paid infra activation unless explicitly approved.
