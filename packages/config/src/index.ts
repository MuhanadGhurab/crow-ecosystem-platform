import { z } from "zod";
const Env = z.object({
  GHURAVIA_RUNTIME_MODE: z.enum(["local_development", "automated_test"]),
  GHURAVIA_DATABASE_URL: z.string().url(),
  GHURAVIA_APP_VERSION: z.string().min(1),
  GHURAVIA_LOCAL_CONFIRM: z.literal("1").optional(),
  GHURAVIA_SYNTHETIC_SESSION_SECRET: z.string().min(16).optional(),
});
export type Config = z.infer<typeof Env>;
export function assertLocalDatabase(url: string): void {
  const parsed = new URL(url);
  const host = parsed.hostname;
  if (!["localhost", "127.0.0.1", "host.docker.internal"].includes(host))
    throw new Error("LOCAL_RUNTIME_ONLY: database host is not local");
  if (!/^ghuravia_(local|test)_/.test(parsed.pathname.slice(1)))
    throw new Error(
      "LOCAL_RUNTIME_ONLY: database name must use ghuravia local/test prefix",
    );
}
export function loadConfig(input: NodeJS.ProcessEnv = process.env): Config {
  const config = Env.parse(input);
  assertLocalDatabase(config.GHURAVIA_DATABASE_URL);
  return config;
}
export function requireSyntheticSessionSecret(config: Config): string {
  if (!config.GHURAVIA_SYNTHETIC_SESSION_SECRET) {
    throw new Error(
      "LOCAL_RUNTIME_ONLY: GHURAVIA_SYNTHETIC_SESSION_SECRET required",
    );
  }
  return config.GHURAVIA_SYNTHETIC_SESSION_SECRET;
}
export function diagnostics(config: Config): string {
  return JSON.stringify({
    runtimeMode: config.GHURAVIA_RUNTIME_MODE,
    database: "[REDACTED]",
    version: config.GHURAVIA_APP_VERSION,
    destructiveConfirmation: config.GHURAVIA_LOCAL_CONFIRM === "1",
    syntheticSessionConfigured: Boolean(
      config.GHURAVIA_SYNTHETIC_SESSION_SECRET,
    ),
  });
}
export function assertDestructiveLocalOperation(config: Config): void {
  const allowedMode =
    config.GHURAVIA_RUNTIME_MODE === "local_development" ||
    config.GHURAVIA_RUNTIME_MODE === "automated_test";
  if (!allowedMode || config.GHURAVIA_LOCAL_CONFIRM !== "1")
    throw new Error(
      "LOCAL_RUNTIME_ONLY: destructive operation requires local_development|automated_test and GHURAVIA_LOCAL_CONFIRM=1",
    );
}
