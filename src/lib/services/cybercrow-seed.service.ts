import { prisma } from "@/lib/db";
import { NCA_BASELINE_CONTROL_KEYS } from "@/lib/constants/nca-compliance-controls";

const BASELINE_EVIDENCE: Record<string, string[]> = {
  "access-control": ["RBAC matrix export", "Entra conditional access policy"],
  "audit-logging": ["Central audit log retention config", "SIEM forwarding checklist"],
  "data-protection": ["Data classification register (draft)", "Encryption at rest attestation"],
  "incident-response": ["IR playbook v1", "Tabletop exercise notes"],
};

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

  for (const controlKey of NCA_BASELINE_CONTROL_KEYS) {
    const control = await prisma.complianceControl.create({
      data: { tenantId, controlKey, status: "in_progress" },
    });
    const titles = BASELINE_EVIDENCE[controlKey] ?? [];
    for (const title of titles.slice(0, 2)) {
      await prisma.complianceEvidence.create({
        data: { controlId: control.id, title },
      });
    }
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

/** Idempotent evidence rows for controls that have none (safe on re-provision / backfill). */
export async function seedCybercrowEvidenceIfMissing(tenantId: string) {
  const controls = await prisma.complianceControl.findMany({ where: { tenantId } });
  for (const control of controls) {
    const existing = await prisma.complianceEvidence.count({
      where: { controlId: control.id },
    });
    if (existing > 0) continue;
    const titles = BASELINE_EVIDENCE[control.controlKey] ?? [];
    for (const title of titles.slice(0, 2)) {
      await prisma.complianceEvidence.create({
        data: { controlId: control.id, title },
      });
    }
  }
}
