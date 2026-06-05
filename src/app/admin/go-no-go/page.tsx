import Link from "next/link";
import { ProCrowGoNoGoCenter } from "@/components/procrow/procrow-go-no-go-center";
import { ProCrowPageHeader } from "@/components/procrow/procrow-page-header";
import { routes } from "@/lib/routes";
import { getProCrowGoNoGoSnapshot } from "@/lib/services/procrow-go-no-go.service";
import { buildCyberCrowTrustGoNoGoDependency } from "@/lib/services/cybercrow-tenant-trust.service";
import { buildSareaExperienceGoNoGoDependency } from "@/lib/sarea/sarea-experience-go-no-go";
import { buildCemRuntimeGoNoGoDependency } from "@/lib/cem/cem-runtime-go-no-go";
import { buildCemOperatingModelGoNoGoDependency } from "@/lib/cem/cem-operating-model-go-no-go";
import { buildCemModuleDepthGoNoGoDependency } from "@/lib/cem/cem-module-depth-go-no-go";
import { buildCemTransactionWorkflowGoNoGoDependency } from "@/lib/cem/cem-transaction-workflow-go-no-go";
import { buildCemWorkflowPersistenceGoNoGoDependency } from "@/lib/cem/cem-workflow-persistence-go-no-go";
import { ProCrowCybercrowTrustGoNoGoPanel } from "@/components/procrow/procrow-cybercrow-trust-go-no-go-panel";
import { ProCrowSareaExperienceGoNoGoPanel } from "@/components/procrow/procrow-sarea-experience-go-no-go-panel";
import { ProCrowCemRuntimeGoNoGoPanel } from "@/components/procrow/procrow-cem-runtime-go-no-go-panel";
import { ProCrowCemOperatingModelGoNoGoPanel } from "@/components/procrow/procrow-cem-operating-model-go-no-go-panel";
import { ProCrowCemModuleDepthGoNoGoPanel } from "@/components/procrow/procrow-cem-module-depth-go-no-go-panel";
import { ProCrowCemTransactionWorkflowGoNoGoPanel } from "@/components/procrow/procrow-cem-transaction-workflow-go-no-go-panel";
import { ProCrowCemWorkflowPersistenceGoNoGoPanel } from "@/components/procrow/procrow-cem-workflow-persistence-go-no-go-panel";

export const dynamic = "force-dynamic";

export default async function AdminGoNoGoPage() {
  const [
    snapshot,
    cybercrowTrustDependency,
    sareaExperienceDependency,
    cemRuntimeDependency,
    cemOperatingModelDependency,
    cemModuleDepthDependency,
    cemTransactionWorkflowDependency,
    cemWorkflowPersistenceDependency,
  ] = await Promise.all([
    getProCrowGoNoGoSnapshot(),
    Promise.resolve(buildCyberCrowTrustGoNoGoDependency()),
    Promise.resolve(buildSareaExperienceGoNoGoDependency()),
    Promise.resolve(buildCemRuntimeGoNoGoDependency()),
    Promise.resolve(buildCemOperatingModelGoNoGoDependency()),
    Promise.resolve(buildCemModuleDepthGoNoGoDependency()),
    Promise.resolve(buildCemTransactionWorkflowGoNoGoDependency()),
    Promise.resolve(buildCemWorkflowPersistenceGoNoGoDependency()),
  ]);

  return (
    <div className="space-y-8">
      <Link href={routes.admin.overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Control tower overview
      </Link>

      <ProCrowPageHeader
        badge="ProCrow · Deployment discipline"
        title="Deployment Go/No-Go Center"
        description="Advisory readiness, validation baseline, and release gate visibility — operator-reviewed. Not CI/CD, not automatic deploy, not compliance certification. Production commercial launch remains F23-gated."
      />

      <ProCrowCybercrowTrustGoNoGoPanel dependency={cybercrowTrustDependency} />
      <ProCrowSareaExperienceGoNoGoPanel dependency={sareaExperienceDependency} />
      <ProCrowCemOperatingModelGoNoGoPanel dependency={cemOperatingModelDependency} />
      <ProCrowCemModuleDepthGoNoGoPanel dependency={cemModuleDepthDependency} />
      <ProCrowCemTransactionWorkflowGoNoGoPanel dependency={cemTransactionWorkflowDependency} />
      <ProCrowCemWorkflowPersistenceGoNoGoPanel dependency={cemWorkflowPersistenceDependency} />
      <ProCrowCemRuntimeGoNoGoPanel dependency={cemRuntimeDependency} />
      <ProCrowGoNoGoCenter snapshot={snapshot} />
    </div>
  );
}
