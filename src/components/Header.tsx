import Image from "next/image";
import Link from "next/link";
import { PACKAGES_ENABLED } from "@/features";
import type { SiteSettingsContent } from "@/content/domain";

export function Header({ settings }: { settings: SiteSettingsContent }) {
  const navItems = [
    ...(PACKAGES_ENABLED ? [{ href: "/packages", label: settings.header.packagesLabel }] : []),
    { href: "/quote", label: settings.header.quoteLabel },
    { href: "/gallery", label: settings.header.galleryLabel },
    { href: "/about", label: settings.header.aboutLabel },
    { href: "/faq", label: settings.header.faqLabel },
  ];
  return (
    <header className="border-b border-[#f2a81d]/25 bg-[#1a1f2e] text-[#f5f0e8]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f0e8]">
            <Image
              src="/brand/ja-logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-semibold">
              {settings.shortName}
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f2a81d]">
              {settings.header.brandDescriptor}
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[#f5f0e8]/75 transition hover:text-[#f2a81d]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/quote"
          className="rounded-md bg-[#f2a81d] px-4 py-2 text-sm font-semibold text-[#1a1f2e] transition hover:bg-[#f7c35a]"
        >
          {settings.header.ctaLabel}
        </Link>
      </div>
      <nav aria-label="Mobile navigation" className="flex justify-center gap-6 border-t border-[#f2a81d]/15 px-6 py-3 md:hidden">
        {navItems.map((item) => <Link key={item.href} href={item.href} className="text-sm text-[#f5f0e8]/75 transition hover:text-[#f2a81d]">{item.label}</Link>)}
      </nav>
    </header>
  );
}
