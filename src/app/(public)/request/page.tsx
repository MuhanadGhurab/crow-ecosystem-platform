import Link from "next/link";
import { redirect } from "next/navigation";

import { PublicContentPage } from "@/components/public-site/public-content-page";
import { getSessionUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

export const metadata = {
  title: "Discuss Your Organization — Crow",
  description: "Structured intake to begin your Crow service request.",
};

export default async function RequestEntryPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(routes.client.requestNew);
  }

  return (
    <PublicContentPage
      eyebrow="Structured intake"
      title="Discuss Your Organization"
      description="Tell Crow about your organization in focused steps — field, purpose, team context, guidance preference, and review. No ERP expertise required."
    >
      <div className="pv2-card max-w-2xl p-6 text-center sm:p-8">
        <p className="pv2-body">
          Account verification is required before a Request is created. Passive browsing does not
          write business records.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={routes.auth.signupWithNext(routes.client.requestNew)}
            className={`pv2-btn-primary text-sm ${PUBLIC_V2_MOTION_CLASS.button}`}
          >
            Create account & start request
          </Link>
          <Link
            href={routes.auth.loginWithNext(routes.client.requestNew)}
            className={`pv2-btn-secondary text-sm ${PUBLIC_V2_MOTION_CLASS.button}`}
          >
            Sign in to continue
          </Link>
        </div>
      </div>
    </PublicContentPage>
  );
}
