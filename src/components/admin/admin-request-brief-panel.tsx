import { getBusinessField } from "@/lib/business-field-catalog/fields";
import { getBusinessPurpose } from "@/lib/client-enterprise-design/purposes/business-purpose-catalog";
import { organizationContextLabel } from "@/lib/client-service-request/org-context-labels";
import type { ClientServiceRequestBrief } from "@/lib/client-service-request/types";
import { REQUEST_JOURNEY_KIND_LABELS } from "@/lib/client-service-request/journey";
import {
  PROCROW_QUALIFICATION_OUTCOME_LABELS,
} from "@/lib/procrow/procrow-qualification";
import { productStatusLabelForPersisted } from "@/lib/procrow/request-status-product-mapping";
import type { ImplementationRequestStatus } from "@/lib/types/platform";
import { AdminFieldResolutionPanel } from "@/components/admin/admin-field-resolution-panel";

export function AdminRequestBriefPanel({
  brief,
  requestId,
  fieldOptions = [],
  status,
}: {
  brief: ClientServiceRequestBrief;
  requestId?: string;
  fieldOptions?: Array<{ key: string; label: string }>;
  status?: ImplementationRequestStatus;
}) {
  const fieldLabel =
    (brief.primaryBusinessFieldKey && getBusinessField(brief.primaryBusinessFieldKey)?.displayNameEn) ||
    brief.customFieldDescription ||
    "—";
  const purposeLabel =
    (brief.primaryPurposeKey && getBusinessPurpose(brief.primaryPurposeKey)?.displayName) ||
    brief.customPurposeDescription ||
    "—";
  const journeyLabel = brief.journeyKind
    ? REQUEST_JOURNEY_KIND_LABELS[brief.journeyKind]
    : "Not specified";
  const productStatus =
    status != null
      ? productStatusLabelForPersisted(status, brief.procrowQualification)
      : null;

  return (
    <section className="cc-glass-card space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Request Brief</h2>
        <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">Client provided</span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Journey</dt>
          <dd className="text-white">{journeyLabel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Organization context</dt>
          <dd className="text-white">{organizationContextLabel(brief.organizationContext)}</dd>
        </div>
        {productStatus && (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Product status</dt>
            <dd className="text-cyan-200">{productStatus}</dd>
          </div>
        )}
        {brief.procrowQualification && (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Qualification outcome</dt>
            <dd className="text-emerald-300">
              {PROCROW_QUALIFICATION_OUTCOME_LABELS[brief.procrowQualification.outcome]}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-slate-500">Primary field</dt>
          <dd className="text-white">{fieldLabel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Field resolution</dt>
          <dd className="text-white">{brief.fieldResolutionStatus ?? "—"}</dd>
        </div>
        {brief.secondaryBusinessFieldKeys.length > 0 && (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Secondary fields</dt>
            <dd className="text-white">
              {brief.secondaryBusinessFieldKeys
                .map((k) => getBusinessField(k)?.displayNameEn ?? k)
                .join(", ")}
            </dd>
          </div>
        )}
        {brief.customFieldDescription && (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Custom field description (immutable client statement)</dt>
            <dd className="text-white">{brief.customFieldDescription}</dd>
          </div>
        )}
        <div>
          <dt className="text-slate-500">Purpose</dt>
          <dd className="text-white">{purposeLabel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Team range</dt>
          <dd className="text-white">{brief.currentTeamRange?.replace(/_/g, " ") ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Growth intention</dt>
          <dd className="text-white">{brief.growthIntention?.replace(/_/g, " ") ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Configuration mode</dt>
          <dd className="text-white">{brief.configurationMode.replace(/_/g, " ")}</dd>
        </div>
        {brief.plainLanguageGoal && (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Plain-language goal</dt>
            <dd className="text-white">{brief.plainLanguageGoal}</dd>
          </div>
        )}
      </dl>

      {brief.preliminaryRecommendation && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-950/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            Crow preliminary recommendation
          </p>
          <p className="mt-2 text-sm text-slate-300">{brief.preliminaryRecommendation.summary}</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-400">
            {brief.preliminaryRecommendation.essentialCapabilities.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {brief.originalClientStatement && (
        <p className="text-xs text-slate-500">
          Original client statement preserved: {brief.originalClientStatement}
        </p>
      )}

      {requestId && (
        <AdminFieldResolutionPanel requestId={requestId} brief={brief} fieldOptions={fieldOptions} />
      )}
    </section>
  );
}
