"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/projects";
import { useGPUTier } from "@/hooks/useGPUTier";
import { ProjectCard } from "./ProjectCard";

interface StarMap {
  [slug: string]: number | null;
}

const FALLBACK_STARS: StarMap = Object.fromEntries(
  PROJECTS.map((p) => [p.slug, p.fallbackStars])
);

export function ProjectsGrid() {
  const [stars, setStars] = useState<StarMap>(FALLBACK_STARS);
  const gpu = useGPUTier();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/github/stars", { cache: "force-cache" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          stars: Array<{ slug: string; stars: number | null }>;
        };
        if (cancelled) return;
        const map: StarMap = { ...FALLBACK_STARS };
        for (const row of data.stars) map[row.slug] = row.stars;
        setStars(map);
      } catch {
        /* fallback already in state */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="projects"
      className="relative mx-auto w-full max-w-7xl scroll-mt-20 px-6 py-24 md:py-32"
      aria-labelledby="projects-heading"
    >
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00F0FF 1px, transparent 1px), linear-gradient(to bottom, #00F0FF 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="mb-14 flex flex-col items-start gap-3 md:mb-20"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/projects
        </span>
        <h2
          id="projects-heading"
          className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight"
        >
          Things I&apos;ve built
        </h2>
        <p className="max-w-2xl text-text-secondary">
          {PROJECTS.length} projects spanning RAG, agentic pipelines, forecasting,
          and full-stack AI tooling.{" "}
          {PROJECTS.filter((p) => p.status === "live").length} shipped,{" "}
          {PROJECTS.filter((p) => p.status !== "live").length} in active development.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            stars={stars[p.slug] ?? p.fallbackStars}
            index={i}
            isMobile={gpu.isMobile}
          />
        ))}
      </div>
    </section>
  );
}
