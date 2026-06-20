import { redirect } from "next/navigation";

import { routes } from "@/lib/routes";

export default async function OnboardingVerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
  }
  const qs = params.toString();
  redirect(qs ? `${routes.account.verifyEmail}?${qs}` : routes.account.verifyEmail);
}
