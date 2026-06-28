import Link from "next/link";
import { redirect } from "next/navigation";

import { RequestPageHero } from "@/components/public/request-page-hero";
import { getSessionUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function RequestEntryPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(routes.client.requestNew);
  }

  return (
    <>
      <RequestPageHero />
      <div className="cc-safe-x mx-auto max-w-2xl pb-28 pt-10 sm:pb-32 sm:pt-14">
        <div className="cc-glass-card space-y-4 text-center">
          <h2 className="text-lg font-semibold text-white">Start a service request</h2>
          <p className="text-sm text-slate-400">
            Tell Crow about your business in five focused steps — field, purpose, team size, guidance preference, and
            review. No ERP expertise required.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href={routes.auth.signupWithNext(routes.client.requestNew)}
              className="cc-btn-primary text-sm"
            >
              Create account & start request
            </Link>
            <Link
              href={routes.auth.loginWithNext(routes.client.requestNew)}
              className="cc-btn-secondary text-sm"
            >
              Sign in to continue
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
