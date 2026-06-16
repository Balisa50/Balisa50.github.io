"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a button/link so it drifts toward the cursor while hovered, like a
 * magnetically-coupled HUD control. No-ops for reduced-motion / touch.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const leave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  return (
    <span
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className={cn("inline-block transition-transform duration-300 ease-out [will-change:transform]", className)}
    >
      {children}
    </span>
  );
}
