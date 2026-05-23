# GitHub branch workflow

Your **local** repo keeps everything. **GitHub** shows the public showcase only.

| Branch | Purpose |
|--------|---------|
| **`main`** (local) | Full development — includes `docs/internal/`, `archive/` |
| **`full-platform`** | Backup snapshot of full dev (same as local main at publish time) |
| **`public-release`** | Curated public tree — **this is what `origin/main` tracks** |

---

## Important

**Do not** `git push origin main` from local `main` — it would upload internal docs to the public GitHub repo.

---

## Update GitHub (public showcase)

```powershell
git checkout public-release
git merge main
git rm -r docs/internal archive
# restore public docs/README.md if merge brought internal refs back
git commit -m "chore: sync public repository"
git push origin public-release:main
git checkout main
```

Or: `npm run public:build` → copy to `../crow-ecosystem-public` → push from there.

---

## GitHub

https://github.com/MuhanadGhurab/crow-ecosystem-platform (public)
