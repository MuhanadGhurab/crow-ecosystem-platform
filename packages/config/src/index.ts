import { z } from "zod";

const RuntimeMode = z.enum([
  "local_development",
  "automated_test",
  "controlled_preview",
]);

const DataClassification = z.enum(["demo_only", "synthetic"]);

const Env = z.object({
  GHURAVIA_RUNTIME_MODE: RuntimeMode,
  GHURAVIA_DATABASE_URL: z.string().url(),
  GHURAVIA_APP_VERSION: z.string().min(1),
  GHURAVIA_LOCAL_CONFIRM: z.literal("1").optional(),
  GHURAVIA_SYNTHETIC_SESSION_SECRET: z.string().min(16).optional(),
  GHURAVIA_DATA_CLASSIFICATION: DataClassification.optional(),
  GHURAVIA_PREVIEW_PROJECT_REF: z.string().min(8).optional(),
  ALLOW_SHARED_DEMO_BACKEND: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export type Config = z.infer<typeof Env>;

/** Known Production / shared-legacy fingerprints — never allow for GHURAVIA Preview. */
export const FORBIDDEN_DATABASE_FINGERPRINTS = [
  "wbwnsndcxrgyqwppurms",
  "supabase-aureolin-bucket",
  "db.wbwnsndcxrgyqwppurms",
] as const;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "host.docker.internal"]);

