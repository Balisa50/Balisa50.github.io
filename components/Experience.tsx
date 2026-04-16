"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { EXPERIENCE } from "@/lib/projects";

export function Experience() {
  if (EXPERIENCE.length === 0) return null;

  return (
    <section
      id="experience"
      className="relative mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24 md:py-28"
      aria-labelledby="experience-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-start gap-3 md:mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/experience
        </span>
        <h2
          id="experience-heading"
          className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight"
        >
          Experience
        </h2>
      </motion.div>

      <ol className="relative space-y-10 border-l border-white/10 pl-6 md:pl-10">
        {EXPERIENCE.map((exp, i) => (
          <motion.li
            key={`${exp.company}-${i}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative"
          >
            {/* Timeline dot */}
            <span
              aria-hidden="true"
              className="absolute -left-[31px] md:-left-[43px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-cyan/40 bg-black/80 shadow-glow-cyan"
            >
              <Briefcase className="h-3 w-3 text-cyan" />
            </span>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
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
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
