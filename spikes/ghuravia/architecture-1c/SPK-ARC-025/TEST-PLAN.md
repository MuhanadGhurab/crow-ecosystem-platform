# SPK-ARC-025 — Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Minor public profile | Crow fields present; private fields `undefined` |
| 2 | Leak assertion | No serialized private values in public JSON |
| 3 | Trust/moderation on public view | `undefined` |
| 4 | Age category on minor public view | Not exposed (`ageCategory=undefined`) |

**Legal note:** Spike does not validate jurisdictional age thresholds or parental consent.
