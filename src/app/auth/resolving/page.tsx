import { redirect } from "next/navigation";
import { CrowPostAuthResolver } from "@/components/auth/crow-post-auth-resolver";
import { getSessionUser } from "@/lib/auth/session";
import { oauthSessionLoginPath } from "@/lib/auth/c3-post-auth-resolution";
import { sanitizeAuthNextPathOptional } from "@/lib/auth/sanitize-auth-next";

export const maxDuration = 30;

export default async function AuthResolvingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = sanitizeAuthNextPathOptional(next);
  const user = await getSessionUser();

  if (!user) {
    redirect(oauthSessionLoginPath());
  }

  return <CrowPostAuthResolver nextPath={nextPath} />;
}
