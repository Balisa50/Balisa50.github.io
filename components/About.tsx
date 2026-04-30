"use client";

import Image from "next/image";
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
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-start gap-4"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/about
        </span>

        {/* Photo + heading row */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* Profile photo */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/5 shadow-glow-cyan sm:h-28 sm:w-28">
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
            Based in Fajikunda, The Gambia. Studying Statistics at KNUST
            in Ghana and building things in parallel. The Gambia is a small
            country, and the problems here look different from what most tech
            spaces talk about, which is part of why I started building.
          </p>
          <p>
            A lot of the work came from bumping into real gaps: Gambians with
            no easy access to legal information, families sending money home
            with no clear picture of what the exchange rate would be, people
            who needed accountability tools that actually worked. I started
            building what I needed instead of waiting for someone else to do it.
          </p>
          <p>
            The stack changes depending on what the problem needs. I work
            across Python, TypeScript, machine learning, and statistical
            modelling because the interesting problems don&apos;t stay in one
            lane. Currently going deeper into actuarial science. Always
            shipping something.
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
