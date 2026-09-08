import { PACKAGES_ENABLED } from "@/features";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { metadataFromSeo } from "@/content/metadata";
import { getSiteContent } from "@/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo((await getSiteContent()).about.seo);
}

export default async function AboutPage() {
  const content = (await getSiteContent()).about;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.introduction.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">{content.introduction.heading}</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">{content.introduction.description}</p>
          <p className="mt-4 text-zinc-600">{content.introduction.secondaryDescription}</p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200">
          <Image src={content.heroImage.src} alt={content.heroImage.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {[content.supportedEvents, content.supportOptions].map((section) => (
          <div key={section.eyebrow} className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{section.eyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">{section.heading}</h2>
            <ul className="mt-6 space-y-4">{section.items.map((item) => <li key={item.key} className="rounded-lg bg-[#f5f0e8] px-5 py-4">{item.text}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.serviceArea.eyebrow}</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">{content.serviceArea.heading}</h2>
        <p className="mt-4 text-zinc-600">{content.serviceArea.description}</p>
      </div>
      <div className="mt-8 rounded-lg bg-[#1a1f2e] px-8 py-12 text-white">
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
