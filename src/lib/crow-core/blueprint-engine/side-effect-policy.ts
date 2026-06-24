/** Side-effect containment — lifecycle must never provision tenants or grant authority. */
export const BLUEPRINT_LIFECYCLE_SIDE_EFFECTS = {
  tenantCreation: false,
  membershipCreation: false,
  permissionAssignment: false,
  workflowCompilation: false,
} as const;
