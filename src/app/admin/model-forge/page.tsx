import { redirect } from "next/navigation";
import { ModelForgeContent } from "@/components/procrow/model-forge-content";
import { requireAuthoritativeCrowAuth } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** ProCrow Model Forge — PLATFORM_ADMIN only; draft enterprise models, no provisioning. */
export default async function AdminModelForgePage() {
  const { auth } = await requireAuthoritativeCrowAuth(routes.admin.modelForge);
  if (auth.role !== "platform_admin") {
    redirect("/unauthorized?reason=platform_admin_only");
  }
  return <ModelForgeContent />;
}
