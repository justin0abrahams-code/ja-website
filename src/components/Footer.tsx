import Link from "next/link";

const footerLinks = [
  { href: "/packages", label: "Packages" },
  { href: "/quote", label: "Quote Request" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              JA Event Production
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Audio, lighting, and AV rental support for events, with optional
              delivery, setup, and technician help.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-700 hover:text-zinc-950"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Getting Started
            </h3>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              The fastest way to get started is to request a quote with your
              event date, location, guest count, and support needs.
            </p>
            <div className="mt-5">
              <Link
                href="/quote"
                className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          © {new Date().getFullYear()} JA Event Production
        </div>
      </div>
    </footer>
  );
}
