import { redirect } from "next/navigation";
import { findPlatformAccountBySupabaseUserId } from "@/lib/account/platform-account.service";
import { includesActiveInternalRole } from "@/lib/auth/authority-boundaries";
import { resolveAuthoritativeCrowAuth, requireAuthoritativeCrowAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { BlueprintEngineError } from "@/lib/crow-core/blueprint-engine/errors";
import type { BlueprintActorContext } from "@/lib/crow-core/blueprint-engine/blueprint-lifecycle-orchestrator";

export async function requireBlueprintPlatformAdmin(nextPath: string): Promise<{
  platformAccountId: string;
  actor: BlueprintActorContext;
}> {
  const { user, auth } = await requireAuthoritativeCrowAuth(nextPath);
  if (auth.role !== "platform_admin") {
    redirect("/unauthorized?reason=platform_admin_only");
  }
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    redirect("/unauthorized?reason=platform_account_required");
  }
  const roles = await prisma.platformInternalRoleAssignment.findMany({
    where: { platformAccountId: account.id, status: "ACTIVE" },
    select: { role: true },
  });
  const activeRoles = roles.map((r) => r.role);
  if (!includesActiveInternalRole(activeRoles, "PLATFORM_ADMIN")) {
    redirect("/unauthorized?reason=platform_admin_only");
  }
  if (includesActiveInternalRole(activeRoles, "IMPLEMENTER") && activeRoles.length === 1) {
    redirect("/unauthorized?reason=implementer_denied");
  }
  return {
    platformAccountId: account.id,
    actor: { platformAccountId: account.id, actorClass: "PLATFORM_ADMIN" },
  };
}

export async function requireBlueprintRequestOwner(requestId: string, nextPath: string) {
  const { user } = await requireAuthoritativeCrowAuth(nextPath);
  const auth = await resolveAuthoritativeCrowAuth(user);
  if (auth.role === "platform_admin") {
    redirect("/unauthorized?reason=client_review_only");
  }
  const request = await prisma.implementationRequest.findUnique({
    where: { id: requestId },
    select: { submittedByUserId: true },
  });
  if (!request?.submittedByUserId || request.submittedByUserId !== user.id) {
    redirect("/unauthorized?reason=request_owner_required");
  }
  const account = await findPlatformAccountBySupabaseUserId(user.id);
  if (!account) {
    redirect("/unauthorized?reason=platform_account_required");
  }
  return {
    platformAccountId: account.id,
    supabaseUserId: user.id,
    actor: { platformAccountId: account.id, actorClass: "REQUEST_OWNER" as const, supabaseUserId: user.id },
  };
}

export function toClientBlueprintError(err: unknown): string {
  if (err instanceof BlueprintEngineError && err.clientSafe) return err.message;
  if (err instanceof BlueprintEngineError) return "Blueprint action could not be completed.";
  return "An unexpected error occurred.";
}
