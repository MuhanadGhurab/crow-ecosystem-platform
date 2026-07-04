import { redirect } from "next/navigation";

import { publicRoutes } from "@/lib/public/routes";

export default function AboutRedirectPage() {
  redirect(publicRoutes.platform.overview);
}
