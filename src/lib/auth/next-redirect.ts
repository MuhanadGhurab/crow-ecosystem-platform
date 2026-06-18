import { headers } from "next/headers";
import { redirect } from "next/navigation";

/** Detect Next.js redirect() throw — must rethrow from server actions. */
export function isNextRedirectError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

/** Issue a redirect using the incoming request host (Preview-safe). */
export async function redirectToAppPath(path: string): Promise<never> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (host) {
    const origin = `${proto}://${host.split(",")[0]?.trim() ?? host}`;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    redirect(`${origin}${normalized}`);
  }
  redirect(path);
}
