import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";
import { updateQuoteStatus } from "../actions";

interface AdminQuoteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function AdminQuoteDetailPage({
  params,
}: AdminQuoteDetailPageProps) {
  const { id } = await params;

  const result = await db
    .select()
    .from(quoteRequests)
    .where(eq(quoteRequests.id, id))
    .limit(1);

  const quote = result[0];

  if (!quote) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6">
        <Link
          href="/admin/quotes"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          ← Back to Quote Requests
        </Link>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {quote.status}
          </span>
          <span className="text-sm text-zinc-500">
            Submitted{" "}
            {quote.createdAt
              ? new Date(quote.createdAt).toLocaleString()
              : "—"}
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950">
          {quote.name}
        </h1>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Update Status
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Move this quote through your workflow.
              </p>
            </div>

            <form action={updateQuoteStatus} className="flex flex-wrap gap-3">
              <input type="hidden" name="id" value={quote.id} />
              <select
                name="status"
                defaultValue={quote.status}
                className="rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Save Status
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Contact
            </h2>
            <div className="mt-3 space-y-2 text-zinc-800">
              <p>
                <span className="font-medium">Email:</span> {quote.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {quote.phone || "—"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Event Basics
            </h2>
            <div className="mt-3 space-y-2 text-zinc-800">
              <p>
                <span className="font-medium">Event Type:</span>{" "}
                {formatLabel(quote.eventType)}
              </p>
              <p>
                <span className="font-medium">Event Date:</span>{" "}
                {quote.eventDate || "—"}
              </p>
              <p>
                <span className="font-medium">Guest Count:</span>{" "}
                {quote.guestCount ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Location
          </h2>
          <p className="mt-3 text-zinc-800">{quote.location || "—"}</p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Rental Preference
            </h2>
            <p className="mt-3 text-zinc-800">
              {quote.rentalPreference
                ? formatLabel(quote.rentalPreference)
                : "—"}
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Support Needs
            </h2>
            {quote.supportNeeds.length > 0 ? (
              <ul className="mt-3 space-y-2 text-zinc-800">
                {quote.supportNeeds.map((item) => (
                  <li key={item}>• {formatLabel(item)}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-zinc-800">—</p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-zinc-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Notes
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-zinc-800">
            {quote.notes || "—"}
          </p>
        </div>
      </div>
    </section>
  );
}
