/**
 * Engineering case study, generated from PROJECTS metadata + the
 * CASE_STUDIES data file. Each project gets a tight 90-second read:
 * problem, constraints, key decisions, pivots, outcome, regret,
 * takeaway. Writing is first-person, owned trade-offs.
 *
 * The Gambia Health & Development project has its own bespoke long-form
 * page at /projects/gambia/, so this dynamic route excludes that slug.
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

  return (
    <main className="relative min-h-screen bg-background text-text-primary">
      {/* Back to portfolio */}
      <Link
        href="/#projects"
        className="fixed left-6 top-5 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary backdrop-blur-md transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to work
      </Link>

      <article className="mx-auto max-w-3xl px-6 pt-24 pb-24 md:pt-28 md:pb-32">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-12 border-b border-white/8 pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan/85">
            ~/projects/{project.slug}
          </p>
          <h1 className="mt-4 text-balance text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.05] tracking-tight">
            {project.title}
          </h1>
          <p className="mt-4 text-pretty text-lg italic text-text-secondary">
            {project.tagline}
          </p>

          {/* Tech chips */}
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-text-secondary"
              >
                {t}
              </li>
            ))}
          </ul>

          {/* Live + GitHub */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-cyan px-4 py-2 text-xs font-medium text-background shadow-glow-cyan transition hover:shadow-glow-cyan-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open the live app
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <Github className="h-3.5 w-3.5" />
                Source on GitHub
              </a>
            )}
            {project.articleUrl && (
              <a
                href={project.articleUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Read the article
              </a>
            )}
          </div>
        </header>

        {/* ── Problem ────────────────────────────────────────── */}
        <Section label="01" title="The problem">
          <p className="text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
            {study.problem}
          </p>
        </Section>

        {/* ── Research ───────────────────────────────────────── */}
        <Section label="02" title="What I read before writing code">
          <ul className="space-y-3">
            {study.research.map((r, i) => (
              <li
                key={i}
                className="flex gap-3 text-[15px] leading-relaxed text-text-secondary"
              >
                <span className="mt-2 inline-block h-1 w-3 shrink-0 rounded-full bg-violet-400/60" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Constraints ────────────────────────────────────── */}
        <Section label="03" title="What I couldn't do">
          <ul className="space-y-2">
            {study.constraints.map((c, i) => (
              <li
                key={i}
                className="flex gap-3 text-base leading-relaxed text-text-secondary"
              >
                <span className="mt-2 inline-block h-1 w-3 shrink-0 rounded-full bg-cyan/60" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── Decisions ──────────────────────────────────────── */}
        <Section label="04" title="The decisions that shaped it">
          <ol className="space-y-7">
            {study.decisions.map((d, i) => (
              <li
                key={i}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 md:p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan/85">
                  Decision {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold leading-snug text-white md:text-xl">
                  {d.call}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                  {d.reason}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── Pivots ─────────────────────────────────────────── */}
        {study.pivots.length > 0 && (
          <Section label="05" title="What broke and how I changed course">
            <ul className="space-y-4">
              {study.pivots.map((p, i) => (
                <li
                  key={i}
                  className="rounded-xl border-l-2 border-pink/40 bg-white/[0.015] py-3 pl-5 pr-4 text-[15px] leading-relaxed text-text-secondary"
                >
                  {p}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Weaknesses ─────────────────────────────────────── */}
        {study.weaknesses.length > 0 && (
          <Section label="06" title="What I didn't know, and how I learned">
            <ul className="space-y-4">
              {study.weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="rounded-xl border-l-2 border-violet-400/40 bg-white/[0.015] py-3 pl-5 pr-4 text-[15px] leading-relaxed text-text-secondary"
                >
                  {w}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ── Outcome ────────────────────────────────────────── */}
        <Section label="07" title="What shipped">
          <ul className="space-y-2">
            {study.outcome.map((o, i) => (
              <li
                key={i}
                className="flex gap-3 text-base leading-relaxed text-text-secondary"
              >
                <span className="mt-2 inline-block h-1 w-3 shrink-0 rounded-full bg-cyan/80" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── What's next ────────────────────────────────────── */}
        <Section label="08" title="What's next">
          <p className="text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
            {study.regret}
          </p>
        </Section>

        {/* ── Takeaway ───────────────────────────────────────── */}
        <section className="mt-16 rounded-3xl border border-cyan/25 bg-gradient-to-br from-cyan/[0.06] to-transparent p-7 md:p-9">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan/85">
            What I learned
          </p>
          <p className="mt-3 text-balance text-xl font-medium leading-snug text-white md:text-2xl">
            {study.takeaway}
          </p>
        </section>

        {/* ── Footer nav ─────────────────────────────────────── */}
        <nav className="mt-16 flex flex-col gap-3 border-t border-white/8 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.22em] text-text-secondary transition hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            All projects
          </Link>
          <a
            href="mailto:[redacted, use the contact form]"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.22em] text-text-secondary transition hover:text-white"
          >
            Talk to me about this
            <ArrowRight className="h-3 w-3" />
          </a>
        </nav>
      </article>
    </main>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 md:mt-16">
      <header className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan/85">
          {label}
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}
