import { routes } from "@/lib/routes";

export const blueprintStudioRoute = "/admin/blueprint-studio";

export function blueprintStudioPaths() {
  return {
    blueprintStudio: blueprintStudioRoute,
    login: "/login",
    tenantStudio: routes.admin.tenantStudio,
    modelForge: routes.admin.modelForge,
    overview: routes.admin.overview,
  };
}
