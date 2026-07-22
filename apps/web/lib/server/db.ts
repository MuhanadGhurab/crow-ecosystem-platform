import "server-only";

import { createDb } from "@ghuravia/data";
import { loadConfig } from "@ghuravia/config";

type DbHandle = ReturnType<typeof createDb>;

let cached: DbHandle | null = null;

/**
 * Process-scoped disposable Postgres handle for local/test Next.js runtime.
 * Do not call sql.end() per request — thrashing pools crashes Node on Windows.
 */
export function getDb(): DbHandle {
  if (!cached) {
    const config = loadConfig();
    cached = createDb(config.GHURAVIA_DATABASE_URL);
  }
  return cached;
}
