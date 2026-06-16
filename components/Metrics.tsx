"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/projects";
import { TiltCard } from "./TiltCard";
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
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {items.map((it, i) => (
          <motion.li
            key={it.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
          >
            <TiltCard className="flex h-full flex-col gap-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-4 backdrop-blur-sm md:px-5 md:py-5">
              <CountUp
                to={it.to}
                suffix={it.suffix}
                durationMs={it.durationMs}
                className="font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                {it.label}
              </span>
            </TiltCard>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
