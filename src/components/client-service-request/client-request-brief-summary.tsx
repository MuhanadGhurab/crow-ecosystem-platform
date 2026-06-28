import { getBusinessField } from "@/lib/business-field-catalog/fields";
import { getBusinessPurpose } from "@/lib/client-enterprise-design/purposes/business-purpose-catalog";
import type { ClientServiceRequestBrief } from "@/lib/client-service-request/types";

export function ClientRequestBriefSummary({ brief }: { brief: ClientServiceRequestBrief }) {
  const fieldLabel =
    (brief.primaryBusinessFieldKey && getBusinessField(brief.primaryBusinessFieldKey)?.displayNameEn) ||
    brief.customFieldDescription ||
    "—";
  const purposeLabel =
    (brief.primaryPurposeKey && getBusinessPurpose(brief.primaryPurposeKey)?.displayName) ||
    brief.customPurposeDescription ||
    "—";

  return (
    <section className="cc-glass-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Request brief</h2>
        {brief.requiresProcrowFieldReview && (
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300">
            ProCrow field review required
          </span>
        )}
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Business field</dt>
          <dd className="text-white">{fieldLabel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Field resolution</dt>
          <dd className="text-white">{brief.fieldResolutionStatus?.replace(/_/g, " ") ?? "—"}</dd>
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
          <dt className="text-slate-500">Growth intention</dt>
          <dd className="text-white">{brief.growthIntention?.replace(/_/g, " ") ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Guidance preference</dt>
          <dd className="text-white">{brief.configurationMode.replace(/_/g, " ")}</dd>
        </div>
        {brief.plainLanguageGoal && (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Plain-language goal</dt>
            <dd className="text-white">{brief.plainLanguageGoal}</dd>
          </div>
        )}
      </dl>
      {brief.submittedAt && (
        <p className="text-xs text-slate-500">Submitted {new Date(brief.submittedAt).toLocaleString()}</p>
      )}
    </section>
  );
}