export function fingerprintDatabaseUrl(url: string): {
  host: string;
  database: string;
  username: string;
  redacted: string;
} {
  const parsed = new URL(url);
  const database = parsed.pathname.replace(/^\//, "").split("?")[0] ?? "";
  const username = decodeURIComponent(parsed.username);
  return {
    host: parsed.hostname,
    database,
    username,
    redacted: `${parsed.protocol}//${username.split(".")[0] ?? "user"}:***@${parsed.hostname}:${parsed.port || "5432"}/${database}`,
  };
}

export function assertLocalDatabase(url: string): void {
  const parsed = new URL(url);
  const host = parsed.hostname;
  if (!LOCAL_HOSTS.has(host))
    throw new Error("LOCAL_RUNTIME_ONLY: database host is not local");
  if (!/^ghuravia_(local|test)_/.test(parsed.pathname.slice(1)))
    throw new Error(
      "LOCAL_RUNTIME_ONLY: database name must use ghuravia local/test prefix",
    );
}

export function assertControlledPreviewDatabase(
  url: string,
  previewProjectRef: string,
): void {
  const fp = fingerprintDatabaseUrl(url);
  const haystack =
    `${fp.host} ${fp.username} ${fp.database} ${url}`.toLowerCase();
  for (const forbidden of FORBIDDEN_DATABASE_FINGERPRINTS) {
    if (haystack.includes(forbidden.toLowerCase())) {
      throw new Error(
        "PREVIEW_RUNTIME_DENIED: Production or legacy shared database fingerprint detected",
      );
    }
  }
  const ref = previewProjectRef.toLowerCase();
  if (!haystack.includes(ref)) {
    throw new Error(
      "PREVIEW_RUNTIME_DENIED: Preview project-ref fingerprint missing from database URL",
    );
  }
  // Dedicated Preview project may use ghuravia_preview_* or the project's
  // isolated default `postgres` database — never a Production project ref.
  if (
    !fp.database.startsWith("ghuravia_preview") &&
    fp.database !== "postgres"
  ) {
    throw new Error(
      "PREVIEW_RUNTIME_DENIED: database name must be ghuravia_preview* or isolated postgres",
    );
  }
  if (LOCAL_HOSTS.has(fp.host)) {
    throw new Error(
      "PREVIEW_RUNTIME_DENIED: controlled Preview must not use local host",
    );
  }
}

export function loadConfig(input: NodeJS.ProcessEnv = process.env): Config {
  const config = Env.parse(input);
  if (
    config.GHURAVIA_RUNTIME_MODE === "local_development" ||
    config.GHURAVIA_RUNTIME_MODE === "automated_test"
  ) {
    assertLocalDatabase(config.GHURAVIA_DATABASE_URL);
    return config;
  }

  // controlled_preview
  if (input.VERCEL_ENV !== "preview") {
    throw new Error(
      "PREVIEW_RUNTIME_DENIED: VERCEL_ENV must be preview for controlled_preview",
    );
  }
  if (config.GHURAVIA_DATA_CLASSIFICATION !== "demo_only") {
    throw new Error(
      "PREVIEW_RUNTIME_DENIED: GHURAVIA_DATA_CLASSIFICATION must be demo_only",
    );
  }
  if (config.ALLOW_SHARED_DEMO_BACKEND) {
    throw new Error(
      "PREVIEW_RUNTIME_DENIED: ALLOW_SHARED_DEMO_BACKEND must be false for dedicated Preview",
    );
  }
  if (!config.GHURAVIA_PREVIEW_PROJECT_REF) {
    throw new Error(
      "PREVIEW_RUNTIME_DENIED: GHURAVIA_PREVIEW_PROJECT_REF required",
    );
  }
  assertControlledPreviewDatabase(
    config.GHURAVIA_DATABASE_URL,
    config.GHURAVIA_PREVIEW_PROJECT_REF,
  );
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
  const fp = fingerprintDatabaseUrl(config.GHURAVIA_DATABASE_URL);
  return JSON.stringify({
    runtimeMode: config.GHURAVIA_RUNTIME_MODE,
    dataClassification: config.GHURAVIA_DATA_CLASSIFICATION ?? null,
    database: "[REDACTED]",
    databaseFingerprint: {
      host: fp.host,
      database: fp.database,
      usernamePrefix: fp.username.split(".")[0] ?? null,
    },
    version: config.GHURAVIA_APP_VERSION,
    destructiveConfirmation: config.GHURAVIA_LOCAL_CONFIRM === "1",
    syntheticSessionConfigured: Boolean(
      config.GHURAVIA_SYNTHETIC_SESSION_SECRET,
    ),
    sharedDemoBackend: Boolean(config.ALLOW_SHARED_DEMO_BACKEND),
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

export type RuntimeGuardCase = {
  name: string;
  env: Record<string, string | undefined>;
  expect: "ALLOW" | "DENY";
};

/** Deterministic matrix used by unit tests and Preview evidence. */
export function runtimeGuardMatrix(): RuntimeGuardCase[] {
  const localDb =
    "postgresql://ghuravia:ghuravia@127.0.0.1:55432/ghuravia_test_ci";
  const previewDb =
    "postgresql://ghuravia_preview.xmuawtodfuavwebxrqpt:secret@aws-1-eu-central-2.pooler.supabase.com:5432/postgres?sslmode=require";
  const prodDb =
    "postgresql://postgres.wbwnsndcxrgyqwppurms:secret@aws-1-eu-central-2.pooler.supabase.com:5432/postgres?sslmode=require";
  const secret = "ci-synthetic-session-secret-32b";
  return [
    {
      name: "Local development",
      expect: "ALLOW",
      env: {
        GHURAVIA_RUNTIME_MODE: "local_development",
        GHURAVIA_DATABASE_URL: localDb,
        GHURAVIA_APP_VERSION: "0.3.0-test",
        GHURAVIA_SYNTHETIC_SESSION_SECRET: secret,
        VERCEL_ENV: undefined,
      },
    },
    {
      name: "CI automated_test",
      expect: "ALLOW",
      env: {
        GHURAVIA_RUNTIME_MODE: "automated_test",
        GHURAVIA_DATABASE_URL: localDb,
        GHURAVIA_APP_VERSION: "0.3.0-ci",
        GHURAVIA_SYNTHETIC_SESSION_SECRET: secret,
        CI: "true",
        VERCEL_ENV: undefined,
      },
    },
    {
      name: "Verified Preview",
      expect: "ALLOW",
      env: {
        GHURAVIA_RUNTIME_MODE: "controlled_preview",
        GHURAVIA_DATA_CLASSIFICATION: "demo_only",
        GHURAVIA_PREVIEW_PROJECT_REF: "xmuawtodfuavwebxrqpt",
        GHURAVIA_DATABASE_URL: previewDb,
        GHURAVIA_APP_VERSION: "0.3.0-preview",
        GHURAVIA_SYNTHETIC_SESSION_SECRET: secret,
        ALLOW_SHARED_DEMO_BACKEND: "false",
        VERCEL_ENV: "preview",
      },
    },
    {
      name: "Preview missing classification",
      expect: "DENY",
      env: {
        GHURAVIA_RUNTIME_MODE: "controlled_preview",
        GHURAVIA_PREVIEW_PROJECT_REF: "xmuawtodfuavwebxrqpt",
        GHURAVIA_DATABASE_URL: previewDb,
        GHURAVIA_APP_VERSION: "0.3.0-preview",
        GHURAVIA_SYNTHETIC_SESSION_SECRET: secret,
        ALLOW_SHARED_DEMO_BACKEND: "false",
        VERCEL_ENV: "preview",
      },
    },
    {
      name: "Preview missing database identity",
      expect: "DENY",
      env: {
        GHURAVIA_RUNTIME_MODE: "controlled_preview",
        GHURAVIA_DATA_CLASSIFICATION: "demo_only",
        GHURAVIA_DATABASE_URL: previewDb,
        GHURAVIA_APP_VERSION: "0.3.0-preview",
        GHURAVIA_SYNTHETIC_SESSION_SECRET: secret,
        ALLOW_SHARED_DEMO_BACKEND: "false",
        VERCEL_ENV: "preview",
      },
    },
    {
      name: "Preview pointing to Production",
      expect: "DENY",
      env: {
        GHURAVIA_RUNTIME_MODE: "controlled_preview",
        GHURAVIA_DATA_CLASSIFICATION: "demo_only",
        GHURAVIA_PREVIEW_PROJECT_REF: "xmuawtodfuavwebxrqpt",
        GHURAVIA_DATABASE_URL: prodDb,
        GHURAVIA_APP_VERSION: "0.3.0-preview",
        GHURAVIA_SYNTHETIC_SESSION_SECRET: secret,
        ALLOW_SHARED_DEMO_BACKEND: "false",
        VERCEL_ENV: "preview",
      },
    },
    {
      name: "Production",
      expect: "DENY",
      env: {
        GHURAVIA_RUNTIME_MODE: "controlled_preview",
        GHURAVIA_DATA_CLASSIFICATION: "demo_only",
        GHURAVIA_PREVIEW_PROJECT_REF: "xmuawtodfuavwebxrqpt",
        GHURAVIA_DATABASE_URL: previewDb,
        GHURAVIA_APP_VERSION: "0.3.0-preview",
        GHURAVIA_SYNTHETIC_SESSION_SECRET: secret,
        ALLOW_SHARED_DEMO_BACKEND: "false",
        VERCEL_ENV: "production",
      },
    },
    {
      name: "Unknown environment",
      expect: "DENY",
      env: {
        GHURAVIA_RUNTIME_MODE: "controlled_preview",
        GHURAVIA_DATA_CLASSIFICATION: "demo_only",
        GHURAVIA_PREVIEW_PROJECT_REF: "xmuawtodfuavwebxrqpt",
        GHURAVIA_DATABASE_URL: previewDb,
        GHURAVIA_APP_VERSION: "0.3.0-preview",
        GHURAVIA_SYNTHETIC_SESSION_SECRET: secret,
        ALLOW_SHARED_DEMO_BACKEND: "false",
        VERCEL_ENV: "development",
      },
    },
  ];
}
