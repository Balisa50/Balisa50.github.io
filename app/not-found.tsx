import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          404 · not found
        </p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight">
          Even the{" "}
          <span className="bg-gradient-to-r from-cyan via-white to-cyan bg-clip-text text-transparent">
            neural net
          </span>{" "}
          doesn&apos;t know this page.
        </h1>
        <p className="mt-4 text-text-secondary">
          It might have been a draft that never shipped. Try the homepage.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-medium text-background shadow-glow-cyan transition hover:shadow-glow-cyan-lg"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
