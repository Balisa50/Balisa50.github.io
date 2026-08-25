"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { PROFILE } from "@/lib/projects";
import { HeroAudio } from "@/components/site/hero-audio";

/**
 * The hero.
 *
 * The ring is the boundary of the content, not a decoration behind it: the
 * name, the role and the line about the work all sit inside the circle, and
 * the circle is sized off the viewport so the composition holds from a phone
 * to a desktop.
 *
 * Two animations, deliberately split. The slow pulse on the hairline circle is
 * a CSS keyframe, because it never needs to coordinate with anything and CSS
 * runs it off the main thread for free. The travelling arc is Framer Motion,
 * because it shares an entrance with the text and the sequencing is easier to
 * read as one declarative timeline than as three keyframe delays.
 *
 * Both are transform and opacity only, so the whole thing composites. There is
 * no canvas here and no WebGL: the previous version of this site paid a
 * Three.js bundle on first paint for a background nobody looked at.
 */
export function Hero() {
  const reduced = useReducedMotion();

  const enter = {
    hidden: { opacity: 0, y: 10 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: reduced ? 0 : 0.35 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    })
  };

  return (
    <section className="hero-band relative overflow-hidden">
      <div className="mx-auto flex min-h-[88svh] w-full max-w-shell flex-col items-center justify-center px-6 py-24 sm:px-10">
        <div className="relative grid aspect-square w-[min(84vmin,34rem)] place-items-center">
          {/* The hairline circle. Scales in once, then pulses in CSS. */}
          <motion.div
            aria-hidden="true"
            className="ring-base absolute inset-0"
            initial={reduced ? false : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* The travelling arc. One composited rotation, forever. */}
          {!reduced && (
            <motion.div
              aria-hidden="true"
              className="ring-arc absolute inset-0"
              initial={{ opacity: 0, rotate: -40 }}
              animate={{ opacity: 1, rotate: 320 }}
              transition={{
                opacity: { duration: 1.4, delay: 0.2 },
                rotate: { duration: 14, ease: "linear", repeat: Infinity, repeatType: "loop" }
              }}
            />
          )}

          {/* Inscribed square. 70% keeps every line clear of the curve. */}
          <div className="relative z-10 w-[72%] text-center">
            <motion.p
              custom={0}
              variants={enter}
              initial="hidden"
              animate="show"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.11em] text-[var(--hero-dim)]"
            >
              {PROFILE.location}
            </motion.p>

            <motion.h1
              custom={1}
              variants={enter}
              initial="hidden"
              animate="show"
              className="display mt-4 text-[clamp(1.9rem,1.1rem+3.4vw,3.4rem)] text-[var(--hero-ink)]"
            >
              {PROFILE.fullName}
            </motion.h1>

            <motion.p
              custom={2}
              variants={enter}
              initial="hidden"
              animate="show"
              className="mt-4 text-[0.9375rem] leading-relaxed text-[var(--hero-dim)]"
            >
              {PROFILE.tagline}
            </motion.p>

            <motion.div
              custom={3}
              variants={enter}
              initial="hidden"
              animate="show"
              className="mt-7 flex items-center justify-center gap-5 text-sm"
            >
              <Link
                href="/work"
                className="border-b border-white/40 pb-0.5 text-[var(--hero-ink)] transition-colors hover:border-white"
              >
                See the work
              </Link>
              <Link
                href="/infra"
                className="border-b border-transparent pb-0.5 text-[var(--hero-dim)] transition-colors hover:border-white/40 hover:text-[var(--hero-ink)]"
              >
                How it is deployed
              </Link>
            </motion.div>

            <motion.div
              custom={4}
              variants={enter}
              initial="hidden"
              animate="show"
              className="mt-5 flex justify-center"
            >
              <HeroAudio />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-14 flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.11em] text-[var(--hero-dim)]"
        >
          <ArrowDown className="h-3 w-3" aria-hidden="true" />
          Four projects worth reading first
        </motion.div>
      </div>
    </section>
  );
}
