import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Local Event Rentals
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950 md:text-6xl">
          Audio, Lighting & AV Rentals for Events
        </h1>

        <p className="mt-6 text-lg leading-8 text-zinc-600">
          Fast quotes, reliable gear, and optional delivery, setup, and
          technician support for weddings, live music, corporate events, and
          presentations.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/packages"
            className="rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Browse Packages
          </Link>

          <Link
            href="/quote"
            className="rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
