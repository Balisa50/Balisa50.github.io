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
  // AI / LLMs
  "agentic systems",
  "RAG pipelines",
  "LLM fine-tuning",
  "prompt engineering",
  "multimodal AI",
  "embedding models",
  "vector databases",
  "AI evaluation",
  "inference pipelines",
  "AI orchestration",
  "transformer models",
  "neural networks",
  "model compression",
  "language chains",
  "tool-calling agents",
  "chain-of-thought",
  "knowledge graphs",
  "context windows",
  "structured outputs",
  "function calling",
  "retrieval systems",
  "AI safety",
  "zero-shot learning",
  "transfer learning",
  // Agents & workflows
  "multi-agent systems",
  "autonomous agents",
  "reasoning agents",
  "memory-augmented AI",
  "agent orchestration",
  "workflow automation",
  "agentic workflows",
  "event-driven systems",
  // Data science
  "data pipelines",
  "feature engineering",
  "predictive models",
  "time-series models",
  "anomaly detection",
  "causal inference",
  "data visualisation",
  "recommendation systems",
  "A/B frameworks",
  "synthetic data gen",
  "NLP pipelines",
  "gradient boosting",
  "ensemble methods",
  "SHAP values",
  "model explainability",
  "tabular ML",
  "cross-validation",
  "class imbalance",
  "dimensionality reduction",
  "signal processing",
  // Statistics
  "Bayesian inference",
  "regression models",
  "hypothesis testing",
  "stochastic models",
  "probability models",
  "statistical learning",
  "Monte Carlo sims",
  "maximum likelihood",
  "Bayesian networks",
  "survival curves",
  "panel data models",
  "GLMs",
  "mixed effects models",
  "nonparametric stats",
  "pattern recognition",
  // Actuarial science
  "survival analysis",
  "mortality models",
  "actuarial pricing",
  "risk reserving",
  "credit risk models",
  "life table analysis",
  "solvency models",
  "hazard rate models",
  "loss reserving",
  "claims modelling",
  "VaR analysis",
  "IBNR estimation",
  "reinsurance pricing",
  // Engineering
  "forecasting systems",
  "real-time analytics",
  "production ML",
  "intelligent systems",
  "API design",
  "stream processing",
  "open source",
  // Human / love
  "the craft",
  "curiosity",
  "the grind",
  "late nights",
  "doing the work",
  "systems thinking",
  "deep focus",
  "stubbornness",
  "discipline",
  "momentum",
  "learning in public",
  "problems worth solving",
  "The Gambia's future",
  "exponential growth",
  "shipping things",
];

export function Hero() {
  const gpu = useGPUTier();
  const [wordIndex, setWordIndex] = useState(0);

  const useWebGL = gpu.ready && gpu.shouldUseWebGL;

  // Cycle words regardless of reducedMotion — the CSS media query makes
  // the AnimatePresence transition instant when reduce-motion is on,
  // which IS the correct accessible behaviour.
  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background visual: WebGL particle brain (desktop only) or SVG fallback */}
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

      {/* ── Text content ──────────────────────────────────────────────────── */}
      {/* All entrance animations are pure CSS (@keyframes hero-fade-up in
          globals.css). This guarantees visibility even if JS is slow or
          Framer Motion hasn't hydrated yet — critical for mobile. */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">

        {/* Status badge */}
        <p
          className="hero-item mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
          </span>
          Available for new work · {PROFILE.location}
        </p>

        {/* Name */}
        <h1
          className="hero-item text-balance text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[1.05] tracking-tight"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="bg-gradient-to-br from-white via-white to-cyan/80 bg-clip-text text-transparent">
            {PROFILE.fullName}
          </span>
        </h1>

        {/* Title */}
        <p
          className="hero-item mt-4 font-mono text-xs uppercase tracking-[0.35em] text-cyan/90"
          style={{ animationDelay: "0.25s" }}
        >
          {PROFILE.title}
        </p>

        {/* Tagline + rotating word */}
        <div
          className="hero-item mt-5 text-pretty text-[clamp(1.05rem,2.2vw,1.35rem)] text-text-secondary"
          style={{ animationDelay: "0.35s" }}
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
              className="relative inline-block h-[1.3em] w-[22ch] overflow-hidden text-left align-bottom"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={ROTATING_WORDS[wordIndex]}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-baseline whitespace-nowrap font-semibold text-white"
                  style={{ textShadow: "0 0 28px rgba(0,240,255,0.65), 0 0 8px rgba(0,240,255,0.35)" }}
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>.</span>
          </p>
        </div>

        {/* Sub-tagline */}
        <p
          className="hero-item mt-3 max-w-xl text-sm text-text-secondary/80"
          style={{ animationDelay: "0.45s" }}
        >
          Real products, measurable results, open-source by default.
        </p>

        {/* CTA buttons */}
        <div
          className="hero-item mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.6s" }}
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
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="hero-item absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-text-secondary"
        style={{ animationDelay: "1.1s" }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/15 p-1.5"
        >
          <span className="h-2 w-1 rounded-full bg-cyan" />
        </motion.div>
      </div>
    </section>
  );
}
