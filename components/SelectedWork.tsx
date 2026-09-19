import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/projects";
import { ProjectRow } from "./ProjectRow";

// Homepage was just a hero and a counter. This puts three projects on it
// so the work is visible without a click through to /work first.
export function SelectedWork() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);

  return (
    <section
      aria-labelledby="selected-work-heading"
      className="mx-auto w-full max-w-shell px-6 sm:px-10 py-20 border-t border-border"
    >
      <div className="mb-4 flex flex-col items-start gap-4">
        <p className="label">Selected work</p>
        <h2
          id="selected-work-heading"
          className="display text-[clamp(2rem,4.5vw,3.25rem)]"
        >
          Three projects, in full
        </h2>
        <p className="measure text-[15px] leading-relaxed text-text-secondary">
          Independent research, a synthetic-data engine written from scratch,
          and a retrieval system that refuses to invent law. Each row links to
          the live product, the code where it is public, and the case study.
        </p>
      </div>

      <div>
        {featured.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} variant="featured" />
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-x-7 gap-y-3">
        <Link
          href="/work"
          className="group inline-flex min-h-11 items-center gap-2 font-medium text-ink link-underline"
        >
          See all {PROJECTS.length} projects
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/case-studies"
          className="inline-flex min-h-11 items-center gap-2 text-text-secondary transition-colors hover:text-ink"
        >
          Read the case studies
        </Link>
      </div>
    </section>
  );
}