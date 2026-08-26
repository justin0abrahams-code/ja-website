import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PackageCard } from "@/components/PackageCard";
import { selectHomepagePackages } from "@/content/merchandising";
import { metadataFromSeo } from "@/content/metadata";
import { getRentalPackages, getSiteContent } from "@/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFromSeo((await getSiteContent()).home.seo);
}

export default async function HomePage() {
  const [packages, site] = await Promise.all([getRentalPackages(), getSiteContent()]);
  const content = site.home;
  const featuredPackages = selectHomepagePackages(packages);
  return (
    <>
      <section className="bg-[#111318] text-[#f5f0e8]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">{content.hero.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-6xl">{content.hero.heading}</h1>
            <p className="mt-5 text-xl font-semibold text-[#f2a81d]">{content.hero.tagline}</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f5f0e8]/75">{content.hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/packages" className="rounded-md bg-[#f2a81d] px-5 py-3 text-sm font-semibold text-[#1a1f2e] transition hover:bg-[#f7c35a]">{content.hero.primaryLabel}</Link>
              <Link href="/quote" className="rounded-md border border-[#f2a81d]/60 px-5 py-3 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#f2a81d]/10">{content.hero.secondaryLabel}</Link>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#f2a81d]/20 bg-[#252b3b]">
            <Image src={content.hero.image.src} alt={content.hero.image.alt} fill priority sizes="(min-width: 1024px) 44vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111318] via-[#111318]/75 to-transparent p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">{content.hero.imageEyebrow}</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#f5f0e8]/80">{content.hero.imageDescription}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f5f0e8]"><div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 md:grid-cols-3">
        {content.proofPoints.map((point) => <div key={point.key} className="border-l-4 border-[#f2a81d] bg-white px-5 py-4"><p className="text-sm font-semibold text-zinc-950">{point.text}</p></div>)}
      </div></section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.featuredPackages.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-zinc-950">{content.featuredPackages.heading}</h2>
            <p className="mt-4 text-zinc-600">{content.featuredPackages.description}</p>
          </div>
          <Link href="/packages" className="text-sm font-semibold text-[#1a1f2e] underline-offset-4 hover:underline">{content.featuredPackages.linkLabel}</Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">{featuredPackages.map((pkg) => <PackageCard key={pkg.slug} labels={site.packages.labels} pkg={pkg} />)}</div>
      </section>
      <section className="border-y border-zinc-200 bg-[#f5f0e8]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.upgrades.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-zinc-950">{content.upgrades.heading}</h2>
            <p className="mt-4 text-zinc-600">{content.upgrades.description}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">{content.upgrades.items.map((item) => <article key={item.key} className="rounded-lg border border-[#f2a81d]/20 bg-white p-6"><h3 className="text-lg font-semibold text-zinc-950">{item.title}</h3><p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p></article>)}</div>
          <Link href="/packages" className="mt-8 inline-flex text-sm font-semibold text-[#1a1f2e] underline-offset-4 hover:underline">{content.upgrades.linkLabel}</Link>
        </div>
      </section>
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200"><Image src={content.process.image.src} alt={content.process.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" /></div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.process.eyebrow}</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-zinc-950">{content.process.heading}</h2>
            <p className="mt-4 text-zinc-600">{content.process.description}</p>
            <div className="mt-8 space-y-4">{content.process.steps.map((step, index) => <div key={step.key} className="rounded-lg bg-white px-5 py-4"><p className="text-sm font-semibold text-[#c8860d]">{content.process.stepLabel} {index + 1}</p><p className="mt-2 text-zinc-800">{step.text}</p></div>)}</div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.eventTypes.eyebrow}</p><h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-zinc-950">{content.eventTypes.heading}</h2></div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">{content.eventTypes.items.map((item) => <article key={item.key} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"><h3 className="text-xl font-semibold tracking-tight text-zinc-950">{item.title}</h3><p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p></article>)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid overflow-hidden rounded-lg bg-[#1a1f2e] text-white md:grid-cols-[1fr_0.8fr]">
          <div className="px-8 py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">{content.cta.eyebrow}</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold tracking-tight">{content.cta.heading}</h2>
            <p className="mt-4 max-w-2xl text-[#f5f0e8]/75">{content.cta.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/quote" className="rounded-md bg-[#f2a81d] px-5 py-3 text-sm font-semibold text-[#1a1f2e] transition hover:bg-[#f7c35a]">{content.cta.primaryLabel}</Link>
              <Link href="/packages" className="rounded-md border border-[#f2a81d]/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f2a81d]/10">{content.cta.secondaryLabel}</Link>
            </div>
          </div>
          <div className="relative min-h-[280px]"><Image src={content.cta.image.src} alt={content.cta.image.alt} fill sizes="(min-width: 768px) 36vw, 100vw" className="object-cover" /></div>
        </div>
      </section>
    </>
  );
}
