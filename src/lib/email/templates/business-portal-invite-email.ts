/**
 * M4D — Transactional Business Portal invite email (HTML + plain text).
 */

import type { BusinessPortalInviteEmailPayload } from "@/lib/email/email-provider";

function roleLabel(role: BusinessPortalInviteEmailPayload["invitedRole"]): string {
  return role === "tenant_admin" ? "Business Portal administrator" : "Business Portal user";
}

function formatExpiry(expiresAt: Date): string {
  return expiresAt.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}

export function buildBusinessPortalInviteEmail(payload: BusinessPortalInviteEmailPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const tenantName = payload.tenantName.trim() || "your organization";
  const role = roleLabel(payload.invitedRole);
  const expiry = formatExpiry(payload.expiresAt);
  const invitedBy = payload.invitedByDisplayName.trim() || "A ProCrow operator";

  const subject = `You're invited to the ${tenantName} Business Portal`;

  const text = [
    `You're invited to the ${tenantName} Business Portal`,
    "",
    `${invitedBy} invited you as ${role}.`,
    "",
    "This invitation grants Business Portal access for day-to-day tenant operations. It does not grant ProCrow operator access, platform administration, or Client Portal proposal approval rights.",
    "",
    "Accept your invitation:",
    payload.inviteUrl,
    "",
    `This link expires on ${expiry} (UTC).`,
    "",
    "Important: Sign in using the same email address that received this invitation.",
    "",
    "If the button or link does not work, copy the URL above into your browser.",
    "",
    "— Crow Ecosystem",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0f172a;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:28px 24px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#94a3b8;">Business Portal invitation</p>
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.35;color:#f8fafc;">You're invited to ${escapeHtml(tenantName)}</h1>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#cbd5e1;">
            ${escapeHtml(invitedBy)} invited you as <strong>${escapeHtml(role)}</strong>.
          </p>
          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#94a3b8;">
            This invitation is for Business Portal access only. It does not grant ProCrow or platform administration access.
          </p>
          <p style="margin:0 0 24px;text-align:center;">
            <a href="${escapeAttr(payload.inviteUrl)}" style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 20px;border-radius:8px;">
              Accept Business Portal Invite
            </a>
          </p>
          <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#94a3b8;">
            Link expires: <strong style="color:#e2e8f0;">${escapeHtml(expiry)} UTC</strong>
          </p>
          <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#94a3b8;">
            Sign in using the <strong style="color:#e2e8f0;">same email address</strong> that received this invitation.
          </p>
          <p style="margin:0 0 0;font-size:12px;line-height:1.6;color:#64748b;word-break:break-all;">
            If the button does not work, copy this link:<br>
            <a href="${escapeAttr(payload.inviteUrl)}" style="color:#5eead4;">${escapeHtml(payload.inviteUrl)}</a>
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#64748b;">Crow Ecosystem · Business Portal access invitation</p>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
