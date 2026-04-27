"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Github, Star, X } from "lucide-react";
import type { Project } from "@/lib/projects";
import { cn, formatStarCount } from "@/lib/utils";

interface Props {
  project: Project;
  stars: number | null;
  index: number;
  isMobile: boolean;
}

const STATUS_STYLES: Record<
  Project["status"],
  { label: string; dot: string; text: string; ring: string }
> = {
  live: {
    label: "LIVE",
    dot: "bg-status-live",
    text: "text-status-live",
    ring: "ring-status-live/30"
  },
  "in-progress": {
    label: "IN PROGRESS",
    dot: "bg-status-progress",
    text: "text-status-progress",
    ring: "ring-status-progress/30"
  },
  planning: {
    label: "PLANNING",
    dot: "bg-status-planning",
    text: "text-text-secondary",
    ring: "ring-white/10"
  }
};

/**
 * Primary destination logic:
 *   - live + demo   → demo URL
 *   - everything else → github URL
 * Clicking anywhere in the card navigates there (new tab).
 */
function primaryHref(p: Project): string {
  if (p.demo) return p.demo;
  return p.github;
}

function primaryLabel(p: Project): string {
  if (p.demo) return p.status === "live" ? "Visit" : "Preview";
  return "View code";
}

export function ProjectCard({ project, stars, index, isMobile }: Props) {
  const [open, setOpen] = useState(false);
  const status = STATUS_STYLES[project.status];
  const href = primaryHref(project);
  const label = primaryLabel(project);

  // Esc closes the mobile sheet
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Mobile: card tap → open bottom sheet (lets user read full description before visiting)
  // Desktop: card click → navigate to primary URL
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't hijack clicks on explicit buttons/anchors inside the card.
    const target = e.target as HTMLElement;
    if (target.closest("a,button")) return;

    if (isMobile) {
      setOpen(true);
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isMobile) setOpen(true);
      else window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-sm transition-all duration-300",
          "hover:-translate-y-1 hover:border-cyan/40 hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
          "active:scale-[0.99]"
        )}
        onClick={handleCardClick}
        role="link"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`${project.title} · ${label}`}
      >
        {/* Accent gradient glow */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60",
            project.accent === "cyan" && "bg-cyan/30",
            project.accent === "pink" && "bg-pink/30",
            project.accent === "violet" && "bg-violet-500/30"
          )}
        />

        {/* Status + stars row */}
        <div className="relative mb-4 flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1",
              status.text,
              status.ring,
              "bg-black/40"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
            {project.progress != null && project.status !== "live" && (
              <span className="text-text-secondary">· {project.progress}%</span>
            )}
          </span>

          <span
            className="inline-flex items-center gap-1 text-xs text-text-secondary"
            title={`${stars ?? "-"} GitHub stars`}
          >
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            {formatStarCount(stars)}
          </span>
        </div>

        {/* Title + tagline */}
        <h3 className="relative flex items-start gap-1.5 text-xl font-semibold text-white">
          <span>{project.title}</span>
          <ArrowUpRight
            className="h-4 w-4 -translate-y-0.5 text-text-secondary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-1 group-hover:text-cyan group-hover:opacity-100"
            aria-hidden="true"
          />
        </h3>
        <p className="relative mt-1 text-sm text-cyan/80">{project.tagline}</p>

        {/* Description */}
        <p className="relative mt-4 text-sm leading-relaxed text-text-secondary">
          {project.description}
        </p>

        {/* Metric */}
        {project.metric && (
          <div className="relative mt-4 font-mono text-xs text-cyan">
            {"// "}
            {project.metric}
          </div>
        )}

        {/* Tech */}
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-text-secondary"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Launch label for WIP */}
        {project.launchLabel && (
          <p className="relative mt-3 text-xs text-status-progress">
            {project.launchLabel}
          </p>
        )}

        {/* Explicit links, stopPropagation so they win over card click */}
        <div className="relative mt-auto flex items-center gap-3 pt-6">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            aria-label={`${project.title} on GitHub`}
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            Code
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md bg-cyan/10 px-3 py-1.5 text-xs font-medium text-cyan transition hover:bg-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              aria-label={`${project.title} live site`}
            >
              {project.status === "live" ? "Live" : "Preview"}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
          {project.articleUrl && (
            <a
              href={project.articleUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md bg-cyan/10 px-3 py-1.5 text-xs font-medium text-cyan transition hover:bg-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              aria-label={`${project.title} article`}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Read Article
            </a>
          )}
        </div>
      </motion.article>

      {/* Mobile bottom sheet */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`sheet-${project.slug}-title`}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t border-white/10 bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/20" aria-hidden="true" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id={`sheet-${project.slug}-title`} className="text-xl font-semibold">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-cyan/80">{project.tagline}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {project.description}
            </p>

            {project.metric && (
              <p className="mt-3 font-mono text-xs text-cyan">// {project.metric}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-text-secondary"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-cyan px-4 py-2 text-sm font-medium text-background"
                >
                  {project.status === "live" ? "Visit site" : "Preview"} <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              {project.articleUrl && (
                <a
                  href={project.articleUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-cyan px-4 py-2 text-sm font-medium text-background"
                >
                  <BookOpen className="h-4 w-4" /> Read Article
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
