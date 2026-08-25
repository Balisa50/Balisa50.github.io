import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Moved } from "@/components/site/moved";
import { PROJECTS } from "@/lib/projects";
import { caseStudySlugs } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Moved",
  robots: { index: false, follow: true }
};

export function generateStaticParams() {
  return caseStudySlugs().map((slug) => ({ slug }));
}

export default async function MovedCaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return <Moved to={`/work/${slug}`} label={project.title} />;
}
