import Link from "next/link";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";
import { ClientOnboardingTrackerPanel } from "@/components/client-portal/client-onboarding-tracker-panel";
import { CLIENT_ONBOARDING_PRODUCTION_GATED_NOTE } from "@/lib/client-portal/client-onboarding-contract";
import { routes } from "@/lib/routes";
import { buildClientOnboardingOverview } from "@/lib/services/client-onboarding.service";
import { createClient } from "@/lib/supabase/server";
import { isAuthDisabled } from "@/lib/supabase/env";

export default async function ClientOnboardingPage() {
  if (isAuthDisabled()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <PageHeader
          title="Onboarding"
          description="Sign-in is required to view your onboarding tracker."
        />
        <p className="mt-6 text-sm text-slate-500">
          Enable Supabase auth or use demo mode from the login page.
        </p>
        <Link href={routes.auth.login} className="mt-4 inline-block text-sm text-teal-400">
          Sign in →
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(routes.auth.login);

  const { trackers, primary } = await buildClientOnboardingOverview(user);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        title="Onboarding"
        description="Operational readiness after scope approval — ProCrow controls provisioning and production go-live."
      />

      <p className="mt-4 rounded-lg border border-slate-800/80 bg-slate-950/50 px-4 py-3 text-sm text-slate-500">
        {CLIENT_ONBOARDING_PRODUCTION_GATED_NOTE}
      </p>

      {trackers.length === 0 ? (
        <section className="cc-glass-card mt-8">
          <p className="text-sm text-slate-400">
            No linked implementation requests yet. Submit a request or sign in with your primary
            contact email to see onboarding steps here.
          </p>
          <Link href={routes.public.request} className="mt-4 inline-block text-sm text-teal-400">
            Start a request →
          </Link>
        </section>
      ) : primary ? (
        <div className="mt-8">
          {trackers.length > 1 && (
            <p className="mb-6 text-sm text-slate-500">
              You have {trackers.length} linked requests. Showing onboarding for{" "}
              <span className="text-slate-300">{primary.referenceCode}</span>. Open a specific
              request for its onboarding summary.
            </p>
          )}
          <ClientOnboardingTrackerPanel tracker={primary} showRequestPicker />
        </div>
      ) : null}
    </div>
  );
}
