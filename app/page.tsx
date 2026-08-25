import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { ProjectRow } from "@/components/work/project-row";
import { PROJECTS } from "@/lib/projects";
import { caseStudySlugs } from "@/lib/mdx";

/**
 * Home is the ring and four projects. Nothing else.
 *
 * The single-page version put the whole CV here: metrics, skills, about,
 * experience, education, certifications, contact, one after another. Each of
 * those now has a page. The cost is one extra click; the saving is that a
 * visitor no longer scrolls past the work to reach the work.
 *
 * Contact is gone from this page on purpose. A phone number on the front page
 * asks for something before the work has earned it.
 */
export default function HomePage() {
  const featured = PROJECTS.filter((p) => p.featured);
  const studies = new Set(caseStudySlugs());

  return (
    <>
      <Hero />

      <section className="mx-auto w-full max-w-shell px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink pb-4">
          <h2 className="display text-[clamp(1.6rem,1.2rem+1.6vw,2.2rem)]">Start here</h2>
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-ink"
          >
            All {PROJECTS.length} projects
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <p className="measure mt-6 text-[1.0625rem] leading-relaxed text-text-secondary">
          Four of the eleven, chosen because in each one the interesting part is not that it works.
          A population projection that disagrees with the UN by 0.7 million and shows why. A data
          generator whose privacy metric I had to throw out twice. A legal chatbot that refuses.
          A credit scorecard validated on a later vintage rather than a random split.
        </p>

        <div className="mt-10 border-t border-rule">
          {featured.map((project, i) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={i}
              featured
              hasStudy={studies.has(project.slug)}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto grid w-full max-w-shell gap-8 px-6 py-16 sm:px-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">This site is one of the projects</h2>
          </div>
          <div className="md:col-span-8">
            <p className="measure text-[0.9375rem] leading-relaxed text-text-secondary">
              It builds to a small container and runs on a single droplet behind Coolify, and the
              same repository also builds to static HTML for a free host, so there is a copy online
              whether or not the droplet is paid for that month. The architecture diagrams are laid
              out at build time by a script in this repo rather than by a chart library in your
              browser. There is no assistant on this page: a chatbot on a portfolio demonstrates an
              API key, not engineering.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/infra" className="link-underline text-ink">
                The droplet, the containers, and what it costs
              </Link>
              <Link href="/notes/vercel-to-vps" className="link-underline text-text-secondary">
                Why I moved off Vercel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
