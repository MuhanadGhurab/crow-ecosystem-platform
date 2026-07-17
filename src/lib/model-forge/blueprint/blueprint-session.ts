import type { BlueprintCompileInput } from "./blueprint-types";
import type { EnterpriseBlueprintDraft } from "./blueprint-types";

const SESSION_KEY = "crow_blueprint_preview_session";
const COMPILE_INPUT_KEY = "crow_model_forge_compile_input";

export type BlueprintSessionPayload = {
  version: "1.0.0";
  compileInput: BlueprintCompileInput;
  exportedAt: string;
};

export function saveCompileInputToSession(input: BlueprintCompileInput): void {
  if (typeof window === "undefined") return;
  const payload: BlueprintSessionPayload = {
    version: "1.0.0",
    compileInput: input,
    exportedAt: new Date().toISOString(),
  };
  sessionStorage.setItem(COMPILE_INPUT_KEY, JSON.stringify(payload));
}

export function loadCompileInputFromSession(): BlueprintCompileInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(COMPILE_INPUT_KEY);
    if (!raw) return null;
    const payload = JSON.parse(raw) as BlueprintSessionPayload;
    if (payload.version !== "1.0.0") return null;
    return payload.compileInput;
  } catch {
    return null;
  }
}

export function saveBlueprintPreviewToSession(draft: EnterpriseBlueprintDraft): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(draft));
}

export function loadBlueprintPreviewFromSession(): EnterpriseBlueprintDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EnterpriseBlueprintDraft;
  } catch {
    return null;
  }
}

export function clearBlueprintSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(COMPILE_INPUT_KEY);
}
