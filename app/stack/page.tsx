import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { Diagram, DiagramLegend } from "@/components/diagram";
import { StackExplorer } from "@/components/stack-explorer";
import { STACK_TOOLS, DEPTH_LABEL, DEPTH_NOTE, type Depth } from "@/lib/stack";
import { PROJECTS } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Stack",
  description:
    "Every tool with one sentence on why it is there and which projects it appears in, arranged by where it runs. Including the three I am still learning."
};

const ORDER: Depth[] = ["daily", "working", "learning"];

export default function StackPage() {
  const counts = ORDER.map((depth) => ({
    depth,
    count: STACK_TOOLS.filter((t) => t.depth === depth).length
  }));

  const projects = PROJECTS.map((p) => ({ slug: p.slug, title: p.title }));

  return (
    <>
      <PageHeader
        eyebrow={`${STACK_TOOLS.length} tools`}
        title="What I use, and where it runs"
        lede="A list of logos proves nothing, so every tool here carries one sentence about the job it does in a real project and a link to that project. The three levels are honest: some of this I reach for without thinking, some I have shipped with once, and some I am learning right now because this site deploys on it."
      />

      <section className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <h2 className="label">The shape of it</h2>
        <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-text-secondary">
          Read left to right. A request enters at the interface, and the cost of answering it goes
          up with every column it has to cross. Most of the work in these projects is deciding how
          far right a request has to travel.
        </p>
        <div className="mt-6">
          <Diagram slug="stack" />
          <DiagramLegend />
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 pb-8 sm:px-10">
        <dl className="grid gap-6 border-y border-rule py-7 sm:grid-cols-3">
          {counts.map(({ depth, count }) => (
            <div key={depth}>
              <dt className="label">
                {DEPTH_LABEL[depth]} · {count}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-text-secondary">{DEPTH_NOTE[depth]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 pb-20 sm:px-10">
        <StackExplorer projects={projects} />
      </section>
    </>
  );
}
