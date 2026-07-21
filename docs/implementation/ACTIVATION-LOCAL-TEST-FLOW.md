# Activation Local Test Flow

Local-only. Requires disposable Postgres (`ghuravia_local_*` or `ghuravia_test_*`) and:

```bash
export GHURAVIA_RUNTIME_MODE=local_development
export GHURAVIA_DATABASE_URL=postgresql://…/ghuravia_local_…
export GHURAVIA_APP_VERSION=0.2.0-local
export GHURAVIA_LOCAL_CONFIRM=1
export GHURAVIA_SYNTHETIC_SESSION_SECRET=at-least-16-chars
```

```bash
npm run db:migrate
npm run dev --workspace=@ghuravia/web
```

1. Open `/activation/email-pending` (ACT-003).
2. Create synthetic session.
3. Request email verification; open mock mailbox (`/api/local/mock-mailbox`).
4. Confirm token on `/activation/email-result` (ACT-011).
5. Accept terms on `/activation/terms` (ACT-005) — copy is **local test · not legally approved**.
6. Accept account risk on `/activation/account-risk` (ACT-013).
7. Activate / land on `/activation/complete` (ACT-006).
8. Optional: exercise recovery on `/activation/recovery` (ACT-012) — cannot bypass formula.

Worker (optional outbox drain):

```bash
npm run start --workspace=@ghuravia/background-worker
```
