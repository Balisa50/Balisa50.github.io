/**
 * Engineering case study, generated from PROJECTS metadata + the
 * CASE_STUDIES data file. First-person, owned trade-offs.
 *
 * This is the in-portfolio view (full navigation). The clean, shareable
 * standalone version of every case study lives at /case-studies/[slug].
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
  return {
    title: `${project.title}, case study, Abdoulie Balisa`,
    description: `How and why I built ${project.title}. ${project.tagline}.`,
  };
}

export default async function CaseStudyPage({
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

  return <CaseStudyView project={project} study={study} standalone={false} />;
}
