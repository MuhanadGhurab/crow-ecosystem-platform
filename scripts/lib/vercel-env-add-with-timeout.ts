import { spawn } from "node:child_process";

const BRANCH = "feat/c3-account-registration-email-verification";

export type VercelEnvTarget = "preview-branch" | "production";

/** Exact phrase required for Production env writes (set via VERCEL_PRODUCTION_ENV_WRITE_CONFIRM). */
export const PRODUCTION_VERCEL_ENV_WRITE_PHRASE = "APPLY PRODUCTION VERCEL ENV WRITES";

/** Production env keys that may be written through vercelEnvAdd. */
export const PRODUCTION_ENV_ALLOWLIST = new Set([
  "GOOGLE_SSO_ENABLED",
  "ACCOUNT_REGISTRATION_ENABLED",
  "CROW_PHONE_VERIFICATION_REQUIRED",
  "CROW_ONBOARDING_GENERATION_REQUIRED",
  "C3_REGISTRATION_DIAGNOSTICS",
  "C3_SESSION_DIAGNOSTICS",
  "C3_AUTH_CANARY_ENABLED",
  "C3_PROOF_DIAGNOSTICS",
  "C3_PROOF_IDENTITY_FINGERPRINT_SECRET",
  "DATABASE_ENVIRONMENT",
  "BACKEND_ISOLATION",
  "EXPECTED_DATABASE_FINGERPRINT",
  "EXPECTED_DIRECT_DATABASE_FINGERPRINT",
]);

export type VercelEnvAddOptions = {
  target?: VercelEnvTarget;
  timeoutMs?: number;
  /** Required when target is production; must equal PRODUCTION_VERCEL_ENV_WRITE_PHRASE. */
  productionWriteConfirm?: string;
};

function resolveOptions(
  options?: VercelEnvTarget | VercelEnvAddOptions,
  legacyTimeoutMs?: number
): Required<Pick<VercelEnvAddOptions, "target" | "timeoutMs">> &
  Pick<VercelEnvAddOptions, "productionWriteConfirm"> {
  if (typeof options === "string") {
    return { target: options, timeoutMs: legacyTimeoutMs ?? 90_000 };
  }
  return {
    target: options?.target ?? "preview-branch",
    timeoutMs: options?.timeoutMs ?? legacyTimeoutMs ?? 90_000,
    productionWriteConfirm: options?.productionWriteConfirm,
  };
}

function assertProductionWriteAuthorized(name: string, productionWriteConfirm?: string): void {
  if (!PRODUCTION_ENV_ALLOWLIST.has(name)) {
    throw new Error(
      `Production Vercel env write blocked: ${name} is not on the operator allowlist.`
    );
  }
  const phrase =
    productionWriteConfirm?.trim() ?? process.env.VERCEL_PRODUCTION_ENV_WRITE_CONFIRM?.trim();
  if (phrase !== PRODUCTION_VERCEL_ENV_WRITE_PHRASE) {
    throw new Error(
      `Production Vercel env writes require VERCEL_PRODUCTION_ENV_WRITE_CONFIRM="${PRODUCTION_VERCEL_ENV_WRITE_PHRASE}".`
    );
  }
}

export function vercelEnvAdd(
  name: string,
  value: string,
  options?: VercelEnvTarget | VercelEnvAddOptions,
  legacyTimeoutMs?: number
): Promise<void> {
  const { target, timeoutMs, productionWriteConfirm } = resolveOptions(options, legacyTimeoutMs);

  if (target === "production") {
    assertProductionWriteAuthorized(name, productionWriteConfirm);
  }

  if (process.env.VERCEL_ENV_DRY_RUN === "true") {
    console.log(`[dry-run] vercel env add ${name} → ${target}`);
    return Promise.resolve();
  }

  const args =
    target === "production"
      ? ["vercel", "env", "add", name, "production", "--value", value, "--force", "--yes", "--no-sensitive"]
      : [
          "vercel",
          "env",
          "add",
          name,
          "preview",
          BRANCH,
          "--value",
          value,
          "--force",
          "--yes",
          "--no-sensitive",
        ];

  return new Promise((resolve, reject) => {
    const child = spawn(
      "npx",
      args,
      { stdio: ["ignore", "pipe", "pipe"], shell: process.platform === "win32" }
    );

    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        child.kill("SIGTERM");
        reject(new Error(`vercel env add timed out for ${name}`));
      }
    }, timeoutMs);

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`vercel env add failed for ${name} (exit ${code ?? "null"})`));
    });
  });
}
