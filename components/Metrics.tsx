"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/projects";
import { CountUp } from "./CountUp";

/**
 * Honest metrics only. No fabricated numbers, no stars card (so we never
 * display "0" or invite "is that real?" questions). Each stat is its own
 * holographic tilt-card with a digital roll-up counter.
 */
export function Metrics() {
  const shipped = PROJECTS.filter((p) => p.status === "live").length;
  const inDev = PROJECTS.filter((p) => p.status !== "live").length;

  const items: { to: number; suffix?: string; durationMs?: number; label: string }[] = [
    { to: shipped, label: "Shipped" },
    { to: inDev, label: "In development" },
    { to: 2024, durationMs: 1800, label: "Shipping since" },
    { to: 100, suffix: "%", label: "Open source" }
  ];

  return (
    <section
      aria-label="Live metrics"
      className="relative mx-auto w-full max-w-7xl px-6 pb-6 pt-2"
    >
      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10">
        {items.map((it, i) => (
          <motion.li
            key={it.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
            className="flex flex-col gap-1 md:px-7 md:first:pl-0"
          >
            <CountUp
              to={it.to}
              suffix={it.suffix}
              durationMs={it.durationMs}
              className="font-mono text-3xl font-semibold tabular-nums text-white md:text-4xl"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              {it.label}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
