import { ImplementationRequestForm } from "@/components/public/implementation-request-form";
import { RequestPageHero } from "@/components/public/request-page-hero";

export default function RequestPage() {
  return (
    <>
      <RequestPageHero />
      <div className="cc-safe-x mx-auto max-w-3xl pb-28 pt-10 sm:pb-32 sm:pt-14 lg:max-w-6xl lg:pb-16 lg:pt-16">
        <ImplementationRequestForm />
      </div>
    </>
  );
}
