import { createHmac, timingSafeEqual } from "node:crypto";
import {
  loadConfig,
  requireSyntheticSessionSecret,
  type Config,
} from "@ghuravia/config";

export type SyntheticSession = {
  accountId: string;
  contactRef: string;
  issuedAt: number;
};

const COOKIE = "ghuravia_synthetic_session";

export function sessionCookieName(): string {
  return COOKIE;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function encodeSession(
  session: SyntheticSession,
  secret: string,
): string {
  const body = Buffer.from(JSON.stringify(session), "utf8").toString(
    "base64url",
  );
  return `${body}.${sign(body, secret)}`;
}

export function decodeSession(
  token: string,
  secret: string,
): SyntheticSession | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as SyntheticSession;
    if (!parsed.accountId || !parsed.contactRef) return null;
    return parsed;
  } catch {
    return null;
  }
}

function deny(message = "LOCAL_RUNTIME_ONLY"): never {
  const err = new Error(message);
  err.name = "LOCAL_RUNTIME_ONLY";
  throw err;
}

/**
 * Allows local development, automated CI, or verified controlled Preview.
 * Production and unknown Vercel environments remain denied.
 */
export function assertLocalRuntime(): Config {
  const config = loadConfig();
  const vercelEnv = process.env.VERCEL_ENV;

  if (process.env.GHURAVIA_DEPLOYMENT_MARKERS === "1") {
    deny();
  }

  if (
    config.GHURAVIA_RUNTIME_MODE === "local_development" ||
    config.GHURAVIA_RUNTIME_MODE === "automated_test"
  ) {
    if (vercelEnv === "preview" || vercelEnv === "production") {
      deny();
    }
    requireSyntheticSessionSecret(config);
    return config;
  }

  // controlled_preview — only when Vercel Preview + verified demo-only DB
  if (config.GHURAVIA_RUNTIME_MODE === "controlled_preview") {
    if (vercelEnv !== "preview") {
      deny("PREVIEW_RUNTIME_DENIED: VERCEL_ENV must be preview");
    }
    requireSyntheticSessionSecret(config);
    return config;
  }

  deny();
}

export function getSessionSecret(): string {
  return requireSyntheticSessionSecret(loadConfig());
}
