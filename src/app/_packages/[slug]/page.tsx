import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { metadataFromSeo } from "@/content/metadata";
import { getRentalPackage, getRentalPackages, getSiteContent } from "@/content/repository";

interface PackageDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const packages = await getRentalPackages();
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PackageDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [pkg, site] = await Promise.all([getRentalPackage(slug), getSiteContent()]);
  if (!pkg) return {};
  return metadataFromSeo({ title: `${pkg.name} | ${site.settings.shortName}`, description: pkg.description, socialImage: pkg.image });
}

export default async function PackageDetailPage({
  params,
}: PackageDetailPageProps) {
  const { slug } = await params;

  const [pkg, site] = await Promise.all([getRentalPackage(slug), getSiteContent()]);

  if (!pkg || !site.packages) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-6">
        <Link
          href="/packages"
          className="text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          {site.packages.labels.backToPackages}
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="relative aspect-[21/9] min-h-[260px] bg-zinc-100">
          <Image
            src={pkg.image.src}
            alt={pkg.image.alt}
            fill
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#f2a81d]/15 px-3 py-1 text-xs font-semibold text-[#1a1f2e]">
              {pkg.category}
            </span>
            {pkg.rentalPeriod ? (
              <span className="text-sm text-zinc-500">{pkg.rentalPeriod}</span>
            ) : null}
          </div>

          <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-zinc-950">
            {pkg.name}
          </h1>

          <p className="mt-4 text-lg leading-8 text-zinc-600">
            {pkg.description}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-[#f5f0e8] p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#c8860d]">
                {site.packages.labels.bestFor.replace(/:$/, "")}
              </h2>
              <p className="mt-3 text-zinc-800">{pkg.bestFor}</p>
            </div>

            <div className="rounded-lg bg-[#f5f0e8] p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#c8860d]">
                {site.packages.labels.eventSize.replace(/:$/, "")}
              </h2>
              <p className="mt-3 text-zinc-800">{pkg.eventSize}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">
                {site.packages.labels.detailIncludes}
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-zinc-700">
                {pkg.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-zinc-950">
                {site.packages.labels.detailAddons}
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-zinc-700">
                {pkg.addons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/quote?package=${pkg.slug}`}
              className="rounded-md bg-[#1a1f2e] px-5 py-3 text-sm font-semibold text-white hover:bg-[#252b3b]"
            >
              {site.packages.labels.detailAvailability}
            </Link>

            <Link
              href="/packages"
              className="rounded-md border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
            >
              {site.packages.labels.detailBrowse}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
