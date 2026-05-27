import { PageHeader } from "@/components/ui/page-header";
import { PROCROW_CONTROL_TOWER } from "@/lib/constants/procrow-portal";
import type { EntityId } from "@/lib/entity-theme";

type ProCrowPageHeaderProps = {
  title: string;
  description?: string;
  /** Override default ProCrow · Control Tower badge. */
  badge?: string;
  /** When true (default), prefix badge with ProCrow unless badge is fully custom. */
  procrowFramed?: boolean;
  entity?: EntityId;
  actions?: React.ReactNode;
};

export function ProCrowPageHeader({
  title,
  description,
  badge,
  procrowFramed = true,
  entity,
  actions,
}: ProCrowPageHeaderProps) {
  const displayBadge =
    badge ??
    (procrowFramed ? `ProCrow · ${PROCROW_CONTROL_TOWER.badge}` : PROCROW_CONTROL_TOWER.badge);

  return (
    <PageHeader
      title={title}
      description={description}
      badge={displayBadge}
      entity={entity}
      actions={actions}
    />
  );
}

/** Control Tower home header — fixed title and subtitle from constants. */
export function ProCrowControlTowerHeader({ actions }: { actions?: React.ReactNode }) {
  return (
    <ProCrowPageHeader
      title={PROCROW_CONTROL_TOWER.title}
      description={PROCROW_CONTROL_TOWER.subtitle}
      badge={`ProCrow · ${PROCROW_CONTROL_TOWER.badge}`}
      entity="cem"
      actions={actions}
    />
  );
}
