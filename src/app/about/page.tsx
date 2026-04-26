import Link from "next/link";

const serviceAreas = [
  "Corporate events",
  "Weddings",
  "Live music",
  "Private parties",
  "Presentations and speaking events",
];

const supportOptions = [
  "Equipment rental packages",
  "Delivery options",
  "Setup and strike support",
  "Optional on-site technician support",
  "Help choosing the right package for the event",
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          About JA Event Production
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
          Rental-first event support with practical expertise
        </h1>

        <p className="mt-6 text-lg leading-8 text-zinc-600">
          JA Event Production is built to make audio, lighting, and AV rentals
          easier to understand and easier to book. The goal is to help customers
          get the right setup for the event without having to decode a long list
          of gear on their own.
        </p>

        <p className="mt-4 text-zinc-600">
          Instead of leading with vague service language or raw inventory, the
          approach is simple: clear packages, fast quote requests, optional
          delivery and setup, and dependable support when the event matters.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            What We Support
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">
            Event types and rental needs
          </h2>

          <ul className="mt-6 space-y-4">
            {serviceAreas.map((item) => (
              <li
                key={item}
                className="rounded-2xl bg-zinc-50 px-5 py-4 text-zinc-800"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Support Options
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">
            Flexible help beyond the rental itself
          </h2>

          <ul className="mt-6 space-y-4">
            {supportOptions.map((item) => (
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

      <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Service Area
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">
          Serving local events and regional clients
        </h2>

        <p className="mt-4 text-zinc-600">
          Service area details can be refined as the business finalizes its
          standard coverage range. For now, this page should communicate that JA
          Event Production supports local and regional event clients and can
          discuss delivery, setup, and logistics during the quote process.
        </p>

        <p className="mt-4 text-zinc-600">
          Once you have the exact cities, counties, or metro area wording from
          your friend, this section can be updated with a more precise coverage
          statement.
        </p>
      </div>

      <div className="mt-8 rounded-3xl bg-zinc-900 px-8 py-12 text-white">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Need help choosing?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Tell us about the event and we’ll help match the right setup
          </h2>
          <p className="mt-4 text-zinc-300">
            If you are not sure which package fits your event, the fastest next
            step is to request a quote and share the basics.
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
  );
}
