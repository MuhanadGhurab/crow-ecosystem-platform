import Link from "next/link";
import { ProCrowOperatorConsole } from "@/components/procrow/procrow-operator-console";
import { ProCrowPageHeader } from "@/components/procrow/procrow-page-header";
import { routes } from "@/lib/routes";
import { getProCrowOperatorConsoleSnapshot } from "@/lib/services/procrow-operator-console.service";

export default async function AdminOperatorConsolePage() {
  const snapshot = await getProCrowOperatorConsoleSnapshot();

  return (
    <div className="space-y-8">
      <Link href={routes.admin.overview} className="text-sm text-cyan-400 hover:text-cyan-300">
        ← Control tower overview
      </Link>

      <ProCrowPageHeader
        badge="ProCrow · Operator discipline"
        title="Operator docs & validation console"
        description="Read-only index of internal runbooks and npm validation commands — manual terminal execution only. For advisory deployment gates and F23 posture, use the go/no-go center. Not CI/CD, not compliance certification, not automatic validation."
      />

      <ProCrowOperatorConsole snapshot={snapshot} />
    </div>
  );
}
