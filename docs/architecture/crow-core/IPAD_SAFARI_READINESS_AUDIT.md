# iPad Safari Readiness Audit (CROW.UAT.1)

**Status:** STATICALLY_VERIFIED · OWNER_DEVICE_TEST_REQUIRED

Code-level checks:

- 44px minimum touch targets on primary buttons (`cc-btn-*`, field finder categories, custom fallback)
- `100dvh` / safe-area sticky wizard actions
- Input `text-base` on mobile (reduces unwanted zoom)
- No hover-only primary actions
- Reduced motion respected via existing motion-safe classes

Not claimed: physical Safari acceptance, split-view keyboard overlap, on-device performance.
