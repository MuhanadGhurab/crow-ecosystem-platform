import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { TenantRuntimeDemoHint } from "@/components/tenant/tenant-runtime-demo-hint";
import type { TenantRuntimeDemoBeat } from "@/lib/constants/tenant-runtime-demo";
import type { EntityId } from "@/lib/entity-theme";

type TenantRuntimePageHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
  entity?: EntityId;
  actions?: ReactNode;
  beat?: TenantRuntimeDemoBeat;
  showRuntimeHint?: boolean;
};

/** K1 — PageHeader plus optional runtime demo hint. */
export function TenantRuntimePageHeader({
  beat,
  showRuntimeHint = true,
  ...header
}: TenantRuntimePageHeaderProps) {
  return (
    <div className="space-y-4">
      {showRuntimeHint && <TenantRuntimeDemoHint beat={beat} compact />}
      <PageHeader {...header} />
    </div>
  );
}
