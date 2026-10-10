"use client";

import { PROJECTS, type Project } from "@/lib/projects";
import { ProjectRow } from "./ProjectRow";

interface Category {
  id: string;
  title: string;
  blurb: string;
  slugs: string[];
}

/**
 * Work grouped by discipline, not by status or date.
 *
 * A statistics recruiter should be able to read the first section and answer
 * "can this person do the job" without scrolling into the AI work. An ML
 * recruiter should be able to skip to section two and get the same signal.
 * The grouping tells each reader which part of the page is for them.
 *
 * Order is deliberate. Statistical work first, because that is the identity.
 * AI second, as systems built on top of that foundation. Client work last,
 * as evidence of range rather than a headline.
 */
const CATEGORIES: Category[] = [
  {
    id: "statistical",
    title: "Statistical modeling and forecasting",
    blurb:
      "Bayesian and classical methods applied to problems where the data is thin and the answer has to be checkable.",
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
      "Models built from scratch, then wrapped in the validation layer that tells you whether they can be trusted.",
    slugs: ["nova", "gambia-legal-aid", "ayat", "hireiq"],
  },
  {
    id: "shipped",
    title: "Also shipped",
    blurb:
      "Smaller builds and client work. Real, delivered, and worth a sentence each.",
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

  // Number rows 01, 02, 03 continuously across all three sections so "the
  // fifth project" means one thing. Compute numbering before render so the
  // map callback stays pure.
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
        <h2
          id="projects-heading"
          className="display text-[clamp(2rem,4.5vw,3.25rem)]"
        >
          Work
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
