import type { BlueprintReadinessReport, EnterpriseBlueprintDocument } from "../blueprint";

export function assessBlueprintReadiness(
  doc: EnterpriseBlueprintDocument
): BlueprintReadinessReport {
  const org = doc.slices.find((s) => s.type === "organizational");
  const ops = doc.slices.find((s) => s.type === "operational");
  const sec = doc.slices.find((s) => s.type === "security_trust");
  const exp = doc.slices.find((s) => s.type === "experience");
  const integ = doc.slices.find((s) => s.type === "integration");
  const comm = doc.slices.find((s) => s.type === "commercial");

  const checks = [
    {
      key: "organizational",
      label: "Organization slice",
      complete: Boolean(org && org.departments.length > 0),
      blocker: org && org.departments.length > 0 ? undefined : "Departments not defined",
    },
    {
      key: "operational",
      label: "Operations slice",
      complete: Boolean(ops && ops.processes.length > 0),
      blocker: ops && ops.processes.length > 0 ? undefined : "Processes not defined",
    },
    {
      key: "security",
      label: "Security & Trust slice",
      complete: Boolean(sec && sec.authorizationModel.length > 0),
      blocker:
        sec && sec.authorizationModel.length > 0
          ? undefined
          : "Authorization model missing",
    },
    {
      key: "experience",
      label: "Experience / SAREA slice",
      complete: Boolean(exp && exp.personas.length > 0),
      blocker: exp && exp.personas.length > 0 ? undefined : "Personas not defined",
    },
    {
      key: "integration",
      label: "Integrations slice",
      complete: Boolean(integ),
    },
    {
      key: "commercial",
      label: "Commercial slice",
      complete: Boolean(comm && comm.modules.length > 0),
      blocker: comm && comm.modules.length > 0 ? undefined : "Modules not listed",
    },
    {
      key: "acceptance",
      label: "Acceptance criteria",
      complete: doc.acceptanceCriteria.length > 0,
      blocker:
        doc.acceptanceCriteria.length > 0 ? undefined : "Acceptance criteria empty",
    },
  ];

  const overviewComplete = checks.filter((c) =>
    ["organizational", "operational", "security", "experience"].includes(c.key)
  ).every((c) => c.complete);

  const roiReady =
    overviewComplete &&
    Boolean(comm?.implementationEffortDays != null || comm?.timelineWeeks != null);

  const sowReady =
    roiReady && doc.acceptanceCriteria.length > 0 && doc.assumptions.length > 0;

  return {
    blueprintId: doc.ref.blueprintId,
    overviewComplete,
    roiReady,
    sowReady,
    checks,
  };
}
