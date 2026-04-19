import { PackageCard } from "@/components/PackageCard";
import { packages } from "@/data/packages";

export default function PackagesPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Rental Packages
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
          Packages built for real event needs
        </h1>
        <p className="mt-4 text-zinc-600">
          Start with the setup that fits your event, then add delivery, setup,
          or technician support as needed.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.slug} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
