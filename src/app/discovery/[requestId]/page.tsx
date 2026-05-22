import { redirect } from "next/navigation";

export default async function DiscoveryIndexPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  redirect(`/discovery/${requestId}/organization`);
}
