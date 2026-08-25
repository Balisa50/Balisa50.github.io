import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { WorkIndex } from "@/components/work/work-index";
import { PROJECTS } from "@/lib/projects";
import { caseStudySlugs } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Eleven projects, filterable by stack and by whether they are live. Each one has an architecture diagram, the decisions behind it, and the failure it taught me."
};

export default function WorkPage() {
  const live = PROJECTS.filter((p) => p.status === "live").length;

  return (
    <>
      <PageHeader
        eyebrow={`${PROJECTS.length} projects`}
        title="Everything I have built"
        lede={`${live} are live and reachable right now, the rest are in progress and say how far. Filter by stack or by status. Nothing here is a tutorial project: each one started because something in The Gambia was missing and I wanted to see whether I could build it.`}
      />

      <div className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <WorkIndex projects={PROJECTS} studySlugs={caseStudySlugs()} />
      </div>
    </>
  );
}
