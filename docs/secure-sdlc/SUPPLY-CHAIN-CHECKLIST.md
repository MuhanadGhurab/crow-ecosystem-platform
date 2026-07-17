# Software Supply Chain Checklist

| Check | How | Status |
|-------|-----|--------|
| Lockfiles committed where applicable | `package-lock.json` present | Present |
| No secrets in repo | `.env.example` only; secret scanning in culture | Ongoing |
| Dependency hygiene | Run `dependency-pin-checker` from mini-it-cyber-projects | Recommended |
| CI on PR | GitHub Actions | Present |
| Least privilege tokens | Deploy secrets outside git | Required ops practice |

Use the mini-repo tool:

https://github.com/MuhanadGhurab/mini-it-cyber-projects/tree/main/python/dependency_pin_checker
