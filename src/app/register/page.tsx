import { redirect } from "next/navigation";
import { sanitizeAuthNextPathWithDefault } from "@/lib/auth/sanitize-auth-next";
import { routes } from "@/lib/routes";

/** C3 alias — platform registration uses the existing Supabase sign-up flow. */
export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = sanitizeAuthNextPathWithDefault(next, routes.public.request);
  redirect(routes.auth.signupWithNext(nextPath));
}
