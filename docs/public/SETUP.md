# Public setup guide

Safe instructions for cloning and running the **architecture showcase** locally. No production secrets required.

---

## Prerequisites

- Node.js 20+
- npm 10+

Optional for full stack:

- PostgreSQL 15+ (local database)
- Supabase project (Auth only, or Auth + DB)

---

## 1. Clone

```bash
git clone https://github.com/MuhanadGhurab/crow-ecosystem-platform.git
cd crow-ecosystem-platform
```

---

## 2. Environment

```bash
cp .env.example .env
```

Never commit `.env`.

---

## 3. UI-only demo (fastest)

In `.env`:

```env
AUTH_DISABLED=true
USE_MOCK_DATA=true
```

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

Optional logistics narrative (mock IDs):

```bash
npm run demo:meem
```

---

## 4. Verify build

```bash
npm run typecheck
npm run build
```

---

## 5. Full stack (optional)

Configure in `.env`:

- `DATABASE_URL` / `DIRECT_URL` → local PostgreSQL
- `NEXT_PUBLIC_SUPABASE_URL` / keys → Supabase Auth

```bash
npm run db:push
npm run db:seed
npm run dev
```

Use `AUTH_DISABLED=false` and `USE_MOCK_DATA=false` for real auth paths.

Detailed operator guides live in `docs/internal/` (not shipped in public mirrors).

---

## Security

- Rotate any key accidentally committed
- Report issues: see root [`SECURITY.md`](../../SECURITY.md)

---

## Related

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`LIFECYCLE.md`](LIFECYCLE.md)
