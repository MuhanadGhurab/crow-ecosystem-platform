import { cookies } from "next/headers";
import { isSareaPreviewPersonaKey, SAREA_PREVIEW_PERSONA_KEYS } from "@/lib/constants/sarea-personas";

export const SAREA_PREVIEW_COOKIE = "sarea_preview_persona";

const VALID_PERSONAS = new Set<string>(SAREA_PREVIEW_PERSONA_KEYS);

export async function readSareaPreviewPersona(): Promise<string | null> {
  const value = (await cookies()).get(SAREA_PREVIEW_COOKIE)?.value;
  if (!value || !VALID_PERSONAS.has(value) || !isSareaPreviewPersonaKey(value)) return null;
  return value;
}
