import Link from "next/link";
import { Diagram, DiagramLegend } from "@/components/diagram";
import { LiveMetrics } from "@/components/live-metrics";
import { TradeOff, TradeOffs } from "@/components/mdx/trade-off";
import { PostMortem } from "@/components/mdx/post-mortem";
import { resultsFor, type MetricsSnapshot } from "@/lib/metrics";

/**
 * A figure that already exists in public/figures, captioned.
 *
 * These are matplotlib output and screenshots from the projects themselves. The
 * rule the site has kept since the rebuild is that a figure has to show a
 * result; there are no decorative images, so a project without a real output
 * simply runs as text.
 */
export function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="not-prose my-8">
      <div className="figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" />
      </div>
      {caption && <figcaption className="mt-3 text-sm leading-relaxed text-text-secondary">{caption}</figcaption>}
    </figure>
  );
}

/** A short row of headline numbers, each with what it actually measures. */
export function Stats({ children }: { children: React.ReactNode }) {
  return (
    <dl className="not-prose my-8 grid gap-x-8 gap-y-6 border-y border-rule py-7 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </dl>
  );
}

export function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="numeral mt-1.5 text-[1.75rem] leading-none text-ink">{value}</dd>
      {note && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{note}</p>}
    </div>
  );
}

/** An aside. Used sparingly, mostly to admit something. */
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside className="not-prose my-8 border-l-2 border-accent pl-5 text-[0.9375rem] leading-relaxed text-text-secondary [&>p+p]:mt-3">
      {children}
    </aside>
  );
}

/**
 * The component map handed to compileMDX.
 *
 * `Architecture` and `Metrics` are bound to the slug here rather than taking it
 * as a prop in every MDX file. Eleven files repeating their own slug is eleven
 * chances to paste the wrong one, and the failure would be a page quietly
 * showing another project's diagram.
 */
export function mdxComponents({ slug, metrics }: { slug: string; metrics: MetricsSnapshot }) {
  return {
    Architecture: (props: { caption?: string }) => <Diagram slug={slug} {...props} />,
    DiagramLegend,
    Metrics: () => <LiveMetrics metrics={metrics} results={resultsFor(metrics, slug)} />,
    TradeOff,
    TradeOffs,
    PostMortem,
    Figure,
    Stats,
    Stat,
    Note,

    // Internal links go through next/link so a click inside a case study is a
    // client navigation like every other link on the site.
    a: ({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
      href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} {...props} />
  };
}
