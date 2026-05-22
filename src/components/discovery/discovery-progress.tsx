import Link from "next/link";

import { ScrollChipNav } from "@/components/ui/scroll-chip-nav";

import {

  DISCOVERY_STEPS,

  discoveryProgressPercent,

  getDiscoveryStepCompletion,

  type DiscoveryStepId,

} from "@/lib/discovery-progress";

import { routes } from "@/lib/routes";



type ProfileSlice = Parameters<typeof getDiscoveryStepCompletion>[0];



const STEP_ENTITY: Partial<Record<DiscoveryStepId, "cem" | "cybercrow" | "sarea">> = {
  organization: "cem",
  modules: "cem",
  security: "cybercrow",
  structure: "cem",
  roles: "cem",
  workflows: "cem",
  summary: "sarea",
};



export function DiscoveryProgress({

  requestId,

  profile,

  currentStep,

}: {

  requestId: string;

  profile: ProfileSlice;

  currentStep?: DiscoveryStepId;

}) {

  const completion = getDiscoveryStepCompletion(profile);

  const percent = discoveryProgressPercent(completion);

  const d = routes.discovery(requestId);



  const hrefByStep: Record<DiscoveryStepId, string> = {

    organization: d.organization,

    modules: d.modules,

    security: d.security,

    structure: d.departments,

    roles: d.roles,

    workflows: d.workflows,

    summary: d.summary,

  };



  return (

    <section className="cc-glass-card cc-pipeline-card !p-4 sm:!p-6">

      <header className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">

        <p className="text-sm font-medium text-cyan-400">Discovery pipeline</p>

        <p className="text-sm text-slate-400">{percent}% essentials complete</p>

      </header>

      <div

        className="cc-progress-track mt-3"

        role="progressbar"

        aria-valuenow={percent}

        aria-valuemin={0}

        aria-valuemax={100}

      >

        <span className="cc-progress-fill" style={{ width: `${percent}%` }} />

      </div>

      <ScrollChipNav className="mt-4 !px-0 !pb-0" aria-label="Discovery steps">

        <ol className="flex gap-2">

          {DISCOVERY_STEPS.map((step) => {

            const done = completion[step.id];

            const active = currentStep === step.id;

            const entity = STEP_ENTITY[step.id];

            const entityClass = entity ? `cc-discovery-step-chip--${entity}` : "";

            return (

              <li key={step.id}>

                <Link

                  href={hrefByStep[step.id]}

                  className={`cc-discovery-step-chip inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${

                    active

                      ? `cc-discovery-step-chip--active bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500/30 ${entityClass}`

                      : done

                        ? "bg-teal-500/10 text-teal-300 hover:bg-teal-500/20"

                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"

                  }`}

                >

                  <span aria-hidden>{done ? "✓" : "○"}</span>

                  {step.label}

                </Link>

              </li>

            );

          })}

        </ol>

      </ScrollChipNav>

    </section>

  );

}

