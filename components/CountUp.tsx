"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  to: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/**
 * Digital counter that rolls from 0 → `to` when it scrolls into view, then
 * gives a brief sci-fi "lock-in" flicker. Reduced-motion shows the final
 * value immediately.
 */
export function CountUp({ to, prefix = "", suffix = "", durationMs = 1500, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      setLocked(true);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutExpo for a snappy, decelerating count
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(eased * to));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLocked(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, durationMs]);

  return (
    <span
      ref={ref}
      className={className}
      style={
        locked
          ? { animation: "name-jolt 0.32s steps(2) 1" }
          : undefined
      }
    >
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
