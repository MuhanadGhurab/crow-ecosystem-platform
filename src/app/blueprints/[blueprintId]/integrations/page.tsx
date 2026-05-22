import { notFound } from "next/navigation";
import { BlueprintDiscoveryReadonly } from "@/components/blueprint/blueprint-discovery-readonly";
import { getDiscoveryContext } from "@/lib/services/discovery.service";
import { getEnterpriseBlueprint } from "@/lib/services/blueprint.service";

export default async function BlueprintIntegrationsPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  const blueprint = await getEnterpriseBlueprint(blueprintId);
  if (!blueprint) notFound();

  const discovery = await getDiscoveryContext(blueprint.requestId);

  return (
    <BlueprintDiscoveryReadonly
      blueprintId={blueprintId}
      requestId={blueprint.requestId}
      discovery={discovery}
      variant="integrations"
    />
  );
}
