import Link from "next/link";
import { siteConfig } from "@/data/site";

const faqs = [
  {
    question: "Do you offer delivery and setup?",
    answer:
      "Yes. Equipment delivery and pickup is listed at $450, with setup, strike, and stage hand labor available at $400/day per person.",
  },
  {
    question: "Can I rent gear without an on-site technician?",
    answer:
      "Yes. Some packages are rental-friendly, especially smaller announcement setups. Larger events, bands, and higher-pressure timelines may benefit from setup help or a technical equipment operator.",
  },
  {
    question: "What does a technical equipment operator cost?",
    answer:
      "The current add-on pricing lists an event technical equipment operator at $800 per 10 hours, per operator.",
  },
  {
    question: "What if I am not sure what package I need?",
    answer:
      "Start with a custom quote request. Share the event type, date, guest count, location, and what you are trying to accomplish, and Justin can recommend the right setup.",
  },
  {
    question: "How far in advance should I request a quote?",
    answer:
      "As early as possible is best, especially for weddings, live shows, and larger event dates. Early requests improve the chance of matching the right package and support availability.",
  },
  {
    question: "Do packages include every possible upgrade?",
    answer:
      "No. The fixed packages are starting points. Subwoofers, uplighting, band gear, delivery, labor, and operators can be added based on the event.",
  },
  {
    question: "What information should I include in a quote request?",
    answer:
      "The most helpful details are your event date, location, event type, guest count, preferred package, pickup or delivery preference, and any notes about venue access or timing.",
  },
  {
    question: "Where do you serve?",
    answer: `The launch copy uses ${siteConfig.serviceArea}. Exact city, county, radius, and travel fee details can be confirmed during the quote process.`,
  },
];

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8860d]">
          Frequently Asked Questions
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-zinc-950">
          Helpful answers before you request a quote
        </h1>

        <p className="mt-6 text-lg leading-8 text-zinc-600">
          Clear package pricing, flexible add-ons, and a quote-first workflow
          keep the rental process simple without promising instant inventory
          booking.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {faqs.map((item) => (
          <article
            key={item.question}
            className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm"
          >
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              {item.question}
            </h2>
            <p className="mt-4 leading-7 text-zinc-600">{item.answer}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-lg bg-[#1a1f2e] px-8 py-12 text-white">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">
            Still have questions?
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight">
            Tell us about your event and Justin can help from there
          </h2>
          <p className="mt-4 text-[#f5f0e8]/75">
            A quote request is the fastest way to figure out the right package,
            support options, and next steps.
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
