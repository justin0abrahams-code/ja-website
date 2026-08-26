"use client";

import { FormEvent } from "react";
import { useSearchParams } from "next/navigation";

interface QuotePackageOption {
  slug: string;
  name: string;
}

interface QuoteRequestFormProps {
  contactEmail: string;
  formEndpoint: string;
  packages: QuotePackageOption[];
}

const eventTypes = [
  "Corporate Event",
  "Wedding",
  "Live Music",
  "Party",
  "Presentation",
  "Other",
];

function getField(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export function QuoteRequestForm({
  contactEmail,
  formEndpoint,
  packages,
}: QuoteRequestFormProps) {
  const searchParams = useSearchParams();
  const selectedPackage =
    packages.find((item) => item.slug === searchParams.get("package"))?.name ??
    "";
  const canSubmit = Boolean(formEndpoint || contactEmail);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (formEndpoint) {
      return;
    }

    event.preventDefault();

    if (!contactEmail) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const eventType = getField(formData, "eventType");
    const eventDate = getField(formData, "eventDate");
    const subject = `Quote request${eventType ? ` - ${eventType}` : ""}${
      eventDate ? ` - ${eventDate}` : ""
    }`;
    const body = [
      `Name: ${getField(formData, "name")}`,
      `Email: ${getField(formData, "email")}`,
      `Phone: ${getField(formData, "phone") || "Not provided"}`,
      `Event date: ${eventDate || "Not provided"}`,
      `Event type: ${eventType}`,
      `Venue or city: ${getField(formData, "location") || "Not provided"}`,
      `Guest count: ${getField(formData, "guestCount") || "Not provided"}`,
      `Package: ${getField(formData, "package") || "Not sure yet"}`,
      "",
      "Event details:",
      getField(formData, "message") || "No additional details provided.",
    ].join("\n");

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      action={formEndpoint || undefined}
      method="POST"
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <input type="hidden" name="source" value="JA Event Production website" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Phone number <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
          />
        </div>

        <div>
          <label
            htmlFor="eventDate"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Event date
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
            Event type
          </label>
          <select
            id="eventType"
            name="eventType"
            defaultValue=""
            required
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
          >
            <option value="" disabled>
              Choose an event type
            </option>
            {eventTypes.map((eventType) => (
              <option key={eventType} value={eventType}>
                {eventType}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="guestCount"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Approximate guest count
          </label>
          <input
            id="guestCount"
            name="guestCount"
            type="number"
            min="0"
            inputMode="numeric"
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="location"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Venue or city
        </label>
        <input
          id="location"
          name="location"
          type="text"
          autoComplete="street-address"
          placeholder="Venue name, city, or event address"
          className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
        />
      </div>

      <div>
        <label
          htmlFor="package"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Package of interest
        </label>
        <select
          id="package"
          name="package"
          defaultValue={selectedPackage}
          className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
        >
          <option value="">Not sure yet</option>
          {packages.map((pkg) => (
            <option key={pkg.slug} value={pkg.name}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Event details
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us what needs to be heard, seen, or supported and anything important about the venue or schedule."
          className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-[#c8860d]"
        />
      </div>

      {!canSubmit ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Quote requests will be available as soon as the public contact email
          or hosted form endpoint is configured.
        </p>
      ) : !formEndpoint ? (
        <p className="text-sm leading-6 text-zinc-500">
          Submitting will open a prepared message in your email app.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-md bg-[#1a1f2e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#252b3b] disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {formEndpoint ? "Send Quote Request" : "Prepare Email Request"}
      </button>
    </form>
  );
}
