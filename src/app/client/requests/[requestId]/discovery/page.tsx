import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientDiscoveryWizard } from "@/components/client-portal/client-discovery-wizard";
import { ClientPortalPageHeader } from "@/components/client-portal/client-portal-page-header";
import { DiscoveryMvpWorkspaceShell } from "@/components/discovery/discovery-mvp-workspace-shell";
import { ProductPageHeader } from "@/components/product/product-page-header";
import { PreviewDbDisabledNotice } from "@/components/runtime/preview-db-disabled-notice";
import { CLIENT_DISCOVERY_STAGE_TEMPLATES } from "@/lib/constants/client-discovery-stage-templates";
import { requireClientAccess } from "@/lib/auth/session";
import { discoveryStatusLabel } from "@/lib/client-portal/client-discovery-contract";
import { parseRequestBriefFromNotes } from "@/lib/client-service-request/constants";
import { isDiscoveryBlueprintCompleteBlocked } from "@/lib/discovery/discovery-mvp-boundaries";
import { buildDiscoveryMvpWorkspaceModel } from "@/lib/discovery/discovery-workspace-context";
import { isPreviewDbDisabledMode } from "@/lib/runtime/preview-db-safety";
import { routes } from "@/lib/routes";
import {
  buildClientDiscoveryPageModel,
  listClientDiscoveryIndustryOptions,
} from "@/lib/services/client-discovery.service";
import { prisma } from "@/lib/db";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

export default async function ClientRequestDiscoveryPage({
  params,
  searchParams,
}: {
  params: Promise<{ requestId: string }>;
  searchParams: Promise<{ step?: string }>;
}) {
  const { requestId } = await params;
  const { step } = await searchParams;
  const user = await requireClientAccess(routes.client.requestDiscovery(requestId));

  // CROW.GAP004.ALT2 — Preview DB-disabled: local-first MVP only (no hosted Discovery).
  if (isPreviewDbDisabledMode()) {
    const mvpWorkspace = buildDiscoveryMvpWorkspaceModel({
      requestId,
      referenceCode: "PREVIEW-LOCAL",
      organizationName: "Preview local-first Discovery",
      requestStatus: "PENDING_REVIEW",
      discoveryProfileStatus: null,
      brief: null,
      clientDiscoveryDraftStatus: "draft",
      blueprintCompleteBlocked: isDiscoveryBlueprintCompleteBlocked(),
    });

    return (
      <div className="space-y-8">
        <ClientPortalPageHeader
          backHref={routes.client.request(requestId)}
          backLabel="← Request"
          eyebrow="Client-led discovery (Preview)"
          title="Guided discovery — local-first"
          description="Hosted Discovery is blocked in this Preview environment."
        />
        <PreviewDbDisabledNotice />
        <DiscoveryMvpWorkspaceShell model={mvpWorkspace} variant="client" />
        <p className="text-sm text-slate-400">
          Adaptive fields and handoff previews run from local state only. Hosted submit,
          completeDiscovery, and Blueprint generation remain blocked.
        </p>
      </div>
    );
  }

  const model = await buildClientDiscoveryPageModel(user, requestId);
  if (!model) notFound();

  let requestRow: {
    notes: string | null;
    status: ImplementationRequestStatus;
    discoveryProfile: { status: string } | null;
  } | null = null;
  try {
    requestRow = await prisma.implementationRequest.findUnique({
      where: { id: requestId },
      select: {
        notes: true,
        status: true,
        discoveryProfile: { select: { status: true } },
      },
    });
  } catch {
    requestRow = null;
  }

  const brief = parseRequestBriefFromNotes(requestRow?.notes);
  const mvpWorkspace = buildDiscoveryMvpWorkspaceModel({
    requestId,
    referenceCode: model.referenceCode,
    organizationName: model.organizationName,
    requestStatus: (requestRow?.status ?? "PENDING_REVIEW") as ImplementationRequestStatus,
    discoveryProfileStatus: (requestRow?.discoveryProfile?.status as
      | "NOT_STARTED"
      | "IN_PROGRESS"
      | "COMPLETED"
      | null) ?? null,
    brief,
    clientDiscoveryDraftStatus: model.draft.status,
    blueprintCompleteBlocked: isDiscoveryBlueprintCompleteBlocked(),
  });

  return (
    <div className="space-y-8">
      <ClientPortalPageHeader
        backHref={routes.client.request(requestId)}
        backLabel="← Request"
        eyebrow="Client-led discovery"
        title="Guided discovery"
        description={`${model.organizationName} · ${model.referenceCode}`}
      />

      <DiscoveryMvpWorkspaceShell model={mvpWorkspace} variant="client" />

      <ProductPageHeader
        title="Configure your operating model"
        description="Complete advisory discovery so ProCrow can review. You cannot approve final pricing, create Blueprint from this D0–D2 foundation alone, or create tenant runtime from this flow."
        statusChip={{
          label: discoveryStatusLabel(model.draft.status),
          tone:
            model.draft.status === "accepted_into_blueprint"
              ? "success"
              : model.draft.status === "submitted_for_procrow_review" ||
                  model.draft.status === "procrow_reviewing" ||
                  model.draft.status === "changes_requested"
                ? "warning"
                : "info",
        }}
      />

      {!model.canEdit && model.editBlockedReason && (
        <section className="cc-glass-card">
          <p className="text-sm text-slate-300">{model.editBlockedReason}</p>
          <Link
            href={routes.client.request(requestId)}
            className="mt-3 inline-block text-sm text-teal-400 hover:text-teal-300"
          >
            Return to request detail
          </Link>
        </section>
      )}

      <ClientDiscoveryWizard
        model={model}
        stageTemplates={CLIENT_DISCOVERY_STAGE_TEMPLATES}
        industryOptions={listClientDiscoveryIndustryOptions()}
        initialStep={step ?? null}
      />
    </div>
  );
}
