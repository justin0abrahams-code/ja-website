import Link from "next/link";
import { PackageCard } from "@/components/PackageCard";
import { packages } from "@/data/packages";

const eventTypes = [
  {
    title: "Corporate Events",
    description: "Presentations, panels, meetings, trainings, and company gatherings.",
  },
  {
    title: "Weddings",
    description: "Ceremony audio, reception support, speeches, and uplighting.",
  },
  {
    title: "Live Music",
    description: "Small band PA setups, vocal mics, mixers, and support options.",
  },
  {
    title: "Parties",
    description: "Simple sound and lighting packages for private events and celebrations.",
  },
  {
    title: "Presentations",
    description: "Clean AV support for spoken-word events and audience clarity.",
  },
];

const supportHighlights = [
  "Fast quote requests",
  "Professional rental packages",
  "Delivery and setup available",
  "Optional on-site technician support",
];

const howItWorks = [
  "Browse packages or tell us about your event",
  "Request availability and pricing",
  "Confirm the right gear and support options",
  "Pickup, delivery, setup, or technician support",
];

export default function HomePage() {
  const featuredPackages = packages.filter((pkg) => pkg.featured).slice(0, 4);

  return (
    <>
      <section className="bg-gradient-to-b from-zinc-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Local Event Rentals
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-6xl">
              Audio, Lighting &amp; AV Rentals for Events
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Fast quotes, reliable gear, and optional delivery, setup, and
              technician support for weddings, live music, corporate events,
              parties, and presentations.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/packages"
                className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Browse Packages
              </Link>

              <Link
                href="/quote"
                className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Get a Fast Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Event Types
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
            Built for real event needs
          </h2>
          <p className="mt-4 text-zinc-600">
            Whether you need a simple speech setup or a more complete event
            package, the goal is to make the right rental option easy to
            understand and request.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {eventTypes.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Featured Packages
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                Start with a package, not a gear spreadsheet
              </h2>
              <p className="mt-4 text-zinc-600">
                Most customers do not want to piece together individual gear
                first. These starter packages make it easier to get the right
                setup and a faster quote.
              </p>
            </div>

            <Link
              href="/packages"
              className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline"
            >
              View all packages
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
              A simpler rental process
            </h2>

            <div className="mt-8 space-y-4">
              {howItWorks.map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl bg-zinc-50 px-5 py-4"
                >
                  <p className="text-sm font-semibold text-zinc-500">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-zinc-800">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Why JA Event Production
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
              Professional gear with optional expert help
            </h2>

            <p className="mt-4 text-zinc-600">
              The goal is not just to rent equipment. It is to help customers
              feel confident they are getting the right setup, clear pricing,
              and dependable support for event day.
            </p>

            <ul className="mt-8 space-y-4">
              {supportHighlights.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl bg-zinc-50 px-5 py-4 text-zinc-800"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-zinc-900 px-8 py-12 text-white">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Request Availability
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Need a quote for your event?
            </h2>
            <p className="mt-4 text-zinc-300">
              Tell us about your event date, location, guest count, and support
              needs. We’ll help match the right rental setup and next steps.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
              >
                Get a Fast Quote
              </Link>

              <Link
                href="/packages"
                className="rounded-lg border border-zinc-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Browse Packages
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
