import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PackageCard } from "@/components/PackageCard";
import { metadataFromSeo } from "@/content/metadata";
import { getRentalPackages, getSiteContent } from "@/content/repository";

export async function generateMetadata(): Promise<Metadata> {
  const content = (await getSiteContent()).packages;
  if (!content) notFound();
  return metadataFromSeo(content.seo);
}

export default async function PackagesPage() {
  const [packages, site] = await Promise.all([getRentalPackages(), getSiteContent()]);
  const content = site.packages;
  if (!content) notFound();
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">{content.introduction.eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">{content.introduction.heading}</h1>
        <p className="mt-4 text-zinc-600">{content.introduction.description}</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => <PackageCard key={pkg.slug} labels={content.labels} pkg={pkg} />)}
      </div>
    </section>
  );
}
