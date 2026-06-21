import { notFound } from "next/navigation";
import { PrintButton } from "@/components/account/print-button";
import { CrowMark } from "@/components/public/brand/crow-mark";
import { markdownToSafeHtml } from "@/lib/legal/legal-content-sanitize";
import { getPublishedVersionById } from "@/lib/legal/legal-document.service";
import { parseLegalDocumentSlug } from "@/lib/legal/legal-urls";

export default async function LegalDocumentPublicPage({
  params,
}: {
  params: Promise<{ slug: string; versionId: string }>;
}) {
  const { slug, versionId } = await params;
  const documentType = parseLegalDocumentSlug(slug);
  if (!documentType) {
    notFound();
  }

  const version = await getPublishedVersionById(versionId);
  if (!version || version.legalDocument.documentType !== documentType) {
    notFound();
  }

  const html = markdownToSafeHtml(version.contentBody);
  const effective = version.effectiveAt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="cc-starfield cc-noise min-h-[100dvh] print:bg-white print:text-black">
      <header className="border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <CrowMark href="/" size="sm" showTagline={false} />
          <PrintButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 print:max-w-none print:px-8">
        <p className="text-xs text-slate-500 print:text-gray-600">
          Version {version.versionNumber} · {version.locale} · Effective {effective}
        </p>
        <h1 className="cc-page-title mt-2 print:text-black">{version.title}</h1>
        <article
          className="legal-doc-content mt-8 space-y-3 text-sm leading-relaxed text-slate-300 print:text-black [&_a]:text-cyan-400 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  );
}
