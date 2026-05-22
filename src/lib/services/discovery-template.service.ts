import { getDiscoveryTemplate } from "@/lib/constants/industry-templates";
import { prisma } from "@/lib/db";
import { refreshRequestPricingEstimate } from "@/lib/services/commercial.service";
import { upsertDiscoveryAnswer } from "@/lib/services/discovery.service";

export type ApplyDiscoveryTemplateResult = {
  industryKey: string;
  filled: string[];
  skipped: string[];
};

/** Pre-fill discovery from an industry template (fills empty sections only). */
export async function applyDiscoveryTemplate(
  requestId: string,
  industryKey: string
): Promise<ApplyDiscoveryTemplateResult> {
  const pack = getDiscoveryTemplate(industryKey);
  if (!pack) {
    throw new Error(`Unknown discovery template: ${industryKey}`);
  }

  const ctx = await prisma.implementationRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: {
      requestedModules: true,
      requestedSecurityPkgs: true,
      discoveryProfile: {
        include: {
          departments: true,
          branches: true,
          roles: true,
          workflows: true,
          securityRequirements: true,
          integrations: true,
          experienceRequirements: true,
          answers: true,
        },
      },
    },
  });

  if (!ctx.discoveryProfile) {
    throw new Error("Discovery profile not found — start discovery first");
  }

  const profile = ctx.discoveryProfile;
  const filled: string[] = [];
  const skipped: string[] = [];

  const org = pack.organization;
  if (!profile.answers.some((a) => a.sectionKey === "organization" && a.questionKey === "operatingModel")) {
    await upsertDiscoveryAnswer(requestId, "organization", "operatingModel", org.operatingModel);
    await upsertDiscoveryAnswer(requestId, "organization", "employeeBand", org.employeeBand);
    await upsertDiscoveryAnswer(requestId, "organization", "goLiveTarget", org.goLiveTarget);
    await upsertDiscoveryAnswer(requestId, "organization", "discoveryNotes", org.discoveryNotes);
    filled.push("organization");
  } else {
    skipped.push("organization");
  }

  const existingModuleKeys = new Set(ctx.requestedModules.map((m) => m.moduleKey));
  const newModules = pack.moduleKeys.filter((k) => !existingModuleKeys.has(k));
  if (newModules.length > 0) {
    await prisma.requestedModule.createMany({
      data: newModules.map((moduleKey) => ({ requestId, moduleKey })),
      skipDuplicates: true,
    });
    filled.push("modules");
  } else {
    skipped.push("modules");
  }

  const mergedModuleKeys = [...new Set([...existingModuleKeys, ...pack.moduleKeys])];
  await upsertDiscoveryAnswer(requestId, "modules", "confirmedKeys", mergedModuleKeys);

  const existingPkgKeys = new Set(ctx.requestedSecurityPkgs.map((p) => p.packageKey));
  const newPkgs = pack.securityPackageKeys.filter((k) => !existingPkgKeys.has(k));
  if (newPkgs.length > 0) {
    await prisma.requestedSecurityPackage.createMany({
      data: newPkgs.map((packageKey) => ({ requestId, packageKey })),
      skipDuplicates: true,
    });
    filled.push("securityPackages");
  } else {
    skipped.push("securityPackages");
  }

  if (!profile.answers.some((a) => a.sectionKey === "identity" && a.questionKey === "idpPreference")) {
    await upsertDiscoveryAnswer(requestId, "identity", "idpPreference", pack.identity.idpPreference);
    await upsertDiscoveryAnswer(requestId, "identity", "mfaRequired", pack.identity.mfaRequired);
    await upsertDiscoveryAnswer(requestId, "identity", "ssoNotes", pack.identity.ssoNotes);
    filled.push("identity");
  } else {
    skipped.push("identity");
  }

  if (!profile.answers.some((a) => a.sectionKey === "security" && a.questionKey === "reviewed")) {
    await upsertDiscoveryAnswer(requestId, "security", "complianceNotes", pack.security.complianceNotes);
    await upsertDiscoveryAnswer(requestId, "security", "ncaAlignment", pack.security.ncaAlignment);
    filled.push("securityAnswers");
  } else {
    skipped.push("securityAnswers");
  }

  const profileId = profile.id;

  if (profile.departments.length === 0) {
    await prisma.discoveryDepartment.createMany({
      data: pack.departments.map((d) => ({ profileId, ...d })),
    });
    filled.push("departments");
  } else {
    skipped.push("departments");
  }

  if (profile.branches.length === 0) {
    await prisma.discoveryBranch.createMany({
      data: pack.branches.map((b) => ({ profileId, ...b })),
    });
    filled.push("branches");
  } else {
    skipped.push("branches");
  }

  if (profile.roles.length === 0) {
    await prisma.discoveryRole.createMany({
      data: pack.roles.map((r) => ({ profileId, ...r })),
    });
    filled.push("roles");
  } else {
    skipped.push("roles");
  }

  if (profile.workflows.length === 0) {
    await prisma.discoveryWorkflow.createMany({
      data: pack.workflows.map((w) => ({ profileId, ...w })),
    });
    filled.push("workflows");
  } else {
    skipped.push("workflows");
  }

  if (profile.securityRequirements.length === 0) {
    await prisma.discoverySecurityRequirement.createMany({
      data: pack.securityRequirements.map((s) => ({ profileId, ...s })),
    });
    filled.push("securityRequirements");
  } else {
    skipped.push("securityRequirements");
  }

  if (profile.integrations.length === 0) {
    await prisma.discoveryIntegration.createMany({
      data: pack.integrations.map((i) => ({ profileId, ...i })),
    });
    filled.push("integrations");
  } else {
    skipped.push("integrations");
  }

  if (profile.experienceRequirements.length === 0) {
    await prisma.discoveryExperienceRequirement.createMany({
      data: pack.experienceRequirements.map((e) => ({ profileId, ...e })),
    });
    filled.push("experience");
  } else {
    skipped.push("experience");
  }

  await prisma.discoveryProfile.update({
    where: { id: profileId },
    data: { summary: `Industry template applied: ${pack.label}` },
  });

  if (ctx.industry !== industryKey) {
    await prisma.implementationRequest.update({
      where: { id: requestId },
      data: { industry: industryKey },
    });
  }

  await refreshRequestPricingEstimate(requestId);

  return { industryKey, filled, skipped };
}
