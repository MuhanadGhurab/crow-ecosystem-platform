import Link from "next/link";
import { PLATFORM_ENGINE_HUB } from "@/lib/constants/platform-engine-hub";
import { routes } from "@/lib/routes";
import { ProductSection } from "@/components/product/product-section";
import { ProductStatusCard } from "@/components/product/product-status-card";

export function ProCrowTenantRuntimeFraming() {
  return (
    <ProductSection
      title="ProCrow governs · Tenant runtime operates"
      description="ProCrow prepares readiness; CEM runs day-to-day business modules."
    >
      <div className="grid gap-3 lg:grid-cols-2">
        <ProductStatusCard
          status="ProCrow"
          title="Preparation & discipline"
          why="Request-to-tenant flow, trust posture, experience studio, go/no-go, and deployment gates."
          nextAction="Review queue and tenant readiness before handoff."
          href={routes.admin.queue}
        />
        <ProductStatusCard
          status="Tenant runtime / CEM"
          title="Operational modules"
          why="HR, finance, CRM, procurement, inventory, logistics, tasks, and reports inside each tenant."
          nextAction="Open a live tenant workspace when runtime is ready."
          href={PLATFORM_ENGINE_HUB.cem()}
          ctaLabel="CEM runtime"
        />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        <Link href={routes.admin.tenants} className="text-cyan-400 hover:text-cyan-300">
          Tenant list →
        </Link>
        {" · "}
        No auto-provisioning or production launch from this overview.
      </p>
    </ProductSection>
  );
}
