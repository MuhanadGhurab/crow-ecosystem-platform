import { notFound } from "next/navigation";
import { DiscoveryEntityPanel } from "@/components/discovery/discovery-entity-panel";
import { DiscoveryStepFooter } from "@/components/discovery/discovery-step-footer";
import { addRole, removeRole } from "@/lib/actions/discovery";
import { routes } from "@/lib/routes";
import { getDiscoveryContext } from "@/lib/services/discovery.service";

export default async function DiscoveryRolesPage({
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
      <DiscoveryEntityPanel
        title="Roles"
        description="Key roles that will drive permissions, approvals, and SAREA personas."
        emptyLabel="No roles defined yet."
        items={profile.roles.map((r) => ({
          id: r.id,
          primary: r.name,
          secondary: r.level ? `Level: ${r.level}` : undefined,
        }))}
        requestId={requestId}
        addAction={addRole}
        removeAction={removeRole}
      >
        <input name="name" required placeholder="Role title" className="input-cc" />
        <select name="level" className="input-cc" defaultValue="">
          <option value="">Level (optional)</option>
          <option value="executive">Executive</option>
          <option value="manager">Manager</option>
          <option value="frontline">Frontline</option>
        </select>
      </DiscoveryEntityPanel>

      <DiscoveryStepFooter
        backHref={d.departments}
        backLabel="← Structure"
        nextHref={d.workflows}
        nextLabel="Workflows →"
      />
    </div>
  );
}
