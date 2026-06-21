import { redirect } from "next/navigation";

/** Detect Next.js redirect() throw — must rethrow from server actions. */
export function isNextRedirectError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

/** Issue a redirect for server actions (relative paths work with the App Router action protocol). */
export async function redirectToAppPath(path: string): Promise<never> {
  redirect(path);
}
