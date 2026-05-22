import { PageHeader } from "@/components/ui/page-header";
import { PagePlaceholder } from "@/components/ui/page-placeholder";
import type { EntityId } from "@/lib/entity-theme";

export type TenantEngine = "CEM" | "CyberCrow" | "Blueprint" | "SAREA";

const ENGINE_ENTITY: Record<TenantEngine, EntityId> = {
  CEM: "cem",
  CyberCrow: "cybercrow",
  Blueprint: "cem",
  SAREA: "sarea",
};

const ENGINE_BADGE: Record<TenantEngine, string> = {
  CEM: "Crow Enterprise Manager",
  CyberCrow: "CyberCrow",
  Blueprint: "Blueprint",
  SAREA: "SAREA Studio",
};

interface TenantModulePageProps {
  engine: TenantEngine;
  title: string;
  description?: string;
  route: string;
  children?: React.ReactNode;
}

/** Standard header + optional body for tenant / blueprint module routes. */
export function TenantModulePage({
  engine,
  title,
  description,
  route,
  children,
}: TenantModulePageProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        badge={ENGINE_BADGE[engine]}
        entity={ENGINE_ENTITY[engine]}
        title={title}
        description={description}
      />
      {children ?? (
        <PagePlaceholder area={engine} route={route} entity={ENGINE_ENTITY[engine]} />
      )}
    </div>
  );
}
