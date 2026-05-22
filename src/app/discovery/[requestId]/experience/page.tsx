import { notFound } from "next/navigation";
import { DiscoveryEntityPanel } from "@/components/discovery/discovery-entity-panel";
import { DiscoverySareaPackageForm } from "@/components/discovery/discovery-sarea-package-form";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import { addExperienceRequirement, removeExperienceRequirement } from "@/lib/actions/discovery";
import { canEditDiscovery } from "@/lib/discovery-editability";
import { getDiscoveryAnswer } from "@/lib/discovery-answers";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function DiscoveryExperiencePage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const ctx = await getDiscoveryContext(requestId);
  const profile = ctx?.discoveryProfile;
  if (!profile) notFound();

  const d = routes.discovery(requestId);
  const sareaPackageKey = getDiscoveryAnswer<string>(profile.answers, "experience", "sareaPackageKey");
  const readOnly = !canEditDiscovery(ctx.status as ImplementationRequestStatus);

  return (
    <div className="space-y-8">
      <header className="cc-entity-block cc-entity-block--sarea mb-2 !p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">SAREA experience</p>
        <p className="mt-1 text-sm text-slate-400">
          Package tier and persona requirements feed blueprint SAREA pricing and adaptive UI at provision.
        </p>
      </header>
      <DiscoverySareaPackageForm
        requestId={requestId}
        currentKey={sareaPackageKey ?? null}
        readOnly={readOnly}
      />
      <DiscoveryEntityPanel
        title="Experience requirements"
        description="Feeds SAREA persona keys and adaptive UI rules at provision."
        emptyLabel="No experience requirements yet."
        items={profile.experienceRequirements.map((e) => ({
          id: e.id,
          primary: e.personaKey,
          secondary: e.requirement,
        }))}
        requestId={requestId}
        addAction={readOnly ? undefined : addExperienceRequirement}
        removeAction={readOnly ? undefined : removeExperienceRequirement}
      >
        <select name="personaKey" className="input-cc" defaultValue="executive">
          <option value="executive">executive</option>
          <option value="manager">manager</option>
          <option value="frontline">frontline</option>
        </select>
        <input name="requirement" required placeholder="Requirement" className="input-cc" />
      </DiscoveryEntityPanel>
      <DiscoveryStepFooter backHref={d.integrations} nextHref={d.summary} nextLabel="Summary →" />
    </div>
  );
}
