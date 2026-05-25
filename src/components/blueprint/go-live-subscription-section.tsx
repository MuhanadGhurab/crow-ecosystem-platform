import {

  PLAN_CAPABILITY_PROFILES,

  PLAN_DISPLAY_NAMES,

  advisoryHintForCapability,

  advisoryLabelForHint,

  type CapabilityKey,

} from "@/lib/subscription/plan-capabilities";

import type { BlueprintSubscriptionReadiness } from "@/lib/services/subscription-readiness.service";

import type { SubscriptionTierKey } from "@/lib/constants/subscriptions";



const INCLUDED_HIGHLIGHTS: CapabilityKey[] = [

  "core_modules",

  "lightweight_blueprint",

  "operational_blueprint",

  "full_enterprise_blueprint",

  "basic_role_dashboards",

  "role_based_layouts",

  "microsoft_entra_sso",

  "guided_setup",

];



export function GoLiveSubscriptionSection({

  readiness,

  planContext,

}: {

  readiness: BlueprintSubscriptionReadiness;

  planContext: {

    planKey: SubscriptionTierKey;

    planDisplayName: string;

    identityMode: string;

    cybercrowDepth: string;

    sareaDepth: string;

    discoveryDepth: string;

    blueprintDepth: string;

    limits: {

      max_users: number;

      max_departments: number;

      max_workflows: number;

      max_modules: number;

      max_sarea_profiles: number;

    };

  };

}) {

  const profile = PLAN_CAPABILITY_PROFILES[planContext.planKey];

  const included = INCLUDED_HIGHLIGHTS.filter((k) => profile.capabilities.has(k));

  const advisories = readiness.items.filter((i) => !i.passed);

  const allClear = advisories.length === 0;



  return (

    <section className="cc-glass-card space-y-5 !p-6">

      <div>

        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">

          Subscription readiness

        </p>

        <p className="mt-1 text-sm text-slate-400">

          Selected plan{" "}

          <span className="font-medium text-cyan-200">{planContext.planDisplayName}</span> — advisory

          review before provision. You may{" "}

          <span className="text-cyan-200">proceed with your current plan</span>; nothing here blocks

          go-live in this phase.

        </p>

      </div>



      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <Chip label="Plan tier" value={planContext.planDisplayName} />

        <Chip label="Blueprint depth" value={planContext.blueprintDepth} />

        <Chip label="Identity mode" value={planContext.identityMode.replace(/_/g, " ")} />

        <Chip label="CyberCrow depth" value={planContext.cybercrowDepth} />

        <Chip label="SAREA depth" value={planContext.sareaDepth} />

        <Chip label="Discovery depth" value={planContext.discoveryDepth} />

      </div>



      <div>

        <p className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">

          Included capabilities (reference)

        </p>

        <ul className="mt-2 flex flex-wrap gap-2">

          {included.map((k) => (

            <li

              key={k}

              className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] capitalize text-emerald-200"

            >

              {k.replace(/_/g, " ")}

            </li>

          ))}

        </ul>

        {planContext.planKey !== "enterprise" && (

          <p className="mt-2 text-xs text-slate-500">

            {advisoryLabelForHint(

              advisoryHintForCapability(planContext.planKey, "microsoft_entra_sso"),

              planContext.planKey

            )}{" "}

            — upgrade expands depth; proceed as advisory if aligned with your rollout.

          </p>

        )}

      </div>



      <div className="rounded-cc-sm border border-cyan-500/15 bg-cyan-500/5 px-4 py-3 text-xs text-slate-400">

        <span className="font-medium text-cyan-200">Recommended bands</span> — up to{" "}

        {planContext.limits.max_users} users, {planContext.limits.max_departments} departments,{" "}

        {planContext.limits.max_workflows} workflows, {planContext.limits.max_modules} modules,{" "}

        {planContext.limits.max_sarea_profiles} SAREA profiles.

      </div>



      {allClear ? (

        <p className="rounded-cc-sm border border-teal-500/20 bg-teal-500/5 px-4 py-3 text-sm text-teal-200/90">

          Plan scope reviewed — no subscription advisories. Proceed with current plan when operational

          readiness is complete.

        </p>

      ) : (

        <div className="space-y-2">

          <p className="text-xs font-medium uppercase tracking-wider text-amber-300/90">

            Advisory warnings

          </p>

          <ul className="space-y-2">

            {advisories.map((item) => (

              <li

                key={item.key}

                className="rounded-cc-sm border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90"

              >

                <span className="font-medium text-amber-200">{item.label}</span>

                <p className="mt-1 text-xs text-slate-400">{item.detail}</p>

              </li>

            ))}

          </ul>

        </div>

      )}



      {readiness.upgradeRecommendation && (

        <p className="rounded-cc-sm border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm text-slate-300">

          <span className="font-medium text-violet-200">Upgrade recommended: </span>

          {readiness.upgradeRecommendation}

        </p>

      )}



      <p className="text-xs text-slate-500">{readiness.proceedNote}</p>

    </section>

  );

}



function Chip({ label, value }: { label: string; value: string }) {

  return (

    <div className="rounded-cc-sm border border-white/10 px-3 py-2">

      <p className="text-xs text-slate-500">{label}</p>

      <p className="text-sm font-medium capitalize text-white">{value}</p>

    </div>

  );

}


