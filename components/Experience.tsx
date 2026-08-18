"use client";

import { Briefcase } from "lucide-react";
import { EXPERIENCE } from "@/lib/projects";

export function Experience() {
  if (EXPERIENCE.length === 0) return null;

  return (
    <section
      id="experience"
      className="relative mx-auto w-full max-w-shell px-6 sm:px-10 scroll-mt-20 py-20 md:py-28"
      aria-labelledby="experience-heading"
    >
      <div
        className="mb-12 flex flex-col items-start gap-3 md:mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          Experience
        </span>
        <h2
          id="experience-heading"
          className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight"
        >
          Experience
        </h2>
      </div>

      <ol className="relative space-y-10 border-l border-rule pl-6 md:pl-10">
        {EXPERIENCE.map((exp, i) => (
          <li
            key={`${exp.company}-${i}`}
            className="relative"
          >
            {/* Timeline dot */}
            <span
              aria-hidden="true"
              className="absolute -left-[31px] md:-left-[43px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-cyan/40 bg-background/90 shadow-glow-cyan"
            >
              <Briefcase className="h-3 w-3 text-cyan" />
            </span>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold text-ink">{exp.role}</h3>
              <span className="text-sm text-cyan">· {exp.company}</span>
            </div>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-text-secondary">
              {exp.period}
              {exp.location ? ` · ${exp.location}` : ""}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-text-secondary">
              {exp.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-cyan/60" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
