import { DIAGRAMS } from "@/lib/generated/diagrams";

/**
 * Renders a build-time diagram.
 *
 * The SVG is inlined rather than dropped into an <img> so it inherits the
 * page's colour tokens and its labels stay selectable and searchable. The
 * markup comes from scripts/generate-diagrams.mjs, which is our own code
 * reading our own JSON, so there is no untrusted string here.
 */
export function Diagram({
  slug,
  caption,
  className = ""
}: {
  slug: string;
  /** Overrides the caption in the JSON. */
  caption?: string;
  className?: string;
}) {
  const diagram = DIAGRAMS[slug];

  // A missing diagram should fail the build, not render an empty box that
  // nobody notices until someone reads the page.
  if (!diagram) {
    throw new Error(
      `No diagram for "${slug}". Add data/architecture/${slug}.json and run npm run diagrams.`
    );
  }

  // Scrollbars are hidden site-wide, so a diagram wider than the column needs
  // to say so in words.
  const wide = diagram.width > 900;
  const text = caption ?? diagram.caption;

  return (
    <figure className={`diagram not-prose ${className}`}>
      <div className="diagram-scroll border-y border-rule bg-white py-5">
        <div
          className="min-w-max px-5"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: diagram.svg }}
        />
      </div>
      {(text || wide) && (
        <figcaption className="mt-3 text-sm leading-relaxed text-text-secondary">
          {text}
          {wide && (
            <span className="mt-1.5 block font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
              Wider than the page. Scroll it sideways.
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * The legend. Printed once per page that carries a diagram, because the kinds
 * are distinguished by line treatment rather than colour and that is not
 * self-evident.
 */
export function DiagramLegend() {
  const items: { label: string; className: string }[] = [
    { label: "Input", className: "border border-dashed border-rule-strong" },
    { label: "Service", className: "border border-rule-strong bg-white" },
    { label: "Model", className: "border border-accent bg-white" },
    { label: "Store", className: "border border-rule-strong bg-surface" },
    { label: "Surface", className: "border border-ink bg-surface" }
  ];

  return (
    <ul className="not-prose mt-4 flex flex-wrap gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span aria-hidden="true" className={`inline-block h-3 w-5 rounded-[2px] ${item.className}`} />
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
