"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { EDUCATION } from "@/lib/projects";

export function Education() {
  if (EDUCATION.length === 0) return null;

  return (
    <section
      id="education"
      className="relative mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24 md:py-28"
      aria-labelledby="education-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-start gap-3 md:mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/education
        </span>
        <h2
          id="education-heading"
          className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight"
        >
          Education
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {EDUCATION.map((ed, i) => (
          <motion.div
            key={`${ed.institution}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10"
              >
                <GraduationCap className="h-5 w-5 text-cyan" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                {ed.period}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold leading-tight text-white">
                {ed.degree} {ed.field}
              </h3>
              <p className="mt-1 text-sm text-cyan">{ed.institution}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{ed.location}</p>
            </div>

            {ed.coursework && ed.coursework.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1.5">
                {ed.coursework.map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-text-secondary"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
