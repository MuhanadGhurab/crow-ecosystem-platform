import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const employeeListArgs = {
  include: { department: { select: { id: true, name: true } } },
  orderBy: { fullName: "asc" },
} satisfies Prisma.HrEmployeeFindManyArgs;

export type HrEmployeeListItem = Prisma.HrEmployeeGetPayload<typeof employeeListArgs>;

export async function listHrEmployees(tenantId: string): Promise<HrEmployeeListItem[]> {
  return prisma.hrEmployee.findMany({
    where: { tenantId },
    ...employeeListArgs,
  });
}

export async function getHrEmployee(tenantId: string, employeeId: string) {
  return prisma.hrEmployee.findFirst({
    where: { id: employeeId, tenantId },
    include: { department: { select: { id: true, name: true } } },
  });
}

export async function createHrEmployee(
  tenantId: string,
  data: {
    fullName: string;
    email: string;
    jobTitle?: string;
    employeeNumber?: string;
    departmentId?: string;
    employmentStatus?: string;
    hireDate?: Date;
  }
) {
  return prisma.hrEmployee.create({
    data: { tenantId, ...data },
    include: { department: { select: { id: true, name: true } } },
  });
}

export async function updateHrEmployee(
  tenantId: string,
  employeeId: string,
  data: {
    fullName?: string;
    email?: string;
    jobTitle?: string | null;
    employeeNumber?: string | null;
    departmentId?: string | null;
    employmentStatus?: string;
    hireDate?: Date | null;
  }
) {
  const existing = await prisma.hrEmployee.findFirst({
    where: { id: employeeId, tenantId },
  });
  if (!existing) throw new Error("Employee not found");

  return prisma.hrEmployee.update({
    where: { id: employeeId },
    data,
    include: { department: { select: { id: true, name: true } } },
  });
}
