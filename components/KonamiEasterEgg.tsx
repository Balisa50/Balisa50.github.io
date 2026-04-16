"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import { useEffect } from "react";
import { useKonami } from "@/hooks/useKonami";

const ROADMAP = [
  {
    title: "FORGE v2",
    status: "Q3 2026",
    note: "Multi-agent code review, Rust-native WASM runtime, 30ms inference target."
  },
  {
    title: "Legal Aid Enterprise",
    status: "Q2 2026",
    note: "Team workspaces, redaction pipeline, SOC-2 readiness, Gambia + UK law packs."
  },
  {
    title: "Dalasi API",
    status: "Q4 2026",
    note: "Public fraud-signal endpoint + embeddable widget for Gambian fintechs."
  }
];

export function KonamiEasterEgg() {
  const [triggered, reset] = useKonami();

  useEffect(() => {
    if (!triggered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") reset();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [triggered, reset]);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="konami-title"
          onClick={reset}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-cyan/40 bg-surface p-7 shadow-glow-cyan-lg"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-cyan/30 blur-3xl"
            />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
                  secret roadmap
                </span>
              </div>
              <button
                onClick={reset}
                aria-label="Close roadmap"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2 id="konami-title" className="mt-3 text-2xl font-semibold">
              You found it.
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Here&apos;s what&apos;s cooking after the current slate ships.
            </p>

            <ul className="mt-6 space-y-4">
              {ROADMAP.map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-black/40 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-text-secondary">{item.note}</p>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
              esc to close · ↑↑↓↓←→←→ b a
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
