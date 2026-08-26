import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { metadataFromSeo } from "@/content/metadata";
import { getRentalPackages, getSiteContent } from "@/content/repository";
import { runtimeSiteConfig } from "@/data/site";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo((await getSiteContent()).quote.seo);
}

export default async function QuotePage() {
  const formEndpoint = process.env.NEXT_PUBLIC_QUOTE_FORM_ENDPOINT ?? "";
  const [packages, site] = await Promise.all([getRentalPackages(), getSiteContent()]);
  const content = site.quote;
  const packageOptions = packages.map(({ slug, name }) => ({ slug, name }));
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.introduction.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">{content.introduction.heading}</h1>
          <p className="mt-5 leading-7 text-zinc-600">{content.introduction.description}</p>
          <div className="mt-8 rounded-lg bg-[#f5f0e8] p-6">
            <h2 className="font-semibold text-zinc-950">{content.nextStepsHeading}</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
              {content.nextSteps.map((step, index) => <li key={step.key}>{index + 1}. {step.text}</li>)}
            </ol>
          </div>
          {runtimeSiteConfig.contactEmail ? (
            <div className="mt-6 text-sm text-zinc-600">{content.emailPrompt}{" "}<a href={`mailto:${runtimeSiteConfig.contactEmail}`} className="font-semibold text-[#1a1f2e] underline underline-offset-4">{runtimeSiteConfig.contactEmail}</a></div>
          ) : null}
        </div>
        <Suspense fallback={<div className="min-h-[640px] animate-pulse rounded-lg bg-zinc-100" />}>
          <QuoteRequestForm contactEmail={runtimeSiteConfig.contactEmail} formEndpoint={formEndpoint} packages={packageOptions} />
        </Suspense>
      </div>
    </section>
  );
}
