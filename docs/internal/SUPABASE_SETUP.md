# Supabase setup for Crow Ecosystem

This app uses **Prisma** against Supabase **PostgreSQL**. You do not need `@supabase/supabase-js` for the current MVP unless you add Auth or Storage later.

## 1. Create a Supabase project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → pick org, name (e.g. `crow-ecosystem`), database password, region
3. Save the database password somewhere safe (you cannot view it again)

## 2. Copy connection strings

1. Open your project → **Project Settings** (gear) → **Database**
2. Under **Connection string**, choose **URI**
3. You need two URLs:

| Variable | Supabase UI | Port | Used for |
|----------|-------------|------|----------|
| `DATABASE_URL` | **Transaction** pooler | `6543` | `npm run dev`, API routes, Prisma Client |
| `DIRECT_URL` | **Session** pooler or **Direct** | `5432` | `npx prisma db push`, migrations |

Append `?pgbouncer=true` to the **Transaction** URL (port 6543) if it is not already present.

Example shape (values are yours):

```env
DATABASE_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
```

Legacy direct host (also works for `DIRECT_URL`):

```env
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

## 3. Create `.env` locally

```powershell
cd d:\CYBERCROW
copy .env.example .env
```

Edit `.env` and paste your real `DATABASE_URL` and `DIRECT_URL`.  
`.env` is gitignored — never commit it.

## 4. Push schema and seed

```powershell
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

`db push` applies `prisma/schema.prisma` to Supabase. Use `DIRECT_URL` (port 5432) so migrations are not blocked by the transaction pooler.

## 5. Run the app

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Submit a request: `/request`
- Admin list: `/admin/requests`

## 6. Verify in Supabase

**Table Editor** in the dashboard should show tables such as `ImplementationRequest`, `Tenant`, etc.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Can't reach database server` | Check password, project not paused, IP allowlist (Supabase → Database → Network) |
| `prepared statement` / pooler errors on migrate | Use `DIRECT_URL` on port **5432** for `db push` |
| Admin shows “Connect DATABASE_URL…” | `.env` missing or wrong URL; rerun `npx prisma db push` |
| Special chars in password | URL-encode the password in the connection string |

## Security note

Prisma uses the **database password** (service role level access to Postgres). Do not expose `DATABASE_URL` or `DIRECT_URL` in the browser (`NEXT_PUBLIC_*`). RLS on Supabase applies to the Data API (`supabase-js`), not to Prisma’s direct Postgres connection.

## Optional: Supabase MCP in Cursor

Authenticate the Supabase MCP server in Cursor to list projects and run SQL from the agent. In chat, complete the OAuth flow when prompted.

## Optional: Supabase CLI

```powershell
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Useful later for managed migrations; for now `prisma db push` is enough.
