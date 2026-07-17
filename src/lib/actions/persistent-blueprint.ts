"use server";

import { revalidatePath } from "next/cache";
import type { EnterpriseBlueprintDraft } from "@/lib/model-forge/blueprint/blueprint-types";
import { requireBlueprintPlatformAdmin, requireBlueprintRequestOwner, toClientBlueprintError } from "@/lib/auth/blueprint-engine-guard";
import {
  executeBlueprintLifecycleAction,
  getBlueprintAdminDetail,
  getClientBlueprintProjectionForRequest,
  saveInternalDraftFromPreview,
} from "@/lib/crow-core/blueprint-engine/blueprint-lifecycle-orchestrator";
import type { BlueprintReviewActionType } from "@/lib/crow-core/blueprint-engine/types";
import { prisma } from "@/lib/db";
import { routes } from "@/lib/routes";

export async function listPersistableRequestsForStudio() {
  const { platformAccountId: _ } = await requireBlueprintPlatformAdmin(routes.admin.blueprintStudio);
  return prisma.implementationRequest.findMany({
    where: { discoveryProfile: { isNot: null } },
    select: {
      id: true,
      referenceCode: true,
      organizationName: true,
      enterpriseBlueprint: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function persistBlueprintInternalDraftAction(input: {
  requestId: string;
  draft: EnterpriseBlueprintDraft;
  expectedContentHash: string;
  confirmed: boolean;
}) {
  if (!input.confirmed) {
    return { ok: false as const, error: "Confirmation required" };
  }
  try {
    const { actor } = await requireBlueprintPlatformAdmin(routes.admin.blueprintStudio);
    const result = await saveInternalDraftFromPreview({
      requestId: input.requestId,
      draft: input.draft,
      actor,
      expectedContentHash: input.expectedContentHash,
    });
    revalidatePath(routes.admin.blueprints);
    revalidatePath(routes.admin.persistentBlueprint(result.root.id));
    return {
      ok: true as const,
      blueprintId: result.root.id,
      versionNumber: result.versionNumber,
      contentHash: result.contentHash,
    };
  } catch (err) {
    return { ok: false as const, error: toClientBlueprintError(err) };
  }
}

export async function blueprintLifecycleAction(input: {
  blueprintId: string;
  action: BlueprintReviewActionType;
  versionNumber: number;
  contentHashAtAction: string;
  expectedRowVersion: number;
  reason?: string | null;
}) {
  try {
    const { actor } = await requireBlueprintPlatformAdmin(routes.admin.persistentBlueprint(input.blueprintId));
    const result = await executeBlueprintLifecycleAction({
      ...input,
      actor,
    });
    revalidatePath(routes.admin.persistentBlueprint(input.blueprintId));
    return { ok: true as const, nextState: result.nextState };
  } catch (err) {
    return { ok: false as const, error: toClientBlueprintError(err) };
  }
}

export async function clientBlueprintReviewAction(input: {
  requestId: string;
  action: Extract<BlueprintReviewActionType, "CLIENT_COMMENT" | "CLIENT_REQUEST_CHANGES" | "CLIENT_ACCEPT">;
  versionNumber: number;
  contentHashAtAction: string;
  expectedRowVersion: number;
  comment?: string | null;
  confirmed?: boolean;
}) {
  if (input.action === "CLIENT_ACCEPT" && !input.confirmed) {
    return { ok: false as const, error: "Explicit acceptance confirmation required" };
  }
  try {
    const { actor, supabaseUserId } = await requireBlueprintRequestOwner(
      input.requestId,
      routes.client.requestBlueprint(input.requestId),
    );
    const root = await prisma.enterpriseBlueprint.findUnique({
      where: { requestId: input.requestId },
      select: { id: true },
    });
    if (!root) return { ok: false as const, error: "Blueprint not found" };
    const result = await executeBlueprintLifecycleAction({
      blueprintId: root.id,
      action: input.action,
      versionNumber: input.versionNumber,
      contentHashAtAction: input.contentHashAtAction,
      expectedRowVersion: input.expectedRowVersion,
      reason: input.comment ?? null,
      actor,
      supabaseUserId,
    });
    revalidatePath(routes.client.requestBlueprint(input.requestId));
    return { ok: true as const, nextState: result.nextState };
  } catch (err) {
    return { ok: false as const, error: toClientBlueprintError(err) };
  }
}

export async function loadBlueprintAdminDetailAction(blueprintId: string) {
  await requireBlueprintPlatformAdmin(routes.admin.persistentBlueprint(blueprintId));
  return getBlueprintAdminDetail(blueprintId);
}

export async function loadClientBlueprintForRequestAction(requestId: string) {
  const { supabaseUserId } = await requireBlueprintRequestOwner(
    requestId,
    routes.client.requestBlueprint(requestId),
  );
  try {
    return { ok: true as const, data: await getClientBlueprintProjectionForRequest(requestId, supabaseUserId) };
  } catch (err) {
    return { ok: false as const, error: toClientBlueprintError(err) };
  }
}
