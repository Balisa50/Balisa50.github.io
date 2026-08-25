"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { STACK_LAYERS, DEPTH_LABEL, DEPTH_NOTE, type StackTool } from "@/lib/stack";
import { cn } from "@/lib/utils";

/**
 * The stack, explorable in two directions.
 *
 * Pick a tool and it tells you what it does here and which projects it is in.
 * Pick a project and everything it does not touch drops back, which is the
 * question a reader actually has: not "does he know Postgres" but "where has he
 * used it and what for".
 *
 * The claim attached to each tool is the point. A list of names is worth
 * nothing, and the three depth levels are there so "still learning it" can be
 * said out loud instead of hidden among things I use every day.
 */
export function StackExplorer({ projects }: { projects: { slug: string; title: string }[] }) {
  const [selected, setSelected] = useState<string>(STACK_LAYERS[0].nodes[0].id);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  const byId = useMemo(() => {
    const map = new Map<string, StackTool>();
    for (const layer of STACK_LAYERS) for (const node of layer.nodes) map.set(node.id, node);
    return map;
  }, []);

  const tool = byId.get(selected);
  const dimmed = (t: StackTool) => projectFilter !== null && !t.projects.includes(projectFilter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-rule pb-5">
        <span className="label mr-1">Highlight a project</span>
        <button
          type="button"
          onClick={() => setProjectFilter(null)}
          aria-pressed={projectFilter === null}
          className={cn(
            "rounded-md border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.09em] transition-colors",
            projectFilter === null
              ? "border-ink text-ink"
              : "border-rule text-text-secondary hover:border-rule-strong hover:text-ink"
          )}
        >
          None
        </button>
        {projects.map((project) => (
          <button
            key={project.slug}
            type="button"
            onClick={() => setProjectFilter(projectFilter === project.slug ? null : project.slug)}
            aria-pressed={projectFilter === project.slug}
            className={cn(
              "rounded-md border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.09em] transition-colors",
              projectFilter === project.slug
                ? "border-ink text-ink"
                : "border-rule text-text-secondary hover:border-rule-strong hover:text-ink"
            )}
          >
            {project.title}
          </button>
        ))}
      </div>

      <div className="grid gap-10 pt-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          {STACK_LAYERS.map((layer) => (
            <section key={layer.id} className="mb-9 last:mb-0">
              <h3 className="label">{layer.name}</h3>
              <ul className="mt-3 border-t border-rule">
                {layer.nodes.map((node) => {
                  const active = node.id === selected;
                  return (
                    <li key={node.id} className="border-b border-rule">
                      <button
                        type="button"
                        onClick={() => setSelected(node.id)}
                        aria-pressed={active}
                        className={cn(
                          "flex w-full items-baseline justify-between gap-4 py-3 text-left transition-opacity",
                          dimmed(node) ? "opacity-35" : "opacity-100"
                        )}
                      >
                        <span
                          className={cn(
                            "text-[0.9375rem] transition-colors",
                            active ? "text-accent" : "text-ink"
                          )}
                        >
                          {node.label}
                        </span>
                        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
                          {node.projects.length > 0
                            ? `${node.projects.length} project${node.projects.length === 1 ? "" : "s"}`
                            : "this site"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="lg:col-span-5">
          {tool && (
            <div className="sticky top-24 border-t border-ink pt-5">
              <p className="label">{DEPTH_LABEL[tool.depth]}</p>
              <h3 className="display mt-2 text-2xl">{tool.label}</h3>
              <p className="mt-1 text-sm text-text-faint">{DEPTH_NOTE[tool.depth]}</p>

              <p className="mt-5 text-[0.9375rem] leading-relaxed text-text">{tool.role}</p>

              <p className="label mt-7">
                {tool.projects.length > 0 ? "Used in" : "Where it appears"}
              </p>
              {tool.projects.length > 0 ? (
                <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
                  {tool.projects.map((slug) => {
                    const project = projects.find((p) => p.slug === slug);
                    if (!project) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/work/${slug}`} className="link-underline text-sm text-text-secondary">
                          {project.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-2.5 text-sm text-text-secondary">
                  Not in a project yet. It is what this site itself deploys on, which is why it is
                  listed here rather than left off.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
