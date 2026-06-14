import { notFound } from "next/navigation";
import { BlueprintStudioShell } from "@/components/blueprint-studio/blueprint-studio-shell";
import {
  isBlueprintStudioSectionKey,
  type BlueprintStudioSectionKey,
} from "@/lib/crow-core/blueprint-studio/studio-sections";
import { blueprintScopeFromSession } from "@/lib/auth/blueprint-scope";
import { getSessionUser } from "@/lib/auth/session";
import { loadBlueprintStudioContext } from "@/lib/server/blueprint-studio-load";

export default async function BlueprintStudioSectionPage({
  params,
}: {
  params: Promise<{ blueprintId: string; section: string }>;
}) {
  const { blueprintId, section: sectionParam } = await params;

  if (!isBlueprintStudioSectionKey(sectionParam)) {
    notFound();
  }

  const section = sectionParam as BlueprintStudioSectionKey;
  const user = await getSessionUser();
  const scope = await blueprintScopeFromSession(user);
  const context = await loadBlueprintStudioContext(blueprintId, scope);
  if (!context) {
    notFound();
  }

  return (
    <BlueprintStudioShell blueprintId={blueprintId} section={section} context={context} />
  );
}
