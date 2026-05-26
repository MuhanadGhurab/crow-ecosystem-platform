# Git Safety Guide

Use this guide for scoped, phase-safe commits.

---

## Hard rules

- Never use `git add .` for scoped phase work.
- Stage exact file paths only.
- Always inspect staged files before commit.
- Never commit forbidden files:
  - `.env*`
  - `tsconfig.tsbuildinfo`
  - `.agents/`
  - `skills-lock.json`

---

## Safe commit pattern

1. Check status
2. Add exact files
3. Verify staged list
4. Commit
5. Push

PowerShell example:

```powershell
Set-Location D:\CYBERCROW

& "C:\Program Files\Git\cmd\git.exe" status -sb

& "C:\Program Files\Git\cmd\git.exe" add `
  path/to/file1 `
  path/to/file2

& "C:\Program Files\Git\cmd\git.exe" diff --cached --name-only

& "C:\Program Files\Git\cmd\git.exe" commit -m "scope: message"
& "C:\Program Files\Git\cmd\git.exe" push origin main
```

---

## Quick checks

Show staged file list:

```powershell
git diff --cached --name-only
```

Unstage everything (safe reset of staging area):

```powershell
git restore --staged .
```

---

## Why this matters

This repo often contains unrelated in-progress local changes. Scoped staging prevents:
- accidental secret leakage
- noisy commits
- broken phase boundaries
- unexpected deployment regressions
