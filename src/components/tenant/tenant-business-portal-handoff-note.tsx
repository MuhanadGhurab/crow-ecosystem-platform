import Link from "next/link";
import {
  CEM_CLIENT_BUSINESS_PROCROW_DISTINCTION,
  CEM_CYBERCROW_SAREA_RELATIONSHIP_COPY,
} from "@/lib/cem/cem-runtime-handoff-contract";
import {
  BUSINESS_PORTAL_RUNTIME_NOTE,
  TENANT_RUNTIME_PROCROW_NOTE,
} from "@/lib/constants/tenant-runtime-demo";
import { routes } from "@/lib/routes";

type Props = {
  slug: string;
};

export function TenantBusinessPortalHandoffNote({ slug }: Props) {
  const r = routes.tenant(slug);

  return (
    <section className="rounded-lg border border-cyan-500/15 bg-cyan-950/15 px-4 py-3 text-sm space-y-2">
      <p className="font-medium text-cyan-200">Business Portal · staging runtime</p>
      <p className="text-xs text-slate-400">{TENANT_RUNTIME_PROCROW_NOTE}</p>
      <p className="text-xs text-slate-400">{BUSINESS_PORTAL_RUNTIME_NOTE}</p>
      <p className="text-xs text-slate-500">{CEM_CYBERCROW_SAREA_RELATIONSHIP_COPY}</p>
      <p className="text-[11px] text-slate-600">
        {CEM_CLIENT_BUSINESS_PROCROW_DISTINCTION.clientPortal} ·{" "}
        {CEM_CLIENT_BUSINESS_PROCROW_DISTINCTION.businessPortal}
      </p>
      <div className="flex flex-wrap gap-3 text-xs pt-1">
        <Link href={r.modules} className="text-cyan-400 hover:text-cyan-300">
          Modules →
        </Link>
        <Link href={r.tasks} className="text-cyan-400 hover:text-cyan-300">
          Tasks →
        </Link>
        <Link href={r.workflows} className="text-cyan-400 hover:text-cyan-300">
          Workflows →
        </Link>
        <Link href={r.reports} className="text-cyan-400 hover:text-cyan-300">
          Reports →
        </Link>
        <Link href={r.cybercrow.dashboard} className="text-violet-400 hover:text-violet-300">
          CyberCrow →
        </Link>
      </div>
    </section>
  );
}
