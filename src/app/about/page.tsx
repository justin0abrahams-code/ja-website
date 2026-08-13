import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";

const serviceAreas = [
  "North Georgia weddings and private gatherings",
  "Corporate meetings, conferences, and trainings",
  "Live shows, bands, and outdoor event setups",
  "Parties, cookouts, and home movie nights",
];

const supportOptions = [
  "Fixed sound rental packages",
  "Subwoofer, uplighting, and band upgrades",
  "Equipment delivery and pickup",
  "Setup, strike, and stage hand labor",
  "Technical equipment operators",
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
            About {siteConfig.shortName}
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">
            A small family-owned event production company focused on rentals
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-600">
            {siteConfig.businessName} serves the {siteConfig.serviceArea} area
            with audio, lighting, and production equipment rentals backed by{" "}
            {siteConfig.experience}.
          </p>

          <p className="mt-4 text-zinc-600">
            The site leads with packages because most customers need a clear
            starting point: what setup fits the event and whether delivery,
            setup, or a technical operator is available.
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200">
          <Image
            src="/brand/stage-audio.jpg"
            alt="Stage and speaker setup for an event"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
            What We Support
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">
            Event types and rental needs
          </h2>

          <ul className="mt-6 space-y-4">
            {serviceAreas.map((item) => (
              <li key={item} className="rounded-lg bg-[#f5f0e8] px-5 py-4">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
            Support Options
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">
            Flexible help beyond the rental itself
          </h2>

          <ul className="mt-6 space-y-4">
            {supportOptions.map((item) => (
              <li key={item} className="rounded-lg bg-[#f5f0e8] px-5 py-4">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
          Service Area
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">
          Serving {siteConfig.serviceArea}
        </h2>

        <p className="mt-4 text-zinc-600">
          Service is available across North Georgia. Share your venue or city
          in the quote request so travel, delivery, and event logistics can be
          confirmed for your date.
        </p>
      </div>

      <div className="mt-8 rounded-lg bg-[#1a1f2e] px-8 py-12 text-white">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">
            Need help choosing?
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight">
            Tell us about the event and Justin can match the right setup
          </h2>
          <p className="mt-4 text-[#f5f0e8]/75">
            If you are not sure which package fits your event, request a quote
            and share the basics.
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
      </div>
    </section>
  );
}
