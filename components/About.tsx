"use client";

import Image from "next/image";
import { Mail, FileText } from "lucide-react";
import { PROFILE } from "@/lib/projects";

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-shell px-6 sm:px-10 scroll-mt-20 py-20 md:py-28"
      aria-labelledby="about-heading"
    >
      <div
        className="flex flex-col items-start gap-4"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          About
        </span>

        {/* Photo + heading row */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* Profile photo */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-rule bg-surface shadow-glow-cyan sm:h-28 sm:w-28">
            <Image
              src="/avatar.jpg"
              alt={PROFILE.fullName}
              fill
              className="relative z-10 object-cover object-center"
              sizes="(max-width: 640px) 96px, 112px"
              onError={(e) => {
                // Hide broken image, fallback initials show through bg
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Initials fallback, sits behind the image, only visible if image fails */}
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
            I got into this because I kept seeing problems
            around me{" "}
            <span className="text-text-secondary">
              that nobody was building for.
            </span>
          </h2>
        </div>

        <div className="mt-2 space-y-4 text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
          <p>
            Based in Fajikunda, The Gambia, studying Statistics at KNUST in
            Ghana. I build things alongside the coursework, mostly because the
            problems I run into at home are not the ones the tutorials are
            written about.
          </p>
          <p>
            Most of it started from something specific. Legal information that
            is hard to look up. Families sending money home without much idea of
            what the rate will be next month. None of these are solved, and some
            of what I built works better than the rest.
          </p>
          <p>
            I work in Python and TypeScript, with statistical modelling on the
            side I care about most. I am reading toward actuarial exams at the
            moment, which is where the survival analysis and credit work came
            from.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-medium text-background transition hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Get in touch
          </a>
          <a
            href="#projects"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rule bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:border-rule-strong hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            See the work
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-cyan/40 bg-cyan/[0.06] px-5 py-2.5 text-sm font-medium text-cyan transition hover:bg-cyan/[0.12] hover:border-cyan/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            aria-label="Request a copy of the CV"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Request the CV
          </a>
        </div>
      </div>
    </section>
  );
}
