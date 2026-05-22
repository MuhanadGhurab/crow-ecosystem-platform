import Link from "next/link";
import {
  getErpChain,
  type ErpModuleKey,
} from "@/lib/constants/erp-module-registry";

type TenantModuleLike = { moduleKey: string; enabled?: boolean };

type ErpChainLinksProps = {
  tenantSlug: string;
  currentModule: ErpModuleKey;
  tenantModules: TenantModuleLike[];
};

export function ErpChainLinks({
  tenantSlug,
  currentModule,
  tenantModules,
}: ErpChainLinksProps) {
  const chain = getErpChain(currentModule, tenantSlug, tenantModules);

  if (!chain.prev && !chain.next) return null;

  return (
    <nav
      className="flex flex-wrap items-center gap-3 border-t border-cyan-500/10 pt-6"
      aria-label="ERP chain navigation"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        ERP chain
      </span>
      {chain.prev && (
        <Link
          href={chain.prev.href}
          className="cc-btn-secondary text-sm"
        >
          ← {chain.prev.label}
        </Link>
      )}
      {chain.next && (
        <Link href={chain.next.href} className="cc-btn-secondary text-sm">
          {chain.next.label} →
        </Link>
      )}
    </nav>
  );
}
