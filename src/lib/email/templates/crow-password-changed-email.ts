export type CrowPasswordChangedEmailInput = {
  changedAtIso: string;
};

export type CrowPasswordChangedEmailContent = {
  subject: string;
  text: string;
  html: string;
};

export function buildCrowPasswordChangedEmail(
  input: CrowPasswordChangedEmailInput
): CrowPasswordChangedEmailContent {
  const subject = "Your Crow password was changed";
  const when = new Date(input.changedAtIso).toUTCString();

  const text = [
    "Crow Ecosystem",
    "",
    "The password for your Crow account was changed.",
    "",
    `Approximate time (UTC): ${when}`,
    "",
    "Crow never sends passwords by email. If you made this change, no further action is needed.",
    "",
    "If you did not change your password, sign in and reset it immediately using Forgot your password,",
    "or contact your Crow workspace administrator through your usual support channel.",
    "",
    "— Crow Ecosystem",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#e2e8f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:480px;background:#1e293b;border-radius:12px;padding:32px 28px;border:1px solid #334155;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#94a3b8;">Crow Ecosystem</p>
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#f8fafc;">Password changed</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cbd5e1;">The password for your Crow account was changed.</p>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#94a3b8;">Approximate time (UTC): <strong style="color:#e2e8f0;">${when}</strong></p>
              <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#94a3b8;">Crow never sends passwords by email. If you made this change, no further action is needed.</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">If you did not change your password, use Forgot your password on the sign-in page or contact your administrator.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}
