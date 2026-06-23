import { redirect } from "next/navigation";
import { BlueprintStudioContent } from "@/components/procrow/blueprint-studio-content";
import { requireAuthoritativeCrowAuth } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** ProCrow Blueprint Studio — PLATFORM_ADMIN only; ephemeral preview, no persistence. */
export default async function AdminBlueprintStudioPage() {
  const { auth } = await requireAuthoritativeCrowAuth(routes.admin.blueprintStudio);
  if (auth.role !== "platform_admin") {
    redirect("/unauthorized?reason=platform_admin_only");
  }
  return <BlueprintStudioContent />;
}
