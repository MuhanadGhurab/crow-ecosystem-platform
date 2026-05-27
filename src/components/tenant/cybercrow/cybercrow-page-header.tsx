import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { CYBERCROW_COPY, CYBERCROW_IDENTITY, type CyberCrowUXArea } from "@/lib/constants/cybercrow-ux-depth";
import { routes } from "@/lib/routes";
import { CybercrowScopeNote } from "./cybercrow-scope-note";

const AREA_DESCRIPTION: Partial<Record<CyberCrowUXArea, string>> = {
  dashboard: "Trust cockpit — evidence, GRC, risk, and event summaries with operator next actions.",
  security_events: CYBERCROW_COPY.eventsPurpose,
  evidence: CYBERCROW_COPY.evidencePurpose,
  grc: CYBERCROW_COPY.grcPurpose,
  risk: CYBERCROW_COPY.riskPurpose,
  audit_logs: CYBERCROW_COPY.auditPurpose,
};

type CybercrowPageHeaderProps = {
  tenantSlug: string;
  area: CyberCrowUXArea;
  title: string;
  description?: string;
  showScopeNote?: boolean;
  emphasizeLegal?: boolean;
  showProcrowLink?: boolean;
};

export function CybercrowPageHeader({
  tenantSlug,
  area,
  title,
  description,
  showScopeNote = true,
  emphasizeLegal = false,
  showProcrowLink = true,
}: CybercrowPageHeaderProps) {
  const desc = description ?? AREA_DESCRIPTION[area] ?? CYBERCROW_IDENTITY.tagline;

  return (
    <div className="space-y-4">
      <PageHeader
        badge={`${CYBERCROW_IDENTITY.shortName} · ${CYBERCROW_IDENTITY.procrowCapability}`}
        entity="cybercrow"
        title={title}
        description={desc}
      />
      {showProcrowLink ? (
        <p className="text-xs text-slate-500">
          {CYBERCROW_COPY.procrowOwnership}{" "}
          <Link href={routes.admin.overview} className="text-violet-400 hover:text-violet-300">
            ProCrow overview →
          </Link>
        </p>
      ) : null}
      {showScopeNote ? (
        <CybercrowScopeNote compact emphasizeLegal={emphasizeLegal || area === "evidence"} />
      ) : null}
    </div>
  );
}
