"use client";

import { Layers } from "lucide-react";
import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectRow } from "./ProjectRow";

interface Category {
  id: string;
  title: string;
  blurb: string;
  slugs: string[];
}

const CATEGORIES: Category[] = [
  {
    id: "statistical",
    title: "Statistical modeling and forecasting",
    blurb:
      "Forecasts and risk models, mostly for places where the data is thin and the answer has to be checkable.",
    slugs: [
      "gambia-population-projection",
      "credit-risk-scorecard",
      "life-insurance-risk",
      "dalasi-pulse",
    ],
  },
  {
    id: "ai",
    title: "AI systems",
    blurb:
      "Retrieval, generative, and search systems, with the validation work that sits between a model and something a person can rely on.",
    slugs: ["nova", "gambia-legal-aid", "ayat", "hireiq"],
  },
  {
    id: "shipped",
    title: "Also shipped",
    blurb: "Smaller builds and client work. Each one delivered.",
    slugs: ["vantage", "forge", "bs-real-estate"],
  },
];

function pickProjects(slugs: string[]): Project[] {
  const bySlug = new Map(PROJECTS.map((p) => [p.slug, p]));
  return slugs.map((s) => bySlug.get(s)).filter((p): p is Project => Boolean(p));
}

export function ProjectsGrid() {
  const liveCount = PROJECTS.filter((p) => p.status === "live").length;
  const wipCount = PROJECTS.length - liveCount;

  let counter = 0;
  const sections = CATEGORIES.map((cat) => ({
    ...cat,
    projects: pickProjects(cat.slugs).map((project) => ({
      project,
      index: counter++,
    })),
  })).filter((s) => s.projects.length > 0);

  return (
    <section
      id="projects"
      className="relative mx-auto w-full max-w-shell px-6 sm:px-10 scroll-mt-20 py-20"
      aria-labelledby="projects-heading"
    >
      <div className="mb-16 flex flex-col items-start gap-4">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          Work
        </span>
        <h2
          id="projects-heading"
          className="display text-[clamp(2rem,4.5vw,3.25rem)]"
        >
          Three disciplines, one identity
        </h2>
        <p className="measure text-[15px] leading-relaxed text-text-secondary">
          {PROJECTS.length} projects across statistics, AI systems, and client
          delivery. {liveCount} shipped, {wipCount} in active development.
        </p>
      </div>

      {sections.map((cat) => (
        <div key={cat.id} className="mb-24 last:mb-0">
          <header className="mb-10 flex flex-col items-start gap-3">
            <h3 className="display text-[clamp(1.5rem,3vw,2rem)]">
              {cat.title}
            </h3>
            <p className="measure text-[15px] leading-relaxed text-text-secondary">
              {cat.blurb}
            </p>
          </header>
          <div>
            {cat.projects.map(({ project, index }) => (
              <ProjectRow
                key={project.slug}
                project={project}
                index={index}
                variant={project.featured ? "featured" : "compact"}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
