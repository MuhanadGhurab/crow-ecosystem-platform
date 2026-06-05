import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
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
  tenantSlug?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

/** Standard header + optional body for tenant / blueprint module routes. */
export function TenantModulePage({
  engine,
  title,
  description,
  route,
  tenantSlug,
  backHref,
  backLabel,
  children,
}: TenantModulePageProps) {
  const modulePath = route.split("/").filter(Boolean).pop() ?? "module";

  return (
    <div className="space-y-8">
      <PageHeader
        badge={ENGINE_BADGE[engine]}
        entity={ENGINE_ENTITY[engine]}
        title={title}
        description={description}
        actions={
          backHref ? (
            <Link href={backHref} className="cc-btn-secondary text-sm">
              {backLabel ?? "Back"}
            </Link>
          ) : undefined
        }
      />
      {children ?? (
        <EmptyState
          title={`${title} is not enabled for this tenant`}
          description={`This workspace does not include the “${modulePath}” module yet. Enable it in the blueprint or open module settings.`}
          action={
            tenantSlug ? (
              <Link href={`/${tenantSlug}/modules`} className="cc-btn-primary text-sm">
                View tenant modules →
              </Link>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
