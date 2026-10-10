"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, FileText, ArrowRight, User } from "lucide-react";
import { PROFILE } from "@/lib/projects";

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-shell px-6 sm:px-10 scroll-mt-20 py-20 md:py-28"
      aria-labelledby="about-heading"
    >
      <div className="flex flex-col items-start gap-4">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          <User className="h-3.5 w-3.5" aria-hidden="true" />
          About
        </span>

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-rule bg-surface shadow-glow-cyan sm:h-28 sm:w-28">
            <Image
              src="/avatar.jpg"
              alt={PROFILE.fullName}
              fill
              className="relative z-10 object-cover object-center"
              sizes="(max-width: 640px) 96px, 112px"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 flex items-center justify-center font-mono text-2xl font-semibold text-cyan/80 select-none"
            >
              AB
            </span>
          </div>

          <h2
            id="about-heading"
            className="text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight"
          >
            Statistics student. Systems builder.{" "}
            <span className="text-text-secondary">
              I turn statistical theory into working tools.
            </span>
          </h2>
        </div>

        <div className="mt-2 space-y-4 text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
          <p>
            I am finishing a BSc in Statistics at KNUST. I am a Mastercard
            Foundation Scholar. Most of my work starts from a problem I can
            see, and ends with a running system, not a notebook.
          </p>
          <p>
            The Gambia has no death registration system, so its population
            projections come entirely from the UN, set before the 2024 census.
            I built an independent Bayesian projection. Banks in West Africa
            sit on data they cannot share, and for rural borrowers the data
            was never collected, so I built a synthetic-data engine that does
            not need a source dataset. Every Qur&apos;an app treats 6,236
            verses as a flat list, and the corpus cross-references itself, so
            I built a galaxy that reorganises around a question.
          </p>
          <p>
            I work in Python and TypeScript. I read Lee-Carter, Cox, and the
            Basel II framework the same way I read Next.js docs. I am working
            toward actuarial exams, and applying for internships in data
            analytics, statistics, or actuarial science.
          </p>
        </div>

        <Link
          href="/build-log"
          className="group mt-2 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-ink"
        >
          See the days I shipped
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-medium text-background transition hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Get in touch
          </Link>
          <Link
            href="/work"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rule bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:border-rule-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            See the work
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.06] px-5 py-2.5 text-sm font-medium text-cyan transition hover:bg-cyan/[0.12] hover:border-cyan/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            aria-label="Request a copy of the CV"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Request the CV
          </Link>
        </div>
      </div>
    </section>
  );
}
