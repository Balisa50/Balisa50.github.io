"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { ProjectRow } from "@/components/work/project-row";
import { cn } from "@/lib/utils";

/**
 * Filtering, client-side, over eleven items.
 *
 * No search index, no query parameters, no debounce. Eleven rows fit in memory
 * and the whole list is already in the bundle, so the honest implementation is
 * two pieces of state and a filter call. Anything more would be building for a
 * scale this list does not have.
 *
 * Tech labels are grouped by family before they become facets, because
 * "Next.js", "Next.js 14" and "Next.js 16" are one filter to a reader and three
 * to a string comparison.
 */

type StatusFilter = "all" | "live" | "in-progress";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "live", label: "Live" },
  { value: "in-progress", label: "In progress" }
];

function techFamily(tech: string): string {
  return tech.replace(/\s+v?\d+(\.\d+)*$/, "");
}

export function WorkIndex({
  projects,
  studySlugs
}: {
  projects: Project[];
  /** Slugs that have an MDX deep dive. The rest link straight out. */
  studySlugs: string[];
}) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [tech, setTech] = useState<string | null>(null);

  const families = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const family of new Set(project.tech.map(techFamily))) {
        counts.set(family, (counts.get(family) ?? 0) + 1);
      }
    }
    // Anything used once is not a facet, it is a detail. Those still show on
    // the row itself.
    return [...counts.entries()]
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [projects]);

  const filtered = useMemo(
    () =>
      projects.filter((project) => {
        if (status !== "all" && project.status !== status) return false;
        if (tech && !project.tech.some((t) => techFamily(t) === tech)) return false;
        return true;
      }),
    [projects, status, tech]
  );

  const studies = useMemo(() => new Set(studySlugs), [studySlugs]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-rule pb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatus(tab.value)}
            aria-pressed={status === tab.value}
            className={cn(
              "-mb-[13px] border-b pb-3 text-sm transition-colors",
              status === tab.value
                ? "border-ink text-ink"
                : "border-transparent text-text-secondary hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="label mr-1">Stack</span>
        <button
          type="button"
          onClick={() => setTech(null)}
          aria-pressed={tech === null}
          className={cn(
            "rounded-md border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.09em] transition-colors",
            tech === null
              ? "border-ink text-ink"
              : "border-rule text-text-secondary hover:border-rule-strong hover:text-ink"
          )}
        >
          Any
        </button>
        {families.map(([family, count]) => (
          <button
            key={family}
            type="button"
            onClick={() => setTech(tech === family ? null : family)}
            aria-pressed={tech === family}
            className={cn(
              "rounded-md border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.09em] transition-colors",
              tech === family
                ? "border-ink text-ink"
                : "border-rule text-text-secondary hover:border-rule-strong hover:text-ink"
            )}
          >
            {family}
            <span className="ml-1.5 text-text-faint">{count}</span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
        {filtered.length} of {projects.length} projects
        {tech ? ` using ${tech}` : ""}
        {status !== "all" ? `, ${status === "live" ? "live" : "in progress"}` : ""}
      </p>

      <div className="mt-2 border-t border-rule">
        {filtered.map((project, i) => (
          <ProjectRow
            key={project.slug}
            project={project}
            index={i}
            hasStudy={studies.has(project.slug)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-text-secondary">
          Nothing matches that combination. Clear the stack filter to see the rest.
        </p>
      )}
    </div>
  );
}
