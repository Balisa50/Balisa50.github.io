/**
 * Standalone, shareable case study at /case-studies/[slug].
 *
 * Identical content to /projects/[slug], but rendered with no portfolio
 * chrome: no "Back to work", no live/repo buttons, no bottom nav: so the
 * link is a clean artifact to send to professors, recruiters, and committees.
 * It is a separate static route, not a query-param toggle.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";
import { CaseStudyView } from "@/components/CaseStudyView";

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Case study not found" };
  const title = `${project.title}: Case study`;
  const description = `${project.tagline}.`;
  return {
    title,
    description,
    openGraph: {
      type: "article",
      url: `/case-studies/${slug}`,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function StandaloneCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  const study = getCaseStudy(slug);

  if (!project || !study) {
    notFound();
  }

  return <CaseStudyView project={project} study={study} standalone={true} />;
}
