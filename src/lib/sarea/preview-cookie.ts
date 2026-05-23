import { cookies } from "next/headers";

export const SAREA_PREVIEW_COOKIE = "sarea_preview_persona";

const VALID_PERSONAS = new Set(["executive", "manager", "frontline"]);

export async function readSareaPreviewPersona(): Promise<string | null> {
  const value = (await cookies()).get(SAREA_PREVIEW_COOKIE)?.value;
  if (!value || !VALID_PERSONAS.has(value)) return null;
  return value;
}
