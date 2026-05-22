/**
 * Grant a Supabase user access to a tenant workspace.
 *
 * Usage:
 *   TENANT_SLUG=acme-corp USER_EMAIL=user@example.com TENANT_ROLE=tenant_admin npm run auth:grant-tenant
 */
import { grantTenantAccessByEmail } from "../src/lib/services/membership.service";
import { prisma } from "../src/lib/db";

const slug = process.env.TENANT_SLUG;
const email = process.env.USER_EMAIL;
const role = (process.env.TENANT_ROLE ?? "tenant_admin") as "tenant_admin" | "tenant_user";

async function main() {
  if (!slug || !email) {
    console.error("Set TENANT_SLUG and USER_EMAIL");
    process.exit(1);
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    console.error(`Tenant not found: ${slug}`);
    process.exit(1);
  }

  const result = await grantTenantAccessByEmail(email, tenant.id, tenant.slug, role);
  console.log("Granted:", result);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
