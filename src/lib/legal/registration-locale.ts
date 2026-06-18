import { headers } from "next/headers";

const DEFAULT_LOCALE = "en-US";

/** Resolve registration locale from Accept-Language (C3 legal gate). */
export async function resolveRegistrationLocale(): Promise<string> {
  const h = await headers();
  const accept = h.get("accept-language");
  if (!accept) return DEFAULT_LOCALE;

  const first = accept.split(",")[0]?.trim();
  if (!first) return DEFAULT_LOCALE;

  const tag = first.split(";")[0]?.trim();
  if (!tag || tag === "*") return DEFAULT_LOCALE;

  if (tag === "en" || tag.startsWith("en-")) return "en-US";
  return tag;
}
