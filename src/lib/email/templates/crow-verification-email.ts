export type CrowVerificationEmailInput = {
  code: string;
  expiresMinutes?: number;
};

export type CrowVerificationEmailContent = {
  subject: string;
  text: string;
  html: string;
};

export function buildCrowVerificationEmail(
  input: CrowVerificationEmailInput
): CrowVerificationEmailContent {
  const expiresMinutes = input.expiresMinutes ?? 15;
  const subject = "Your Crow verification code";

  const text = [
    "Crow Ecosystem",
    "",
    `Your verification code is: ${input.code}`,
    "",
    `This code expires in ${expiresMinutes} minutes.`,
    "Do not share this code with anyone — Crow support will never ask for it.",
    "",
    "If you did not request this code, you can ignore this email.",
    "For help, contact your Crow workspace administrator or reply through your usual support channel.",
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
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#f8fafc;">Verify your email</h1>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#cbd5e1;">Enter this verification code to continue setting up your Crow account:</p>
              <p style="margin:0 0 24px;font-size:32px;font-weight:700;letter-spacing:0.35em;color:#f8fafc;text-align:center;">${input.code}</p>
              <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#94a3b8;">This code expires in <strong style="color:#e2e8f0;">${expiresMinutes} minutes</strong>.</p>
              <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#94a3b8;">Do not share this code. Crow will never ask you to forward it by email or chat.</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">If you did not request this code, you can safely ignore this message.</p>
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
