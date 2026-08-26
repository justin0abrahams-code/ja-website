import { Suspense } from "react";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { getRentalPackages } from "@/content/repository";
import { siteConfig } from "@/data/site";

export default async function QuotePage() {
  const formEndpoint = process.env.NEXT_PUBLIC_QUOTE_FORM_ENDPOINT ?? "";
  const packageOptions = (await getRentalPackages()).map(({ slug, name }) => ({
    slug,
    name,
  }));

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
            Check Availability
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">
            Tell us the basics about your event
          </h1>
          <p className="mt-5 leading-7 text-zinc-600">
            Share your date, location, event type, and the package you are
            considering. Justin can confirm availability and recommend the
            right setup and support.
          </p>

          <div className="mt-8 rounded-lg bg-[#f5f0e8] p-6">
            <h2 className="font-semibold text-zinc-950">What happens next</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
              <li>1. Your event details are reviewed.</li>
              <li>2. Availability and logistics are confirmed.</li>
              <li>3. You receive a package recommendation and quote.</li>
            </ol>
          </div>

          {siteConfig.contactEmail ? (
            <div className="mt-6 text-sm text-zinc-600">
              Prefer email?{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-semibold text-[#1a1f2e] underline underline-offset-4"
              >
                {siteConfig.contactEmail}
              </a>
            </div>
          ) : null}
        </div>

        <Suspense
          fallback={
            <div className="min-h-[640px] animate-pulse rounded-lg bg-zinc-100" />
          }
        >
          <QuoteRequestForm
            contactEmail={siteConfig.contactEmail}
            formEndpoint={formEndpoint}
            packages={packageOptions}
          />
        </Suspense>
      </div>
    </section>
  );
}
