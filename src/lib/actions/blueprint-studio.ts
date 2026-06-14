"use server";

import { revalidatePath } from "next/cache";
import { requireActionDiscoveryWrite } from "@/lib/auth/action-guard";
import { getSessionUser } from "@/lib/auth/session";
import { createBlueprintVersionSnapshot } from "@/lib/crow-core/blueprint-studio/blueprint-version.service";
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

  await requireActionDiscoveryWrite();
  const user = await getSessionUser();
  const context = await loadBlueprintStudioContext(blueprintId);
  if (!context) return;

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
    summary: "Manual snapshot captured from Blueprint Studio",
    document: context.document,
  });

  revalidateStudio(blueprintId);
}
