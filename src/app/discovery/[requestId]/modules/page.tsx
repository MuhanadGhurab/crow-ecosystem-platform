import { notFound } from "next/navigation";
import { DiscoveryModulesForm } from "@/components/discovery/discovery-modules-form";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import type { CemModuleKey } from "@/lib/constants/modules";
import { getConfirmedModuleKeys } from "@/lib/discovery-answers";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

export default async function DiscoveryModulesPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const ctx = await getDiscoveryContext(requestId);

  if (!ctx?.discoveryProfile) {
    notFound();
  }

  const initialSelected = getConfirmedModuleKeys(
    ctx.requestedModules.map((m) => m.moduleKey),
    ctx.discoveryProfile.answers
  );

  const d = routes.discovery(requestId);

  return (
    <>
      <header className="cc-entity-block cc-entity-block--cem mb-6 !p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Step 2 · Modules</p>
        <p className="mt-1 text-sm text-slate-400">
          Select modules that match the client scope. Sector suggestions on Org intelligence use
          this list — confirm keys align with blueprint pricing catalog.
        </p>
      </header>
      <DiscoveryModulesForm requestId={requestId} initialSelected={initialSelected as CemModuleKey[]} />
      <DiscoveryStepFooter
        backHref={d.organization}
        backLabel="← Organization"
        nextHref={d.security}
        nextLabel="3. Security →"
      />
    </>
  );
}
