import type { ProCrowControlTowerSnapshot } from "@/lib/procrow/procrow-control-tower-contract";
import { routes } from "@/lib/routes";
import { ProductNextAction } from "@/components/product/product-next-action";
import { ProductStatusCard } from "@/components/product/product-status-card";

type ProCrowOverviewPriorityProps = {
  snapshot: ProCrowControlTowerSnapshot;
};

export function ProCrowOverviewPriority({ snapshot }: ProCrowOverviewPriorityProps) {
  const cf = snapshot.customerFlow;
  const primary =
    cf.pendingReview > 0
      ? {
          title: "Review submitted requests",
          description: `${cf.pendingReview} request(s) need operator attention in the queue.`,
          href: routes.admin.queue,
        }
      : cf.proposalSentWaitingClient > 0
        ? {
            title: "Client proposals awaiting response",
            description: `${cf.proposalSentWaitingClient} proposal(s) waiting on client feedback.`,
            href: routes.admin.requests,
          }
        : snapshot.deploymentReadiness.validationBaseline === "blocked" ||
            snapshot.deploymentReadiness.blockedReason
          ? {
              title: "Deployment gate needs review",
              description: "F23 production gate — advisory readiness before any go-live discussion.",
              href: routes.admin.goNoGo,
            }
          : {
              title: "Scan operator queue",
              description: "No urgent intake signal — confirm pipeline and tenant readiness.",
              href: routes.admin.queue,
            };

  return (
    <div className="space-y-4">
      <ProductNextAction
        title={primary.title}
        description={primary.description}
        href={primary.href}
        label="Go"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ProductStatusCard
          status={cf.pendingReview > 0 ? "Attention" : "Requests"}
          title={`${cf.totalRequests} in pipeline`}
          why="Customer intake through onboarding."
          nextAction="Open requests or full queue."
          href={routes.admin.queue}
        />
        <ProductStatusCard
          status="Tenants"
          title={`${snapshot.tenantRuntime.tenantCount} runtime tenant(s)`}
          why="CEM workspaces after governed go-live."
          nextAction="Check tenant health and modules."
          href={routes.admin.tenants}
        />
        <ProductStatusCard
          status="Trust"
          title="CyberCrow posture"
          why="Advisory trust signals — human interpretation only."
          nextAction="Open security baselines or tenant CyberCrow."
          href={routes.admin.securityBaselines}
        />
        <ProductStatusCard
          status="Release"
          title="Go / No-Go"
          why="F23-gated deployment discipline — staging/demo."
          nextAction="Review validation index and blockers."
          href={routes.admin.goNoGo}
        />
      </div>
    </div>
  );
}
