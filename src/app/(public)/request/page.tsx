import Link from "next/link";
import { redirect } from "next/navigation";

import {
  PublicContentPage,
} from "@/components/public-site/public-content-page";
import { PublicClientJourneySteps } from "@/components/public-site/public-client-journey-steps";
import { getSessionUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

export const metadata = {
  title: "Discuss Your Organization — Crow",
  description: "Learn how Crow intake works — sign in only when you begin the secure client request.",
};

/**
 * Option A — public explanation page.
 * Auth is required only when the user continues to secure request creation.
 * Logged-in users skip to the client workflow (unchanged behavior).
 */
export default async function RequestEntryPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(routes.client.requestNew);
  }

  return (
    <PublicContentPage
      mood="teal"
      eyebrow="Structured intake"
      title="Discuss Your Organization"
      description="Browse Crow freely. When you are ready to start the secure client process, create an account or sign in — that is when Crow begins structured intake."
      introExtra={
        <p className="pv2-access-callout">
          <strong className="text-[var(--pv2-text-primary)]">Public browsing is open.</strong> Sign-in is
          required only to create a Request, enter the Client Portal, or continue Discovery and Blueprint
          work. Choosing a journey on public pages does not create business records.
        </p>
      }
    >
      <PublicClientJourneySteps highlight={["browse", "signin", "request"]} compact />

      <div className="pv2-blueprint-frame max-w-2xl">
        <div className="pv2-blueprint-frame-header">
          <p className="text-sm font-semibold text-[var(--pv2-text-primary)]">Secure client request</p>
          <span className="pv2-provenance-chip">Auth required to begin</span>
        </div>
        <p className="pv2-body">
          Tell Crow about your organization in focused steps — field, purpose, team context, guidance
          preference, and review. Account verification is required before a Request record is created.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={routes.auth.signupWithNext(routes.client.requestNew)}
            className={`pv2-btn-primary text-sm ${PUBLIC_V2_MOTION_CLASS.button}`}
          >
            Create account &amp; begin secure request
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
