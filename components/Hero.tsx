"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { useGPUTier } from "@/hooks/useGPUTier";
import { PROFILE } from "@/lib/projects";
import { StaticBrainSVG } from "./StaticBrainSVG";
import { ErrorBoundary } from "./ErrorBoundary";

const HeroParticles = dynamic(
  () => import("./HeroParticles").then((m) => m.HeroParticles),
  { ssr: false, loading: () => null }
);

const ROTATING_WORDS = [
  "agentic systems",
  "RAG pipelines",
  "forecasting models",
  "AI tooling",
  "production ML"
];

export function Hero() {
  const gpu = useGPUTier();
  const [wordIndex, setWordIndex] = useState(0);

  // Pre-mount: show static SVG (matches worst-case fallback). Once the
  // detector reports back, we mount WebGL or keep the SVG.
  const useWebGL = gpu.ready && gpu.shouldUseWebGL;

  useEffect(() => {
    if (gpu.reducedMotion) return;
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, [gpu.reducedMotion]);

  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background visual: WebGL particle brain or SVG fallback */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {useWebGL ? (
          <ErrorBoundary
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-[min(80vmin,640px)] w-[min(80vmin,640px)] opacity-70">
                  <StaticBrainSVG reducedMotion={gpu.reducedMotion} />
                </div>
              </div>
            }
          >
            <HeroParticles />
          </ErrorBoundary>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[min(80vmin,640px)] w-[min(80vmin,640px)] opacity-80">
              <StaticBrainSVG reducedMotion={gpu.reducedMotion} />
            </div>
          </div>
        )}

        {/* Vignette for text contrast */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.4)_60%,rgba(5,5,5,0.85)_100%)]"
          aria-hidden="true"
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm"
        >
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
          </span>
          Available for new work · {PROFILE.location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[1.05] tracking-tight"
        >
          <span className="bg-gradient-to-br from-white via-white to-cyan/80 bg-clip-text text-transparent">
            {PROFILE.fullName}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-cyan/90"
        >
          {PROFILE.title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-5 text-pretty text-[clamp(1.05rem,2.2vw,1.35rem)] text-text-secondary"
        >
          <p className="flex flex-wrap items-baseline justify-center gap-x-2">
            <span>I build</span>
            <span className="font-medium text-cyan">intelligent systems</span>
            <span>that ship.</span>
          </p>
          <p className="mt-2 flex items-baseline justify-center gap-x-2 text-sm text-text-secondary/80">
            <span>Currently working on</span>
            <span
              aria-live="polite"
              className="relative inline-block h-[1.3em] w-[19ch] overflow-hidden text-left align-bottom"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={ROTATING_WORDS[wordIndex]}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-baseline whitespace-nowrap font-medium text-cyan"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>.</span>
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-3 max-w-xl text-sm text-text-secondary/80"
        >
          Real products, measurable results, open-source by default.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-medium text-background shadow-glow-cyan transition hover:shadow-glow-cyan-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            See the work
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="LinkedIn profile"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href={`mailto:${PROFILE.email}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email
          </a>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-text-secondary"
        aria-hidden="true"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-cyan"
          />
        </div>
      </motion.div>
    </section>
  );
}
