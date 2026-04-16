"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Award } from "lucide-react";
import { CERTIFICATES, type Certificate } from "@/lib/projects";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | Certificate["category"];

const CATEGORY_LABELS: Record<Certificate["category"], string> = {
  ai: "AI / ML",
  data: "Data",
  software: "Software",
  other: "Other"
};

const CATEGORY_ACCENT: Record<Certificate["category"], string> = {
  ai: "text-cyan border-cyan/30 bg-cyan/10",
  data: "text-pink border-pink/30 bg-pink/10",
  software: "text-violet-300 border-violet-400/30 bg-violet-500/10",
  other: "text-text-secondary border-white/10 bg-white/5"
};

export function Certifications() {
  if (CERTIFICATES.length === 0) return null;

  return (
    <section
      id="certifications"
      className="relative mx-auto w-full max-w-7xl scroll-mt-20 px-6 py-24 md:py-28"
      aria-labelledby="certs-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-start gap-3 md:mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/certifications
        </span>
        <h2
          id="certs-heading"
          className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight"
        >
          Credentials
        </h2>
        <p className="max-w-2xl text-text-secondary">
          {CERTIFICATES.length} certificates spanning AI engineering, data
          science, and software engineering. Tap any to verify.
        </p>
      </motion.div>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATES.map((cert, i) => {
          const hasUrl = Boolean(cert.credentialUrl);
          const Tag = hasUrl ? "a" : "div";
          const props = hasUrl
            ? {
                href: cert.credentialUrl!,
                target: "_blank" as const,
                rel: "noreferrer noopener" as const
              }
            : {};

          return (
            <motion.li
              key={`${cert.name}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Tag
                {...props}
                className={cn(
                  "group flex h-full items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm transition",
                  hasUrl &&
                    "hover:border-cyan/40 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                    CATEGORY_ACCENT[cert.category]
                  )}
                  aria-hidden="true"
                >
                  <Award className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium leading-snug text-white">
                      {cert.name}
                    </h3>
                    {hasUrl && (
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0 text-text-secondary transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {cert.issuer}
                    {cert.date ? ` · ${cert.date}` : ""}
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      CATEGORY_ACCENT[cert.category]
                    )}
                  >
                    {CATEGORY_LABELS[cert.category]}
                  </span>
                </div>
              </Tag>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
