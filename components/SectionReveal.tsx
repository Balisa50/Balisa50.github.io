"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Wraps a section so that, the first time it scrolls into view, a scan line
 * sweeps down it and HUD corner brackets fade in, as if an AI is
 * constructing the panel. Decorative only (doesn't touch child layout);
 * reduced-motion simply shows the brackets with no sweep.
 */
export function SectionReveal({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // `amount: "some"` (fires as any part enters) is robust for sections that
  // are taller than the viewport, where a ratio threshold could never trip.
  const inView = useInView(ref, { once: true, amount: "some" });

  return (
    <div ref={ref} className={cn("section-reveal", inView && "revealed", className)}>
      <span className="sr-scan" aria-hidden="true" />
      <span className="sr-bracket sr-tl" aria-hidden="true" />
      <span className="sr-bracket sr-tr" aria-hidden="true" />
      <span className="sr-bracket sr-bl" aria-hidden="true" />
      <span className="sr-bracket sr-br" aria-hidden="true" />
      {children}
    </div>
  );
}
