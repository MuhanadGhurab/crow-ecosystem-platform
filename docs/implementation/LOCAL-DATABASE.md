# Local database

Only localhost, 127.0.0.1, and host.docker.internal are permitted. Database names must start `ghuravia_local_` or `ghuravia_test_`. Reset additionally requires local mode and `GHURAVIA_LOCAL_CONFIRM=1`.

Migrations: `0000_foundation.sql` then `0001_activation_runtime.sql` via `npm run db:migrate`. Validate with `npm run db:validate`.
