import Link from "next/link";

const faqs = [
  {
    question: "Do you offer delivery and setup?",
    answer:
      "Yes. Delivery and setup can be discussed during the quote process based on the event location, package, and support needed.",
  },
  {
    question: "Can I rent gear without an on-site technician?",
    answer:
      "Yes. Some events may only need equipment rental, while others may benefit from setup help or technician support. The quote process helps determine the right fit.",
  },
  {
    question: "What if I am not sure what package I need?",
    answer:
      "That is completely fine. The site is designed to make the process easier, not force customers to know every technical detail. Submit a quote request with the basics of your event and JA Event Production can recommend the right setup.",
  },
  {
    question: "How far in advance should I request a quote?",
    answer:
      "As early as possible is best, especially for weddings, live music, and larger event dates. Early requests improve the chances of getting the right package and support availability.",
  },
  {
    question: "Can you support different types of events?",
    answer:
      "Yes. JA Event Production supports a range of event types including corporate events, weddings, presentations, parties, and live music needs.",
  },
  {
    question: "Do I need to know exactly what equipment I want?",
    answer:
      "No. Most customers think in terms of event needs, not individual gear models. That is why the site leads with packages and a quote request flow instead of expecting every customer to build a system from scratch.",
  },
  {
    question: "What information should I include in a quote request?",
    answer:
      "The most helpful details are your event date, location, event type, guest count, and any notes about what kind of setup or support you think you need.",
  },
  {
    question: "Can lighting be included with audio packages?",
    answer:
      "Yes, depending on the event. Lighting and other support options can be discussed as part of the quote request so the final recommendation fits the event more closely.",
  },
];

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Frequently Asked Questions
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
          Helpful answers before you request a quote
        </h1>

        <p className="mt-6 text-lg leading-8 text-zinc-600">
          The goal is to make event rentals easier to understand, easier to
          request, and easier to book with confidence.
        </p>
      </div>

      <div className="mt-12 space-y-6">
        {faqs.map((item) => (
          <article
            key={item.question}
            className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
          >
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              {item.question}
            </h2>
            <p className="mt-4 leading-7 text-zinc-600">{item.answer}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-3xl bg-zinc-900 px-8 py-12 text-white">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Still have questions?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Tell us about your event and we’ll help from there
          </h2>
          <p className="mt-4 text-zinc-300">
            A quote request is the fastest way to figure out the right package,
            support options, and next steps for your event.
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
