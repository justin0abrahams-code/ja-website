export default function QuotePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Request a Quote
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
          Tell us about your event
        </h1>
        <p className="mt-4 text-zinc-600">
          Share a few details and we’ll help match the right audio, lighting, or
          AV rental package for your event.
        </p>
      </div>

      <form className="mt-10 space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
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
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
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
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
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
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
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
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
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
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
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
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
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
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
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
                Setup
              </label>
              <label className="flex items-center gap-3 text-sm text-zinc-700">
                <input type="checkbox" name="support" value="technician" />
                On-site Technician
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
            placeholder="Tell us about your event, what kind of setup you think you need, venue details, timeline, and any questions."
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-6">
          <p className="text-sm text-zinc-500">
            We’ll use this information to prepare a rental recommendation and
            quote.
          </p>

          <button
            type="submit"
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Submit Quote Request
          </button>
        </div>
      </form>
    </section>
  );
}
