import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

const accountListArgs = {
  include: {
    _count: { select: { contacts: true } },
  },
  orderBy: { name: "asc" },
} satisfies Prisma.CrmAccountFindManyArgs;

const contactListArgs = {
  include: {
    account: { select: { id: true, name: true } },
  },
  orderBy: { fullName: "asc" },
} satisfies Prisma.CrmContactFindManyArgs;

export type CrmAccountListItem = Prisma.CrmAccountGetPayload<typeof accountListArgs>;
export type CrmContactListItem = Prisma.CrmContactGetPayload<typeof contactListArgs>;

export async function listCrmAccounts(tenantId: string): Promise<CrmAccountListItem[]> {
  return prisma.crmAccount.findMany({
    where: { tenantId },
    ...accountListArgs,
  });
}

export async function listCrmContacts(tenantId: string): Promise<CrmContactListItem[]> {
  return prisma.crmContact.findMany({
    where: { tenantId },
    ...contactListArgs,
  });
}

export async function createCrmAccount(
  tenantId: string,
  data: { name: string; industry?: string; website?: string; status?: string }
) {
  return prisma.crmAccount.create({ data: { tenantId, ...data } });
}

export async function updateCrmAccount(
  tenantId: string,
  accountId: string,
  data: { name?: string; industry?: string | null; website?: string | null; status?: string }
) {
  const existing = await prisma.crmAccount.findFirst({
    where: { id: accountId, tenantId },
  });
  if (!existing) throw new Error("Account not found");
  return prisma.crmAccount.update({ where: { id: accountId }, data });
}

export async function createCrmContact(
  tenantId: string,
  data: {
    fullName: string;
    email?: string;
    phone?: string;
    title?: string;
    accountId?: string;
  }
) {
  return prisma.crmContact.create({
    data: { tenantId, ...data },
    include: { account: { select: { id: true, name: true } } },
  });
}

export async function updateCrmContact(
  tenantId: string,
  contactId: string,
  data: {
    fullName?: string;
    email?: string | null;
    phone?: string | null;
    title?: string | null;
    accountId?: string | null;
  }
) {
  const existing = await prisma.crmContact.findFirst({
    where: { id: contactId, tenantId },
  });
  if (!existing) throw new Error("Contact not found");
  return prisma.crmContact.update({
    where: { id: contactId },
    data,
    include: { account: { select: { id: true, name: true } } },
  });
}
