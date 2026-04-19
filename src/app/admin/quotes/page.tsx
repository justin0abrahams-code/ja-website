import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { quoteRequests } from "@/db/schema";

export default async function AdminQuotesPage() {
  const quotes = await db
    .select()
    .from(quoteRequests)
    .orderBy(desc(quoteRequests.createdAt));

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Internal Admin
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
          Quote Requests
        </h1>
        <p className="mt-4 text-zinc-600">
          New quote requests submitted through the website.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        {quotes.length === 0 ? (
          <div className="px-6 py-10 text-zinc-600">
            No quote requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-zinc-50">
                <tr className="border-b border-zinc-200 text-left">
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                    Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                    Event Type
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                    Event Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                    Guest Count
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="border-b border-zinc-100 align-top last:border-b-0"
                  >
                    <td className="px-6 py-5 text-sm text-zinc-600">
                      {quote.createdAt
                        ? new Date(quote.createdAt).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/quotes/${quote.id}`}
                        className="font-medium text-zinc-900 underline-offset-4 hover:underline"
                      >
                        {quote.name}
                      </Link>
                      <div className="mt-1 text-sm text-zinc-600">
                        {quote.email}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600">
                        {quote.phone || "—"}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-700">
                      {quote.eventType}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-700">
                      {quote.eventDate || "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-zinc-700">
                      {quote.guestCount ?? "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                        {quote.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
