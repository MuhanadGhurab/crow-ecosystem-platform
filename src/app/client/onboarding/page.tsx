import Link from "next/link";
import { ClientOnboardingTrackerPanel } from "@/components/client-portal/client-onboarding-tracker-panel";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { CLIENT_ONBOARDING_PRODUCTION_GATED_NOTE } from "@/lib/client-portal/client-onboarding-contract";
import { requireClientAccess } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { buildClientOnboardingOverview } from "@/lib/services/client-onboarding.service";

export default async function ClientOnboardingPage() {
  const user = await requireClientAccess(routes.client.onboarding);
  const { trackers, primary } = await buildClientOnboardingOverview(user);

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        eyebrow="Readiness"
        title="Onboarding"
        description="Operational readiness after scope approval. ProCrow controls provisioning and tenant go-live — this tracker is advisory only."
      />

      <section
        className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-sm text-slate-500"
        aria-label="Onboarding trust notice"
      >
        {CLIENT_ONBOARDING_PRODUCTION_GATED_NOTE}
      </section>

      {trackers.length === 0 ? (
        <ClientPortalStatusCard
          title="No linked requests yet"
          badge="Get started"
          badgeTone="warning"
          description="Submit a request or sign in with the same email as your primary contact to see onboarding steps here."
        >
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={routes.public.request} className="cc-btn-primary text-sm">
              Submit a request
            </Link>
            <Link href={routes.client.requests} className="cc-btn-secondary text-sm">
              Your requests
            </Link>
          </div>
        </ClientPortalStatusCard>
      ) : primary ? (
        <>
          {trackers.length > 1 && (
            <p className="text-sm text-slate-500">
              You have {trackers.length} linked requests. Showing onboarding for{" "}
              <span className="font-mono text-slate-300">{primary.referenceCode}</span>. Open a
              request, proposal, or blueprint page for that request&apos;s summary card.
            </p>
          )}
          <ClientOnboardingTrackerPanel tracker={primary} showRequestPicker />
        </>
      ) : null}
    </div>
  );
}
