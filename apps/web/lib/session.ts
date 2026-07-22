import { createHmac, timingSafeEqual } from "node:crypto";
import { loadConfig, requireSyntheticSessionSecret } from "@ghuravia/config";

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

export function assertLocalRuntime(): ReturnType<typeof loadConfig> {
  const config = loadConfig();
  if (
    config.GHURAVIA_RUNTIME_MODE !== "local_development" &&
    config.GHURAVIA_RUNTIME_MODE !== "automated_test"
  ) {
    const err = new Error("LOCAL_RUNTIME_ONLY");
    err.name = "LOCAL_RUNTIME_ONLY";
    throw err;
  }
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "preview" || vercelEnv === "production") {
    const err = new Error("LOCAL_RUNTIME_ONLY");
    err.name = "LOCAL_RUNTIME_ONLY";
    throw err;
  }
  if (process.env.GHURAVIA_DEPLOYMENT_MARKERS === "1") {
    const err = new Error("LOCAL_RUNTIME_ONLY");
    err.name = "LOCAL_RUNTIME_ONLY";
    throw err;
  }
  requireSyntheticSessionSecret(config);
  return config;
}

export function getSessionSecret(): string {
  return requireSyntheticSessionSecret(loadConfig());
}
