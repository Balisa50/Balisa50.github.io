import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/projects";
import { CASE_STUDIES } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case studies",
  description:
    "How and why I built each project: the problem, what I read first, the decisions that shaped the system, what broke, and what I'd do differently."
};

// First two sentences of the problem, for the row preview.
function lead(text: string, max = 260): string {
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) ?? [text];
  let out = "";
  for (const s of sentences) {
    if (out && (out + s).length > max) break;
    out += s;
  }
  return (out || text.slice(0, max)).trim();
}

export default function CaseStudiesPage() {
  const studies = PROJECTS.filter((p) => CASE_STUDIES[p.slug]);

  return (
    <main className="mx-auto w-full max-w-shell px-6 sm:px-10 py-20 md:py-24">
      <header className="mb-16">
        <p className="label">Case studies</p>
        <h1 className="display mt-3 text-[clamp(2.25rem,5vw,3.75rem)]">
          How I built them
        </h1>
        <p className="measure mt-5 text-[16px] leading-relaxed text-text-secondary">
          Each study covers the problem, what I read before writing code, the
          decisions that shaped the system, what broke, what I didn&apos;t know
          going in, and what I&apos;d do differently. Written first-person,
          grounded in real commits.
        </p>
      </header>

      <div>
        {studies.map((p, i) => {
          const study = CASE_STUDIES[p.slug];
          return (
            <article
              key={p.slug}
              className="group border-t border-border py-10 first:border-t-0"
            >
              <div className="grid grid-cols-1 items-baseline gap-x-6 gap-y-3 sm:grid-cols-12">
                <span className="numeral col-span-2 text-[13px] text-text-faint sm:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="col-span-10 min-w-0 sm:col-span-7">
                  <Link
                    href={`/case-studies/${p.slug}/`}
                    className="focus-visible:outline-none"
                  >
                    <h2 className="inline-flex items-center gap-1.5 text-[19px] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                      {p.title}
                      <ArrowUpRight
                        className="h-3.5 w-3.5 -translate-x-1 text-text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </h2>
                  </Link>
                  <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                    {lead(study.problem)}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {p.tech.slice(0, 5).map((t) => (
                      <li key={t} className="font-mono text-[11px] text-text-faint">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sm:col-span-4 sm:justify-self-end">
                  <Link
                    href={`/case-studies/${p.slug}/`}
                    className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-accent"
                  >
                    Read case study
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <nav className="mt-16 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-border pt-8">
        <Link
          href="/work"
          className="group inline-flex min-h-11 items-center gap-2 font-medium text-ink link-underline"
        >
          See all projects
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-text-secondary transition-colors hover:text-ink"
        >
          Back home
        </Link>
      </nav>
    </main>
  );
}
