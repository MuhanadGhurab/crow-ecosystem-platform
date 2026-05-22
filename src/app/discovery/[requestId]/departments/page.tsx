import { notFound } from "next/navigation";
import { DiscoveryEntityPanel } from "@/components/discovery/discovery-entity-panel";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import {
  addBranch,
  addDepartment,
  removeBranch,
  removeDepartment,
} from "@/lib/actions/discovery";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

export default async function DiscoveryStructurePage({
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

  const d = routes.discovery(requestId);

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-400">
        Map organizational structure — departments and branches feed the enterprise blueprint.
      </p>

      <DiscoveryEntityPanel
        title="Departments"
        description="Business units or functions that will own workflows and data."
        emptyLabel="No departments added yet."
        items={profile.departments.map((dep) => ({
          id: dep.id,
          primary: dep.name,
          secondary: dep.headcount ? `${dep.headcount} people` : dep.nameAr ?? undefined,
        }))}
        requestId={requestId}
        addAction={addDepartment}
        removeAction={removeDepartment}
      >
        <input name="name" required placeholder="Department name" className="input-cc" />
        <input name="nameAr" placeholder="الاسم (AR)" dir="rtl" className="input-cc" />
        <input name="headcount" type="number" min={1} placeholder="Headcount" className="input-cc" />
      </DiscoveryEntityPanel>

      <DiscoveryEntityPanel
        title="Branches"
        description="Sites, regions, or subsidiaries operating under the same tenant."
        emptyLabel="No branches added yet."
        items={profile.branches.map((b) => ({
          id: b.id,
          primary: b.name,
          secondary: [b.city, b.region].filter(Boolean).join(", ") || undefined,
        }))}
        requestId={requestId}
        addAction={addBranch}
        removeAction={removeBranch}
      >
        <input name="name" required placeholder="Branch name" className="input-cc" />
        <input name="city" placeholder="City" className="input-cc" />
        <input name="region" placeholder="Region" className="input-cc" />
      </DiscoveryEntityPanel>

      <DiscoveryStepFooter
        backHref={d.security}
        backLabel="← Security"
        nextHref={d.roles}
        nextLabel="Roles →"
      />
    </div>
  );
}
