import Link from "next/link";

/**
 * A permanent home for a URL that used to exist.
 *
 * /projects/[slug] and /case-studies/[slug] were both real pages on the
 * previous version of this site, and both are in someone's history, in a chat
 * thread, and possibly in an application I have already sent. Deleting them
 * would turn all of that into a 404.
 *
 * A server redirect would be cleaner, but this site also builds to static HTML
 * for a host that cannot issue one, so the redirect is a meta refresh plus a
 * link that works with no JavaScript at all. React hoists the meta tags into
 * the head.
 */
export function Moved({ to, label }: { to: string; label: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <link rel="canonical" href={`https://balisa50.github.io${to}`} />

      <div className="mx-auto w-full max-w-shell px-6 py-40 sm:px-10">
        <p className="label">This page moved</p>
        <h1 className="display mt-3 text-[clamp(1.8rem,1.3rem+2vw,2.6rem)]">{label}</h1>
        <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-text-secondary">
          Case studies now live under <code className="font-mono text-[0.9em]">/work</code>. You
          should arrive there in a moment. If nothing happens, the link is right here.
        </p>
        <Link href={to} className="link-underline mt-6 inline-block text-ink">
          Continue to {label}
        </Link>
      </div>
    </>
  );
}
