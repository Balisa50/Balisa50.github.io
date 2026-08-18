"use client";

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
  other: "text-text-secondary border-rule bg-surface"
};

export function Certifications() {
  if (CERTIFICATES.length === 0) return null;

  return (
    <section
      id="certifications"
      className="relative mx-auto w-full max-w-shell px-6 sm:px-10 scroll-mt-20 py-20 md:py-28"
      aria-labelledby="certs-heading"
    >
      <div
        className="mb-12 flex flex-col items-start gap-3 md:mb-16"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          Certifications
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
      </div>

      <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
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
            <li
              key={`${cert.name}-${i}`}
            >
              <Tag
                {...props}
                className={cn(
                  "group flex h-full items-start gap-3 border-b border-white/[0.08] py-4 transition",
                  hasUrl && "focus-visible:outline-none"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center",
                    CATEGORY_ACCENT[cert.category].split(" ")[0]
                  )}
                  aria-hidden="true"
                >
                  <Award className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium leading-snug text-ink">
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
                      "mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider",
                      CATEGORY_ACCENT[cert.category].split(" ")[0]
                    )}
                  >
                    {CATEGORY_LABELS[cert.category]}
                  </span>
                </div>
              </Tag>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
