import stack from "@/data/stack.json";
import { PROJECTS } from "@/lib/projects";

/**
 * The stack explorer and the stack diagram read the same file.
 *
 * That is deliberate: a tech list on a portfolio is usually a wall of logos
 * with no claim attached, and the moment the diagram and the list live in
 * separate places they start disagreeing about what is actually used. Here a
 * tool exists once, in data/stack.json, with the projects it appears in and one
 * sentence about why it is there rather than something else.
 */

export type Depth = "daily" | "working" | "learning";

export interface StackTool {
  id: string;
  label: string;
  kind: string;
  depth: Depth;
  role: string;
  projects: string[];
}

export interface StackLayer {
  id: string;
  name: string;
  nodes: StackTool[];
}

export const STACK_LAYERS = (stack.layers as unknown as StackLayer[]).map((layer) => ({
  ...layer,
  nodes: layer.nodes.map((node) => ({ ...node, depth: node.depth as Depth }))
}));

export const STACK_TOOLS: StackTool[] = STACK_LAYERS.flatMap((l) => l.nodes);

export const DEPTH_LABEL: Record<Depth, string> = {
  daily: "Use it constantly",
  working: "Shipped with it",
  learning: "Still learning it"
};

/**
 * Written out rather than inferred, because the difference between these three
 * is the only part of a stack list a reader should trust.
 */
export const DEPTH_NOTE: Record<Depth, string> = {
  daily: "Reach for it without thinking, and can explain the parts that bite.",
  working: "Shipped something real with it and hit its edges at least once.",
  learning: "In progress. Listed because it is what this site deploys on, not because I have mastered it."
};

const PROJECT_TITLES = new Map(PROJECTS.map((p) => [p.slug, p.title]));

/**
 * Fails loudly at build time rather than rendering a link to nothing. The stack
 * file is hand-edited and a typo in a slug is otherwise invisible until someone
 * clicks it.
 */
export function projectTitle(slug: string): string {
  const title = PROJECT_TITLES.get(slug);
  if (!title) throw new Error(`data/stack.json references unknown project slug "${slug}"`);
  return title;
}

export function toolsForProject(slug: string): StackTool[] {
  return STACK_TOOLS.filter((t) => t.projects.includes(slug));
}
