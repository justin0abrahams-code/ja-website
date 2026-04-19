import { loginAdmin } from "./actions";

interface AdminLoginPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const error = resolvedSearchParams?.error;

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-16">
      <div className="w-full rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Admin Access
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
          Sign in to Admin
        </h1>
        <p className="mt-4 text-zinc-600">
          Enter the admin password to access quote requests.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <form action={loginAdmin} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Admin Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
}
