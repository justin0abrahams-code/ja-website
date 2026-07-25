import { packages } from "@/data/packages";
import { submitQuoteRequest } from "./actions";

interface QuotePageProps {
  searchParams?: Promise<{
    package?: string;
    success?: string;
    error?: string;
  }>;
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const success = resolvedSearchParams?.success === "1";
  const error = resolvedSearchParams?.error;
  const selectedPackage = packages.find(
    (pkg) => pkg.slug === resolvedSearchParams?.package
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
          Request Availability
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">
          Tell us about your event
        </h1>
        <p className="mt-4 text-zinc-600">
          Share a few details and Justin can match the right sound, lighting, or
          production rental setup for your event.
        </p>
      </div>

      {success ? (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
          Thanks, your quote request has been submitted. We&apos;ll be in touch
          soon.
        </div>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {selectedPackage ? (
        <div className="mt-8 rounded-lg border border-[#f2a81d]/40 bg-[#f5f0e8] px-5 py-4">
          <p className="text-sm font-semibold text-[#1a1f2e]">
            Selected package: {selectedPackage.name}
          </p>
          <p className="mt-1 text-sm text-zinc-600">
            {selectedPackage.startingPrice === "Custom"
              ? "Justin can recommend the right setup from your event details."
              : `Starts at ${selectedPackage.startingPrice} (${selectedPackage.rentalPeriod ?? "rental"})`}
          </p>
        </div>
      ) : null}

      <form
        action={submitQuoteRequest}
        className="mt-10 space-y-8 rounded-lg border border-zinc-200 bg-white p-8 shadow-sm"
      >
        {selectedPackage ? (
          <input
            type="hidden"
            name="selectedPackageSlug"
            value={selectedPackage.slug}
          />
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 555-5555"
              className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
            />
          </div>

          <div>
            <label
              htmlFor="eventDate"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Event Date
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
            />
          </div>

          <div>
            <label
              htmlFor="eventType"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Event Type
            </label>
            <select
              id="eventType"
              name="eventType"
              defaultValue=""
              className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
              required
            >
              <option value="" disabled>
                Select event type
              </option>
              <option value="corporate">Corporate Event</option>
              <option value="wedding">Wedding</option>
              <option value="live-music">Live Music</option>
              <option value="party">Party</option>
              <option value="presentation">Presentation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="guestCount"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Estimated Guest Count
            </label>
            <input
              id="guestCount"
              name="guestCount"
              type="number"
              placeholder="e.g. 120"
              className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Event Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="City, venue, or address"
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-zinc-800">
              Rental Preference
            </legend>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input type="radio" name="rentalPreference" value="pickup" />
                Pickup
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input type="radio" name="rentalPreference" value="delivery" />
                Delivery
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input
                  type="radio"
                  name="rentalPreference"
                  value="not-sure"
                />
                Not Sure Yet
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-zinc-800">
              Additional Support
            </legend>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input type="checkbox" name="support" value="setup" />
                Setup / labor
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input type="checkbox" name="support" value="technician" />
                Technical operator
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input type="checkbox" name="support" value="not-sure" />
                Need Help Deciding
              </label>
            </div>
          </fieldset>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Event Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={6}
            placeholder="Tell us about your event, venue, timeline, gear needs, access details, and any questions."
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            We&apos;ll use this information to prepare a rental recommendation
            and quote.
          </p>

          <button
            type="submit"
            className="rounded-md bg-[#1a1f2e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252b3b]"
          >
            Submit Quote Request
          </button>
        </div>
      </form>
    </section>
  );
}
