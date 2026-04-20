import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin-login");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/admin/quotes"
              className="text-lg font-semibold text-zinc-900"
            >
              JA Event Production Admin
            </Link>
            <p className="mt-1 text-sm text-zinc-500">
              Quote request management
            </p>
          </div>

          <AdminLogoutButton />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
