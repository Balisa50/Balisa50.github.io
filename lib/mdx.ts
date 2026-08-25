import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Case studies live in content/work as MDX.
 *
 * The split between this and lib/case-studies.ts is deliberate and worth
 * stating, because two files holding project writing looks like a mistake until
 * you know why:
 *
 *   lib/case-studies.ts   structured, typed, uniform across every project.
 *                         Decisions, pivots, outcomes. Rendered the same way
 *                         everywhere, so a reader can compare projects.
 *
 *   content/work/*.mdx    the deep dive. Prose, in order, with the diagram and
 *                         the live probe embedded where they belong in the
 *                         argument. Different for every project, because the
 *                         interesting thing about each one is different.
 *
 * Nothing is duplicated between them. The MDX picks one failure and writes it
 * up properly; the structured memo underneath carries the full list.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "work");

export interface CaseStudyMeta {
  slug: string;
  /** Overrides the project title on the deep-dive page. Usually the same. */
  title: string;
  /** One sentence, shown under the title and used as the page description. */
  lede: string;
  /** ISO date this write-up was last revised, not when the project shipped. */
  updated: string;
}

export interface CaseStudyFile {
  meta: CaseStudyMeta;
  source: string;
}

export function caseStudySlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

export function readCaseStudy(slug: string): CaseStudyFile | null {
  // Slugs come from generateStaticParams and from the project list, but this is
  // the function that touches the filesystem with a value from the URL, so it
  // is the one that has to refuse a path.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const parsed = matter(fs.readFileSync(file, "utf8"));
  const data = parsed.data as Partial<CaseStudyMeta>;

  if (!data.title || !data.lede) {
    throw new Error(`content/work/${slug}.mdx is missing a title or a lede in its frontmatter`);
  }

  return {
    meta: {
      slug,
      title: data.title,
      lede: data.lede,
      updated: data.updated ?? ""
    },
    source: parsed.content
  };
}

export function hasCaseStudy(slug: string): boolean {
  return readCaseStudy(slug) !== null;
}

/* ------------------------------------------------------------------ notes */

/**
 * Longer pieces that are not about one project. Currently one: the argument
 * for moving off a managed platform onto a machine I pay for.
 */
const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export interface NoteMeta extends CaseStudyMeta {
  /** Shown above the title. Keeps the notes distinguishable from case studies. */
  kind: string;
}

export function noteSlugs(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

export function readNote(slug: string): { meta: NoteMeta; source: string } | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  const file = path.join(NOTES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const parsed = matter(fs.readFileSync(file, "utf8"));
  const data = parsed.data as Partial<NoteMeta>;

  if (!data.title || !data.lede) {
    throw new Error(`content/notes/${slug}.mdx is missing a title or a lede in its frontmatter`);
  }

  return {
    meta: {
      slug,
      title: data.title,
      lede: data.lede,
      updated: data.updated ?? "",
      kind: data.kind ?? "Note"
    },
    source: parsed.content
  };
}
