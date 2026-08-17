"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, FileText, Github, Lock } from "lucide-react";
import type { Project } from "@/lib/projects";
import { CASE_STUDIES } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

/**
 * A project, as a row on the editorial grid.
 *
 * Rewritten for the light layout. What came out: a radial "holographic" sheen
 * that tracked the cursor, an index number that glitched on a random timer, a
 * per-project accent colour, and hover bars. What went in: the project's own
 * figure, and one grid shared with every other section on the page.
 *
 * Featured rows alternate the figure left and right down the page. That is the
 * "fold" rhythm: each entry reads as its own composition rather than as another
 * paragraph in a stack, and it costs nothing but an :nth-child rule.
 */


/**
 * First couple of sentences, for the homepage.
 *
 * The full `description` runs 900+ characters on the lead projects. That is the
 * right length for the case study and the wrong length for a row a reader is
 * scanning: it turned the page into a wall of text and buried the next project.
 * The whole description is still one keystroke away on the case-study page, so
 * nothing is lost by leading with the claim and letting the reader opt in.
 */
function lead(text: string, maxChars = 320): string {
  if (text.length <= maxChars) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) ?? [text];
  let out = "";
  for (const sentence of sentences) {
    if (out && (out + sentence).length > maxChars) break;
    out += sentence;
  }
  return (out || text.slice(0, maxChars)).trim();
}

/** Per-project case-study URL, or null when there is no distinct page. */
function caseStudyHref(p: Project): string | null {
  if (CASE_STUDIES[p.slug]) return `/case-studies/${p.slug}/`;
  return null;
}

/** Where the title links to: live demo > repo > article. A private repo is
 *  skipped, since sending a reader to a 404 is worse than not linking. */
function primaryHref(p: Project): string {
  if (p.demo) return p.demo;
  if (p.github && !p.codePrivate) return p.github;
  if (p.articleUrl) return p.articleUrl;
  return "#";
}

const STATUS_STYLES: Record<
  Project["status"],
  { label: string; dot: string; text: string }
> = {
  live: { label: "Live", dot: "bg-status-live", text: "text-status-live" },
  "in-progress": {
    label: "In progress",
    dot: "bg-status-progress",
    text: "text-status-progress"
  },
  planning: { label: "Planning", dot: "bg-status-planning", text: "text-text-secondary" }
};

interface Props {
  project: Project;
  index: number;
  variant: "featured" | "compact";
}

function StatusTag({ project }: { project: Project }) {
  const s = STATUS_STYLES[project.status];
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      <span className={s.text}>{s.label}</span>
      {project.progress != null && project.status !== "live" && (
        <span className="text-text-secondary">· {project.progress}%</span>
      )}
    </span>
  );
}

function Links({ project }: { project: Project }) {
  const cs = caseStudyHref(project);
  const linkClass =
    "inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:text-accent";
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noreferrer noopener" className={linkClass}>
          {project.status === "live" ? "Live" : "Preview"}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
      {project.github && !project.codePrivate && (
        <a href={project.github} target="_blank" rel="noreferrer noopener" className={linkClass}>
          <Github className="h-3.5 w-3.5" aria-hidden="true" />
          Code
        </a>
      )}
      {project.codePrivate && (
        <span className={`${linkClass} cursor-default opacity-70`}>
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Code private
        </span>
      )}
      {project.articleUrl && (
        <a href={project.articleUrl} target="_blank" rel="noreferrer noopener" className={linkClass}>
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          Article
        </a>
      )}
      {cs && (
        <Link href={cs} className={linkClass}>
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          Case study
        </Link>
      )}
    </div>
  );
}

function TechTags({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1">
      {tech.map((t) => (
        <li key={t} className="font-mono text-[11px] text-text-faint">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function ProjectRow({ project, index, variant }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const href = primaryHref(project);

  /* -------------------------------------------------- Featured */
  if (variant === "featured") {
    // Odd entries put the figure on the left. Purely positional, so adding or
    // reordering a project keeps the alternation without touching data.
    const figureFirst = index % 2 === 1;

    return (
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="group border-t border-rule py-14 first:border-t-0 md:py-20"
      >
        <div className="grid grid-cols-1 items-start gap-x-10 gap-y-8 lg:grid-cols-12">
          {/* Figure */}
          {project.figure && (
            <div
              className={cn(
                "col-span-12 lg:col-span-6",
                figureFirst ? "lg:order-1" : "lg:order-2"
              )}
            >
              <div className="figure">
                <Image
                  src={project.figure.src}
                  alt={project.figure.alt}
                  width={1200}
                  height={750}
                  className="h-auto w-full"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-text-faint">
                {project.figure.alt}
              </p>
            </div>
          )}

          {/* Text */}
          <div
            className={cn(
              "col-span-12 min-w-0",
              project.figure ? "lg:col-span-6" : "lg:col-span-8",
              project.figure && (figureFirst ? "lg:order-2" : "lg:order-1")
            )}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="numeral text-[13px] text-text-faint">{num}</span>
              <StatusTag project={project} />
            </div>

            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-visible:outline-none"
              aria-label={`${project.title}, open`}
            >
              <h3 className="display mt-4 flex items-start gap-2 text-[clamp(1.75rem,3vw,2.5rem)] transition-colors group-hover:text-accent">
                <span>{project.title}</span>
                <ArrowUpRight
                  className="mt-2 h-5 w-5 shrink-0 -translate-x-1 text-text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </h3>
            </a>

            <p className="mt-3 text-[15px] italic leading-relaxed text-text-secondary">
              {project.tagline}
            </p>

            <p className="mt-5 text-[15px] leading-[1.75] text-text">
              {lead(project.description)}
            </p>

            {project.metric && (
              <p className="mt-5 border-l-2 border-accent pl-4 text-[13px] leading-relaxed text-text-secondary">
                {project.metric}
              </p>
            )}

            {project.launchLabel && (
              <p className="mt-2 font-mono text-xs text-status-progress">
                {project.launchLabel}
              </p>
            )}

            <div className="mt-6">
              <TechTags tech={project.tech} />
            </div>

            <div className="mt-5">
              <Links project={project} />
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  /* --------------------------------------------------- Compact */
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group border-t border-rule py-7"
    >
      <div className="grid grid-cols-1 items-baseline gap-x-6 gap-y-3 sm:grid-cols-12">
        <span className="numeral col-span-2 text-[13px] text-text-faint sm:col-span-1">
          {num}
        </span>

        <div className="col-span-10 min-w-0 sm:col-span-7">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-visible:outline-none"
              aria-label={`${project.title}, open`}
            >
              <h3 className="inline-flex items-center gap-1.5 text-[17px] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                {project.title}
                <ArrowUpRight
                  className="h-3.5 w-3.5 -translate-x-1 text-text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </h3>
            </a>
            <StatusTag project={project} />
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
            {project.tagline}
          </p>
          <div className="mt-3">
            <TechTags tech={project.tech} />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-4 sm:justify-self-end">
          <Links project={project} />
        </div>
      </div>
    </motion.article>
  );
}
