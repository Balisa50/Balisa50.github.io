/**
 * Engineering case study, generated from PROJECTS metadata + the
 * CASE_STUDIES data file. First-person, owned trade-offs.
 *
 * Wide editorial layout: full-width header, then a sticky contents rail and a
 * main column, so the page fills the screen instead of a narrow centred column.
 *
 * The Gambia Health & Development project has its own bespoke long-form page at
 * /projects/gambia/, so this dynamic route excludes that slug.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Github, ExternalLink } from "lucide-react";
import { PROJECTS } from "@/lib/projects";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";

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

  // Contents rail: only list sections that actually render.
  const toc: Array<[string, string]> = [
    ["problem", "The problem"],
    ["research", "What I read"],
    ["constraints", "Constraints"],
    ["decisions", "Decisions"],
    ...(study.pivots.length ? ([["pivots", "What broke"]] as Array<[string, string]>) : []),
    ...(study.weaknesses.length ? ([["weaknesses", "What I learned"]] as Array<[string, string]>) : []),
    ["outcome", "What shipped"],
    ["next", "What's next"],
    ["takeaway", "The takeaway"],
  ];

  return (
    <main className="relative min-h-screen bg-background text-text-primary">
      <Link
        href="/#projects"
        className="fixed left-6 top-5 z-30 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary transition hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to work
      </Link>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 md:pt-28">
        {/* Header — full width */}
        <header className="border-b border-white/10 pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan/85">
            ~/projects/{project.slug}
          </p>
          <h1 className="mt-4 max-w-[20ch] text-balance text-[clamp(2.25rem,6vw,4.25rem)] font-semibold leading-[1.04] tracking-tight">
            {project.title}
          </h1>
          <p className="mt-4 max-w-[60ch] text-pretty text-lg italic text-text-secondary">
            {project.tagline}
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5">
            {project.tech.map((t) => (
              <li key={t} className="font-mono text-[11px] uppercase tracking-wider text-text-secondary">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-cyan transition hover:text-white">
                <ExternalLink className="h-3.5 w-3.5" /> Open the live app
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-text-secondary transition hover:text-white">
                <Github className="h-3.5 w-3.5" /> Source on GitHub
              </a>
            )}
            {project.articleUrl && (
              <a href={project.articleUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-text-secondary transition hover:text-white">
                <ExternalLink className="h-3.5 w-3.5" /> Read the article
              </a>
            )}
          </div>
        </header>

        {/* Body: sticky contents rail + main column */}
        <div className="mt-4 lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Contents" className="hidden lg:block">
            <div className="sticky top-24">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">Contents</p>
              <ol className="mt-4 space-y-2.5">
                {toc.map(([id, label], i) => (
                  <li key={id}>
                    <a href={`#${id}`} className="block text-[13px] leading-snug text-text-secondary transition hover:text-cyan">
                      <span className="font-mono text-white/30">{String(i + 1).padStart(2, "0")}</span> {label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="min-w-0">
            <Section id="problem" label="01" title="The problem">
              <p className="max-w-[68ch] text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
                {study.problem}
              </p>
            </Section>

            <Section id="research" label="02" title="What I read before writing code">
              <ul className="max-w-[72ch] space-y-3">
                {study.research.map((r, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-text-secondary">
                    <span className="mt-2 inline-block h-1 w-3 shrink-0 rounded-full bg-violet-400/60" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="constraints" label="03" title="What I couldn't do">
              <ul className="max-w-[72ch] space-y-2">
                {study.constraints.map((c, i) => (
                  <li key={i} className="flex gap-3 text-base leading-relaxed text-text-secondary">
                    <span className="mt-2 inline-block h-1 w-3 shrink-0 rounded-full bg-cyan/60" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="decisions" label="04" title="The decisions that shaped it">
              <ol className="max-w-[72ch] space-y-7">
                {study.decisions.map((d, i) => (
                  <li key={i} className="border-l-2 border-cyan/25 pl-5 md:pl-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan/85">
                      Decision {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold leading-snug text-white md:text-xl">{d.call}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{d.reason}</p>
                  </li>
                ))}
              </ol>
            </Section>

            {study.pivots.length > 0 && (
              <Section id="pivots" label="05" title="What broke and how I changed course">
                <ul className="max-w-[72ch] space-y-4">
                  {study.pivots.map((p, i) => (
                    <li key={i} className="border-l-2 border-pink/40 py-1 pl-5 text-[15px] leading-relaxed text-text-secondary">
                      {p}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {study.weaknesses.length > 0 && (
              <Section id="weaknesses" label="06" title="What I didn't know, and how I learned">
                <ul className="max-w-[72ch] space-y-4">
                  {study.weaknesses.map((w, i) => (
                    <li key={i} className="border-l-2 border-violet-400/40 py-1 pl-5 text-[15px] leading-relaxed text-text-secondary">
                      {w}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section id="outcome" label="07" title="What shipped">
              <ul className="max-w-[72ch] space-y-2">
                {study.outcome.map((o, i) => (
                  <li key={i} className="flex gap-3 text-base leading-relaxed text-text-secondary">
                    <span className="mt-2 inline-block h-1 w-3 shrink-0 rounded-full bg-cyan/80" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="next" label="08" title="What's next">
              <p className="max-w-[68ch] text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
                {study.regret}
              </p>
            </Section>

            <section id="takeaway" className="mt-16 scroll-mt-24 border-l-2 border-cyan/40 pl-6 md:pl-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan/85">What I learned</p>
              <p className="mt-3 max-w-[60ch] text-balance text-xl font-medium leading-snug text-white md:text-2xl">
                {study.takeaway}
              </p>
            </section>

            <nav className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/#projects" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.22em] text-text-secondary transition hover:text-white">
                <ArrowLeft className="h-3 w-3" /> All projects
              </Link>
              <a href="mailto:[redacted, use the contact form]" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.22em] text-text-secondary transition hover:text-white">
                Talk to me about this <ArrowRight className="h-3 w-3" />
              </a>
            </nav>
          </article>
        </div>
      </div>
    </main>
  );
}

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-24 first:mt-0">
      <header className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan/85">{label}</p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
      </header>
      {children}
    </section>
  );
}
