import Link from "next/link";
import { notFound } from "next/navigation";
import { packages } from "@/data/packages";

interface PackageDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export default async function PackageDetailPage({
  params,
}: PackageDetailPageProps) {
  const { slug } = await params;

  const pkg = packages.find((item) => item.slug === slug);

  if (!pkg) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6">
        <Link
          href="/packages"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Back to Packages
        </Link>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {pkg.category}
          </span>
          <span className="text-sm font-semibold text-zinc-900">
            Starting at {pkg.startingPrice}
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950">
          {pkg.name}
        </h1>

        <p className="mt-4 text-lg leading-8 text-zinc-600">
          {pkg.description}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Best For
            </h2>
            <p className="mt-3 text-zinc-800">{pkg.bestFor}</p>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Event Size
            </h2>
            <p className="mt-3 text-zinc-800">{pkg.eventSize}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              What&apos;s Included
            </h2>
            <ul className="mt-4 space-y-3 text-zinc-700">
              {pkg.includes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              Optional Add-Ons
            </h2>
            <ul className="mt-4 space-y-3 text-zinc-700">
              {pkg.addons.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/quote"
            className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Request Quote
          </Link>

          <Link
            href="/packages"
            className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            View More Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
