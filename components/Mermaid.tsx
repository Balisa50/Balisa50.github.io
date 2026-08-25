"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * A Mermaid diagram, rendered in the browser.
 *
 * Mermaid is around a megabyte, and this site is a static export where most
 * visitors never open a case study. So it is imported inside the effect rather
 * than at the top of the file: the chunk is fetched the first time a diagram
 * actually mounts, and the home page never pays for it.
 *
 * Rendering can fail. A syntax slip in one chart should cost that one diagram,
 * not the page, so a failure hides the figure and leaves the prose intact.
 * Nothing here renders untrusted input; the charts are in lib/architecture.ts.
 */
export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"pending" | "ready" | "failed">("pending");

  // useId gives a stable id per instance. Mermaid needs one, and a shared id
  // makes two diagrams on the same page overwrite each other.
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          // Matches the site rather than Mermaid's defaults: one accent, warm
          // off-white, hairline borders, and the same two typefaces.
          theme: "base",
          themeVariables: {
            background: "#FAFAF9",
            primaryColor: "#F4F4F2",
            primaryTextColor: "#1C1917",
            primaryBorderColor: "#D6D3D1",
            lineColor: "#A8A29E",
            secondaryColor: "#EFF4FF",
            tertiaryColor: "#FAFAF9",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            fontSize: "14px"
          },
          flowchart: { curve: "basis", nodeSpacing: 40, rankSpacing: 55, padding: 12 },
          // The charts are ours, but strict is the right default and costs
          // nothing here: no chart needs to emit raw HTML.
          securityLevel: "strict"
        });

        const { svg } = await mermaid.render(id, chart);
        if (cancelled || !ref.current) return;
        ref.current.innerHTML = svg;
        setState("ready");
      } catch {
        if (!cancelled) setState("failed");
      }
    })();

    return () => {
      cancelled = true;
      // Mermaid leaves a measuring node behind when a render is interrupted,
      // which Strict Mode's double effect makes routine in development.
      document.getElementById(`d${id}`)?.remove();
    };
  }, [chart, id]);

  if (state === "failed") return null;

  return (
    <figure className="my-8">
      <div
        className="mermaid-scroll border-y border-rule bg-white px-4 py-6"
        // Hidden scrollbars are a site-wide rule, so a wide diagram still
        // scrolls, it just does not advertise it. The caption says so instead.
        style={{ overflowX: "auto" }}
      >
        <div
          ref={ref}
          className="min-w-max"
          style={{ minHeight: state === "pending" ? "120px" : undefined }}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[13px] leading-relaxed text-text-secondary">
          {caption}
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.09em] text-text-faint">
            Drag sideways if it runs past the edge
          </span>
        </figcaption>
      )}
    </figure>
  );
}
