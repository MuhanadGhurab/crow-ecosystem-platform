import type { RoiAssumption, RoiModel } from "../commercial";

export type RoiValidationIssue = {
  code: string;
  message: string;
  assumptionKey?: string;
};

export type RoiValidationResult = {
  valid: boolean;
  issues: RoiValidationIssue[];
};

export function validateRoiModel(model: RoiModel): RoiValidationResult {
  const issues: RoiValidationIssue[] = [];

  if (model.assumptions.length === 0) {
    issues.push({
      code: "NO_ASSUMPTIONS",
      message: "At least one ROI assumption is required",
    });
  }

  for (const assumption of model.assumptions) {
    if (!assumption.unit) {
      issues.push({
        code: "MISSING_UNIT",
        message: `Assumption ${assumption.key} is missing a unit`,
        assumptionKey: assumption.key,
      });
    }
    if (Number.isNaN(assumption.value)) {
      issues.push({
        code: "INVALID_VALUE",
        message: `Assumption ${assumption.key} has invalid numeric value`,
        assumptionKey: assumption.key,
      });
    }
  }

  const unapproved = model.assumptions.filter((a) => a.approvalStatus === "draft");
  if (unapproved.length > 0) {
    issues.push({
      code: "UNAPPROVED_ASSUMPTIONS",
      message: `${unapproved.length} assumption(s) not yet approved`,
    });
  }

  return { valid: issues.length === 0, issues };
}

export function validateAssumption(assumption: RoiAssumption): RoiValidationResult {
  const issues: RoiValidationIssue[] = [];
  if (assumption.value < 0) {
    issues.push({
      code: "NEGATIVE_VALUE",
      message: "Assumption value cannot be negative",
      assumptionKey: assumption.key,
    });
  }
  return { valid: issues.length === 0, issues };
}
