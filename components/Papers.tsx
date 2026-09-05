"use client";

import { ArrowUpRight, FileText, Github, Lock } from "lucide-react";
import { PAPERS } from "@/lib/papers";

/**
 * Working papers.
 *
 * Deliberately not styled as cards. The projects grid already uses cards, and
 * repeating them here would say these are more of the same. A paper is a
 * document, so the row reads as one: finding first, then the summary, then
 * where to get it.
 *
 * The heading says "Working Papers" and the note under it says unrefereed. Both
 * are load-bearing. Two of the three report results that did not support their
 * own hypotheses, which is worth showing rather than hiding, but only if the
 * status of the work is stated plainly in the same breath.
 */
export function Papers() {
  if (PAPERS.length === 0) return null;

  return (
    <section
      id="papers"
      className="relative mx-auto w-full max-w-shell scroll-mt-20 px-6 py-20 sm:px-10 md:py-28"
      aria-labelledby="papers-heading"
    >
      <div className="mb-12 flex flex-col items-start gap-3 md:mb-16">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          Working Papers
        </span>
        <h2
          id="papers-heading"
          className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight"
        >
          Research
        </h2>
        <p className="max-w-2xl text-text-secondary">
          Three manuscripts asking the same question of different data: does a
          model, or the uncertainty it reports, survive being moved to a country
          it was never fitted on. Unrefereed and not submitted to any venue.
        </p>
      </div>

      <ol className="flex flex-col">
        {PAPERS.map((paper, i) => (
          <li
            key={paper.slug}
            className="border-t border-white/[0.08] py-8 first:border-t-0 first:pt-0 md:py-10"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4">
                <span
                  className="font-mono text-xs tabular-nums text-text-secondary"
                  aria-hidden="true"
                >
                  {String(PAPERS.length - i).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-text-secondary">
                  {paper.year} &middot; {paper.pages} pages
                </span>
              </div>

              <h3 className="max-w-4xl text-balance text-lg font-medium leading-snug text-ink md:text-xl">
                {paper.title}
              </h3>

              {/* The finding, not the abstract. A reader deciding whether to
                  open a PDF needs the result, not the setup. */}
              <p className="max-w-3xl border-l-2 border-cyan/40 pl-4 text-[15px] leading-relaxed text-ink">
                {paper.finding}
              </p>

              <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
                {paper.summary}
              </p>

              {paper.badges && paper.badges.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Paper attributes">
                  {paper.badges.map((b) => (
                    <li
                      key={b}
                      className="border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              <ul className="flex flex-wrap gap-x-3 gap-y-1" aria-label="Methods">
                {paper.methods.map((m) => (
                  <li key={m} className="font-mono text-[11px] text-text-secondary">
                    {m}
                  </li>
                ))}
              </ul>

              <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a
                  href={paper.pdf}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1.5 text-sm text-ink transition hover:text-cyan"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Read the paper
                  <ArrowUpRight
                    className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>

                {paper.articleUrl && (
                  <a
                    href={paper.articleUrl}
                    className="group inline-flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-cyan"
                  >
                    Long-form version
                    <ArrowUpRight
                      className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}

                {/* A private repo renders as text. A dead link reads as work
                    that was never really done. */}
                {paper.repo && !paper.repoPrivate && (
                  <a
                    href={paper.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-cyan"
                  >
                    <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    Code
                    <ArrowUpRight
                      className="h-3 w-3 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                )}
                {paper.repo && paper.repoPrivate && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                    <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                    Code private
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
