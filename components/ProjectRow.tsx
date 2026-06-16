"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, FileText, Github } from "lucide-react";
import type { Project } from "@/lib/projects";
import { CASE_STUDIES } from "@/lib/case-studies";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------- */
/*  Link resolution (shared with the old card, kept self-contained)  */
/* ----------------------------------------------------------------- */

/** Per-project case-study URL, or null when there is no distinct page. */
function caseStudyHref(p: Project): string | null {
  let href: string | null = null;
  if (p.slug === "gambia-health-dashboard") href = "/projects/gambia";
  else if (CASE_STUDIES[p.slug]) href = `/projects/${p.slug}`;
  if (!href) return null;
  if (p.demo === href) return null;
  return href;
}

/** Where the title links to: live demo > repo > article. */
function primaryHref(p: Project): string {
  if (p.demo) return p.demo;
  if (p.github) return p.github;
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

const ACCENT_TEXT: Record<Project["accent"], string> = {
  cyan: "group-hover:text-cyan",
  pink: "group-hover:text-pink",
  violet: "group-hover:text-violet-400"
};

const ACCENT_BAR: Record<Project["accent"], string> = {
  cyan: "bg-cyan",
  pink: "bg-pink",
  violet: "bg-violet-400"
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
    "inline-flex items-center gap-1 font-mono text-xs text-text-secondary transition-colors hover:text-cyan focus-visible:outline-none focus-visible:text-cyan";
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noreferrer noopener" className={linkClass}>
          {project.status === "live" ? "Live" : "Preview"}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer noopener" className={linkClass}>
          <Github className="h-3.5 w-3.5" aria-hidden="true" />
          Code
        </a>
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
    <div className="flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <span
          key={t}
          className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-text-secondary"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export function ProjectRow({ project, index, variant }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const href = primaryHref(project);

  /* -------------------------------------------------- Featured */
  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="group relative border-t border-white/10 py-10 md:py-14"
      >
        {/* hover accent bar */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-0 h-0 w-[2px] transition-all duration-500 group-hover:h-full",
            ACCENT_BAR[project.accent]
          )}
        />

        <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-[auto_1fr]">
          {/* index */}
          <div className="flex items-baseline gap-4 md:block">
            <span className="font-mono text-3xl font-semibold text-white/15 md:text-5xl">
              {num}
            </span>
          </div>

          {/* body */}
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <StatusTag project={project} />
            </div>

            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-visible:outline-none"
              aria-label={`${project.title} — open`}
            >
              <h3
                className={cn(
                  "flex items-start gap-2 text-3xl font-semibold leading-tight tracking-tight text-white transition-colors md:text-[2.75rem]",
                  ACCENT_TEXT[project.accent]
                )}
              >
                <span>{project.title}</span>
                <ArrowUpRight
                  className="mt-1 h-6 w-6 shrink-0 -translate-x-1 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </h3>
            </a>

            <p className="mt-2 text-base text-cyan/80">{project.tagline}</p>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
              {project.description}
            </p>

            {project.metric && (
              <p className="mt-5 font-mono text-xs text-cyan">{"// "}{project.metric}</p>
            )}

            {project.launchLabel && (
              <p className="mt-2 font-mono text-xs text-status-progress">{project.launchLabel}</p>
            )}

            <div className="mt-6">
              <TechTags tech={project.tech} />
            </div>

            <div className="mt-6">
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-t border-white/10 py-6"
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-0 h-0 w-[2px] transition-all duration-500 group-hover:h-full",
          ACCENT_BAR[project.accent]
        )}
      />
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-[auto_1fr_auto] md:items-baseline">
        <span className="font-mono text-sm text-white/20">{num}</span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="focus-visible:outline-none"
              aria-label={`${project.title} — open`}
            >
              <h3
                className={cn(
                  "inline-flex items-center gap-1.5 text-lg font-semibold tracking-tight text-white transition-colors",
                  ACCENT_TEXT[project.accent]
                )}
              >
                {project.title}
                <ArrowUpRight
                  className="h-3.5 w-3.5 -translate-x-1 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </h3>
            </a>
            <StatusTag project={project} />
          </div>
          <p className="mt-1 text-sm text-text-secondary">{project.tagline}</p>
          <div className="mt-3 md:hidden">
            <TechTags tech={project.tech} />
          </div>
        </div>

        <div className="md:text-right">
          <Links project={project} />
        </div>
      </div>
    </motion.article>
  );
}
