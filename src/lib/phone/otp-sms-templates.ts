/** Transactional OTP SMS copy — no links, no marketing. Provider review may require sender/company identity. */

export type OtpSmsLocale = "en" | "ar";

const EN_TEMPLATE =
  "Your Crow verification code is: {{CODE}}. It expires in {{MINUTES}} minutes. Do not share this code.";

const AR_TEMPLATE =
  "رمز التحقق الخاص بحساب Crow هو: {{CODE}}. تنتهي صلاحيته خلال {{MINUTES}} دقائق. لا تشارك هذا الرمز مع أي شخص.";

export function buildOtpSmsBody(input: {
  code: string;
  minutes: number;
  locale?: string;
}): string {
  const locale: OtpSmsLocale =
    input.locale?.trim().toLowerCase().startsWith("ar") ? "ar" : "en";
  const template = locale === "ar" ? AR_TEMPLATE : EN_TEMPLATE;
  return template
    .replace("{{CODE}}", input.code)
    .replace("{{MINUTES}}", String(input.minutes));
}
