import { notFound } from "next/navigation";
import { DiscoverySecurityForm } from "@/components/discovery/discovery-security-form";
import { DiscoveryEntityPanel } from "@/components/discovery/discovery-entity-panel";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import {
  addSecurityRequirement,
  removeSecurityRequirement,
} from "@/lib/actions/discovery";
import { getDiscoveryAnswer } from "@/lib/discovery-answers";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

export default async function DiscoverySecurityPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const ctx = await getDiscoveryContext(requestId);
  const profile = ctx?.discoveryProfile;

  if (!profile) {
    notFound();
  }

  const answers = profile.answers;
  const d = routes.discovery(requestId);

  return (
    <div className="space-y-8">
      <header className="cc-entity-block cc-entity-block--cybercrow mb-2 !p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">Step 3 · Security</p>
        <p className="mt-1 text-sm text-slate-400">
          CyberCrow packages and NCA-aligned requirements for blueprint security baselines.
        </p>
      </header>
      <DiscoverySecurityForm
        requestId={requestId}
        requestedPackageKeys={ctx.requestedSecurityPkgs.map((p) => p.packageKey)}
        initial={{
          complianceNotes: getDiscoveryAnswer<string>(answers, "security", "complianceNotes") ?? "",
          ncaAlignment: getDiscoveryAnswer<string>(answers, "security", "ncaAlignment") ?? "",
        }}
      />

      <DiscoveryEntityPanel
        title="Security requirements"
        description="Specific controls or policies to reflect in CyberCrow baseline."
        emptyLabel="No additional requirements captured."
        items={profile.securityRequirements.map((r) => ({
          id: r.id,
          primary: r.requirement,
          secondary: r.priority ? `Priority: ${r.priority}` : undefined,
        }))}
        requestId={requestId}
        addAction={addSecurityRequirement}
        removeAction={removeSecurityRequirement}
      >
        <input name="requirement" required placeholder="Requirement" className="input-cc sm:col-span-2" />
        <select name="priority" className="input-cc" defaultValue="">
          <option value="">Priority (optional)</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </DiscoveryEntityPanel>

      <DiscoveryStepFooter
        backHref={d.modules}
        backLabel="← Modules"
        nextHref={d.departments}
        nextLabel="Structure →"
      />
    </div>
  );
}
