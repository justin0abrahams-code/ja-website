import Image from "next/image";
import Link from "next/link";
import { PackageCard } from "@/components/PackageCard";
import { packages } from "@/data/packages";
import { siteConfig } from "@/data/site";

const eventTypes = [
  {
    title: "Weddings and Parties",
    description:
      "Ceremony sound, reception audio, uplighting, private parties, cookouts, and home movie nights.",
  },
  {
    title: "Meetings and Conferences",
    description:
      "Clear announcement systems for meetings, trainings, panels, and corporate gatherings.",
  },
  {
    title: "Live Shows",
    description:
      "Scalable sound packages with monitors, microphones, subs, and operator support when needed.",
  },
];

const howItWorks = [
  "Choose a package or start with a custom quote",
  "Add upgrades like subs, uplighting, labor, or a technical operator",
  "Confirm availability, delivery, setup, and event-day support",
];

export default function HomePage() {
  const featuredPackages = packages.filter((pkg) => pkg.featured).slice(0, 4);

  return (
    <>
      <section className="bg-[#111318] text-[#f5f0e8]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">
              Equipment Rentals in {siteConfig.serviceArea}
            </p>

            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold tracking-tight md:text-6xl">
              {siteConfig.businessName}
            </h1>

            <p className="mt-5 text-xl font-semibold text-[#f2a81d]">
              {siteConfig.tagline}
            </p>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#f5f0e8]/75">
              Rental-first sound, lighting, and event production support for
              weddings, parties, live shows, conferences, meetings, and private
              gatherings.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/packages"
                className="rounded-md bg-[#f2a81d] px-5 py-3 text-sm font-semibold text-[#1a1f2e] transition hover:bg-[#f7c35a]"
              >
                Browse Packages
              </Link>

              <Link
                href="/quote"
                className="rounded-md border border-[#f2a81d]/60 px-5 py-3 text-sm font-semibold text-[#f5f0e8] transition hover:bg-[#f2a81d]/10"
              >
                Request Availability
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-[#f2a81d]/20 bg-[#252b3b]">
            <Image
              src="/brand/uplighting-room.jpg"
              alt="Event room with blue and amber uplighting"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111318] via-[#111318]/75 to-transparent p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">
                Rentals, setup, and operators
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#f5f0e8]/80">
                Packages start at $550/day, with delivery, labor, and technical
                operator add-ons available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f0e8]">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-8 md:grid-cols-3">
          <div className="border-l-4 border-[#f2a81d] bg-white px-5 py-4">
            <p className="text-sm font-semibold text-zinc-950">
              {siteConfig.experience}
            </p>
          </div>
          <div className="border-l-4 border-[#f2a81d] bg-white px-5 py-4">
            <p className="text-sm font-semibold text-zinc-950">
              Basic sound packages for 50-500 people
            </p>
          </div>
          <div className="border-l-4 border-[#f2a81d] bg-white px-5 py-4">
            <p className="text-sm font-semibold text-zinc-950">
              Delivery, labor, and operators available
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
              Launch Packages
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-zinc-950">
              Start with a real rental package
            </h2>
            <p className="mt-4 text-zinc-600">
              Pick a sound package, add upgrades or event-day services, and
              request availability before assuming gear is booked.
            </p>
          </div>

          <Link
            href="/packages"
            className="text-sm font-semibold text-[#1a1f2e] underline-offset-4 hover:underline"
          >
            View all packages
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featuredPackages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200">
            <Image
              src="/brand/audio-console.jpg"
              alt="Digital audio console at an event"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
              How It Works
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-zinc-950">
              A quote-first rental process
            </h2>
            <p className="mt-4 text-zinc-600">
              The site does not pretend inventory is instantly bookable. It
              helps customers choose a starting point, then Justin can confirm
              availability, logistics, and the right support level.
            </p>

            <div className="mt-8 space-y-4">
              {howItWorks.map((step, index) => (
                <div key={step} className="rounded-lg bg-white px-5 py-4">
                  <p className="text-sm font-semibold text-[#c8860d]">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-zinc-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
            Event Types
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-zinc-950">
            Built for gatherings that need clear sound and simple support
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {eventTypes.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
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

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid overflow-hidden rounded-lg bg-[#1a1f2e] text-white md:grid-cols-[1fr_0.8fr]">
          <div className="px-8 py-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">
              Request Availability
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold tracking-tight">
              Need a rental quote for an event in {siteConfig.serviceArea}?
            </h2>
            <p className="mt-4 max-w-2xl text-[#f5f0e8]/75">
              Share the date, location, guest count, package, and support needs.
              Justin can help match the right rental setup and next steps.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="rounded-md bg-[#f2a81d] px-5 py-3 text-sm font-semibold text-[#1a1f2e] transition hover:bg-[#f7c35a]"
              >
                Get a Fast Quote
              </Link>

              <Link
                href="/packages"
                className="rounded-md border border-[#f2a81d]/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f2a81d]/10"
              >
                Browse Packages
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px]">
            <Image
              src="/brand/outdoor-screen.jpg"
              alt="Outdoor event screen and production setup"
              fill
              sizes="(min-width: 768px) 36vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
