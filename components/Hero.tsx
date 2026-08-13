import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "@/lib/projects";

/**
 * Opening section.
 *
 * Previously a full-viewport WebGL particle "brain" with a lens flare, drifting
 * quantum dots, a per-letter animated name and a rotating word, which meant a
 * visitor's first screen contained no information about the work. This version
 * is left-aligned and sized so the intro and the first project are visible
 * together: the point of the page is the projects, so the header should hand
 * over to them quickly rather than occupy a whole screen on its own.
 */
export function Hero() {
  return (
    <header
      className="mx-auto w-full max-w-5xl px-6 pb-16 pt-28 sm:pt-32"
      aria-label="Introduction"
    >
      <p className="flex items-center gap-2 text-sm text-text-secondary">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-status-live"
          aria-hidden="true"
        />
        Available for new work · {PROFILE.location}
      </p>

      <h1 className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-tight">
        {PROFILE.fullName}
      </h1>

      <p className="mt-2 text-base text-text-secondary">{PROFILE.title}</p>

      <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-text-secondary">
        I build AI systems that run in production, not demos. Retrieval that
        cites its sources and refuses when it cannot, model fallback chains that
        survive a provider going end-of-life, and validation layers that catch a
        model inventing a citation before a user ever sees it.
      </p>

      <nav
        className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
        aria-label="Primary"
      >
        <a
          href="#projects"
          className="group inline-flex min-h-[44px] items-center gap-2 font-medium text-text underline decoration-border underline-offset-4 transition-colors hover:decoration-text"
        >
          See the work
          <ArrowDown
            className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-[44px] items-center gap-2 text-text-secondary transition-colors hover:text-text"
        >
          <Github className="h-4 w-4" aria-hidden="true" />
          GitHub
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-[44px] items-center gap-2 text-text-secondary transition-colors hover:text-text"
          aria-label="LinkedIn profile"
        >
          <Linkedin className="h-4 w-4" aria-hidden="true" />
          LinkedIn
        </a>
        <a
          href={`mailto:${PROFILE.email}`}
          className="inline-flex min-h-[44px] items-center gap-2 text-text-secondary transition-colors hover:text-text"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email
        </a>
      </nav>
    </header>
  );
}
