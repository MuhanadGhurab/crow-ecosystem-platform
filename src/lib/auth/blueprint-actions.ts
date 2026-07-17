/**
 * C2 — explicit Blueprint Studio action capabilities (C1.1 authorization matrix).
 * SAREA is presentation-only and is not listed here.
 */

export const BlueprintAction = {
  "blueprint.list": "blueprint.list",
  "blueprint.read.internal": "blueprint.read.internal",
  "blueprint.read.client": "blueprint.read.client",
  "blueprint.draft.create": "blueprint.draft.create",
  "blueprint.draft.edit.organization": "blueprint.draft.edit.organization",
  "blueprint.draft.edit.operations": "blueprint.draft.edit.operations",
  "blueprint.draft.edit.security": "blueprint.draft.edit.security",
  "blueprint.draft.edit.experience": "blueprint.draft.edit.experience",
  "blueprint.draft.edit.integrations": "blueprint.draft.edit.integrations",
  "blueprint.draft.edit.commercial": "blueprint.draft.edit.commercial",
  "blueprint.version.compare": "blueprint.version.compare",
  "blueprint.review.submit": "blueprint.review.submit",
  "blueprint.review.request_changes": "blueprint.review.request_changes",
  "blueprint.approve": "blueprint.approve",
  "blueprint.archive": "blueprint.archive",
  "blueprint.version.create_next": "blueprint.version.create_next",
  "blueprint.roi.generate": "blueprint.roi.generate",
  "blueprint.roi.assumption.edit": "blueprint.roi.assumption.edit",
  "blueprint.roi.assumption.approve": "blueprint.roi.assumption.approve",
  "blueprint.sow.generate": "blueprint.sow.generate",
  "blueprint.sow.edit": "blueprint.sow.edit",
  "blueprint.sow.review": "blueprint.sow.review",
  "blueprint.configuration.propose": "blueprint.configuration.propose",
  "blueprint.trace.read": "blueprint.trace.read",
} as const;

export type BlueprintActionKey = (typeof BlueprintAction)[keyof typeof BlueprintAction];
