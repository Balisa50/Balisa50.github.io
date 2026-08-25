"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Fades a section up the first time it enters the viewport.
 *
 * Deliberately additive. The previous version set `opacity: 0` in CSS and only
 * cleared it once JavaScript added a class, so every section below the fold was
 * invisible until the observer fired: with JS blocked, on a crawler, or on a
 * direct jump to an anchor, the page rendered blank. Content is visible by
 * default now and the animation is the enhancement rather than the gate.
 *
 * It also rendered a scan line and four HUD corner brackets. Those belonged to
 * the cinematic layer, their CSS is gone, and the empty spans went with them.
 */
export function SectionReveal({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // `amount: "some"` (fires as any part enters) is robust for sections taller
  // than the viewport, where a ratio threshold could never trip.
  const inView = useInView(ref, { once: true, amount: "some" });

  return (
    <div ref={ref} className={cn("section-reveal", inView && "revealed", className)}>
      {children}
    </div>
  );
}
