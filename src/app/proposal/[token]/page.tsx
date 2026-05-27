import { notFound } from "next/navigation";

import { CrowMark } from "@/components/public/brand/crow-mark";

import { ProposalTokenApprovalNotice } from "@/components/blueprint/commercial/proposal-token-approval-notice";

import { PricingHeroPanel } from "@/components/blueprint/commercial/pricing-hero-panel";

import {

  formatSar,

  getProposalByToken,

  proposalStatusLabel,

} from "@/lib/services/commercial.service";

import { MOCK_PRICING_ESTIMATE } from "@/lib/mock/pipeline";

import { ENTITY_THEME } from "@/lib/entity-theme";



export default async function ProposalPage({

  params,

}: {

  params: Promise<{ token: string }>;

}) {

  const { token } = await params;

  const proposal = await getProposalByToken(token).catch(() => null);

  if (!proposal) {
    notFound();
  }



  const { blueprint, estimate, planLabel, modules, securityPackages } = proposal;

  const org = blueprint.request.organizationName;

  const status = blueprint.proposalStatus;

  const canAct = status === "SENT";

  const pricing = estimate ?? MOCK_PRICING_ESTIMATE;



  return (

    <div className="cc-proposal-page">

      <div className="cc-proposal-page-inner">

        <header className="text-center sm:text-left">

          <CrowMark href="/" size="md" className="mx-auto sm:mx-0" />

          <span className="cc-nca-badge mt-6 inline-flex">Commercial proposal</span>

          <h1 className="cc-section-title mt-4">{org}</h1>

          <p className="mt-2 font-mono text-sm text-slate-500">{blueprint.request.referenceCode}</p>

          <p className="mt-2 text-sm text-slate-400">

            Status: <span className="text-cyan-300">{proposalStatusLabel(status)}</span>

          </p>

        </header>



        <PricingHeroPanel

          breakdown={pricing}

          storedTotal={Number(blueprint.request.estimatedMonthlySar) || pricing.totalMonthlySar}

          className="!static"

        />



        <section className="cc-entity-block cc-entity-block--cem space-y-3">

          <h2 className="text-sm font-medium text-cyan-400">{ENTITY_THEME.cem.shortLabel} · Plan</h2>

          <p className="text-lg text-white">{planLabel}</p>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Modules</p>

            <ul className="mt-2 space-y-1 text-sm text-slate-300">

              {modules.map((m) => (

                <li key={m.key}>{m.label}</li>

              ))}

            </ul>

          </div>

        </section>



        {securityPackages.length > 0 && (

          <section className="cc-entity-block cc-entity-block--cybercrow space-y-3">

            <h2 className="text-sm font-medium text-violet-300">

              {ENTITY_THEME.cybercrow.shortLabel} · Security

            </h2>

            <ul className="space-y-1 text-sm text-slate-300">

              {securityPackages.map((p) => (

                <li key={p.key}>{p.label}</li>

              ))}

            </ul>

            <p className="text-xs text-violet-300/80">

              Security add-on: {formatSar(pricing.securityMonthlySar)}/mo

            </p>

          </section>

        )}



        <section className="cc-entity-block cc-entity-block--sarea space-y-2">

          <h2 className="text-sm font-medium text-rose-300">{ENTITY_THEME.sarea.shortLabel} · Experience</h2>

          <p className="text-sm text-slate-400">

            Adaptive dashboards and role layouts included at go-live — configured during discovery.

          </p>

        </section>



        {status === "CLIENT_APPROVED" && (

          <section className="cc-glass-card border-teal-500/20 bg-teal-500/10">

            <p className="text-teal-300">Thank you — this proposal is approved.</p>

            {blueprint.clientApprovedAt && (

              <p className="mt-2 text-xs text-slate-500">

                Approved {blueprint.clientApprovedAt.toLocaleString()}

              </p>

            )}

          </section>

        )}



        {status === "DECLINED" && (

          <section className="cc-glass-card">

            <p className="text-slate-400">This proposal was declined.</p>

          </section>

        )}



        {canAct && <ProposalTokenApprovalNotice />}

      </div>

    </div>

  );

}

