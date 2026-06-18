import "server-only";

import { headers } from "next/headers";

/** Best-effort same-origin guard for C3 registration server actions. */
export async function assertC3RegistrationOrigin(): Promise<void> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const origin = h.get("origin");
  if (!host || !origin) return;

  try {
    const originHost = new URL(origin).host;
    if (originHost !== host.split(",")[0]?.trim()) {
      throw new Error("Invalid request origin.");
    }
  } catch {
    throw new Error("Invalid request origin.");
  }
}
