import Link from "next/link";
import { ProCrowGoNoGoCenter } from "@/components/procrow/procrow-go-no-go-center";
import { ProCrowPageHeader } from "@/components/procrow/procrow-page-header";
import { routes } from "@/lib/routes";
import { getProCrowGoNoGoSnapshot } from "@/lib/services/procrow-go-no-go.service";
import { buildCyberCrowTrustGoNoGoDependency } from "@/lib/services/cybercrow-tenant-trust.service";
import { buildSareaExperienceGoNoGoDependency } from "@/lib/sarea/sarea-experience-go-no-go";
import { ProCrowCybercrowTrustGoNoGoPanel } from "@/components/procrow/procrow-cybercrow-trust-go-no-go-panel";
import { ProCrowSareaExperienceGoNoGoPanel } from "@/components/procrow/procrow-sarea-experience-go-no-go-panel";

export const dynamic = "force-dynamic";

export default async function AdminGoNoGoPage() {
  const [snapshot, cybercrowTrustDependency, sareaExperienceDependency] = await Promise.all([
    getProCrowGoNoGoSnapshot(),
    Promise.resolve(buildCyberCrowTrustGoNoGoDependency()),
    Promise.resolve(buildSareaExperienceGoNoGoDependency()),
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
      <ProCrowGoNoGoCenter snapshot={snapshot} />
    </div>
  );
}
