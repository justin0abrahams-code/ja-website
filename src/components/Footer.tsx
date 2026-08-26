import Link from "next/link";
import type { SiteSettingsContent } from "@/content/domain";

export function Footer({ contactEmail, settings }: { contactEmail: string; settings: SiteSettingsContent }) {
  const footerLinks = [
    { href: "/packages", label: settings.footer.packagesLabel },
    { href: "/quote", label: settings.footer.quoteLabel },
    { href: "/about", label: settings.footer.aboutLabel },
    { href: "/faq", label: settings.footer.faqLabel },
  ];
  return (
    <footer className="border-t border-[#f2a81d]/20 bg-[#111318] text-[#f5f0e8]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-xl font-semibold">
              {settings.businessName}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#f5f0e8]/70">
              {settings.description}
            </p>
            <p className="mt-4 text-sm font-semibold text-[#f2a81d]">
              {settings.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">
              {settings.footer.navigationHeading}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#f5f0e8]/70 transition hover:text-[#f2a81d]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">
              {settings.footer.serviceAreaHeading}
            </h3>
            <p className="mt-4 text-sm leading-6 text-[#f5f0e8]/70">
              {settings.footer.serviceAreaDescription}
            </p>
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="mt-3 inline-block text-sm font-semibold text-[#f2a81d] hover:text-[#f7c35a]"
              >
                {contactEmail}
              </a>
            ) : null}
            <div className="mt-5">
              <Link
                href="/quote"
                className="inline-flex rounded-md bg-[#f2a81d] px-4 py-2 text-sm font-semibold text-[#1a1f2e] transition hover:bg-[#f7c35a]"
              >
                {settings.footer.ctaLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#f2a81d]/20 pt-6 text-sm text-[#f5f0e8]/50">
          &copy; {new Date().getFullYear()} {settings.businessName}
        </div>
      </div>
    </footer>
  );
}
