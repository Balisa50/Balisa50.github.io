"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { PROFILE } from "@/lib/projects";

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto w-full max-w-4xl scroll-mt-20 px-6 py-24 md:py-32"
      aria-labelledby="about-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-start gap-4"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/about
        </span>

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

        <div className="mt-2 space-y-4 text-pretty text-base leading-relaxed text-text-secondary md:text-lg">
          <p>
            Self-taught, based in The Gambia, studying Statistics at KNUST. I
            work across AI, data science, and engineering because the
            interesting problems don&apos;t fit neatly into one field.
          </p>
          <p>
            Currently picking up actuarial science. Always shipping something.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE.email}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-cyan px-5 py-2.5 text-sm font-medium text-background transition hover:shadow-glow-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Get in touch
          </a>
          <a
            href="#projects"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            See the work
          </a>
        </div>
      </motion.div>
    </section>
  );
}
