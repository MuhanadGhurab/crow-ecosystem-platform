import { prisma } from "@/lib/db";

/** Demo CyberCrow posture rows for new tenants (Phase 6). */
export async function seedCybercrowBaseline(tenantId: string) {
  const existing = await prisma.incident.count({ where: { tenantId } });
  if (existing > 0) return { skipped: true as const };

  await prisma.riskScore.create({
    data: {
      tenantId,
      score: 72,
      factors: { auth: "good", patching: "monitor", data: "baseline" },
    },
  });

  await prisma.incident.create({
    data: {
      tenantId,
      title: "Baseline security review completed",
      status: "closed",
      severity: "low",
    },
  });

  for (const controlKey of ["access-control", "audit-logging", "data-protection", "incident-response"]) {
    await prisma.complianceControl.create({
      data: { tenantId, controlKey, status: "in_progress" },
    });
  }

  await prisma.grcFinding.create({
    data: {
      tenantId,
      title: "Enable MFA for tenant admins",
      status: "open",
    },
  });

  return { skipped: false as const };
}
