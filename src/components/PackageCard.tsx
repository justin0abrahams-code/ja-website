import Image from "next/image";
import Link from "next/link";
import { RentalPackage } from "@/lib/types";

interface PackageCardProps {
  pkg: RentalPackage;
}

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      {pkg.imageSrc ? (
        <div className="relative aspect-[16/9] bg-zinc-100">
          <Image
            src={pkg.imageSrc}
            alt=""
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-[#f2a81d]/15 px-3 py-1 text-xs font-semibold text-[#1a1f2e]">
            {pkg.category}
          </span>
        </div>

        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
          {pkg.name}
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {pkg.description}
        </p>

        <div className="mt-4 space-y-2 text-sm text-zinc-700">
          <p>
            <span className="font-semibold">Best for:</span> {pkg.bestFor}
          </p>
          <p>
            <span className="font-semibold">Event size:</span> {pkg.eventSize}
          </p>
          {pkg.rentalPeriod ? (
            <p>
              <span className="font-semibold">Rental period:</span>{" "}
              {pkg.rentalPeriod}
            </p>
          ) : null}
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold text-zinc-900">Includes:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-zinc-600">
            {pkg.includes.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link
            href={`/quote?package=${pkg.slug}`}
            className="rounded-md bg-[#1a1f2e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#252b3b]"
          >
            Check Availability
          </Link>

          <Link
            href={`/packages/${pkg.slug}`}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
