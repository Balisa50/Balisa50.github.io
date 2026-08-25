import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/projects";
import { caseStudySlugs, readCaseStudy } from "@/lib/mdx";
import { getMetrics } from "@/lib/metrics";
import { mdxComponents } from "@/components/mdx";
import { EngineeringMemo } from "@/components/mdx/engineering-memo";
import { StatusDot } from "@/components/ui/badge";

/**
 * The deep dive.
 *
 * Statically generated for every MDX file in content/work, and revalidated on
 * the hour so the live check near the bottom is a measurement rather than a
 * fossil. On the static export build there is no revalidation, and the check
 * falls back to the committed snapshot with its date shown.
 */
export const revalidate = 3600;

export function generateStaticParams() {
  return caseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const file = readCaseStudy(slug);
  if (!file) return {};
  return {
    title: file.meta.title,
    description: file.meta.lede,
    openGraph: {
      title: file.meta.title,
      description: file.meta.lede,
      images: [{ url: `/diagrams/${slug}.svg` }]
    }
  };
}

const STATUS_LABEL = {
  live: "Live",
  "in-progress": "In progress",
  planning: "Planned"
} as const;

const STATUS_TONE = {
  live: "live",
  "in-progress": "progress",
  planning: "planning"
} as const;

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const file = readCaseStudy(slug);
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!file || !project) notFound();

  const metrics = await getMetrics();
  const { content } = await compileMDX({
    source: file.source,
    components: mdxComponents({ slug, metrics })
  });

  // Neighbours for the bottom rail, in the order the work page lists them.
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const studies = new Set(caseStudySlugs());
  const neighbours = [PROJECTS[index - 1], PROJECTS[index + 1]].map((p) =>
    p && studies.has(p.slug) ? p : undefined
  );

  return (
    <>
      <header className="border-b border-rule pb-10 pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-shell px-6 sm:px-10">
          <Link
            href="/work"
            className="mb-6 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.11em] text-text-secondary transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            All work
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="label">Case study</p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
              <StatusDot tone={STATUS_TONE[project.status]} />
              {STATUS_LABEL[project.status]}
              {project.progress != null && project.status !== "live" ? ` ${project.progress}%` : ""}
            </span>
          </div>

          <h1 className="display mt-3 text-[clamp(2rem,1.3rem+2.8vw,3.1rem)]">{file.meta.title}</h1>
          <p className="measure mt-5 text-[1.0625rem] leading-relaxed text-text-secondary">
            {file.meta.lede}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {project.demo && (
              <a
                href={project.demo}
                className="inline-flex items-center gap-1 text-ink transition-colors hover:text-accent"
              >
                Open it
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
                Repository private
              </span>
            )}
            {project.articleUrl && (
              <Link href="/research/gambia-2074" className="link-underline text-text-secondary">
                Read the write-up
              </Link>
            )}
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <article className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="prose-note">{content}</div>

        <EngineeringMemo slug={slug} />

        {file.meta.updated && (
          <p className="mt-16 border-t border-rule pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
            Write-up last revised {file.meta.updated}
          </p>
        )}
      </article>

      <nav aria-label="Other projects" className="border-t border-rule">
        <div className="mx-auto grid w-full max-w-shell gap-6 px-6 py-10 sm:grid-cols-2 sm:px-10">
          {neighbours[0] ? (
            <Link href={`/work/${neighbours[0].slug}`} className="group">
              <span className="label inline-flex items-center gap-1.5">
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                Previous
              </span>
              <p className="display mt-2 text-xl transition-colors group-hover:text-accent">
                {neighbours[0].title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {neighbours[1] && (
            <Link href={`/work/${neighbours[1].slug}`} className="group sm:text-right">
              <span className="label inline-flex items-center gap-1.5">
                Next
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
              <p className="display mt-2 text-xl transition-colors group-hover:text-accent">
                {neighbours[1].title}
              </p>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
