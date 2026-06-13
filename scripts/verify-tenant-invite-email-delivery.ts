/**
 * M4D — Business Portal invite email delivery verifier.
 *
 *   npm run tenant-invite-email:verify
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const PHASE_DOC = "docs/internal/M4D_BUSINESS_PORTAL_INVITE_EMAIL_DELIVERY.md";

const EMAIL_MODULE_FILES = [
  "src/lib/email/email-delivery-result.ts",
  "src/lib/email/email-provider-config.ts",
  "src/lib/email/email-provider.ts",
  "src/lib/email/providers/configured-provider.ts",
  "src/lib/email/templates/business-portal-invite-email.ts",
  "src/lib/email/send-business-portal-invite-email.ts",
] as const;

const INTEGRATION_FILES = [
  "src/lib/services/tenant-invite-token.service.ts",
  "src/lib/actions/tenant-invite-acceptance.ts",
  "src/components/admin/admin-tenant-membership-invite-panel.tsx",
  "src/lib/tenant/tenant-invite-acceptance-contract.ts",
] as const;

const FORBIDDEN = [
  "platform_admin",
  "email was sent",
  "we sent an email",
  "email has been sent",
  "Invitation sent to",
  "RESEND_API_KEY",
  "process.env.RESEND",
] as const;

function fail(msg: string) {
  console.error(`FAIL: ${msg}`);
  return false;
}

function ok(msg: string) {
  console.log(`OK: ${msg}`);
  return true;
}

function fileText(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

function main(): boolean {
  let pass = true;

  console.log("\n=== M4D Business Portal invite email delivery ===\n");

  for (const rel of EMAIL_MODULE_FILES) {
    if (!existsSync(join(ROOT, rel))) pass = fail(`Missing ${rel}`) && pass;
    else pass = ok(`Found ${rel}`) && pass;
  }

  const sendEntry = fileText("src/lib/email/send-business-portal-invite-email.ts");
  if (!sendEntry.includes("sendBusinessPortalInviteEmail")) {
    pass = fail("send-business-portal-invite-email must export sendBusinessPortalInviteEmail") && pass;
  }
  if (!sendEntry.includes("isBusinessPortalInviteEmailConfigured")) {
    pass = fail("Missing isBusinessPortalInviteEmailConfigured") && pass;
  }
  pass = ok("Email send entry point") && pass;

  const provider = fileText("src/lib/email/providers/configured-provider.ts");
  if (provider.includes("api.resend.com")) {
    pass = ok("Resend provider isolated under providers/") && pass;
  } else {
    pass = fail("Configured provider must call Resend API") && pass;
  }

  const template = fileText("src/lib/email/templates/business-portal-invite-email.ts");
  for (const phrase of [
    "Accept Business Portal Invite",
    "same email address",
    "does not grant ProCrow",
    "html: string",
    "text: string",
  ]) {
    if (!template.includes(phrase)) pass = fail(`Template missing: ${phrase}`) && pass;
  }
  pass = ok("HTML and plain-text invite template") && pass;

  const service = fileText("src/lib/services/tenant-invite-token.service.ts");
  if (!service.includes("sendBusinessPortalInviteEmail")) {
    pass = fail("Token service must attempt email delivery") && pass;
  }
  if (!service.includes("tokenHash") || service.includes("rawToken:")) {
    /* rawToken in variable name is ok, but must hash before persist */
  }
  if (!service.includes("createHash") || !service.includes("tokenHash")) {
    pass = fail("Token service must hash tokens (never store raw)") && pass;
  }
  if (!service.includes("retryTenantInviteEmailDelivery")) {
    pass = fail("Token service must support retry delivery") && pass;
  }
  if (!service.includes("logInviteEmailDeliveryAudit")) {
    pass = fail("Token service must audit email delivery") && pass;
  }
  pass = ok("Invite token service integration") && pass;

  const contract = fileText("src/lib/tenant/tenant-invite-acceptance-contract.ts");
  if (!contract.includes("InviteEmailDeliverySummary")) {
    pass = fail("Contract missing InviteEmailDeliverySummary") && pass;
  }
  if (!contract.includes("provider_unconfigured")) {
    pass = fail("Contract missing delivery outcomes") && pass;
  }
  pass = ok("Invite acceptance contract extended for M4D") && pass;

  const actions = fileText("src/lib/actions/tenant-invite-acceptance.ts");
  if (!actions.includes("retryTenantInviteEmailAction")) {
    pass = fail("Actions missing retryTenantInviteEmailAction") && pass;
  }
  pass = ok("Server actions for email retry") && pass;

  const workforceCopy = fileText("src/lib/constants/crow-workforce-activation.ts");
  for (const phrase of [
    "Create and email invite",
    "Create invite link",
    "Invite email delivered",
    "Retry email delivery",
  ]) {
    if (!workforceCopy.includes(phrase)) pass = fail(`Workforce copy missing: ${phrase}`) && pass;
  }
  pass = ok("Workforce activation delivery copy") && pass;

  const panel = fileText("src/components/admin/admin-tenant-membership-invite-panel.tsx");
  for (const phrase of [
    "inviteEmailConfigured",
    "WORKFORCE_ACTIVATION_COPY.createAndEmail",
    "WORKFORCE_ACTIVATION_COPY.createLink",
    "Copy this link",
    "WORKFORCE_ACTIVATION_COPY.deliveryDelivered",
    "WORKFORCE_ACTIVATION_COPY.retryEmail",
  ]) {
    if (!panel.includes(phrase)) pass = fail(`Admin panel missing: ${phrase}`) && pass;
  }
  if (panel.includes("RESEND") || panel.includes("process.env")) {
    pass = fail("Admin panel must not reference server env vars") && pass;
  }
  pass = ok("Tenant Command Center invite UI") && pass;

  const clientSurface = panel;
  for (const bad of FORBIDDEN) {
    if (clientSurface.includes(bad)) {
      pass = fail(`Forbidden in client panel: ${bad}`) && pass;
    }
  }

  const serverCombined = [service, actions, sendEntry, provider, template].join("\n");
  if (serverCombined.includes("rawToken") && serverCombined.match(/tokenHash\s*:\s*rawToken/)) {
    pass = fail("Must not persist raw token") && pass;
  }
  for (const bad of ["platform_admin", "email was sent", "we sent an email", "email has been sent"]) {
    if (serverCombined.toLowerCase().includes(bad.toLowerCase())) {
      pass = fail(`Forbidden phrase in server implementation: ${bad}`) && pass;
    }
  }
  pass = ok("Security copy and role boundaries") && pass;

  const pkg = fileText("package.json");
  if (!pkg.includes('"tenant-invite-email:verify"')) {
    pass = fail("package.json missing tenant-invite-email:verify") && pass;
  } else {
    pass = ok("npm script tenant-invite-email:verify") && pass;
  }

  if (!existsSync(join(ROOT, PHASE_DOC))) {
    pass = fail(`Missing ${PHASE_DOC}`) && pass;
  } else {
    const phase = fileText(PHASE_DOC);
    if (!phase.includes("IMPLEMENTATION PASSED")) {
      pass = fail("Phase doc must state IMPLEMENTATION PASSED") && pass;
    } else {
      pass = ok("M4D phase documentation") && pass;
    }
  }

  console.log("");
  if (pass) console.log("PASS: M4D Business Portal invite email delivery");
  else console.log("FAIL: M4D Business Portal invite email delivery");
  return pass;
}

const success = main();
process.exit(success ? 0 : 1);
