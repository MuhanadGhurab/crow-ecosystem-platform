"use server";

import { revalidatePath } from "next/cache";
import { BlueprintAction } from "@/lib/auth/blueprint-actions";
import { requireBlueprintAction } from "@/lib/auth/blueprint-action-guard";
import { blueprintScopeFromSession } from "@/lib/auth/blueprint-scope";
import { getSessionUser } from "@/lib/auth/session";
import { createBlueprintVersionSnapshot } from "@/lib/crow-core/blueprint-studio/blueprint-version.service";
import { BlueprintConcurrencyError } from "@/lib/crow-core/blueprint-runtime/blueprint-errors";
import {
  ensureInitialDraftVersion,
  saveBlueprintDraft,
} from "@/lib/crow-core/blueprint-runtime/blueprint-versioning.service";
import { recordBlueprintTraceEvent } from "@/lib/crow-core/traceability/blueprint-traceability.service";
import { loadBlueprintStudioContext } from "@/lib/server/blueprint-studio-load";
import { routes } from "@/lib/routes";

function revalidateStudio(blueprintId: string) {
  const b = routes.blueprint(blueprintId);
  revalidatePath(b.studio);
  for (const section of [
    "overview",
    "organization",
    "operations",
    "security-trust",
    "experience-sarea",
    "integrations",
    "commercial",
    "roi",
    "sow",
    "versions-evidence",
  ]) {
    revalidatePath(b.studioSection(section));
  }
}

export async function captureBlueprintSnapshotAction(formData: FormData) {
  const blueprintId = String(formData.get("blueprintId") ?? "");
  if (!blueprintId) return;

  await requireBlueprintAction(BlueprintAction["blueprint.version.create_next"]);
  const user = await getSessionUser();
  const scope = await blueprintScopeFromSession(user);
  const context = await loadBlueprintStudioContext(blueprintId, scope);
  if (!context) return;

  if (context.tenantUnresolved || !context.tenantId) {
    const parent = context.versions[context.versions.length - 1];
    createBlueprintVersionSnapshot(context.document, {
      parentVersionId: parent?.id,
    });
    recordBlueprintTraceEvent({
      blueprintId,
      stage: "blueprint_version",
      actor: {
        actorType: "human_user",
        actorId: user?.id ?? "unknown",
        displayName: user?.email ?? "Platform user",
        isNonHuman: false,
      },
      summary: "Manual snapshot captured (legacy in-memory store — tenant unresolved)",
      document: context.document,
    });
    revalidateStudio(blueprintId);
    return;
  }

  try {
    let versionId = context.activeDraftVersionId;
    let revision = context.draftRevision ?? 1;

    if (!versionId) {
      const draft = await ensureInitialDraftVersion({
        scope,
        blueprintId,
        tenantId: context.tenantId,
        document: context.document,
        authorUserId: user?.id ?? null,
      });
      versionId = draft.id;
      revision = draft.revision;
    } else if (revision == null) {
      revision = 1;
    }

    await saveBlueprintDraft({
      scope,
      versionId,
      expectedRevision: revision,
      document: context.document,
      authorUserId: user?.id ?? null,
    });
  } catch (error) {
    if (error instanceof BlueprintConcurrencyError) {
      console.warn("Blueprint draft save conflict", {
        blueprintId,
        expectedRevision: error.expectedRevision,
        currentRevision: error.currentRevision,
      });
      return;
    }
    throw error;
  }

  revalidateStudio(blueprintId);
}
