import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { RequestStatusBadge } from "@/components/admin/request-status-badge";
import { requireClientAccess } from "@/lib/auth/session";
import { getBusinessField } from "@/lib/business-field-catalog/fields";
import { getBusinessPurpose } from "@/lib/client-enterprise-design/purposes/business-purpose-catalog";
import { parseRequestBriefFromNotes } from "@/lib/client-service-request/constants";
import { clientCanAccessRequest } from "@/lib/services/client-request-link.service";
import { getImplementationRequest } from "@/lib/services/implementation-request.service";
import { routes } from "@/lib/routes";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function ClientRequestConfirmationPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  const user = await requireClientAccess(routes.client.requestConfirmation(requestId));

  if (!user.email) notFound();
  const allowed = await clientCanAccessRequest(user.id, user.email, requestId).catch(() => false);
  if (!allowed) notFound();

  const request = await getImplementationRequest(requestId).catch(() => null);
  if (!request) notFound();

  const brief = parseRequestBriefFromNotes(request.notes);
  if (!brief) notFound();

  const fieldLabel =
    (brief.primaryBusinessFieldKey && getBusinessField(brief.primaryBusinessFieldKey)?.displayNameEn) ||
    brief.customFieldDescription ||
    request.industry ||
    "—";
  const purposeLabel =
    (brief.primaryPurposeKey && getBusinessPurpose(brief.primaryPurposeKey)?.displayName) ||
    brief.customPurposeDescription ||
    "—";

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        eyebrow="Request received"
        title="Your service request was submitted"
        description={`Reference ${request.referenceCode}`}
      />

      <div className="cc-glass-card space-y-4">
        <RequestStatusBadge status={request.status as ImplementationRequestStatus} />
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Business field</dt>
            <dd className="text-white">{fieldLabel}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Purpose</dt>
            <dd className="text-white">{purposeLabel}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Team range</dt>
            <dd className="text-white">{brief.currentTeamRange?.replace(/_/g, " ") ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Guidance</dt>
            <dd className="text-white">{brief.configurationMode.replace(/_/g, " ")}</dd>
          </div>
        </dl>
        <p className="text-sm text-slate-400">
          ProCrow will review your request. No tenant or Blueprint has been created. You may continue to Discovery
          now or return later.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={routes.client.home} className="cc-btn-secondary">
          Let ProCrow continue
        </Link>
        <Link href={routes.client.requestDiscoveryDesign(requestId)} className="cc-btn-primary">
          Continue to Discovery
        </Link>
        <Link href={routes.client.request(requestId)} className="cc-btn-secondary">
          View request
        </Link>
      </div>
    </div>
  );
}
