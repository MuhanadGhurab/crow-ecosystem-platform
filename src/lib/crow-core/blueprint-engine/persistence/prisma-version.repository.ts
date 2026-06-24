import { prisma } from "@/lib/db";
import type { BlueprintVersionRepository } from "../repository-contracts";
import { BlueprintEngineError } from "../errors";
import { mapVersion, snapshotToVersionCreateData } from "./prisma-mappers";

export const prismaBlueprintVersionRepository: BlueprintVersionRepository = {
  async createImmutableVersion(input) {
    try {
      const blueprint = await prisma.enterpriseBlueprint.findUnique({
        where: { id: input.blueprintId },
        select: { tenantId: true },
      });
      const row = await prisma.enterpriseBlueprintVersion.create({
        data: snapshotToVersionCreateData({
          ...input,
          tenantId: blueprint?.tenantId ?? null,
        }),
      });
      return mapVersion(row);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "P2002") {
        throw new BlueprintEngineError("BLUEPRINT_DUPLICATE_VERSION_NUMBER", "Version number already exists");
      }
      throw err;
    }
  },

  async getVersion(blueprintId, versionNumber) {
    const row = await prisma.enterpriseBlueprintVersion.findUnique({
      where: { blueprintId_versionNumber: { blueprintId, versionNumber } },
    });
    return row ? mapVersion(row) : null;
  },

  async getCurrentVersion(blueprintId) {
    const blueprint = await prisma.enterpriseBlueprint.findUnique({
      where: { id: blueprintId },
      include: { currentVersion: true },
    });
    if (!blueprint?.currentVersion) {
      const latest = await prisma.enterpriseBlueprintVersion.findFirst({
        where: { blueprintId },
        orderBy: { versionNumber: "desc" },
      });
      return latest ? mapVersion(latest) : null;
    }
    return mapVersion(blueprint.currentVersion);
  },

  async listVersions(blueprintId) {
    const rows = await prisma.enterpriseBlueprintVersion.findMany({
      where: { blueprintId },
      orderBy: { versionNumber: "asc" },
    });
    return rows.map(mapVersion);
  },

  updateVersionUnsupported() {
    throw new BlueprintEngineError("BLUEPRINT_VERSION_IMMUTABLE", "Blueprint versions are append-only");
  },

  deleteVersionUnsupported() {
    throw new BlueprintEngineError("BLUEPRINT_VERSION_IMMUTABLE", "Blueprint versions are append-only");
  },
};

export async function getVersionRowId(blueprintId: string, versionNumber: number): Promise<string | null> {
  const row = await prisma.enterpriseBlueprintVersion.findUnique({
    where: { blueprintId_versionNumber: { blueprintId, versionNumber } },
    select: { id: true },
  });
  return row?.id ?? null;
}

export async function nextVersionNumber(blueprintId: string): Promise<number> {
  const latest = await prisma.enterpriseBlueprintVersion.findFirst({
    where: { blueprintId },
    orderBy: { versionNumber: "desc" },
    select: { versionNumber: true },
  });
  return (latest?.versionNumber ?? 0) + 1;
}
