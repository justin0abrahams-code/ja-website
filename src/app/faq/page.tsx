import { PACKAGES_ENABLED } from "@/features";
import type { Metadata } from "next";
import Link from "next/link";
import { metadataFromSeo } from "@/content/metadata";
import { getFaqs, getSiteContent } from "@/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo((await getSiteContent()).faq.seo);
}

export default async function FaqPage() {
  const [faqs, site] = await Promise.all([getFaqs(), getSiteContent()]);
  const content = site.faq;
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.introduction.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">{content.introduction.heading}</h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600">{content.introduction.description}</p>
      </div>
      <div className="mt-12 space-y-6">
        {faqs.map((item) => <article key={item.question} className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm"><h2 className="text-xl font-semibold tracking-tight text-zinc-950">{item.question}</h2><p className="mt-4 leading-7 text-zinc-600">{item.answer}</p></article>)}
      </div>
      <div className="mt-10 rounded-lg bg-[#1a1f2e] px-8 py-12 text-white">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">{content.cta.eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight">{content.cta.heading}</h2>
          <p className="mt-4 text-[#f5f0e8]/75">{content.cta.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/quote" className="rounded-md bg-[#f2a81d] px-5 py-3 text-sm font-semibold text-[#1a1f2e] transition hover:bg-[#f7c35a]">{content.cta.primaryLabel}</Link>
            {PACKAGES_ENABLED ? <Link href="/packages" className="rounded-md border border-[#f2a81d]/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f2a81d]/10">{content.cta.secondaryLabel}</Link> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
