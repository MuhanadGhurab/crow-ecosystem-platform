"use server";

/**
 * CROW.DEVFLOW.5 — Public server action for alpha demo feedback.
 * No auth required (friends/testers on Preview). Fail-closed via DEVFLOW.4 guards.
 */

import type { DemoFeedbackSubmitResult } from "@/lib/demo-feedback/demo-feedback-contract";
import { submitDemoFeedback } from "@/lib/services/demo-feedback.service";

export async function submitDemoFeedbackAction(
  input: Record<string, unknown>,
): Promise<DemoFeedbackSubmitResult> {
  return submitDemoFeedback(input, {});
}
