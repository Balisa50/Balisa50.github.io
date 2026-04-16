"use client";

import { motion } from "framer-motion";
import { Copy, Github, Linkedin, Mail, Phone, Check, MapPin } from "lucide-react";
import { useState } from "react";
import { PROFILE } from "@/lib/projects";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied; do nothing */
    }
  };

  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24 md:py-32"
      aria-labelledby="contact-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-cyan/5 p-8 backdrop-blur-md md:p-14"
      >
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-pink/10 blur-3xl"
        />

        <span className="relative font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/contact
        </span>

        <h2
          id="contact-heading"
          className="relative mt-3 text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight"
        >
          Have a hard problem?{" "}
          <span className="bg-gradient-to-r from-cyan via-white to-cyan bg-clip-text text-transparent">
            Let&apos;s talk.
          </span>
        </h2>

        <p className="relative mt-4 max-w-xl text-text-secondary">
          Open to full-time roles and select contract work on ML-heavy products.
          Fastest reply is email. Phone works too.
        </p>

        <div className="relative mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE.email}?subject=Let%27s%20talk`}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-medium text-background shadow-glow-cyan transition hover:shadow-glow-cyan-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email me
          </a>

          <a
            href={`tel:${PROFILE.phone.replace(/\s+/g, "")}`}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {PROFILE.phone}
          </a>

          <button
            onClick={copyEmail}
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-mono text-text-secondary transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
            aria-label={`Copy email ${PROFILE.email} to clipboard`}
            title={`${PROFILE.email} · PGP available on request`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-status-live" aria-hidden="true" />
                <span className="text-status-live">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                {PROFILE.email}
              </>
            )}
          </button>
        </div>

        <div className="relative mt-10 flex flex-wrap items-center gap-5 text-sm text-text-secondary">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:text-white"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            github.com/{PROFILE.githubHandle}
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 transition hover:text-white focus-visible:outline-none focus-visible:text-white"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            linkedin.com/in/{PROFILE.linkedinHandle}
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {PROFILE.location}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
