import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { StatusDot } from "@/components/ui/badge";

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "Live",
  "in-progress": "In progress",
  planning: "Planned"
};

const STATUS_TONE: Record<Project["status"], "live" | "progress" | "planning"> = {
  live: "live",
  "in-progress": "progress",
  planning: "planning"
};

/**
 * A row, not a card.
 *
 * Cards give every project the same weight and the same box, which is fine for
 * a catalogue and wrong for a portfolio where four of these matter more than
 * the rest. Rows separated by a hairline let the eye run down the titles and
 * stop at the one it wants, and the featured variant gets the figure without
 * needing a different component.
 */
export function ProjectRow({
  project,
  index,
  featured = false,
  hasStudy = true
}: {
  project: Project;
  index: number;
  featured?: boolean;
  hasStudy?: boolean;
}) {
  const href = hasStudy ? `/work/${project.slug}` : project.demo ?? project.github ?? "/work";

  return (
    <article className="group border-b border-rule py-9 first:border-t-0">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-1">
          <span className="numeral text-xs text-text-faint">{String(index + 1).padStart(2, "0")}</span>
        </div>

        <div className={featured && project.figure ? "md:col-span-6" : "md:col-span-8"}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="display text-[1.6rem] leading-tight">
              <Link href={href} className="transition-colors hover:text-accent">
                {project.title}
              </Link>
            </h3>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
              <StatusDot tone={STATUS_TONE[project.status]} />
              {STATUS_LABEL[project.status]}
              {project.progress != null && project.status !== "live" ? ` ${project.progress}%` : ""}
            </span>
          </div>

          <p className="mt-2 text-[0.9375rem] text-text-secondary">{project.tagline}</p>

          {project.metric && (
            <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink">{project.metric}</p>
          )}

          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
            {project.tech.map((tech) => (
              <li key={tech} className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {hasStudy && (
              <Link href={`/work/${project.slug}`} className="link-underline text-ink">
                Read the case study
              </Link>
            )}
            {project.demo && (
              <a
                href={project.demo}
                className="inline-flex items-center gap-1 text-text-secondary transition-colors hover:text-ink"
              >
                Live site
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {project.github && !project.codePrivate && (
              <a
                href={project.github}
                className="inline-flex items-center gap-1 text-text-secondary transition-colors hover:text-ink"
              >
                Code
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {project.codePrivate && (
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
                Repo private
              </span>
            )}
          </div>
        </div>

        {featured && project.figure && (
          <div className="md:col-span-5">
            <figure className="figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.figure.src} alt={project.figure.alt} loading="lazy" />
            </figure>
          </div>
        )}
      </div>
    </article>
  );
}
