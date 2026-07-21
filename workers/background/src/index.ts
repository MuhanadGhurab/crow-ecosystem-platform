/** Local-only thin outbox runner. It does not contact cloud providers. */
export async function runOnce(): Promise<"idle"> {
  return "idle";
}
