import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default function PortalHomePage() {
  redirect(routes.portal.requests);
}
