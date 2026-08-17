"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/projects";
import { ProjectRow } from "./ProjectRow";

/**
 * Editorial / terminal-dev index of work.
 * Featured builds get full case-study rows; the rest become a compact,
 * scannable index. No cards, no grid, thin rules and mono numbering.
 */
export function ProjectsGrid() {
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);
  const liveCount = PROJECTS.filter((p) => p.status === "live").length;
  const wipCount = PROJECTS.length - liveCount;

  return (
    <section
      id="projects"
      className="relative mx-auto w-full max-w-shell px-6 sm:px-10 scroll-mt-20 py-20 md:py-20"
      aria-labelledby="projects-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="mb-4 flex flex-col items-start gap-4"
      >
        <h2
          id="projects-heading"
          className="display text-[clamp(2rem,4.5vw,3.25rem)]"
        >
          Selected work
        </h2>
        <p className="measure text-[15px] leading-relaxed text-text-secondary">
          {PROJECTS.length} projects spanning RAG, agentic pipelines, forecasting, and
          full-stack AI tooling. {liveCount} shipped, {wipCount} in active development.
        </p>
      </motion.div>

      {/* Featured, full case-study rows */}
      <div>
        {featured.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} variant="featured" />
        ))}
      </div>

      {/* The rest, compact index */}
      {rest.length > 0 && (
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-2 flex items-center gap-3"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">
              More builds
            </span>
            <span className="h-px flex-1 bg-surface" />
          </motion.div>
          <div>
            {rest.map((p, i) => (
              <ProjectRow
                key={p.slug}
                project={p}
                index={featured.length + i}
                variant="compact"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
