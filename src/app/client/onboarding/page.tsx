import Link from "next/link";
import { ClientPortalStatusCard } from "@/components/client-portal/client-portal-status-card";
import { requireClientAccess } from "@/lib/auth/session";
import { buildClientPortalDashboardSnapshot } from "@/lib/services/client-portal.service";
import { routes } from "@/lib/routes";

export default async function ClientOnboardingPage() {
  const user = await requireClientAccess(routes.client.onboarding);
  const snapshot = await buildClientPortalDashboardSnapshot(user);
  const steps = snapshot.onboardingSteps;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="cc-page-title">Onboarding</h1>
        <p className="mt-2 text-sm text-slate-400">
          Track progress from request through discovery, blueprint, proposal, and go-live. ProCrow
          controls provisioning readiness.
        </p>
      </div>

      {steps.length === 0 ? (
        <ClientPortalStatusCard
          title="Onboarding not started"
          description="Link a request to your account to see onboarding steps."
        >
          <Link href={routes.public.request} className="cc-btn-primary mt-4 inline-flex text-sm">
            Submit a request
          </Link>
        </ClientPortalStatusCard>
      ) : (
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.key}>
              <ClientPortalStatusCard
                title={`${index + 1}. ${step.label}`}
                badge={step.status.replace("_", " ")}
                badgeTone={
                  step.status === "complete"
                    ? "success"
                    : step.status === "in_progress"
                      ? "info"
                      : step.status === "blocked"
                        ? "warning"
                        : "neutral"
                }
                description={step.description}
              >
                <p className="text-xs text-slate-500 capitalize">Owner: {step.owner}</p>
                {step.relatedRoute && (
                  <Link href={step.relatedRoute} className="mt-3 inline-block text-sm text-teal-400">
                    Open related page →
                  </Link>
                )}
              </ClientPortalStatusCard>
            </li>
          ))}
        </ol>
      )}

      <ClientPortalStatusCard title="ProCrow provisioning" badge="Control tower" badgeTone="info">
        <p className="text-sm text-slate-400">
          Tenant provisioning, security initialization, and SAREA setup are managed in ProCrow.
          You will see go-live readiness here when linked — not in this skeleton phase.
        </p>
      </ClientPortalStatusCard>
    </div>
  );
}
