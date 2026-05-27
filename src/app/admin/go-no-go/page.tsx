import Link from "next/link";
import { ProCrowGoNoGoCenter } from "@/components/procrow/procrow-go-no-go-center";
import { ProCrowPageHeader } from "@/components/procrow/procrow-page-header";
import { routes } from "@/lib/routes";
import { getProCrowGoNoGoSnapshot } from "@/lib/services/procrow-go-no-go.service";

export default async function AdminGoNoGoPage() {
  const snapshot = await getProCrowGoNoGoSnapshot();

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

      <ProCrowGoNoGoCenter snapshot={snapshot} />
    </div>
  );
}
