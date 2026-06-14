import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export default async function BlueprintStudioIndexPage({
  params,
}: {
  params: Promise<{ blueprintId: string }>;
}) {
  const { blueprintId } = await params;
  redirect(routes.blueprint(blueprintId).studioSection("overview"));
}
