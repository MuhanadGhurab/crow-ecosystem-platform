import { redirect } from "next/navigation";
import { TenantStudioContent } from "@/components/procrow/tenant-studio-content";
import { requireAuthoritativeCrowAuth } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** ProCrow Tenant Studio — PLATFORM_ADMIN only; draft composition, no provisioning. */
export default async function AdminTenantStudioPage() {
  const { auth } = await requireAuthoritativeCrowAuth(routes.admin.tenantStudio);
  if (auth.role !== "platform_admin") {
    redirect("/unauthorized?reason=platform_admin_only");
  }
  return <TenantStudioContent />;
}
