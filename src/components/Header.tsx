import Link from "next/link";

const navItems = [
  { href: "/packages", label: "Packages" },
  { href: "/quote", label: "Quote" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          JA Event Production
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-700 hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
