"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/projects";

/**
 * Honest metrics only. No fabricated numbers, no stars card (so we never
 * display "0" or invite "is that real?" questions).
 */
export function Metrics() {
  const shipped = PROJECTS.filter((p) => p.status === "live").length;
  const inDev = PROJECTS.filter((p) => p.status !== "live").length;

  const items: { value: string; label: string }[] = [
    { value: String(shipped), label: "Shipped" },
    { value: String(inDev), label: "In development" },
    { value: "2024", label: "Shipping since" },
    { value: "100%", label: "Open source" }
  ];

  return (
    <section
      aria-label="Live metrics"
      className="relative mx-auto w-full max-w-7xl px-6 pb-6 pt-2"
    >
      <motion.ul
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm md:grid-cols-4 md:gap-6 md:p-6"
      >
        {items.map((it, i) => (
          <motion.li
            key={it.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: 0.08 * i }}
            className="flex flex-col gap-1 border-white/10 px-2 md:px-4 md:[&:not(:last-child)]:border-r"
          >
            <span className="font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl">
              {it.value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
              {it.label}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
