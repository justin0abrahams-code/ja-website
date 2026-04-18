export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-600">
        <p>© {new Date().getFullYear()} JA Event Production</p>
      </div>
    </footer>
  );
}
