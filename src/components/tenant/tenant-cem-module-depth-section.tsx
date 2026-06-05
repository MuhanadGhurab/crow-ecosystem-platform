import type { CemModuleDepthSnapshot } from "@/lib/cem/cem-module-depth-contract";
import { CemModuleDepthHeader } from "@/components/tenant/cem-module-depth-header";
import { CemModuleRecordsPanel } from "@/components/tenant/cem-module-records-panel";
import { CemModuleFlowPanel } from "@/components/tenant/cem-module-flow-panel";
import { CemModuleReportingPanel } from "@/components/tenant/cem-module-reporting-panel";
import { CemModuleTrustExperiencePanel } from "@/components/tenant/cem-module-trust-experience-panel";
import { CemModuleNextActions } from "@/components/tenant/cem-module-next-actions";

type Props = {
  slug: string;
  snapshot: CemModuleDepthSnapshot;
  cybercrowInitialized?: boolean;
};

export function TenantCemModuleDepthSection({
  slug,
  snapshot,
  cybercrowInitialized,
}: Props) {
  return (
    <div className="space-y-4" data-cem-module-depth={snapshot.moduleKey}>
      <CemModuleDepthHeader snapshot={snapshot} />
      <CemModuleRecordsPanel records={snapshot.records} moduleLabel={snapshot.moduleLabel} />
      <CemModuleFlowPanel
        slug={slug}
        workflows={snapshot.workflows}
        tasks={snapshot.tasks}
        crossModuleLinks={snapshot.crossModuleLinks}
      />
      <CemModuleReportingPanel
        slug={slug}
        reports={snapshot.reports}
        moduleLabel={snapshot.moduleLabel}
      />
      <CemModuleTrustExperiencePanel
        slug={slug}
        cyberCrowHooks={snapshot.cyberCrowHooks}
        sareaHooks={snapshot.sareaHooks}
        cybercrowInitialized={cybercrowInitialized}
      />
      <CemModuleNextActions snapshot={snapshot} />
    </div>
  );
}
