import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          404 · not found
        </p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight">
          This page isn&apos;t here.
        </h1>
        <p className="mt-4 text-text-secondary">
          It may have been a draft that never shipped, or a link that moved.
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
