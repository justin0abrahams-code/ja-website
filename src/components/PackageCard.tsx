import Link from "next/link";
import { RentalPackage } from "@/lib/types";

interface PackageCardProps {
  pkg: RentalPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
          {pkg.category}
        </span>
        <span className="text-sm font-semibold text-zinc-900">
          From {pkg.startingPrice}
        </span>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
        {pkg.name}
      </h2>

      <p className="mt-3 text-sm leading-6 text-zinc-600">{pkg.description}</p>

      <div className="mt-4 space-y-2 text-sm text-zinc-700">
        <p>
          <span className="font-semibold">Best for:</span> {pkg.bestFor}
        </p>
        <p>
          <span className="font-semibold">Event size:</span> {pkg.eventSize}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-zinc-900">Includes:</p>
        <ul className="mt-2 space-y-2 text-sm text-zinc-600">
          {pkg.includes.slice(0, 4).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex gap-3 pt-2">
        <Link
          href="/quote"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          Request Quote
        </Link>

        <Link
          href={`/packages/${pkg.slug}`}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
